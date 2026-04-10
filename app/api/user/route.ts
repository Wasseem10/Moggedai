import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();

  // Get user + goal + schedule
  const { rows } = await db.query(
    `SELECT u.id, u.phone, g.goal_text, s.frequency_minutes, s.start_time, s.end_time, s.active, s.timezone
     FROM users u
     LEFT JOIN goals g ON g.user_id = u.id AND g.active = true
     LEFT JOIN schedules s ON s.user_id = u.id AND s.active = true
     WHERE u.clerk_id = $1`,
    [userId]
  );

  if (rows.length === 0) return NextResponse.json({ user: null });

  const user = rows[0];

  // Get stats
  const { rows: statsRows } = await db.query(
    `SELECT COUNT(*) as total_texts,
            MIN(sent_at) as first_text,
            MAX(sent_at) as last_text
     FROM messages WHERE user_id = $1`,
    [user.id]
  );

  // Get last 5 messages
  const { rows: recentMessages } = await db.query(
    `SELECT message_text, sent_at FROM messages
     WHERE user_id = $1 ORDER BY sent_at DESC LIMIT 5`,
    [user.id]
  );

  // Calculate streak (days with at least one message)
  const { rows: streakRows } = await db.query(
    `SELECT COUNT(DISTINCT DATE(sent_at)) as active_days
     FROM messages WHERE user_id = $1
     AND sent_at > NOW() - INTERVAL '30 days'`,
    [user.id]
  );

  return NextResponse.json({
    user,
    stats: {
      total_texts: parseInt(statsRows[0]?.total_texts ?? "0"),
      active_days: parseInt(streakRows[0]?.active_days ?? "0"),
    },
    recent_messages: recentMessages,
  });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = getDb();

  // Get internal user id
  const { rows: userRows } = await db.query(
    `SELECT id FROM users WHERE clerk_id = $1`, [userId]
  );
  if (userRows.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const internalId = userRows[0].id;

  // Toggle active
  if (typeof body.active === "boolean") {
    await db.query(`UPDATE schedules SET active = $1 WHERE user_id = $2`, [body.active, internalId]);
  }

  // Update goal
  if (body.goal_text) {
    await db.query(`UPDATE goals SET active = false WHERE user_id = $1`, [internalId]);
    await db.query(
      `INSERT INTO goals (user_id, goal_text, active) VALUES ($1, $2, true)`,
      [internalId, body.goal_text]
    );
  }

  // Update schedule settings
  if (body.frequency_minutes || body.start_time || body.end_time) {
    const fields: string[] = [];
    const vals: (string | number)[] = [];
    let idx = 1;
    if (body.frequency_minutes) { fields.push(`frequency_minutes = $${idx++}`); vals.push(body.frequency_minutes); }
    if (body.start_time)        { fields.push(`start_time = $${idx++}`);        vals.push(body.start_time); }
    if (body.end_time)          { fields.push(`end_time = $${idx++}`);          vals.push(body.end_time); }
    vals.push(internalId);
    await db.query(`UPDATE schedules SET ${fields.join(", ")} WHERE user_id = $${idx}`, vals);
  }

  return NextResponse.json({ success: true });
}
