import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { phone, goal, frequency_minutes, start_time, end_time } = await req.json()

    if (!phone || !goal || !frequency_minutes || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDb()

    // Upsert user by phone
    const { rows: userRows } = await db.query(
      `INSERT INTO users (phone) VALUES ($1)
       ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
       RETURNING id`,
      [phone]
    )
    const userId = userRows[0].id

    // Deactivate existing goals and schedules
    await db.query(`UPDATE goals SET active = false WHERE user_id = $1`, [userId])
    await db.query(`UPDATE schedules SET active = false WHERE user_id = $1`, [userId])

    // Insert new goal
    await db.query(
      `INSERT INTO goals (user_id, goal_text, active) VALUES ($1, $2, true)`,
      [userId, goal]
    )

    // Insert new schedule
    await db.query(
      `INSERT INTO schedules (user_id, frequency_minutes, start_time, end_time, active)
       VALUES ($1, $2, $3, $4, true)`,
      [userId, frequency_minutes, start_time, end_time]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
