import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import twilio from 'twilio'
import { GoogleGenerativeAI } from '@google/generative-ai'

function getLocalTime(timezone: string): string {
  try {
    const now = new Date()
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now)
    const h = parts.find(p => p.type === 'hour')?.value ?? '00'
    const m = parts.find(p => p.type === 'minute')?.value ?? '00'
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
  } catch {
    // fallback to UTC
    const now = new Date()
    return `${now.getUTCHours().toString().padStart(2,'0')}:${now.getUTCMinutes().toString().padStart(2,'0')}`
  }
}

function isWithinWindow(current: string, start: string, end: string): boolean {
  return current >= start && current <= end
}

async function generateMessage(goalText: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const prompt = `The user is trying to: ${goalText}. Write one sharp 1-2 sentence accountability text message. Be direct, no fluff, no emojis. Reference their specific goal. Sound like a no-nonsense coach, not a motivational poster. Return only the message, nothing else.`
  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)
  const now = new Date()

  const { rows: schedules } = await db.query(`
    SELECT s.id, s.frequency_minutes, s.start_time, s.end_time,
           s.last_texted_at, s.timezone,
           u.phone, g.goal_text
    FROM schedules s
    JOIN users u ON u.id = s.user_id
    JOIN goals g ON g.user_id = s.user_id AND g.active = true
    WHERE s.active = true
  `)

  const results = { sent: 0, skipped: 0, errors: 0 }

  for (const schedule of schedules) {
    const tz = schedule.timezone || 'America/New_York'
    const localTime = getLocalTime(tz)

    if (!isWithinWindow(localTime, schedule.start_time, schedule.end_time)) {
      results.skipped++
      continue
    }

    if (schedule.last_texted_at) {
      const minutesSince = (now.getTime() - new Date(schedule.last_texted_at).getTime()) / 60000
      if (minutesSince < schedule.frequency_minutes) {
        results.skipped++
        continue
      }
    }

    try {
      const message = await generateMessage(schedule.goal_text)
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: schedule.phone,
      })
      await db.query(`UPDATE schedules SET last_texted_at = $1 WHERE id = $2`, [now.toISOString(), schedule.id])
      results.sent++
    } catch (err) {
      console.error(`Error sending to ${schedule.phone}:`, err)
      results.errors++
    }
  }

  return NextResponse.json({ success: true, ...results })
}
