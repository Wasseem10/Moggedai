import twilio from 'twilio'

type SendSmsArgs = {
  to: string
  body: string
}

export type SendSmsResult = {
  provider: 'telnyx' | 'twilio'
  response?: unknown
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

export async function sendSms({ to, body }: SendSmsArgs): Promise<SendSmsResult> {
  if (process.env.SMS_PROVIDER === 'telnyx') {
    const res = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${requireEnv('TELNYX_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: requireEnv('TELNYX_FROM_NUMBER'),
        to,
        text: body,
        messaging_profile_id: process.env.TELNYX_MESSAGING_PROFILE_ID || undefined,
      }),
    })

    const responseText = await res.text()
    let response: unknown = responseText
    try {
      response = responseText ? JSON.parse(responseText) : null
    } catch {
      response = responseText
    }

    if (!res.ok) {
      throw new Error(`Telnyx send failed (${res.status}): ${responseText}`)
    }

    return { provider: 'telnyx', response }
  }

  const twilioClient = twilio(
    requireEnv('TWILIO_ACCOUNT_SID'),
    requireEnv('TWILIO_AUTH_TOKEN')
  )

  const message = await twilioClient.messages.create({
    body,
    from: requireEnv('TWILIO_PHONE_NUMBER'),
    to,
  })

  return { provider: 'twilio', response: { sid: message.sid, status: message.status } }
}
