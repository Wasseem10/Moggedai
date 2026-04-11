import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const db = getDb()

  try {
    const userRes = await db.query(
      `SELECT id, phone, active FROM users WHERE clerk_id = $1 LIMIT 1`,
      [userId]
    )

    if (userRes.rows.length === 0) {
      return NextResponse.json({ user: null })
    }

    const user = userRes.rows[0]
    const internalId = user.id

    const [goalsRes, schedRes, statsRes, msgsRes] = await Promise.all([
      db.query(
        `SELECT goal_text, deadline, stakes, why_it_matters, procrastination_triggers,
                weakness, tone, competition, sacrifice, success_vision
         FROM goals WHERE user_id = $1 LIMIT 1`,
        [internalId]
      ),
      db.query(
        `SELECT frequency_minutes, start_time, end_time, active_days, active
         FROM schedules WHERE user_id = $1 ORDER BY id DESC LIMIT 1`,
        [internalId]
      ),
      db.query(
        `SELECT
           (SELECT COUNT(*) FROM messages WHERE user_id = $1) AS total_texts,
           (SELECT COUNT(DISTINCT DATE(sent_at)) FROM messages
            WHERE user_id = $1
              AND sent_at > NOW() - INTERVAL '30 days') AS streak
        `,
        [internalId]
      ),
      db.query(
        `SELECT message_text, sent_at, responded_at
         FROM messages WHERE user_id = $1
         ORDER BY sent_at DESC LIMIT 10`,
        [internalId]
      ),
    ])

    const goals = goalsRes.rows[0] ?? null
    const schedule = schedRes.rows[0] ?? null
    const statsRow = statsRes.rows[0]

    return NextResponse.json({
      user: {
        phone: user.phone ?? '',
        active: user.active ?? true,
      },
      goals: {
        goal_text: goals?.goal_text ?? '',
        deadline: goals?.deadline
          ? new Date(goals.deadline).toISOString().split('T')[0]
          : '',
        stakes: goals?.stakes ?? '',
        why_it_matters: goals?.why_it_matters ?? '',
        procrastination_triggers: goals?.procrastination_triggers ?? [],
        weakness: goals?.weakness ?? '',
        tone: goals?.tone ?? 'firm',
        competition: goals?.competition ?? '',
        sacrifice: goals?.sacrifice ?? '',
        success_vision: goals?.success_vision ?? '',
      },
      schedule: {
        frequency_minutes: schedule?.frequency_minutes ?? 60,
        start_time: schedule?.start_time
          ? String(schedule.start_time).slice(0, 5)
          : '08:00',
        end_time: schedule?.end_time
          ? String(schedule.end_time).slice(0, 5)
          : '22:00',
        active_days: schedule?.active_days ?? [
          'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN',
        ],
        active: schedule?.active ?? true,
      },
      stats: {
        total_texts: parseInt(statsRow?.total_texts ?? '0', 10),
        streak: parseInt(statsRow?.streak ?? '0', 10),
      },
      recent_messages: msgsRes.rows,
    })
  } catch (err) {
    console.error('GET /api/user/profile error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()

  try {
    const body = await request.json() as Record<string, unknown>

    const userRes = await db.query(
      `SELECT id FROM users WHERE clerk_id = $1 LIMIT 1`,
      [userId]
    )

    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const internalId: number = userRes.rows[0].id

    // Handle pause/resume toggle
    if (typeof body.active === 'boolean') {
      await db.query(`UPDATE users SET active = $1 WHERE id = $2`, [
        body.active,
        internalId,
      ])
    }

    // Upsert goals fields
    const goalFields = [
      'goal_text',
      'deadline',
      'stakes',
      'why_it_matters',
      'procrastination_triggers',
      'weakness',
      'tone',
      'competition',
      'sacrifice',
      'success_vision',
    ]

    const hasGoalField = goalFields.some((f) => f in body)

    if (hasGoalField) {
      const goalData = {
        goal_text: (body.goal_text as string) ?? '',
        deadline: (body.deadline as string) || null,
        stakes: (body.stakes as string) ?? '',
        why_it_matters: (body.why_it_matters as string) ?? '',
        procrastination_triggers: JSON.stringify(
          (body.procrastination_triggers as string[]) ?? []
        ),
        weakness: (body.weakness as string) ?? '',
        tone: (body.tone as string) ?? 'firm',
        competition: (body.competition as string) ?? '',
        sacrifice: (body.sacrifice as string) ?? '',
        success_vision: (body.success_vision as string) ?? '',
      }

      await db.query(
        `INSERT INTO goals
           (user_id, goal_text, deadline, stakes, why_it_matters,
            procrastination_triggers, weakness, tone, competition, sacrifice, success_vision)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (user_id) DO UPDATE SET
           goal_text               = EXCLUDED.goal_text,
           deadline                = EXCLUDED.deadline,
           stakes                  = EXCLUDED.stakes,
           why_it_matters          = EXCLUDED.why_it_matters,
           procrastination_triggers = EXCLUDED.procrastination_triggers,
           weakness                = EXCLUDED.weakness,
           tone                    = EXCLUDED.tone,
           competition             = EXCLUDED.competition,
           sacrifice               = EXCLUDED.sacrifice,
           success_vision          = EXCLUDED.success_vision`,
        [
          internalId,
          goalData.goal_text,
          goalData.deadline,
          goalData.stakes,
          goalData.why_it_matters,
          goalData.procrastination_triggers,
          goalData.weakness,
          goalData.tone,
          goalData.competition,
          goalData.sacrifice,
          goalData.success_vision,
        ]
      )
    }

    // Update schedule fields
    const schedFields = [
      'frequency_minutes',
      'start_time',
      'end_time',
      'active_days',
    ]
    const hasSchedField = schedFields.some((f) => f in body)

    if (hasSchedField) {
      const existing = await db.query(
        `SELECT id FROM schedules WHERE user_id = $1 LIMIT 1`,
        [internalId]
      )

      if (existing.rows.length > 0) {
        const setParts: string[] = []
        const vals: unknown[] = [internalId]

        if ('frequency_minutes' in body) {
          vals.push(body.frequency_minutes)
          setParts.push(`frequency_minutes = $${vals.length}`)
        }
        if ('start_time' in body) {
          vals.push(body.start_time)
          setParts.push(`start_time = $${vals.length}`)
        }
        if ('end_time' in body) {
          vals.push(body.end_time)
          setParts.push(`end_time = $${vals.length}`)
        }
        if ('active_days' in body) {
          vals.push(JSON.stringify(body.active_days))
          setParts.push(`active_days = $${vals.length}`)
        }

        if (setParts.length > 0) {
          await db.query(
            `UPDATE schedules SET ${setParts.join(', ')} WHERE user_id = $1`,
            vals
          )
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/user/profile error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
