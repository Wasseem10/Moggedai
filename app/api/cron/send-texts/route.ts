import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import twilio from 'twilio'
import { GoogleGenerativeAI } from '@google/generative-ai'

function getLocalTime(timezone: string): string {
  try {
    const now = new Date()
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(now)
    const h = parts.find(p => p.type === 'hour')?.value ?? '00'
    const m = parts.find(p => p.type === 'minute')?.value ?? '00'
    return `${h.padStart(2,'0')}:${m.padStart(2,'0')}`
  } catch {
    const now = new Date()
    return `${now.getUTCHours().toString().padStart(2,'0')}:${now.getUTCMinutes().toString().padStart(2,'0')}`
  }
}

function isWithinWindow(current: string, start: string, end: string): boolean {
  return current >= start && current <= end
}

type HabitContext = {
  name: string
  why?: string | null
  biggest_excuse?: string | null
  stakes?: string | null
  coach_style?: string | null
}

async function generateMessage(habit: HabitContext, scheduleCoachStyle: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const coachStyle = habit.coach_style || scheduleCoachStyle || 'direct'

  const styleGuide: Record<string, string> = {
    direct: `no-nonsense. short, real, gets to the point. like a friend who doesn't sugarcoat things but actually wants you to win.`,
    brutal: `tough love. zero sympathy. calls out their BS directly. reminds them what they said they wanted and why they keep fumbling it.`,
    savage: `ruthless. maximum pressure. says the uncomfortable thing out loud. if they have a pattern of excuses, name it. no softness.`,
    motivating: `hype energy but grounded. makes them feel like they can actually do it. pulls from their "why". more hype coach than drill sergeant.`,
  }

  const prompt = `you're texting someone as their personal accountability coach. you text exactly like a gen z friend who actually cares — short, casual, lowercase, real. NOT a notification. NOT a marketing text. NOT a bot.

their habit: "${habit.name}"
${habit.why ? `why they care about it: ${habit.why}` : ''}
${habit.biggest_excuse ? `their go-to excuse when they skip: ${habit.biggest_excuse}` : ''}
${habit.stakes ? `what's at stake if they keep slacking: ${habit.stakes}` : ''}
your energy: ${styleGuide[coachStyle] || styleGuide.direct}

write ONE check-in text. 1-2 sentences MAX. use their specific context — don't be generic. if they have a known excuse, you can call it out. mix it up in tone (sometimes a question, sometimes a statement, sometimes calling them out). do NOT start with "hey" every time. do NOT say things like "friendly reminder" or "checking in" or "hope you're doing well". do NOT use exclamation points unless it's genuinely hype. just sound like a real person.

good examples (do NOT copy — just match the energy):
- "yo you hitting the gym today or are we doing the excuse thing again"
- "it's leg day. you going or nah"
- "bro you said this matters to you. so what's the move"
- "haven't seen you skip yet this week. don't start now"
- "real talk — you doing it today or not"
- "your future self is watching. what are you doing rn"

reply ONLY with the message. nothing else.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

async function generateFollowUp(habitName: string, coachStyle: string, excuse?: string | null): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const styleGuide: Record<string, string> = {
    direct: 'direct and real',
    brutal: 'harsh, no sympathy',
    savage: 'ruthless, maximum pressure',
    motivating: 'intense but pushing them forward',
  }

  const prompt = `you texted someone about their "${habitName}" habit a few minutes ago. no reply yet.

send a follow-up. 1 sentence only. be ${styleGuide[coachStyle] || styleGuide.direct}. text like a real person — short, casual, lowercase. ${excuse ? `their usual excuse is "${excuse}" — if it fits naturally, call it out without being weird about it.` : ''}

do NOT say "just checking in" or "following up" or anything corporate. sound like a friend who's lowkey annoyed they haven't heard back.

reply ONLY with the message.`

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
  const results = { sent: 0, followups: 0, skipped: 0, errors: 0 }

  // ── 1. Send follow-ups for unanswered messages ────────────────────────────
  const { rows: pendingFollowups } = await db.query(`
    SELECT m.id, m.habit_id, m.user_id, u.phone,
           h.name as habit_name, p.coach_style
    FROM messages m
    JOIN users u ON u.id = m.user_id
    LEFT JOIN habits h ON h.id = m.habit_id
    LEFT JOIN profiles p ON p.user_id = m.user_id
    WHERE m.follow_up_at <= $1
      AND m.follow_up_sent = false
      AND m.responded_at IS NULL
  `, [now.toISOString()])

  for (const row of pendingFollowups) {
    try {
      const msg = await generateFollowUp(row.habit_name || 'your goal', row.coach_style || 'direct')
      await twilioClient.messages.create({ body: msg, from: process.env.TWILIO_PHONE_NUMBER!, to: row.phone })
      await db.query(`UPDATE messages SET follow_up_sent = true WHERE id = $1`, [row.id])
      results.followups++
    } catch (err) {
      console.error('Follow-up error:', err)
      results.errors++
    }
  }

  // ── 2. Send regular check-ins ─────────────────────────────────────────────
  const { rows: schedules } = await db.query(`
    SELECT s.id as schedule_id, s.user_id, s.frequency_minutes, s.start_time,
           s.end_time, s.last_texted_at, s.timezone,
           u.phone, p.coach_style, p.biggest_distraction
    FROM schedules s
    JOIN users u ON u.id = s.user_id
    LEFT JOIN profiles p ON p.user_id = s.user_id
    WHERE s.active = true
  `)

  for (const schedule of schedules) {
    const tz = schedule.timezone || 'America/New_York'
    const localTime = getLocalTime(tz)

    if (!isWithinWindow(localTime, schedule.start_time, schedule.end_time)) {
      results.skipped++; continue
    }

    if (schedule.last_texted_at) {
      const minsSince = (now.getTime() - new Date(schedule.last_texted_at).getTime()) / 60000
      if (minsSince < schedule.frequency_minutes) {
        results.skipped++; continue
      }
    }

    // Pick the habit that was checked in on least recently
    const { rows: habits } = await db.query(`
      SELECT h.id, h.name, h.emoji, h.why, h.biggest_excuse, h.stakes, h.coach_style,
             MAX(m.sent_at) as last_checked
      FROM habits h
      LEFT JOIN messages m ON m.habit_id = h.id AND m.user_id = h.user_id
      WHERE h.user_id = $1 AND h.active = true
      GROUP BY h.id, h.name, h.emoji, h.why, h.biggest_excuse, h.stakes, h.coach_style
      ORDER BY last_checked ASC NULLS FIRST
      LIMIT 1
    `, [schedule.user_id])

    if (!habits.length) { results.skipped++; continue }

    const habit = habits[0]

    try {
      const message = await generateMessage(
        habit,
        schedule.coach_style || 'direct'
      )

      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: schedule.phone,
      })

      // Log message with follow-up scheduled for 5 min from now
      const followUpAt = new Date(now.getTime() + 5 * 60 * 1000)
      await db.query(
        `INSERT INTO messages (user_id, habit_id, message_text, sent_at, follow_up_at, follow_up_sent)
         VALUES ($1, $2, $3, $4, $5, false)`,
        [schedule.user_id, habit.id, message, now.toISOString(), followUpAt.toISOString()]
      )

      await db.query(`UPDATE schedules SET last_texted_at = $1 WHERE id = $2`, [now.toISOString(), schedule.schedule_id])
      results.sent++
    } catch (err) {
      console.error(`Error sending to ${schedule.phone}:`, err)
      results.errors++
    }
  }

  return NextResponse.json({ success: true, ...results })
}
