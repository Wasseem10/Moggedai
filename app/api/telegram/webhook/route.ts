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

type RecentTelegramMessage = {
  role: 'user' | 'assistant'
  message_text: string
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

async function rememberMessage(chatId: number, role: 'user' | 'assistant', text: string) {
  const db = getDb()
  await db.query(
    `INSERT INTO telegram_messages (chat_id, role, message_text)
     VALUES ($1, $2, $3)`,
    [chatId, role, text]
  )
}

async function getRecentMessages(chatId: number): Promise<RecentTelegramMessage[]> {
  const db = getDb()
  const { rows } = await db.query(
    `SELECT role, message_text
     FROM telegram_messages
     WHERE chat_id = $1
     ORDER BY created_at DESC
     LIMIT 10`,
    [chatId]
  )

  return rows.reverse() as RecentTelegramMessage[]
}

async function sendAndRemember(chatId: number, text: string) {
  await sendTelegramMessage(chatId, text)
  await rememberMessage(chatId, 'assistant', text)
}

async function generateAssistantReply(memory: string, userMessage: string, recentMessages: RecentTelegramMessage[]): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const conversation = recentMessages
    .map((message) => `${message.role}: ${message.message_text}`)
    .join('\n')

  const prompt = `you are StayPinged, a personal assistant brain inside Telegram.

your job:
- remember small details, tasks, follow-ups, dates, people, errands, ideas, and context
- help the user offload mental clutter
- be concise, useful, calm, and natural
- sound like a smart personal assistant texting, not a motivational coach
- if they ask you to remember something, confirm what you saved
- if they ask to move/reschedule something, acknowledge the new timing
- if they ask what something was about, summarize from memory/context
- if timing is vague, ask one short clarifying question
- do not hype them up, shame them, pressure them, or talk about streaks
- do not say you completed actions outside Telegram unless the system can actually do them
- write in lowercase unless a name/title needs capitalization

saved memory / current focus:
"${memory || 'nothing saved yet'}"

recent conversation:
${conversation || '(none)'}

latest user message:
"${userMessage}"

reply in 1-2 short sentences. reply only with the message.`

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

    await rememberMessage(chatId, 'user', text)

    if (/^\/start/i.test(text)) {
      await db.query(
        `UPDATE telegram_users SET state = 'awaiting_memory', active = true, updated_at = NOW() WHERE chat_id = $1`,
        [chatId]
      )
      await sendAndRemember(
        chatId,
        "i'm here. send me anything you want me to remember, track, or ping you about."
      )
      return NextResponse.json({ success: true })
    }

    if (/^\/?(stop|pause)$/i.test(text)) {
      await db.query(
        `UPDATE telegram_users SET active = false, updated_at = NOW() WHERE chat_id = $1`,
        [chatId]
      )
      await sendAndRemember(chatId, "got it. i'll stay quiet for now.")
      return NextResponse.json({ success: true })
    }

    if (/^\/?(reset|forget|clear)$/i.test(text)) {
      await db.query(
        `UPDATE telegram_users SET goal = NULL, state = 'awaiting_memory', active = true, updated_at = NOW() WHERE chat_id = $1`,
        [chatId]
      )
      await db.query(`DELETE FROM telegram_messages WHERE chat_id = $1`, [chatId])
      await sendAndRemember(chatId, "memory cleared. what should i keep track of now?")
      return NextResponse.json({ success: true })
    }

    if (!user.goal || user.state === 'awaiting_goal' || user.state === 'awaiting_memory') {
      await db.query(
        `UPDATE telegram_users SET goal = $1, state = 'ready', active = true, updated_at = NOW() WHERE chat_id = $2`,
        [text, chatId]
      )
      await sendAndRemember(chatId, `saved. i'll keep track of: ${text}`)
      return NextResponse.json({ success: true })
    }

    const recentMessages = await getRecentMessages(chatId)
    const reply = await generateAssistantReply(user.goal, text, recentMessages)
    await sendAndRemember(chatId, reply)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/telegram/webhook] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
