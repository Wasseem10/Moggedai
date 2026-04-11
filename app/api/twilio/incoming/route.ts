import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { GoogleGenerativeAI } from '@google/generative-ai'
import twilio from 'twilio'

async function generateCoachReply(userMessage: string, habitName: string, coachStyle: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const styleGuide: Record<string, string> = {
    brutal: 'Be brutal and harsh. No sympathy.',
    direct: 'Be direct and no-nonsense.',
    motivating: 'Be intense but motivating.',
  }
  const prompt = `You are an AI accountability coach via SMS.
Habit: "${habitName}"
Style: ${styleGuide[coachStyle] || styleGuide.direct}
User replied: "${userMessage}"
Respond in 1-2 sentences max. Be sharp. No emojis. Reply ONLY with your message.`
  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

function getStreak(completions: { completed_at: string }[]): number {
  if (!completions.length) return 0
  const days = [...new Set(completions.map(c => new Date(c.completed_at).toDateString()))]
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (days.includes(d.toDateString())) streak++
    else if (i > 0) break
  }
  return streak
}

function twiml(msg: string) {
  return new NextResponse(`<Response><Message>${msg}</Message></Response>`, {
    headers: { 'Content-Type': 'text/xml' },
  })
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const from = formData.get('From') as string
    const body = ((formData.get('Body') as string) || '').trim()
    if (!from) return twiml('')

    const db = getDb()
    const digits = from.replace(/\D/g, '')

    // Get user
    const { rows: userRows } = await db.query(
      `SELECT u.id, p.coach_style, p.biggest_distraction
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.phone = $1 OR u.phone = $2 LIMIT 1`,
      [digits, from]
    )

    // ── STOP ──────────────────────────────────────────────────────────────
    if (/^(stop|unsubscribe|cancel|quit)$/i.test(body)) {
      if (userRows.length) {
        await db.query(`UPDATE schedules SET active = false WHERE user_id = $1`, [userRows[0].id])
      }
      return twiml("You've been unsubscribed. Text START anytime to get back on track.")
    }

    // ── START ──────────────────────────────────────────────────────────────
    if (/^start$/i.test(body)) {
      if (userRows.length) {
        await db.query(`UPDATE schedules SET active = true WHERE user_id = $1`, [userRows[0].id])
      }
      return twiml("You're back. No more excuses.")
    }

    if (!userRows.length) {
      return twiml("I don't have you in the system. Sign up at moggedai.com")
    }

    const user = userRows[0]

    // ── HABITS ─────────────────────────────────────────────────────────────
    if (/^habits?$/i.test(body)) {
      const { rows: habits } = await db.query(
        `SELECT h.name, h.emoji,
                COUNT(c.id) as total,
                MAX(c.completed_at) as last_done
         FROM habits h
         LEFT JOIN completions c ON c.habit_id = h.id
         WHERE h.user_id = $1 AND h.active = true
         GROUP BY h.id, h.name, h.emoji`,
        [user.id]
      )
      if (!habits.length) return twiml("No habits set up yet. Go to moggedai.com to add some.")
      const list = habits.map((h: { emoji: string; name: string; total: string }) => `${h.emoji} ${h.name} (${h.total} done)`).join('\n')
      return twiml(`Your habits:\n${list}`)
    }

    // ── STREAK ─────────────────────────────────────────────────────────────
    if (/^streak$/i.test(body)) {
      const { rows: habits } = await db.query(
        `SELECT h.name, h.emoji FROM habits h WHERE h.user_id = $1 AND h.active = true`,
        [user.id]
      )
      const lines: string[] = []
      for (const h of habits) {
        const { rows: comps } = await db.query(
          `SELECT completed_at FROM completions WHERE user_id = $1 AND habit_id = (SELECT id FROM habits WHERE user_id = $1 AND name = $2 LIMIT 1) ORDER BY completed_at DESC LIMIT 365`,
          [user.id, h.name]
        )
        const streak = getStreak(comps)
        lines.push(`${h.emoji} ${h.name}: ${streak} day streak`)
      }
      return twiml(lines.join('\n') || "No streaks yet. Get moving.")
    }

    // ── DONE ───────────────────────────────────────────────────────────────
    if (/^done/i.test(body)) {
      // Find most recent message to get habit
      const { rows: lastMsg } = await db.query(
        `SELECT m.habit_id, h.name, h.emoji FROM messages m
         LEFT JOIN habits h ON h.id = m.habit_id
         WHERE m.user_id = $1
         ORDER BY m.sent_at DESC LIMIT 1`,
        [user.id]
      )

      const habitId = lastMsg[0]?.habit_id
      const habitName = lastMsg[0]?.name || 'your habit'
      const habitEmoji = lastMsg[0]?.emoji || '✓'

      // Mark message as responded
      await db.query(
        `UPDATE messages SET responded_at = NOW(), follow_up_sent = true
         WHERE user_id = $1 AND responded_at IS NULL
         ORDER BY sent_at DESC LIMIT 1`,
        [user.id]
      )

      // Log completion
      if (habitId) {
        await db.query(
          `INSERT INTO completions (user_id, habit_id, completed_at) VALUES ($1, $2, NOW())`,
          [user.id, habitId]
        )
      }

      // Calculate streak
      const { rows: comps } = await db.query(
        `SELECT completed_at FROM completions WHERE user_id = $1 AND habit_id = $2 ORDER BY completed_at DESC LIMIT 365`,
        [user.id, habitId]
      )
      const streak = getStreak(comps)

      const coachStyle = user.coach_style || 'direct'
      const streakMsg = streak > 1 ? ` ${streak} day streak.` : ''

      const replies: Record<string, string[]> = {
        brutal: [`${habitEmoji} Done.${streakMsg} Don't get comfortable.`, `Good.${streakMsg} Now stay focused.`],
        direct: [`${habitEmoji} Marked done.${streakMsg} Keep it up.`, `Got it.${streakMsg} Stay on it.`],
        motivating: [`${habitEmoji} Let's go!${streakMsg} You're building something real.`, `Yes!${streakMsg} That's how it's done.`],
      }

      const pool = replies[coachStyle] || replies.direct
      const reply = pool[Math.floor(Math.random() * pool.length)]
      return twiml(reply)
    }

    // ── SKIP ───────────────────────────────────────────────────────────────
    if (/^skip$/i.test(body)) {
      await db.query(
        `UPDATE messages SET responded_at = NOW(), follow_up_sent = true
         WHERE user_id = $1 AND responded_at IS NULL
         ORDER BY sent_at DESC LIMIT 1`,
        [user.id]
      )
      const style = user.coach_style || 'direct'
      const msgs: Record<string, string> = {
        brutal: "Skipped. Again. That's why you're not where you want to be.",
        direct: "Skipped. Don't make it a habit.",
        motivating: "Skipped this one. Make sure you get back to it.",
      }
      return twiml(msgs[style] || msgs.direct)
    }

    // ── AI COACH REPLY ─────────────────────────────────────────────────────
    const { rows: lastMsg } = await db.query(
      `SELECT m.habit_id, h.name FROM messages m
       LEFT JOIN habits h ON h.id = m.habit_id
       WHERE m.user_id = $1 ORDER BY m.sent_at DESC LIMIT 1`,
      [user.id]
    )

    // Mark as responded
    await db.query(
      `UPDATE messages SET responded_at = NOW()
       WHERE user_id = $1 AND responded_at IS NULL
       ORDER BY sent_at DESC LIMIT 1`,
      [user.id]
    )

    const habitName = lastMsg[0]?.name || 'your goal'
    const reply = await generateCoachReply(body, habitName, user.coach_style || 'direct')
    return twiml(reply)

  } catch (err) {
    console.error('Incoming webhook error:', err)
    return twiml("Something went wrong on our end. Try again.")
  }
}
