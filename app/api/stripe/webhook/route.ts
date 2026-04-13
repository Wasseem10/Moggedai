import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = getDb();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId) {
        await db.query(
          `UPDATE users SET stripe_customer_id = $1, stripe_subscription_id = $2, plan = 'pro' WHERE id = $3`,
          [customerId, subscriptionId, userId]
        );
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const status = sub.status;
      const plan = status === "active" || status === "trialing" ? "pro" : "free";

      await db.query(
        `UPDATE users SET plan = $1 WHERE stripe_customer_id = $2`,
        [plan, sub.customer as string]
      );
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await db.query(
        `UPDATE users SET plan = 'free', stripe_subscription_id = NULL WHERE stripe_customer_id = $1`,
        [sub.customer as string]
      );
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await db.query(
        `UPDATE users SET plan = 'free' WHERE stripe_customer_id = $1`,
        [invoice.customer as string]
      );
      break;
    }
  }

  return NextResponse.json({ received: true });
}
