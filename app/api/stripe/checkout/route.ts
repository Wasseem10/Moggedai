import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json(); // "monthly" | "yearly"

  const priceId =
    plan === "yearly"
      ? process.env.STRIPE_PRICE_YEARLY!
      : process.env.STRIPE_PRICE_MONTHLY!;

  if (!priceId) return NextResponse.json({ error: "Price not configured" }, { status: 500 });

  const db = getDb();
  const { rows } = await db.query(
    `SELECT id, stripe_customer_id FROM users WHERE clerk_id = $1`,
    [userId]
  );

  if (!rows.length) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const user = rows[0];

  const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://moggedai-production.up.railway.app";

  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: user.stripe_customer_id ?? undefined,
    customer_email: user.stripe_customer_id ? undefined : undefined, // populated via Clerk if needed
    client_reference_id: user.id,
    success_url: `${origin}/dashboard?upgraded=1`,
    cancel_url: `${origin}/pricing`,
    metadata: { clerk_id: userId, user_id: user.id },
  });

  return NextResponse.json({ url: session.url });
}
