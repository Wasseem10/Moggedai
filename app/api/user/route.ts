import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const { rows } = await db.query(
    `SELECT u.phone, g.goal_text, s.frequency_minutes, s.start_time, s.end_time, s.active
     FROM users u
     LEFT JOIN goals g ON g.user_id = u.id AND g.active = true
     LEFT JOIN schedules s ON s.user_id = u.id AND s.active = true
     WHERE u.clerk_id = $1`,
    [userId]
  );

  if (rows.length === 0) return NextResponse.json({ user: null });
  return NextResponse.json({ user: rows[0] });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { active } = await req.json();
  const db = getDb();

  await db.query(
    `UPDATE schedules SET active = $1
     WHERE user_id = (SELECT id FROM users WHERE clerk_id = $2)`,
    [active, userId]
  );

  return NextResponse.json({ success: true });
}
