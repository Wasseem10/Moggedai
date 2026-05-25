import { NextRequest, NextResponse } from 'next/server'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

export async function GET(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get('secret')
    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = requireEnv('TELEGRAM_BOT_TOKEN')
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.moggedai.com'
    const webhookUrl = `${baseUrl.replace(/\/$/, '')}/api/telegram/webhook`

    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    })
    const body = await res.json()

    return NextResponse.json({ success: res.ok, webhookUrl, telegram: body }, { status: res.ok ? 200 : 500 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
