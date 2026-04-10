import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { GoogleGenerativeAI } from '@google/generative-ai'
import twilio from 'twilio'

async function generateCoachReply(userMessage: string, goalText: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const prompt = `You are a no-nonsense accountability coach via SMS. Keep it short (1-2 sentences max).
The user's goal is: "${goalText}"
They just replied to your accountability text with: "${userMessage}"
Respond like a direct, sharp coach. If they're making excuses, call it out. If they're back on track, acknowledge it briefly and push them forward. No emojis. No fluff. Return only your reply.`
  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const from = formData.get('From') as string
    const body = (formData.get('Body') as string)?.trim()

    if (!from || !body) {
      return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
    }

    // Handle STOP / unsubscribe — Twilio handles this automatically but we mark inactive too
    if (/^(stop|unsubscribe|cancel|quit)$/i.test(body)) {
      const db = getDb()
      const digits = from.replace(/\D/g, '')
      await db.query(
        `UPDATE schedules SET active = false
         WHERE user_id = (SELECT id FROM users WHERE phone = $1 OR phone = $2)`,
        [digits, from]
      )
      const twiml = `<Response><Message>You've been unsubscribed. Text START to reactivate anytime.</Message></Response>`
      return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } })
    }

    // Handle START / resubscribe
    if (/^start$/i.test(body)) {
      const db = getDb()
      const digits = from.replace(/\D/g, '')
      await db.query(
        `UPDATE schedules SET active = true
         WHERE user_id = (SELECT id FROM users WHERE phone = $1 OR phone = $2)`,
        [digits, from]
      )
      const twiml = `<Response><Message>You're back in. No more excuses.</Message></Response>`
      return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } })
    }

    // Look up their goal and reply with AI coaching
    const db = getDb()
    const digits = from.replace(/\D/g, '')
    const { rows } = await db.query(
      `SELECT g.goal_text FROM goals g
       JOIN users u ON u.id = g.user_id
       WHERE (u.phone = $1 OR u.phone = $2) AND g.active = true
       LIMIT 1`,
      [digits, from]
    )

    let reply: string
    if (rows.length === 0) {
      reply = "I don't have you in the system. Sign up at moggedai.com to get started."
    } else {
      reply = await generateCoachReply(body, rows[0].goal_text)
    }

    // Send reply via Twilio TwiML
    const twiml = `<Response><Message>${reply}</Message></Response>`
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } })
  } catch (err) {
    console.error('Incoming webhook error:', err)
    return new NextResponse('<Response></Response>', { headers: { 'Content-Type': 'text/xml' } })
  }
}
