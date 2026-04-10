import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import twilio from 'twilio'
import { GoogleGenerativeAI } from '@google/generative-ai'

function getCurrentTimeString(): string {
  const now = new Date()
  const hours = now.getUTCHours().toString().padStart(2, '0')
  const minutes = now.getUTCMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function isWithinWindow(currentTime: string, startTime: string, endTime: string): boolean {
  return currentTime >= startTime && currentTime <= endTime
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

  const supabase = getSupabase()
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)
  const now = new Date()
  const currentTime = getCurrentTimeString()

  const { data: schedules, error } = await supabase
    .from('schedules')
    .select(`
      id,
      user_id,
      frequency_minutes,
      start_time,
      end_time,
      last_texted_at,
      users ( phone ),
      goals ( goal_text )
    `)
    .eq('active', true)

  if (error) {
    console.error('Fetch schedules error:', error)
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 })
  }

  const results = { sent: 0, skipped: 0, errors: 0 }

  for (const schedule of schedules ?? []) {
    if (!isWithinWindow(currentTime, schedule.start_time, schedule.end_time)) {
      results.skipped++
      continue
    }

    if (schedule.last_texted_at) {
      const lastTexted = new Date(schedule.last_texted_at)
      const minutesSince = (now.getTime() - lastTexted.getTime()) / 60000
      if (minutesSince < schedule.frequency_minutes) {
        results.skipped++
        continue
      }
    }

    const user = Array.isArray(schedule.users) ? schedule.users[0] : schedule.users
    const goal = Array.isArray(schedule.goals) ? schedule.goals[0] : schedule.goals

    if (!user?.phone || !goal?.goal_text) {
      results.skipped++
      continue
    }

    try {
      const message = await generateMessage(goal.goal_text)

      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: user.phone,
      })

      await supabase
        .from('schedules')
        .update({ last_texted_at: now.toISOString() })
        .eq('id', schedule.id)

      results.sent++
    } catch (err) {
      console.error(`Error sending to ${user.phone}:`, err)
      results.errors++
    }
  }

  return NextResponse.json({ success: true, ...results })
}
