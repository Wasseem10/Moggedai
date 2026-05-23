import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ensureSchema, getDb } from '@/lib/db'
import { sendSms } from '@/lib/sms'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureSchema()
  const db = getDb()

  const { rows } = await db.query(
    `SELECT id, phone FROM users WHERE clerk_id = $1 LIMIT 1`,
    [userId]
  )

  if (!rows.length || !rows[0].phone) {
    return NextResponse.json({ error: 'No phone number found for this user' }, { status: 404 })
  }

  const body = await req.json().catch(() => ({})) as { message?: string }
  const message = body.message?.trim() ||
    'MoggedAI test: your SMS setup is connected. Reply DONE and I should text you back.'

  await sendSms({ to: rows[0].phone, body: message })
  await db.query(
    `INSERT INTO messages (user_id, message_text, sent_at, follow_up_sent)
     VALUES ($1, $2, NOW(), true)`,
    [rows[0].id, message]
  )

  return NextResponse.json({ success: true, to: rows[0].phone })
}
