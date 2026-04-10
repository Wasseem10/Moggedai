import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    const { phone, goal, frequency_minutes, start_time, end_time, timezone } = await req.json()

    if (!phone || !goal || !frequency_minutes || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDb()

    const { rows: userRows } = await db.query(
      `INSERT INTO users (phone, clerk_id) VALUES ($1, $2)
       ON CONFLICT (phone) DO UPDATE SET clerk_id = COALESCE($2, users.clerk_id)
       RETURNING id`,
      [phone, clerkId ?? null]
    )
    const userId = userRows[0].id

    await db.query(`UPDATE goals SET active = false WHERE user_id = $1`, [userId])
    await db.query(`UPDATE schedules SET active = false WHERE user_id = $1`, [userId])

    await db.query(
      `INSERT INTO goals (user_id, goal_text, active) VALUES ($1, $2, true)`,
      [userId, goal]
    )

    await db.query(
      `INSERT INTO schedules (user_id, frequency_minutes, start_time, end_time, timezone, active)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [userId, frequency_minutes, start_time, end_time, timezone || 'America/New_York']
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
