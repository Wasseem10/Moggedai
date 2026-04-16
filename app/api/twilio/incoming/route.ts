import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { GoogleGenerativeAI } from '@google/generative-ai'

type HabitRow = {
  id: string
  name: string
  emoji: string
  why: string | null
  biggest_excuse: string | null
  stakes: string | null
  coach_style: string | null
}

async function generateCoachReply(
  userMessage: string,
  habit: HabitRow,
  coachStyle: string,
  recentCheckIns: string[]
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const styleGuide: Record<string, string> = {
    direct: `no-nonsense, real, short. like a friend who doesn't sugarcoat but actually wants them to win.`,
    brutal: `tough love. zero sympathy. calls out their pattern directly. reminds them of what's at stake.`,
    savage: `ruthless and relentless. says the thing nobody else will say to them. maximum pressure.`,
    motivating: `hype energy but grounded. pulls from their "why". makes them feel like they can actually do this.`,
  }

  const contextBlock = recentCheckIns.length
    ? `\nlast few things you texted them:\n${recentCheckIns.map(m => `- "${m}"`).join('\n')}\n`
    : ''

  const prompt = `you're their accountability coach texting back. you text like a real gen z person — short, lowercase, casual, no corporate speak. this is a real text conversation, not a chatbot interaction.

their habit: "${habit.name}"
${habit.why ? `why they care: ${habit.why}` : ''}
${habit.biggest_excuse ? `their go-to excuse: ${habit.biggest_excuse}` : ''}
${habit.stakes ? `what's at stake: ${habit.stakes}` : ''}
your energy: ${styleGuide[coachStyle] || styleGuide.direct}
${contextBlock}
they just texted: "${userMessage}"

reply in 1-2 sentences MAX. react to exactly what they said. if they're making an excuse, call it out using what you know about them. if they're giving you a reason they can't, push back on it. if they did the thing, react to that. keep it human — no emojis unless it actually fits, no "great job!" type energy unless you're on motivating mode. reply ONLY with the message.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

async function generateDoneReply(
  habit: HabitRow,
  coachStyle: string,
  streak: number
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const styleGuide: Record<string, string> = {
    direct: `real and clean. acknowledge it without making it a big thing. keep them locked in.`,
    brutal: `give credit but don't let them celebrate too hard. remind them consistency is what matters.`,
    savage: `minimal praise. one line max. pivot to what's next.`,
    motivating: `let them feel it. they're building something. ${streak > 1 ? `the streak is real, hype it.` : `tell them this is how it starts.`}`,
  }

  const streakLine = streak > 1 ? ` they're on a ${streak}-day streak right now.` : ''

  const prompt = `your client just said they did their "${habit.name}" habit.${streakLine}

${habit.why ? `why this matters to them: ${habit.why}` : ''}

send a short reply. be ${styleGuide[coachStyle] || styleGuide.direct} 1-2 sentences MAX. text like a real person — short, lowercase, casual. no "great job!" or "awesome!" unless it's genuine hype. reply ONLY with the message.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

async function generateSkipReply(habit: HabitRow, coachStyle: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const styleGuide: Record<string, string> = {
    direct: 'call it out cleanly. no drama but make them feel it.',
    brutal: 'no mercy. remind them exactly what they keep doing and what it costs them.',
    savage: 'one sentence. make it sting. say the thing they don\'t want to hear.',
    motivating: 'show disappointment but redirect. tomorrow is still there.',
  }

  const prompt = `your client just texted "skip" for their "${habit.name}" habit.
${habit.stakes ? `what's at stake for them: ${habit.stakes}` : ''}
${habit.biggest_excuse ? `their usual excuse: ${habit.biggest_excuse}` : ''}

reply in 1 sentence. ${styleGuide[coachStyle] || styleGuide.direct} lowercase, short, real. reply ONLY with the message.`

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

async function generatePhotoReply(
  habit: HabitRow,
  coachStyle: string,
  streak: number
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const styleGuide: Record<string, string> = {
    direct: `acknowledge it cleanly. no hype, just respect. they proved it.`,
    brutal: `give credit but don't let them get comfortable. remind them consistency is what actually matters.`,
    savage: `minimal words. they did it. now keep that energy.`,
    motivating: `go hype. they sent proof. they showed up. make them feel it.`,
  }

  const streakLine = streak > 1 ? ` they're on a ${streak}-day streak.` : ''

  const prompt = `your client just sent you a photo as proof they completed their "${habit.name}" habit.${streakLine}

${habit.why ? `why this matters to them: ${habit.why}` : ''}

react to the photo proof. be ${styleGuide[coachStyle] || styleGuide.direct} 1-2 sentences MAX. casual, lowercase, real. acknowledge that they actually showed up and proved it. reply ONLY with the message.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const from = formData.get('From') as string
    const body = ((formData.get('Body') as string) || '').trim()
    const numMedia = parseInt((formData.get('NumMedia') as string) || '0')
    const mediaUrl = formData.get('MediaUrl0') as string | null
    if (!from) return twiml('')

    const db = getDb()
    const digits = from.replace(/\D/g, '')

    // Get user + profile
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
      return twiml("you've been unsubscribed. text START anytime to get back on track.")
    }

    // ── START ──────────────────────────────────────────────────────────────
    if (/^start$/i.test(body)) {
      if (userRows.length) {
        await db.query(`UPDATE schedules SET active = true WHERE user_id = $1`, [userRows[0].id])
      }
      return twiml("you're back. let's get it.")
    }

    if (!userRows.length) {
      return twiml("i don't have you in the system. sign up at moggedai.com")
    }

    const user = userRows[0]
    const coachStyle = user.coach_style || 'direct'

    // Get active habits with full context
    const { rows: habits } = await db.query(
      `SELECT id, name, emoji, why, biggest_excuse, stakes, coach_style
       FROM habits WHERE user_id = $1 AND active = true`,
      [user.id]
    )

    // Get last outbound message to know which habit we were talking about
    const { rows: lastOutbound } = await db.query(
      `SELECT m.habit_id, m.message_text
       FROM messages m
       WHERE m.user_id = $1
       ORDER BY m.sent_at DESC LIMIT 1`,
      [user.id]
    )

    const activeHabitId = lastOutbound[0]?.habit_id
    const activeHabit: HabitRow =
      habits.find((h: HabitRow) => h.id === activeHabitId) ||
      habits[0] || {
        id: null,
        name: 'your goal',
        emoji: '🎯',
        why: null,
        biggest_excuse: null,
        stakes: null,
        coach_style: null,
      }

    // Get recent outbound check-ins as context (last 4)
    const { rows: recentMsgs } = await db.query(
      `SELECT message_text FROM messages
       WHERE user_id = $1
       ORDER BY sent_at DESC LIMIT 4`,
      [user.id]
    )
    const recentCheckIns = recentMsgs.reverse().map((m: { message_text: string }) => m.message_text)

    // Mark any pending outbound as responded
    await db.query(
      `UPDATE messages SET responded_at = NOW(), follow_up_sent = true
       WHERE user_id = $1 AND responded_at IS NULL`,
      [user.id]
    )

    // ── PHOTO PROOF ────────────────────────────────────────────────────────
    if (numMedia > 0 && mediaUrl) {
      // Log completion with photo note
      if (activeHabitId) {
        await db.query(
          `INSERT INTO completions (user_id, habit_id, completed_at) VALUES ($1, $2, NOW())`,
          [user.id, activeHabitId]
        )
      }

      // Store the photo subgoal in messages table
      await db.query(
        `INSERT INTO messages (user_id, habit_id, message_text, sent_at, follow_up_sent, responded_at)
         VALUES ($1, $2, $3, NOW(), true, NOW())
         ON CONFLICT DO NOTHING`,
        [user.id, activeHabitId || null, `[photo proof sent] ${body || ''}`.trim()]
      )

      const { rows: comps } = await db.query(
        `SELECT completed_at FROM completions WHERE user_id = $1 AND habit_id = $2 ORDER BY completed_at DESC LIMIT 365`,
        [user.id, activeHabitId]
      )
      const streak = getStreak(comps)
      const reply = await generatePhotoReply(activeHabit, coachStyle, streak)
      return twiml(reply)
    }

    // ── HABITS ─────────────────────────────────────────────────────────────
    if (/^habits?$/i.test(body)) {
      if (!habits.length) return twiml("no habits set up yet. go to moggedai.com to add some.")
      const list = habits.map((h: HabitRow) => `${h.emoji} ${h.name}`).join('\n')
      return twiml(`your goals:\n${list}`)
    }

    // ── STREAK ─────────────────────────────────────────────────────────────
    if (/^streak$/i.test(body)) {
      const lines: string[] = []
      for (const h of habits) {
        const { rows: comps } = await db.query(
          `SELECT completed_at FROM completions WHERE user_id = $1 AND habit_id = $2 ORDER BY completed_at DESC LIMIT 365`,
          [user.id, h.id]
        )
        const streak = getStreak(comps)
        lines.push(`${h.emoji} ${h.name}: ${streak} day streak`)
      }
      return twiml(lines.join('\n') || "no streaks yet. get moving.")
    }

    // ── DONE ───────────────────────────────────────────────────────────────
    if (/^(done|finished|completed|did it|just did|i did it)/i.test(body)) {
      if (activeHabitId) {
        await db.query(
          `INSERT INTO completions (user_id, habit_id, completed_at) VALUES ($1, $2, NOW())`,
          [user.id, activeHabitId]
        )
      }

      const { rows: comps } = await db.query(
        `SELECT completed_at FROM completions WHERE user_id = $1 AND habit_id = $2 ORDER BY completed_at DESC LIMIT 365`,
        [user.id, activeHabitId]
      )
      const streak = getStreak(comps)

      const reply = await generateDoneReply(activeHabit, coachStyle, streak)
      return twiml(reply)
    }

    // ── SKIP ───────────────────────────────────────────────────────────────
    if (/^skip$/i.test(body)) {
      const reply = await generateSkipReply(activeHabit, coachStyle)
      return twiml(reply)
    }

    // ── AI COACH REPLY (catch-all for everything else) ─────────────────────
    const reply = await generateCoachReply(body, activeHabit, coachStyle, recentCheckIns)
    return twiml(reply)

  } catch (err) {
    console.error('Incoming webhook error:', err)
    return twiml("something went wrong on our end. try again.")
  }
}
