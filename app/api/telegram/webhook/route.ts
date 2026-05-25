import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ensureSchema, getDb } from '@/lib/db'

type TelegramUser = {
  id: number
  username?: string
  first_name?: string
}

type TelegramMessage = {
  chat?: { id?: number }
  from?: TelegramUser
  text?: string
}

type TelegramUpdate = {
  message?: TelegramMessage
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

async function sendTelegramMessage(chatId: number, text: string) {
  const token = requireEnv('TELEGRAM_BOT_TOKEN')
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  })

  if (!res.ok) {
    throw new Error(`Telegram send failed (${res.status}): ${await res.text()}`)
  }
}

async function generateCoachReply(goal: string, userMessage: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `you're an accountability coach texting inside telegram. write like a real person: short, calm, natural, lowercase. you feel like a sharp friend who remembers what they said they wanted, not a bot.

their goal: "${goal || 'stay consistent with their goal'}"
they just said: "${userMessage}"

reply in 1-2 sentences max. no command instructions. no "reply done". no corporate language. if they are making an excuse, push back without sounding cringe. if they completed it, acknowledge it naturally. reply only with the message.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json() as TelegramUpdate
    const message = update.message
    const chatId = message?.chat?.id
    const text = message?.text?.trim() || ''

    if (!chatId || !text) {
      return NextResponse.json({ success: true, ignored: true })
    }

    await ensureSchema()
    const db = getDb()
    const from = message?.from

    await db.query(
      `INSERT INTO telegram_users (chat_id, username, first_name, state, updated_at)
       VALUES ($1, $2, $3, 'awaiting_goal', NOW())
       ON CONFLICT (chat_id) DO UPDATE SET
         username = EXCLUDED.username,
         first_name = EXCLUDED.first_name,
         updated_at = NOW()`,
      [chatId, from?.username || null, from?.first_name || null]
    )

    const { rows } = await db.query(
      `SELECT goal, state FROM telegram_users WHERE chat_id = $1`,
      [chatId]
    )
    const user = rows[0] as { goal: string | null; state: string }

    if (/^\/start/i.test(text)) {
      await db.query(
        `UPDATE telegram_users SET state = 'awaiting_goal', active = true, updated_at = NOW() WHERE chat_id = $1`,
        [chatId]
      )
      await sendTelegramMessage(
        chatId,
        "alright, what are we working on? say it the way you'd say it to a friend."
      )
      return NextResponse.json({ success: true })
    }

    if (/^\/?(stop|pause)$/i.test(text)) {
      await db.query(
        `UPDATE telegram_users SET active = false, updated_at = NOW() WHERE chat_id = $1`,
        [chatId]
      )
      await sendTelegramMessage(chatId, "got it. i'll chill for now.")
      return NextResponse.json({ success: true })
    }

    if (/^\/?(reset|goal)$/i.test(text)) {
      await db.query(
        `UPDATE telegram_users SET goal = NULL, state = 'awaiting_goal', active = true, updated_at = NOW() WHERE chat_id = $1`,
        [chatId]
      )
      await sendTelegramMessage(chatId, "okay, what are we switching the focus to?")
      return NextResponse.json({ success: true })
    }

    if (!user.goal || user.state === 'awaiting_goal') {
      await db.query(
        `UPDATE telegram_users SET goal = $1, state = 'ready', active = true, updated_at = NOW() WHERE chat_id = $2`,
        [text, chatId]
      )
      await sendTelegramMessage(chatId, `got you. i'll keep you honest about ${text}.`)
      return NextResponse.json({ success: true })
    }

    if (/^(done|finished|completed|did it|i did it)$/i.test(text)) {
      await sendTelegramMessage(chatId, `good. that's one real rep toward ${user.goal}.`)
      return NextResponse.json({ success: true })
    }

    if (/^skip$/i.test(text)) {
      await sendTelegramMessage(chatId, `alright. not ideal, but don't let one miss turn into the whole pattern.`)
      return NextResponse.json({ success: true })
    }

    const reply = await generateCoachReply(user.goal, text)
    await sendTelegramMessage(chatId, reply)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/telegram/webhook] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
