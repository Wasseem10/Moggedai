import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

function getStreak(completions: { completed_at: string }[]): number {
  if (!completions.length) return 0;
  const days = [...new Set(completions.map(c => new Date(c.completed_at).toDateString()))];
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (days.includes(d.toDateString())) streak++;
    else if (i > 0) break;
  }
  return streak;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();

  const { rows: userRows } = await db.query(
    `SELECT u.id, u.phone, s.frequency_minutes, s.start_time, s.end_time, s.active, s.timezone,
            p.coach_style, p.biggest_distraction, p.why
     FROM users u
     LEFT JOIN schedules s ON s.user_id = u.id AND s.active = true
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE u.clerk_id = $1`,
    [userId]
  );

  if (!userRows.length) return NextResponse.json({ user: null });
  const user = userRows[0];

  // Get habits with streaks and completion counts
  const { rows: habits } = await db.query(
    `SELECT h.id, h.name, h.emoji,
            COUNT(c.id) as total_completions
     FROM habits h
     LEFT JOIN completions c ON c.habit_id = h.id
     WHERE h.user_id = $1 AND h.active = true
     GROUP BY h.id, h.name, h.emoji
     ORDER BY h.created_at ASC`,
    [user.id]
  );

  // Get streak per habit
  const habitsWithStreaks = await Promise.all(habits.map(async (h: { id: string; name: string; emoji: string; total_completions: string }) => {
    const { rows: comps } = await db.query(
      `SELECT completed_at FROM completions WHERE habit_id = $1 ORDER BY completed_at DESC LIMIT 365`,
      [h.id]
    );
    return { ...h, streak: getStreak(comps), total_completions: parseInt(h.total_completions) };
  }));

  // Recent messages
  const { rows: recentMessages } = await db.query(
    `SELECT m.message_text, m.sent_at, m.responded_at, h.name as habit_name, h.emoji as habit_emoji
     FROM messages m
     LEFT JOIN habits h ON h.id = m.habit_id
     WHERE m.user_id = $1 ORDER BY m.sent_at DESC LIMIT 10`,
    [user.id]
  );

  // Total stats
  const { rows: statsRows } = await db.query(
    `SELECT COUNT(*) as total_texts FROM messages WHERE user_id = $1`, [user.id]
  );
  const { rows: compRows } = await db.query(
    `SELECT COUNT(*) as total_completions FROM completions WHERE user_id = $1`, [user.id]
  );

  return NextResponse.json({
    user,
    habits: habitsWithStreaks,
    recent_messages: recentMessages,
    stats: {
      total_texts: parseInt(statsRows[0]?.total_texts ?? "0"),
      total_completions: parseInt(compRows[0]?.total_completions ?? "0"),
    },
  });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const db = getDb();

  const { rows: userRows } = await db.query(`SELECT id FROM users WHERE clerk_id = $1`, [userId]);
  if (!userRows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const uid = userRows[0].id;

  if (typeof body.active === "boolean") {
    await db.query(`UPDATE schedules SET active = $1 WHERE user_id = $2`, [body.active, uid]);
  }
  if (body.frequency_minutes || body.start_time || body.end_time) {
    const fields: string[] = [];
    const vals: (string | number)[] = [];
    let i = 1;
    if (body.frequency_minutes) { fields.push(`frequency_minutes=$${i++}`); vals.push(body.frequency_minutes); }
    if (body.start_time)        { fields.push(`start_time=$${i++}`);        vals.push(body.start_time); }
    if (body.end_time)          { fields.push(`end_time=$${i++}`);          vals.push(body.end_time); }
    vals.push(uid);
    await db.query(`UPDATE schedules SET ${fields.join(",")} WHERE user_id = $${i}`, vals);
  }
  if (body.add_habit) {
    await db.query(
      `INSERT INTO habits (user_id, name, emoji, active) VALUES ($1, $2, $3, true)`,
      [uid, body.add_habit.name, body.add_habit.emoji || '🎯']
    );
  }
  if (body.remove_habit_id) {
    await db.query(`UPDATE habits SET active = false WHERE id = $1 AND user_id = $2`, [body.remove_habit_id, uid]);
  }

  return NextResponse.json({ success: true });
}
