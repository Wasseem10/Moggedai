import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDb, ensureSchema } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()

    // Require authenticated session
    if (!clerkId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const {
      phone, habits, coach_style, biggest_distraction, why,
      frequency_minutes, start_time, end_time, timezone
    } = await req.json()

    if (!phone || !frequency_minutes || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Auto-create tables if they don't exist (handles fresh Railway DB)
    await ensureSchema()

    const db = getDb()

    // Upsert user — works whether phone already exists or not
    const { rows: userRows } = await db.query(
      `INSERT INTO users (phone, clerk_id, active)
       VALUES ($1, $2, true)
       ON CONFLICT (phone) DO UPDATE
         SET clerk_id = COALESCE(EXCLUDED.clerk_id, users.clerk_id),
             active   = true
       RETURNING id`,
      [phone, clerkId]
    )
    const userId = userRows[0].id

    // Also make sure clerk_id is linked if phone existed under a different clerk_id
    await db.query(
      `UPDATE users SET clerk_id = $1 WHERE id = $2 AND (clerk_id IS NULL OR clerk_id = $1)`,
      [clerkId, userId]
    )

    // Deactivate old habits & schedules for clean slate
    await db.query(`UPDATE habits    SET active = false WHERE user_id = $1`, [userId])
    await db.query(`UPDATE schedules SET active = false WHERE user_id = $1`, [userId])

    // Upsert profile
    await db.query(
      `INSERT INTO profiles (user_id, coach_style, biggest_distraction, why)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE
         SET coach_style=$2, biggest_distraction=$3, why=$4`,
      [userId, coach_style || 'direct', biggest_distraction || '', why || '']
    )

    // Insert new habits (may be empty array or undefined — that's fine)
    for (const habit of (habits ?? [])) {
      await db.query(
        `INSERT INTO habits (user_id, name, emoji, active) VALUES ($1, $2, $3, true)`,
        [userId, habit.name, habit.emoji || '🎯']
      )
    }

    // Insert new schedule
    await db.query(
      `INSERT INTO schedules
         (user_id, frequency_minutes, start_time, end_time, timezone, active)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [userId, frequency_minutes, start_time, end_time, timezone || 'America/New_York']
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Subscribe error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
