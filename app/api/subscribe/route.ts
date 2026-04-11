import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    const {
      phone, habits, coach_style, biggest_distraction, why,
      frequency_minutes, start_time, end_time, timezone
    } = await req.json()

    if (!phone || !habits?.length || !frequency_minutes || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDb()

    // Upsert user — works whether phone already exists or not
    const { rows: userRows } = await db.query(
      `INSERT INTO users (phone, clerk_id, active)
       VALUES ($1, $2, true)
       ON CONFLICT (phone) DO UPDATE
         SET clerk_id = COALESCE($2, users.clerk_id),
             active   = true
       RETURNING id`,
      [phone, clerkId ?? null]
    )
    const userId = userRows[0].id

    // Also link by clerk_id in case phone changed
    if (clerkId) {
      await db.query(
        `UPDATE users SET clerk_id = $1 WHERE id = $2`,
        [clerkId, userId]
      )
    }

    // Deactivate old habits & schedules for clean slate
    await db.query(`UPDATE habits   SET active = false WHERE user_id = $1`, [userId])
    await db.query(`UPDATE schedules SET active = false WHERE user_id = $1`, [userId])

    // Upsert profile
    await db.query(
      `INSERT INTO profiles (user_id, coach_style, biggest_distraction, why)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE
         SET coach_style=$2, biggest_distraction=$3, why=$4`,
      [userId, coach_style || 'direct', biggest_distraction || '', why || '']
    )

    // Insert new habits
    for (const habit of habits) {
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
