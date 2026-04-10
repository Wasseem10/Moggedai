import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { phone, goal, frequency_minutes, start_time, end_time } = await req.json()

    if (!phone || !goal || !frequency_minutes || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Upsert user by phone
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({ phone }, { onConflict: 'phone' })
      .select('id')
      .single()

    if (userError) {
      console.error('User upsert error:', userError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    const userId = user.id

    // Deactivate any existing goals/schedules for this user
    await supabase.from('goals').update({ active: false }).eq('user_id', userId)
    await supabase.from('schedules').update({ active: false }).eq('user_id', userId)

    // Insert new goal
    const { error: goalError } = await supabase
      .from('goals')
      .insert({ user_id: userId, goal_text: goal, active: true })

    if (goalError) {
      console.error('Goal insert error:', goalError)
      return NextResponse.json({ error: 'Failed to save goal' }, { status: 500 })
    }

    // Insert new schedule
    const { error: scheduleError } = await supabase
      .from('schedules')
      .insert({
        user_id: userId,
        frequency_minutes,
        start_time,
        end_time,
        active: true,
        last_texted_at: null,
      })

    if (scheduleError) {
      console.error('Schedule insert error:', scheduleError)
      return NextResponse.json({ error: 'Failed to save schedule' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
