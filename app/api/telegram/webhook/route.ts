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

type ExtractedReminder = {
  reminder_text: string
  due_at: string
}

const memoryIntentPattern =
  /\b(remember|remind|ping|follow up|track|goal|goals|study|gym|deadline|appointment|errand|todo|to-do|task|don't let me forget|dont let me forget|keep me on track)\b/i

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

function getCurrentDateLabel(): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeZone: 'America/New_York',
  }).format(new Date())
}

function shouldSaveToMemory(text: string): boolean {
  return memoryIntentPattern.test(text)
}

function mergeMemory(currentMemory: string | null, userMessage: string): string {
  if (!currentMemory) return userMessage
  if (currentMemory.toLowerCase().includes(userMessage.toLowerCase())) return currentMemory
  return `${currentMemory}\n- ${userMessage}`
}

function safeJsonFromText(text: string): unknown {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim()
  return JSON.parse(cleaned)
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

  const prompt = `you are StayPinged, a friendly personal assistant inside Telegram.

today is ${getCurrentDateLabel()}.

core identity:
- you help with questions, reminders, goals, errands, studying, gym plans, follow-ups, and everyday decisions
- you are useful first: answer normal questions directly, even if they are not about reminders
- you are also an assistant brain: if the user wants help staying on track, help them pick the first thing to tackle

style:
- text like a sharp, warm assistant, not a corporate chatbot
- casual and natural, like: "yeah, absolutely — both of those are right in my wheelhouse"
- use lowercase most of the time, but keep names, places, titles, and acronyms properly capitalized
- keep it short: usually 1-3 text-message sized sentences
- occasional light personality is okay, but do not overdo emojis
- do not hype, shame, pressure, or sound like a motivational coach

behavior rules:
- if the user asks a factual question, answer it directly
- if they ask who the current president of the united states is, answer: "Donald Trump is the current president of the United States."
- if they ask "what can you do?" explain by asking for something they'd normally google, text a friend about, or need reminded about
- if they ask about goals/studying/gym, say yes and ask which goal they want to tackle first
- if they ask you to remember/remind/ping/track something, confirm briefly and ask for timing if needed
- if timing is vague, ask one short clarifying question
- if you cannot actually complete an external action, be honest and offer the next useful step
- do not say "as an AI language model"

saved memory / current focus:
"${memory || 'nothing saved yet'}"

recent conversation:
${conversation || '(none)'}

latest user message:
"${userMessage}"

reply only with the message.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

async function extractReminder(userMessage: string, recentMessages: RecentTelegramMessage[]): Promise<ExtractedReminder | null> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const conversation = recentMessages
    .slice(-6)
    .map((message) => `${message.role}: ${message.message_text}`)
    .join('\n')

  const prompt = `extract a reminder from this Telegram conversation.

today is ${getCurrentDateLabel()}.
the user's timezone is America/New_York.

return ONLY valid JSON in one of these exact shapes:
{"has_reminder":true,"reminder_text":"...","due_at":"2026-05-26T14:00:00.000-04:00"}
{"has_reminder":false}

rules:
- only return has_reminder true when the user clearly asks to be reminded, pinged, followed up with, or checked in at a future time
- if they mention a task or goal but no future time, return has_reminder false
- due_at must be an ISO datetime with timezone offset
- reminder_text should be short and human, like "study for bio exam" or "go to the gym"

recent conversation:
${conversation || '(none)'}

latest user message:
"${userMessage}"`

  const result = await model.generateContent(prompt)
  let parsed: Partial<ExtractedReminder> & { has_reminder?: boolean }
  try {
    parsed = safeJsonFromText(result.response.text()) as Partial<ExtractedReminder> & {
      has_reminder?: boolean
    }
  } catch (err) {
    console.warn('[extractReminder] failed to parse reminder JSON:', err)
    return null
  }

  if (!parsed.has_reminder || !parsed.reminder_text || !parsed.due_at) return null

  const due = new Date(parsed.due_at)
  if (Number.isNaN(due.getTime()) || due.getTime() <= Date.now()) {
    return null
  }

  return {
    reminder_text: parsed.reminder_text,
    due_at: due.toISOString(),
  }
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
        "i'm a friendly personal assistant here to take things off your plate. ask me anything, or send me something you want remembered.\n\nbtw, what's your name?"
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

    const recentMessages = await getRecentMessages(chatId)
    let savedReminder: ExtractedReminder | null = null

    if (shouldSaveToMemory(text)) {
      const nextMemory = mergeMemory(user.goal, text)
      await db.query(
        `UPDATE telegram_users SET goal = $1, state = 'ready', active = true, updated_at = NOW() WHERE chat_id = $2`,
        [nextMemory, chatId]
      )

      savedReminder = await extractReminder(text, recentMessages)
      if (savedReminder) {
        await db.query(
          `INSERT INTO telegram_reminders (chat_id, reminder_text, due_at)
           VALUES ($1, $2, $3)`,
          [chatId, savedReminder.reminder_text, savedReminder.due_at]
        )
      }
    }

    const { rows: freshRows } = await db.query(
      `SELECT goal FROM telegram_users WHERE chat_id = $1`,
      [chatId]
    )
    const memory = freshRows[0]?.goal || user.goal || ''
    const baseReply = await generateAssistantReply(memory, text, recentMessages)
    const reply = savedReminder
      ? `${baseReply}\n\nsaved reminder for ${new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'America/New_York',
        }).format(new Date(savedReminder.due_at))}.`
      : baseReply
    await sendAndRemember(chatId, reply)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/telegram/webhook] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
