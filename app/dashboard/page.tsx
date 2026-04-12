'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, useClerk, UserButton } from '@clerk/nextjs'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Habit = {
  id: string
  name: string
  emoji: string
  streak: number
  total_completions: number
  why?: string
  biggest_excuse?: string
  stakes?: string
  time_of_day?: string
  coach_style?: string
  last_message?: string
  last_message_at?: string
}

type UserData = { phone: string; active: boolean }
type Stats = { total_texts: number; streak: number; total_completions: number }
type Message = {
  message_text: string
  sent_at: string
  responded_at: string | null
  habit_id?: string
}
type CompletedHabit = {
  id: string
  name: string
  emoji: string
  completed_at: string
  total_completions: number
}
type WeeklyRecap = {
  total: number
  monthly_total: number
  by_habit: { name: string; emoji: string; count: number }[]
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const C = {
  bg:     'var(--c-bg)',
  s1:     'var(--c-s1)',
  s2:     'var(--c-s2)',
  border: 'var(--c-border)',
  text:   'var(--c-text)',
  text2:  'var(--c-text2)',
  text3:  'var(--c-text3)',
}

const MONO = "'Space Mono', 'Courier New', monospace"
const GROTESK = "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif"

const PRESET_HABITS = [
  { name: 'Gym', emoji: '💪' },
  { name: 'Study', emoji: '📚' },
  { name: 'Work', emoji: '💼' },
  { name: 'Read', emoji: '📖' },
  { name: 'Meditate', emoji: '🧘' },
  { name: 'Sleep', emoji: '😴' },
  { name: 'Diet', emoji: '🥗' },
  { name: 'Side Project', emoji: '🚀' },
  { name: 'No Phone', emoji: '📵' },
  { name: 'Water', emoji: '💧' },
]

const TIME_OPTIONS = [
  { value: 'morning', label: '🌅 Morning', sub: '6am–12pm' },
  { value: 'afternoon', label: '☀️ Afternoon', sub: '12pm–5pm' },
  { value: 'evening', label: '🌆 Evening', sub: '5pm–10pm' },
  { value: 'anytime', label: '🔄 Throughout', sub: 'the day' },
]

const COACH_OPTIONS = [
  { value: 'direct', label: 'DIRECT', sub: 'Clear and no-nonsense. Just get it done.' },
  { value: 'brutal', label: 'BRUTAL', sub: 'No mercy. Gets in your face. Zero sympathy.' },
  { value: 'savage', label: 'SAVAGE', sub: 'Maximum pressure. Not for the weak.' },
]

type View = 'overview' | 'detail' | 'add' | 'confirm'

interface AddDraft {
  name: string
  emoji: string
  why: string
  biggest_excuse: string
  stakes: string
  time_of_day: string
  coach_style: string
}

const defaultDraft = (): AddDraft => ({
  name: '',
  emoji: '🎯',
  why: '',
  biggest_excuse: '',
  stakes: '',
  time_of_day: 'anytime',
  coach_style: 'direct',
})

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter()
  const { user: clerkUser } = useUser()
  const { signOut } = useClerk()

  const [view, setView] = useState<View>('overview')
  const [confirmedDraft, setConfirmedDraft] = useState<AddDraft | null>(null)
  const [selectedMission, setSelectedMission] = useState<Habit | null>(null)

  const [userData, setUserData] = useState<UserData | null>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [completedHabits, setCompletedHabits] = useState<CompletedHabit[]>([])
  const [weeklyRecap, setWeeklyRecap] = useState<WeeklyRecap>({ total: 0, monthly_total: 0, by_habit: [] })
  const [stats, setStats] = useState<Stats>({ total_texts: 0, streak: 0, total_completions: 0 })
  const [recentMessages, setRecentMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<'dark'|'light'>('dark')

  useEffect(() => {
    const stored = (localStorage.getItem('mogged-theme') || 'dark') as 'dark'|'light'
    setTheme(stored)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('mogged-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  // Add flow state
  const [addStep, setAddStep] = useState(1)
  const [addDraft, setAddDraft] = useState<AddDraft>(defaultDraft())
  const [addLoading, setAddLoading] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customEmoji, setCustomEmoji] = useState('🎯')

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/user')
      const d = await res.json()
      if (d.user) {
        // If user exists but has no phone, send them to setup
        if (!d.user.phone) {
          router.push('/setup')
          return
        }
        setUserData(d.user)
        setHabits(d.habits ?? [])
        setCompletedHabits(d.completed_habits ?? [])
        setWeeklyRecap(d.weekly_recap ?? { total: 0, monthly_total: 0, by_habit: [] })
        setStats(d.stats ?? { total_texts: 0, streak: 0, total_completions: 0 })
        setRecentMessages(d.recent_messages ?? [])
      } else {
        // No user record at all — send to setup
        router.push('/setup')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'GOOD MORNING'
    if (h < 17) return 'GOOD AFTERNOON'
    return 'GOOD EVENING'
  }

  const handleAddSubmit = async () => {
    if (!addDraft.coach_style) return
    setAddLoading(true)
    try {
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ add_habit: addDraft }),
      })
      await loadData()
      setConfirmedDraft({ ...addDraft })
      setView('confirm')
      setAddDraft(defaultDraft())
      setAddStep(1)
    } catch (e) {
      console.error(e)
    } finally {
      setAddLoading(false)
    }
  }

  const handleUpdateHabit = async (updated: Partial<Habit> & { id: string }) => {
    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ update_habit: updated }),
    })
    await loadData()
    // Refresh selectedMission with updated data
    setSelectedMission(prev => prev ? { ...prev, ...updated } : prev)
  }

  const handleDeleteHabit = async (habitId: string) => {
    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remove_habit_id: habitId }),
    })
    await loadData()
    setView('overview')
  }

  const handleCompleteHabit = async (habitId: string) => {
    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complete_habit_id: habitId }),
    })
    await loadData()
    setView('overview')
  }

  const handleToggleActive = async () => {
    if (!userData) return
    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !userData.active }),
    })
    await loadData()
  }

  const handleUpdatePhone = async (newPhone: string) => {
    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ update_phone: newPhone }),
    })
    await loadData()
  }

  const handleSignOut = () => signOut(() => router.push('/'))

  if (loading) {
    return (
      <>
        <FontLoader />
        <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: C.text3, fontFamily: MONO, fontSize: '0.7rem', letterSpacing: '0.2em' }}>LOADING...</span>
        </div>
      </>
    )
  }

  return (
    <>
      <FontLoader />
      <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: GROTESK }}>
        <Nav onLogoClick={() => router.push('/')} theme={theme} onToggleTheme={toggleTheme} />
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 1.25rem', paddingBottom: '4rem' }}>
          {view === 'overview' && (
            <OverviewView
              clerkUser={clerkUser}
              userData={userData}
              habits={habits}
              completedHabits={completedHabits}
              weeklyRecap={weeklyRecap}
              stats={stats}
              greeting={greeting()}
              onSelectMission={(h) => { setSelectedMission(h); setView('detail') }}
              onAddMission={() => { setView('add'); setAddStep(1); setAddDraft(defaultDraft()) }}
              onToggleActive={handleToggleActive}
              onUpdatePhone={handleUpdatePhone}
              onSignOut={handleSignOut}
            />
          )}
          {view === 'detail' && selectedMission && (
            <DetailView
              habit={selectedMission}
              messages={recentMessages.filter(m => m.habit_id === selectedMission.id)}
              onBack={() => setView('overview')}
              onDelete={() => handleDeleteHabit(selectedMission.id)}
              onComplete={() => handleCompleteHabit(selectedMission.id)}
              onUpdate={handleUpdateHabit}
            />
          )}
          {view === 'confirm' && confirmedDraft && (
            <ConfirmView
              draft={confirmedDraft}
              onDone={() => setView('overview')}
            />
          )}
          {view === 'add' && (
            <AddView
              step={addStep}
              draft={addDraft}
              habits={habits}
              customName={customName}
              customEmoji={customEmoji}
              loading={addLoading}
              onStepChange={setAddStep}
              onDraftChange={(patch) => setAddDraft(prev => ({ ...prev, ...patch }))}
              onCustomNameChange={setCustomName}
              onCustomEmojiChange={setCustomEmoji}
              onSubmit={handleAddSubmit}
              onBack={() => setView('overview')}
            />
          )}
        </div>
      </div>
    </>
  )
}

// ─── Font Loader ───────────────────────────────────────────────────────────────

function FontLoader() {
  return (
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  )
}

// ─── Nav ───────────────────────────────────────────────────────────────────────

function Nav({ onLogoClick, theme, onToggleTheme }: { onLogoClick: () => void; theme: 'dark'|'light'; onToggleTheme: () => void }) {
  return (
    <nav style={{
      background: C.bg,
      borderBottom: `1px solid ${C.border}`,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 1.25rem',
    }}>
      <div style={{
        maxWidth: 640,
        margin: '0 auto',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={onLogoClick}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: MONO, fontSize: '0.85rem', letterSpacing: '0.05em', color: C.text }}
        >
          MOGGED<span style={{ color: '#0ea5e9' }}>AI</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: C.s2,
              border: `1px solid ${C.border}`,
              cursor: 'pointer',
              padding: '0.3rem 0.6rem',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span style={{ fontFamily: MONO, fontSize: '0.45rem', letterSpacing: '0.1em', color: C.text3 }}>
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </span>
          </button>
          <UserButton />
        </div>
      </div>
    </nav>
  )
}

// ─── Overview View ─────────────────────────────────────────────────────────────

// ─── Weekly Recap Card ────────────────────────────────────────────────────────

function WeeklyRecapCard({ recap, streak, totalCompletions }: { recap: WeeklyRecap; streak: number; totalCompletions: number }) {
  const topHabit = recap.by_habit[0]
  return (
    <div style={{
      border: `1px solid var(--c-accent-bdr)`,
      background: 'var(--c-accent-dim)',
      marginBottom: '2rem',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { width: 0; }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: '0.85rem 1.25rem', borderBottom: `1px solid var(--c-accent-bdr)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: '0.65rem', letterSpacing: '0.2em', color: '#0ea5e9', fontWeight: 700 }}>THIS WEEK</span>
        <span style={{ fontFamily: MONO, fontSize: '0.55rem', color: 'var(--c-text3)', letterSpacing: '0.1em' }}>
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} recap
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: `1px solid var(--c-accent-bdr)` }}>
        {[
          { label: 'THIS WEEK', value: recap.total, sub: 'completions' },
          { label: 'THIS MONTH', value: recap.monthly_total, sub: 'completions' },
          { label: 'STREAK', value: streak > 0 ? `🔥 ${streak}` : '—', sub: 'days' },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: '1rem 0.75rem', textAlign: 'center',
              borderRight: i < 2 ? `1px solid var(--c-accent-bdr)` : undefined,
              opacity: 0, animation: `slideUp 0.4s ease forwards`, animationDelay: `${i * 100}ms`,
            }}
          >
            <div style={{ fontFamily: GROTESK, fontWeight: 700, fontSize: 'clamp(1.1rem,4vw,1.5rem)', color: '#0ea5e9', lineHeight: 1, marginBottom: '0.25rem' }}>{s.value}</div>
            <div style={{ fontFamily: MONO, fontSize: '0.5rem', color: 'var(--c-text3)', letterSpacing: '0.1em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per-habit breakdown */}
      {recap.by_habit.length > 0 && (
        <div style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontFamily: MONO, fontSize: '0.55rem', color: 'var(--c-text3)', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>BREAKDOWN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {recap.by_habit.map((h, i) => {
              const pct = topHabit ? Math.round((h.count / topHabit.count) * 100) : 0
              return (
                <div key={h.name} style={{ opacity: 0, animation: `slideUp 0.4s ease forwards`, animationDelay: `${300 + i * 80}ms` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontFamily: GROTESK, fontSize: '0.85rem', color: 'var(--c-text)' }}>{h.emoji} {h.name}</span>
                    <span style={{ fontFamily: MONO, fontSize: '0.6rem', color: '#0ea5e9' }}>{h.count}×</span>
                  </div>
                  <div style={{ height: '3px', background: 'var(--c-border)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', background: '#0ea5e9', borderRadius: '2px',
                      width: `${pct}%`, animation: `barGrow 0.6s ease forwards`, animationDelay: `${400 + i * 80}ms`,
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
          {totalCompletions > 0 && (
            <div style={{ marginTop: '0.85rem', fontFamily: MONO, fontSize: '0.55rem', color: 'var(--c-text3)', letterSpacing: '0.1em', opacity: 0, animation: `slideUp 0.4s ease forwards`, animationDelay: '600ms' }}>
              {totalCompletions} total completions all time
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Overview View ─────────────────────────────────────────────────────────────

function OverviewView({
  clerkUser,
  userData,
  habits,
  completedHabits,
  weeklyRecap,
  stats,
  greeting,
  onSelectMission,
  onAddMission,
  onToggleActive,
  onUpdatePhone,
  onSignOut,
}: {
  clerkUser: ReturnType<typeof useUser>['user']
  userData: UserData | null
  habits: Habit[]
  completedHabits: CompletedHabit[]
  weeklyRecap: WeeklyRecap
  stats: Stats
  greeting: string
  onSelectMission: (h: Habit) => void
  onAddMission: () => void
  onToggleActive: () => void
  onUpdatePhone: (phone: string) => Promise<void>
  onSignOut: () => void
}) {
  const displayName = clerkUser?.firstName || userData?.phone || ''
  const isActive = userData?.active ?? false
  const [editingPhone, setEditingPhone] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const [phoneLoading, setPhoneLoading] = useState(false)

  return (
    <div>
      {/* Hero */}
      <div style={{ paddingTop: '2rem', paddingBottom: '1.5rem' }}>
        <p style={{ fontFamily: MONO, fontSize: '0.75rem', color: C.text2, letterSpacing: '0.15em', margin: 0, marginBottom: '0.4rem' }}>
          {greeting} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
        </p>
        <h1 style={{ fontFamily: GROTESK, fontWeight: 700, fontSize: 'clamp(1.3rem,5vw,1.6rem)', margin: 0, marginBottom: '0.5rem', color: C.text }}>
          {displayName}
        </h1>
        <span style={{
          fontFamily: MONO,
          fontSize: '0.7rem',
          color: isActive ? '#22c55e' : C.text3,
          letterSpacing: '0.1em',
        }}>
          {isActive ? '● ACTIVE' : '● PAUSED'}
        </span>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', border: `1px solid ${C.border}`, marginBottom: '2rem' }}>

        {/* Active Missions */}
        <div style={{ padding: '1rem 0.75rem', textAlign: 'center', borderRight: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: GROTESK, fontWeight: 700, fontSize: 'clamp(1.1rem,4vw,1.4rem)', color: C.text, lineHeight: 1, marginBottom: '0.3rem' }}>
            {habits.length}
          </div>
          <div style={{ fontFamily: MONO, fontSize: '0.6rem', color: C.text3, letterSpacing: '0.12em' }}>MISSIONS</div>
          <div style={{ fontFamily: MONO, fontSize: '0.55rem', color: habits.length > 0 ? '#22c55e' : C.text3, letterSpacing: '0.08em', marginTop: '0.2rem' }}>
            {habits.length > 0 ? 'ACTIVE' : 'NONE YET'}
          </div>
        </div>

        {/* Streak */}
        <div style={{ padding: '1rem 0.75rem', textAlign: 'center', borderRight: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: GROTESK, fontWeight: 700, fontSize: 'clamp(1.1rem,4vw,1.4rem)', color: stats.streak > 0 ? '#f59e0b' : C.text, lineHeight: 1, marginBottom: '0.3rem' }}>
            {stats.streak > 0 ? `🔥 ${stats.streak}` : '—'}
          </div>
          <div style={{ fontFamily: MONO, fontSize: '0.6rem', color: C.text3, letterSpacing: '0.12em' }}>DAY STREAK</div>
          <div style={{ fontFamily: MONO, fontSize: '0.55rem', color: C.text3, letterSpacing: '0.08em', marginTop: '0.2rem' }}>
            {stats.streak > 0 ? 'KEEP GOING' : 'REPLY DONE TO START'}
          </div>
        </div>

        {/* Completions */}
        <div style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
          <div style={{ fontFamily: GROTESK, fontWeight: 700, fontSize: 'clamp(1.1rem,4vw,1.4rem)', color: C.text, lineHeight: 1, marginBottom: '0.3rem' }}>
            {stats.total_completions}
          </div>
          <div style={{ fontFamily: MONO, fontSize: '0.6rem', color: C.text3, letterSpacing: '0.12em' }}>COMPLETED</div>
          <div style={{ fontFamily: MONO, fontSize: '0.55rem', color: C.text3, letterSpacing: '0.08em', marginTop: '0.2rem' }}>
            {stats.total_completions > 0 ? 'TOTAL DONE' : 'NONE YET'}
          </div>
        </div>

      </div>

      {/* Missions */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontFamily: MONO, fontSize: '0.75rem', letterSpacing: '0.15em', color: C.text2, fontWeight: 700 }}>
            MY MISSIONS
          </span>
          <span style={{
            background: C.s2,
            border: `1px solid ${C.border}`,
            color: C.text2,
            fontFamily: MONO,
            fontSize: '0.7rem',
            padding: '0.1rem 0.5rem',
          }}>
            {habits.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {habits.map(h => (
            <MissionCard key={h.id} habit={h} onClick={() => onSelectMission(h)} />
          ))}

          {/* Empty state — shown when no missions yet */}
          {habits.length === 0 && (
            <div style={{
              border: `1px solid ${C.border}`,
              background: C.s1,
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🎯</div>
              <div>
                <p style={{ fontFamily: MONO, fontSize: '0.7rem', letterSpacing: '0.15em', color: C.text, margin: 0, marginBottom: '0.4rem', fontWeight: 700 }}>
                  NO MISSIONS YET
                </p>
                <p style={{ fontFamily: MONO, fontSize: '0.58rem', color: C.text3, margin: 0, lineHeight: 1.7, letterSpacing: '0.05em' }}>
                  Add your first mission and your AI coach<br />will start texting you to make sure you do it.
                </p>
              </div>
              <button
                onClick={onAddMission}
                style={{
                  background: '#0ea5e9',
                  border: 'none',
                  color: '#fff',
                  fontFamily: MONO,
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  fontWeight: 700,
                  padding: '0.85rem 1.75rem',
                  cursor: 'pointer',
                }}
              >
                + ADD YOUR FIRST MISSION
              </button>
            </div>
          )}

          {/* Add button — shown when missions exist but under the limit */}
          {habits.length > 0 && habits.length < 5 && (
            <button
              onClick={onAddMission}
              style={{
                width: '100%',
                border: `1px dashed ${C.border}`,
                background: 'transparent',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
                borderRadius: 0,
              }}
            >
              <span style={{ fontSize: '1.4rem', color: '#0ea5e9', lineHeight: 1 }}>+</span>
              <span style={{ fontFamily: MONO, fontSize: '0.6rem', color: C.text3, letterSpacing: '0.1em' }}>
                Add a mission
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Weekly Recap — always show once they have at least one mission */}
      {habits.length > 0 && (
        <WeeklyRecapCard recap={weeklyRecap} streak={stats.streak} totalCompletions={stats.total_completions} />
      )}

      {/* Completed Missions */}
      {completedHabits.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: MONO, fontSize: '0.75rem', letterSpacing: '0.15em', color: C.text2, fontWeight: 700 }}>
              COMPLETED MISSIONS
            </span>
            <span style={{ background: C.s2, border: `1px solid ${C.border}`, color: C.text2, fontFamily: MONO, fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>
              {completedHabits.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {completedHabits.map((h, i) => (
              <div
                key={h.id}
                style={{
                  border: `1px solid ${C.border}`,
                  background: C.s1,
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  opacity: 0,
                  animation: `slideUp 0.4s ease forwards`,
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{h.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: GROTESK, fontWeight: 600, fontSize: '0.95rem', color: C.text2 }}>{h.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: '0.6rem', color: C.text3, marginTop: '0.2rem' }}>
                    {h.total_completions} completions · finished {new Date(h.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <span style={{ fontSize: '1.2rem' }}>🏆</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account Section */}
      <div style={{ borderTop: `1px solid ${C.border}` }}>

        {/* Phone row */}
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: '1rem 0' }}>
          <div style={{ fontFamily: MONO, fontSize: '0.7rem', color: C.text2, letterSpacing: '0.12em', marginBottom: '0.4rem', fontWeight: 700 }}>PHONE NUMBER</div>
          {editingPhone ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="tel"
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                placeholder="(555) 000-0000"
                style={{
                  background: C.s2,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  fontFamily: MONO,
                  fontSize: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  outline: 'none',
                  borderRadius: 0,
                  width: '160px',
                }}
              />
              <button
                onClick={async () => {
                  setPhoneLoading(true)
                  await onUpdatePhone(phoneInput)
                  setPhoneLoading(false)
                  setEditingPhone(false)
                  setPhoneInput('')
                }}
                disabled={phoneLoading || phoneInput.replace(/\D/g,'').length !== 10}
                style={{
                  background: '#0ea5e9',
                  border: 'none',
                  color: '#fff',
                  fontFamily: MONO,
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  opacity: phoneInput.replace(/\D/g,'').length !== 10 ? 0.4 : 1,
                  borderRadius: 0,
                }}
              >
                {phoneLoading ? 'SAVING...' : 'SAVE'}
              </button>
              <button
                onClick={() => { setEditingPhone(false); setPhoneInput('') }}
                style={{ background: 'none', border: 'none', color: C.text3, fontFamily: MONO, fontSize: '0.6rem', cursor: 'pointer', padding: '0.5rem' }}
              >
                CANCEL
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontFamily: MONO, fontSize: '0.78rem', color: C.text }}>{userData?.phone ?? '—'}</span>
              <button
                onClick={() => setEditingPhone(true)}
                style={{ background: 'none', border: `1px solid ${C.border}`, color: C.text3, fontFamily: MONO, fontSize: '0.55rem', letterSpacing: '0.1em', padding: '0.3rem 0.6rem', cursor: 'pointer', borderRadius: 0 }}
              >
                CHANGE
              </button>
            </div>
          )}
        </div>

        {/* Pause/Resume */}
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: '1rem 0' }}>
          <button
            onClick={onToggleActive}
            style={{
              background: 'none',
              border: `1px solid ${C.border}`,
              color: isActive ? C.text3 : '#22c55e',
              fontFamily: MONO,
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              padding: '0.6rem 1rem',
              cursor: 'pointer',
              borderRadius: 0,
            }}
          >
            {isActive ? 'PAUSE ALL TEXTS' : 'RESUME TEXTS'}
          </button>
        </div>

        {/* Subscription */}
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: '1rem 0' }}>
          <div style={{ fontFamily: MONO, fontSize: '0.7rem', color: C.text2, letterSpacing: '0.12em', marginBottom: '0.75rem', fontWeight: 700 }}>SUBSCRIPTION</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontFamily: MONO, fontSize: '0.75rem', color: C.text, fontWeight: 700 }}>FREE PLAN</span>
                <span style={{ fontFamily: MONO, fontSize: '0.5rem', color: '#f59e0b', border: '1px solid #f59e0b', padding: '0.1rem 0.4rem', letterSpacing: '0.1em' }}>CURRENT</span>
              </div>
              <div style={{ fontFamily: MONO, fontSize: '0.6rem', color: C.text3, letterSpacing: '0.05em' }}>1 mission · check-ins every 2hrs</div>
            </div>
            <button
              onClick={() => window.location.href = '/pricing'}
              style={{
                background: '#0ea5e9',
                border: 'none',
                color: '#fff',
                fontFamily: MONO,
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                fontWeight: 700,
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                borderRadius: 0,
                whiteSpace: 'nowrap',
              }}
            >
              UPGRADE TO PRO →
            </button>
          </div>
        </div>

        {/* Sign out */}
        <div style={{ padding: '1rem 0' }}>
          <button
            onClick={onSignOut}
            style={{
              background: 'none',
              border: `1px solid ${C.border}`,
              color: C.text3,
              fontFamily: MONO,
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              padding: '0.6rem 1rem',
              cursor: 'pointer',
              borderRadius: 0,
            }}
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, borderLeft, valueColor }: {
  label: string
  value: string | number
  borderLeft?: boolean
  valueColor?: string
}) {
  return (
    <div style={{
      flex: 1,
      padding: '1rem 0.75rem',
      borderLeft: borderLeft ? `1px solid ${C.border}` : undefined,
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: GROTESK,
        fontWeight: 700,
        fontSize: 'clamp(1.1rem,4vw,1.4rem)',
        color: valueColor || C.text,
        marginBottom: '0.3rem',
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{ fontFamily: MONO, fontSize: '0.5rem', color: C.text3, letterSpacing: '0.15em' }}>
        {label}
      </div>
    </div>
  )
}

function MissionCard({ habit, onClick }: { habit: Habit; onClick: () => void }) {
  const timeLabel = habit.time_of_day
    ? TIME_OPTIONS.find(t => t.value === habit.time_of_day)?.sub ?? ''
    : ''

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: C.s1,
        border: `1px solid ${C.border}`,
        padding: '1.25rem',
        cursor: 'pointer',
        textAlign: 'left',
        color: C.text,
        transition: 'all 0.2s',
        borderRadius: 0,
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
        <span style={{
          display: 'inline-block',
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#22c55e',
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', paddingRight: '1rem' }}>
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{habit.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontFamily: GROTESK, fontWeight: 600, fontSize: '1rem', color: C.text }}>
              {habit.name}
            </span>
            {habit.streak > 0 && (
              <span style={{
                fontFamily: MONO,
                fontSize: '0.55rem',
                color: '#f59e0b',
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
                padding: '0.1rem 0.35rem',
              }}>
                🔥 {habit.streak} days
              </span>
            )}
          </div>
          <p style={{
            fontFamily: MONO,
            fontSize: '0.72rem',
            color: C.text3,
            margin: 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}>
            {habit.last_message || "You haven't started. Don't fall behind."}
          </p>
        </div>
        <span style={{ color: C.text3, fontSize: '0.9rem', flexShrink: 0 }}>›</span>
      </div>

      {timeLabel && (
        <div style={{ fontFamily: MONO, fontSize: '0.55rem', color: C.text3, letterSpacing: '0.1em', paddingLeft: '2.25rem' }}>
          {timeLabel}
        </div>
      )}
    </button>
  )
}

function AccountRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 0',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <span style={{ fontFamily: MONO, fontSize: '0.55rem', color: C.text3, letterSpacing: '0.15em' }}>{label}</span>
      <span style={{ fontFamily: MONO, fontSize: '0.75rem', color: C.text2 }}>{value}</span>
    </div>
  )
}

// ─── Confirm View ──────────────────────────────────────────────────────────────

function ConfirmView({ draft, onDone }: { draft: AddDraft; onDone: () => void }) {
  const timeLabel = TIME_OPTIONS.find(t => t.value === draft.time_of_day)?.label ?? draft.time_of_day
  const coachLabel = COACH_OPTIONS.find(c => c.value === draft.coach_style)?.label ?? draft.coach_style

  const TYPED_TEXT = 'MISSION ACTIVATED'
  const [phase, setPhase] = useState(0)       // 0=scan 1=badge 2=type 3=content 4=done
  const [typed, setTyped] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600)
    const t2 = setTimeout(() => setPhase(2), 1100)
    const t3 = setTimeout(() => setVisible(true), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    if (phase < 2) return
    if (typed >= TYPED_TEXT.length) { setTimeout(() => setPhase(3), 200); return }
    const t = setTimeout(() => setTyped(n => n + 1), 55)
    return () => clearTimeout(t)
  }, [phase, typed])

  const rows = [
    { label: 'HABIT',         value: `${draft.emoji} ${draft.name}` },
    { label: 'CHECK-IN TIME', value: timeLabel },
    { label: 'COACH STYLE',   value: coachLabel },
    ...(draft.why    ? [{ label: 'YOUR WHY', value: draft.why }]    : []),
    ...(draft.stakes ? [{ label: 'STAKES',   value: draft.stakes }] : []),
  ]

  const steps = [
    { n: '01', text: `You'll start receiving texts for ${draft.name} during your chosen time window.` },
    { n: '02', text: 'Each message is AI-generated — different every time, based on your why and stakes.' },
    { n: '03', text: 'Reply "done" when you complete it. Your streak starts building immediately.' },
    { n: '04', text: 'No reply? We follow up in 5 minutes. No excuses.' },
  ]

  return (
    <div style={{ paddingTop: '2rem', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes scanDown {
          0%   { top: 0; opacity: 1; }
          80%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes badgeIn {
          0%   { transform: scale(0.3); opacity: 0; }
          70%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
          50%      { box-shadow: 0 0 24px 4px rgba(14,165,233,0.25); }
        }
      `}</style>

      {/* Scan line */}
      {phase === 0 && (
        <div style={{
          position: 'fixed', left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, transparent, #0ea5e9, #0ea5e9, transparent)',
          boxShadow: '0 0 20px 4px rgba(14,165,233,0.6)',
          animation: 'scanDown 0.6s ease-in forwards',
          zIndex: 999, pointerEvents: 'none',
        }} />
      )}

      {/* Badge */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem', minHeight: '160px', justifyContent: 'center' }}>
        {phase >= 1 && (
          <div style={{ position: 'relative', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Expanding rings */}
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                position: 'absolute',
                width: '72px', height: '72px', borderRadius: '50%',
                border: '1px solid rgba(14,165,233,0.4)',
                animation: `ring 2s ease-out ${i * 0.55}s infinite`,
                pointerEvents: 'none',
              }} />
            ))}
            {/* Emoji badge */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem',
              animation: 'badgeIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards, glowPulse 3s ease-in-out 1s infinite',
            }}>
              {draft.emoji}
            </div>
          </div>
        )}

        {/* Typewriter label */}
        <div style={{ fontFamily: MONO, fontSize: '0.6rem', letterSpacing: '0.25em', color: '#0ea5e9', marginBottom: '0.5rem', minHeight: '1em' }}>
          {TYPED_TEXT.slice(0, typed)}
          {phase === 2 && (
            <span style={{ animation: 'blink 0.7s step-end infinite', opacity: 1 }}>█</span>
          )}
        </div>

        {phase >= 3 && (
          <h2 style={{
            fontFamily: GROTESK, fontWeight: 700, fontSize: 'clamp(1.3rem,5vw,1.6rem)',
            margin: 0, color: C.text,
            animation: 'fadeUp 0.4s ease forwards',
          }}>
            {draft.name} is live
          </h2>
        )}
      </div>

      {/* Summary card */}
      {phase >= 3 && (
        <div style={{ border: `1px solid ${C.border}`, background: C.s1, marginBottom: '1.5rem', animation: 'fadeUp 0.5s ease 0.1s both' }}>
          <div style={{ padding: '0.85rem 1.25rem', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: MONO, fontSize: '0.5rem', color: C.text3, letterSpacing: '0.15em' }}>WHAT YOU SET UP</span>
          </div>
          {rows.map((row, i) => (
            <div key={row.label} style={{
              display: 'flex', gap: '1rem', padding: '0.85rem 1.25rem',
              borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : undefined,
              alignItems: 'flex-start',
              animation: `fadeUp 0.4s ease ${0.15 + i * 0.07}s both`,
            }}>
              <span style={{ fontFamily: MONO, fontSize: '0.5rem', color: C.text3, letterSpacing: '0.12em', minWidth: '100px', paddingTop: '2px' }}>{row.label}</span>
              <span style={{ fontFamily: GROTESK, fontSize: '0.85rem', color: C.text, lineHeight: 1.5 }}>{row.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Next steps */}
      {phase >= 3 && (
        <div style={{ border: `1px solid ${C.border}`, background: C.s1, marginBottom: '2rem', animation: 'fadeUp 0.5s ease 0.3s both' }}>
          <div style={{ padding: '0.85rem 1.25rem', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: MONO, fontSize: '0.5rem', color: C.text3, letterSpacing: '0.15em' }}>WHAT HAPPENS NEXT</span>
          </div>
          {steps.map((step, i) => (
            <div key={step.n} style={{
              display: 'flex', gap: '1rem', padding: '0.85rem 1.25rem',
              borderBottom: i < steps.length - 1 ? `1px solid ${C.border}` : undefined,
              alignItems: 'flex-start',
              animation: `fadeUp 0.4s ease ${0.35 + i * 0.08}s both`,
            }}>
              <span style={{ fontFamily: MONO, fontSize: '0.6rem', color: '#0ea5e9', minWidth: '24px', paddingTop: '2px' }}>{step.n}</span>
              <span style={{ fontFamily: GROTESK, fontSize: '0.83rem', color: C.text2, lineHeight: 1.6 }}>{step.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {phase >= 3 && (
        <button
          onClick={onDone}
          style={{
            width: '100%', background: '#0ea5e9', border: 'none', color: '#fff',
            fontFamily: MONO, fontSize: '0.7rem', letterSpacing: '0.15em',
            padding: '1rem', cursor: 'pointer', borderRadius: 0,
            animation: 'fadeUp 0.4s ease 0.7s both',
          }}
        >
          GO TO DASHBOARD →
        </button>
      )}
    </div>
  )
}

// ─── Detail View ───────────────────────────────────────────────────────────────

function DetailView({
  habit,
  messages,
  onBack,
  onDelete,
  onComplete,
  onUpdate,
}: {
  habit: Habit
  messages: Message[]
  onBack: () => void
  onDelete: () => void
  onComplete: () => void
  onUpdate: (updated: Partial<Habit> & { id: string }) => Promise<void>
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmComplete, setConfirmComplete] = useState(false)
  const [showCompleteAnim, setShowCompleteAnim] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [edit, setEdit] = useState({
    name: habit.name,
    emoji: habit.emoji,
    why: habit.why || '',
    biggest_excuse: habit.biggest_excuse || '',
    stakes: habit.stakes || '',
    time_of_day: habit.time_of_day || 'anytime',
    coach_style: habit.coach_style || 'direct',
  })

  const handleSave = async () => {
    setSaving(true)
    await onUpdate({ id: habit.id, ...edit })
    setSaving(false)
    setEditing(false)
  }

  const replied = messages.filter(m => m.responded_at).length
  const replyRate = messages.length > 0 ? Math.round((replied / messages.length) * 100) : 0
  const timeLabel = TIME_OPTIONS.find(t => t.value === (edit.time_of_day || habit.time_of_day))?.label ?? ''

  const fieldStyle = {
    width: '100%', background: C.s2, border: `1px solid ${C.border}`,
    color: C.text, fontFamily: GROTESK, fontSize: '0.85rem',
    padding: '0.65rem 0.75rem', outline: 'none', borderRadius: 0,
    boxSizing: 'border-box' as const, lineHeight: 1.5,
  }
  const labelStyle = { fontFamily: MONO, fontSize: '0.5rem', color: C.text3, letterSpacing: '0.15em', display: 'block', marginBottom: '0.3rem' }

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <button onClick={onBack} style={{ background:'none', border:'none', color:C.text3, fontFamily:MONO, fontSize:'0.65rem', letterSpacing:'0.1em', cursor:'pointer', padding:'0 0 1.5rem 0', display:'block' }}>
        ← MY MISSIONS
      </button>

      {/* Hero */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <span style={{ fontSize:'2.2rem', lineHeight:1 }}>{habit.emoji}</span>
          <div>
            <h2 style={{ fontFamily:GROTESK, fontWeight:700, fontSize:'clamp(1.2rem,4vw,1.4rem)', margin:0, color:C.text }}>{habit.name}</h2>
            {habit.streak > 0 && <span style={{ fontFamily:MONO, fontSize:'0.6rem', color:'#f59e0b' }}>🔥 {habit.streak} day streak</span>}
          </div>
        </div>
        <button
          onClick={() => setEditing(e => !e)}
          style={{ background: editing ? '#0ea5e9' : C.s2, border:`1px solid ${editing ? '#0ea5e9' : C.border}`, color: editing ? '#fff' : C.text2, fontFamily:MONO, fontSize:'0.55rem', letterSpacing:'0.1em', padding:'0.45rem 0.85rem', cursor:'pointer', borderRadius:0 }}
        >
          {editing ? 'CANCEL' : 'EDIT'}
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', border:`1px solid ${C.border}`, marginBottom:'1.5rem' }}>
        {[
          { label:'COMPLETED', value: habit.total_completions },
          { label:'REPLY RATE', value: messages.length > 0 ? `${replyRate}%` : '—' },
          { label:'STREAK', value: habit.streak > 0 ? `🔥 ${habit.streak}` : '—' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding:'0.85rem 0.5rem', textAlign:'center', borderRight: i < 2 ? `1px solid ${C.border}` : undefined }}>
            <div style={{ fontFamily:GROTESK, fontWeight:700, fontSize:'clamp(1rem,3vw,1.25rem)', color:C.text, marginBottom:'0.25rem' }}>{s.value}</div>
            <div style={{ fontFamily:MONO, fontSize:'0.45rem', color:C.text3, letterSpacing:'0.12em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── EDIT MODE ── */}
      {editing && (
        <div style={{ border:`1px solid ${C.border}`, background:C.s1, marginBottom:'1.5rem' }}>
          <div style={{ padding:'0.85rem 1.25rem', borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontFamily:MONO, fontSize:'0.5rem', color:C.text3, letterSpacing:'0.15em' }}>EDIT MISSION</span>
          </div>
          <div style={{ padding:'1.25rem', display:'flex', flexDirection:'column', gap:'1rem' }}>

            {/* Name + emoji */}
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <div style={{ flex:'0 0 64px' }}>
                <label style={labelStyle}>EMOJI</label>
                <input value={edit.emoji} onChange={e => setEdit(p=>({...p, emoji:e.target.value}))} style={{ ...fieldStyle, textAlign:'center', fontSize:'1.4rem', padding:'0.4rem' }} maxLength={2}/>
              </div>
              <div style={{ flex:1 }}>
                <label style={labelStyle}>HABIT NAME</label>
                <input value={edit.name} onChange={e => setEdit(p=>({...p, name:e.target.value}))} style={fieldStyle} placeholder="e.g. Gym, Study, Read"/>
              </div>
            </div>

            {/* Why */}
            <div>
              <label style={labelStyle}>WHY IT MATTERS TO YOU</label>
              <textarea value={edit.why} onChange={e => setEdit(p=>({...p, why:e.target.value}))} style={{ ...fieldStyle, minHeight:'72px', resize:'vertical' }} placeholder="What's the real reason you want this habit?"/>
            </div>

            {/* Excuse */}
            <div>
              <label style={labelStyle}>YOUR BIGGEST EXCUSE</label>
              <textarea value={edit.biggest_excuse} onChange={e => setEdit(p=>({...p, biggest_excuse:e.target.value}))} style={{ ...fieldStyle, minHeight:'60px', resize:'vertical' }} placeholder="What do you tell yourself to skip it?"/>
            </div>

            {/* Stakes */}
            <div>
              <label style={labelStyle}>WHAT'S AT STAKE</label>
              <textarea value={edit.stakes} onChange={e => setEdit(p=>({...p, stakes:e.target.value}))} style={{ ...fieldStyle, minHeight:'60px', resize:'vertical' }} placeholder="What do you lose if you don't follow through?"/>
            </div>

            {/* Time of day */}
            <div>
              <label style={labelStyle}>CHECK-IN TIME</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                {TIME_OPTIONS.map(t => (
                  <button key={t.value} onClick={() => setEdit(p=>({...p, time_of_day:t.value}))}
                    style={{ background:edit.time_of_day===t.value?'rgba(14,165,233,0.12)':C.s2, border:`1px solid ${edit.time_of_day===t.value?'#0ea5e9':C.border}`, color:edit.time_of_day===t.value?C.text:C.text3, fontFamily:MONO, fontSize:'0.55rem', padding:'0.6rem', cursor:'pointer', textAlign:'left', borderRadius:0 }}>
                    {t.label}<br/><span style={{ fontSize:'0.45rem', color:C.text3 }}>{t.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Coach style */}
            <div>
              <label style={labelStyle}>COACH STYLE</label>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                {COACH_OPTIONS.map(c => (
                  <button key={c.value} onClick={() => setEdit(p=>({...p, coach_style:c.value}))}
                    style={{ background:edit.coach_style===c.value?'rgba(14,165,233,0.12)':C.s2, border:`1px solid ${edit.coach_style===c.value?'#0ea5e9':C.border}`, color:edit.coach_style===c.value?C.text:C.text3, fontFamily:MONO, fontSize:'0.55rem', padding:'0.65rem 0.85rem', cursor:'pointer', textAlign:'left', borderRadius:0 }}>
                    <span style={{ fontWeight:700 }}>{c.label}</span> — <span style={{ fontSize:'0.5rem' }}>{c.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} disabled={saving || !edit.name}
              style={{ background:'#0ea5e9', border:'none', color:'#fff', fontFamily:MONO, fontSize:'0.65rem', letterSpacing:'0.12em', padding:'0.85rem', cursor:saving?'wait':'pointer', opacity:!edit.name?0.4:1, borderRadius:0 }}>
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </div>
      )}

      {/* ── VIEW MODE: Context ── */}
      {!editing && (
        <>
          {/* Coach + time badges */}
          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
            <span style={{ fontFamily:MONO, fontSize:'0.55rem', color:'#0ea5e9', border:'1px solid #0ea5e9', padding:'0.25rem 0.6rem', letterSpacing:'0.1em' }}>
              {(habit.coach_style || 'direct').toUpperCase()}
            </span>
            {habit.time_of_day && (
              <span style={{ fontFamily:MONO, fontSize:'0.55rem', color:C.text3, border:`1px solid ${C.border}`, padding:'0.25rem 0.6rem', letterSpacing:'0.08em' }}>
                {timeLabel}
              </span>
            )}
          </div>

          {/* Context card */}
          {(habit.why || habit.biggest_excuse || habit.stakes) ? (
            <div style={{ background:C.s1, border:`1px solid ${C.border}`, marginBottom:'1.5rem' }}>
              <div style={{ padding:'0.85rem 1.25rem', borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontFamily:MONO, fontSize:'0.5rem', color:C.text3, letterSpacing:'0.15em' }}>YOUR CONTEXT</span>
              </div>
              {[
                { label:'WHY IT MATTERS', value: habit.why },
                { label:'YOUR GO-TO EXCUSE', value: habit.biggest_excuse },
                { label:"WHAT'S AT STAKE", value: habit.stakes },
              ].filter(r => r.value).map((r, i, arr) => (
                <div key={r.label} style={{ padding:'0.85rem 1.25rem', borderBottom: i < arr.length-1 ? `1px solid ${C.border}` : undefined }}>
                  <div style={{ fontFamily:MONO, fontSize:'0.48rem', color:C.text3, letterSpacing:'0.12em', marginBottom:'0.3rem' }}>{r.label}</div>
                  <div style={{ fontFamily:GROTESK, fontSize:'0.85rem', color:C.text2, lineHeight:1.6 }}>{r.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background:C.s1, border:`1px solid ${C.border}`, padding:'1.25rem', marginBottom:'1.5rem', textAlign:'center' }}>
              <div style={{ fontFamily:MONO, fontSize:'0.55rem', color:C.text3, letterSpacing:'0.1em', marginBottom:'0.4rem' }}>NO CONTEXT SET</div>
              <div style={{ fontFamily:GROTESK, fontSize:'0.8rem', color:C.text3 }}>Hit EDIT to add your why, excuses and stakes — this is what makes the AI messages personal.</div>
            </div>
          )}

          {/* Recent messages */}
          <div style={{ marginBottom:'1.5rem' }}>
            <div style={{ fontFamily:MONO, fontSize:'0.5rem', color:C.text3, letterSpacing:'0.15em', marginBottom:'0.75rem' }}>RECENT MESSAGES</div>
            {messages.length === 0 ? (
              <div style={{ background:C.s1, border:`1px solid ${C.border}`, padding:'1.5rem', textAlign:'center' }}>
                <div style={{ fontSize:'1.5rem', marginBottom:'0.5rem' }}>📭</div>
                <div style={{ fontFamily:MONO, fontSize:'0.55rem', color:C.text3, letterSpacing:'0.1em', marginBottom:'0.3rem' }}>NO TEXTS YET</div>
                <div style={{ fontFamily:GROTESK, fontSize:'0.8rem', color:C.text3 }}>Messages will appear here once check-ins start.</div>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                {messages.slice(0,10).map((m, i) => (
                  <div key={i} style={{ background:C.s1, border:`1px solid ${C.border}`, borderLeft:`3px solid ${m.responded_at?'#0ea5e9':C.border}`, padding:'0.75rem 1rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'0.5rem' }}>
                      <p style={{ fontFamily:GROTESK, fontSize:'0.82rem', color:C.text2, margin:0, lineHeight:1.6, flex:1 }}>{m.message_text}</p>
                      <span style={{ fontFamily:MONO, fontSize:'0.55rem', color:C.text3, flexShrink:0, marginTop:'0.15rem' }}>
                        {new Date(m.sent_at).toLocaleDateString('en',{month:'short',day:'numeric'})}
                      </span>
                    </div>
                    {m.responded_at && (
                      <span style={{ fontFamily:MONO, fontSize:'0.5rem', color:'#0ea5e9', letterSpacing:'0.1em', marginTop:'0.35rem', display:'block' }}>✓ replied done</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Complete / Delete */}
      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:'1.25rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>

        {/* Mark as complete */}
        {confirmComplete ? (
          <div style={{ background: C.s1, border:`1px solid #22c55e`, padding:'1rem 1.25rem' }}>
            <p style={{ fontFamily:MONO, fontSize:'0.6rem', color:'#22c55e', letterSpacing:'0.1em', margin:'0 0 0.75rem 0' }}>
              MARK AS COMPLETE — this will move it to your completed missions.
            </p>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <button onClick={() => setShowCompleteAnim(true)} style={{ flex:1, background:'#22c55e', border:'none', color:'#000', fontFamily:MONO, fontSize:'0.65rem', letterSpacing:'0.1em', fontWeight:700, padding:'0.7rem', cursor:'pointer', borderRadius:0 }}>
                🏆 YES, MISSION COMPLETE
              </button>
              <button onClick={() => setConfirmComplete(false)} style={{ background:'none', border:`1px solid ${C.border}`, color:C.text3, fontFamily:MONO, fontSize:'0.6rem', padding:'0.7rem 1rem', cursor:'pointer', borderRadius:0 }}>
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmComplete(true)}
            style={{ width:'100%', background:'transparent', border:`1px solid #22c55e`, color:'#22c55e', fontFamily:MONO, fontSize:'0.65rem', letterSpacing:'0.12em', fontWeight:700, padding:'0.85rem', cursor:'pointer', borderRadius:0 }}
          >
            🏆 MARK MISSION COMPLETE
          </button>
        )}

        {/* Delete (smaller, less prominent) */}
        {!confirmComplete && (
          confirmDelete ? (
            <button onClick={onDelete} style={{ width:'100%', background:'#ef4444', border:'none', color:'#fff', fontFamily:MONO, fontSize:'0.6rem', letterSpacing:'0.1em', padding:'0.65rem', cursor:'pointer', borderRadius:0 }}>
              CONFIRM — DELETE PERMANENTLY
            </button>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{ background:'none', border:'none', color:C.text3, fontFamily:MONO, fontSize:'0.55rem', letterSpacing:'0.1em', padding:'0.3rem 0', cursor:'pointer', textDecoration:'underline' }}>
              delete mission
            </button>
          )
        )}
      </div>

      {/* Mission Complete Animation Overlay */}
      {showCompleteAnim && (
        <MissionCompleteOverlay
          habit={habit}
          onFinish={() => {
            setShowCompleteAnim(false)
            onComplete()
          }}
        />
      )}
    </div>
  )
}

// ─── Mission Complete Overlay ─────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * 360
  const dist = 120 + Math.random() * 180
  const x = Math.cos((angle * Math.PI) / 180) * dist
  const y = Math.sin((angle * Math.PI) / 180) * dist
  const colors = ['#22c55e', '#0ea5e9', '#f59e0b', '#ffffff', '#a855f7', '#ec4899']
  return { x, y, color: colors[i % colors.length], size: 4 + Math.random() * 6, delay: Math.random() * 0.3 }
})

function MissionCompleteOverlay({ habit, onFinish }: { habit: Habit; onFinish: () => void }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100)
    const t2 = setTimeout(() => setPhase(2), 600)
    const t3 = setTimeout(() => setPhase(3), 1100)
    const t4 = setTimeout(() => setPhase(4), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: '#000',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes particleFly {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--px), var(--py)) scale(0); opacity: 0; }
        }
        @keyframes trophyDrop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.35) rotate(8deg); opacity: 1; }
          80%  { transform: scale(0.9) rotate(-4deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes slamIn {
          0%   { transform: translateY(-60px) scaleY(1.3); opacity: 0; }
          60%  { transform: translateY(6px) scaleY(0.95); opacity: 1; }
          100% { transform: translateY(0) scaleY(1); opacity: 1; }
        }
        @keyframes glowPulseGreen {
          0%, 100% { text-shadow: 0 0 20px rgba(34,197,94,0.8), 0 0 60px rgba(34,197,94,0.4); }
          50%       { text-shadow: 0 0 40px rgba(34,197,94,1),   0 0 100px rgba(34,197,94,0.6); }
        }
        @keyframes statPop {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes continuePulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
        @keyframes bgPulse {
          0%, 100% { background: #000; }
          30%      { background: #001a0a; }
          60%      { background: #000; }
        }
      `}</style>

      {/* bg pulse */}
      <div style={{ position:'absolute', inset:0, animation:'bgPulse 1.5s ease forwards' }} />

      {/* Particles */}
      {phase >= 1 && PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: '50%',
          // @ts-expect-error CSS custom properties
          '--px': `${p.x}px`,
          '--py': `${p.y}px`,
          animation: `particleFly 0.9s cubic-bezier(0.2,0.8,0.4,1) ${p.delay}s both`,
        }} />
      ))}

      {/* Trophy */}
      {phase >= 1 && (
        <div style={{
          fontSize: '5rem', lineHeight: 1, marginBottom: '1.5rem',
          animation: 'trophyDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
          filter: 'drop-shadow(0 0 30px rgba(245,158,11,0.9))',
        }}>
          🏆
        </div>
      )}

      {/* MISSION text */}
      {phase >= 2 && (
        <div style={{
          fontFamily: MONO, fontWeight: 700,
          fontSize: 'clamp(2rem,10vw,3.5rem)',
          letterSpacing: '0.15em',
          color: '#ffffff',
          animation: 'slamIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
          marginBottom: '0.1rem',
        }}>
          MISSION
        </div>
      )}

      {/* COMPLETE text */}
      {phase >= 2 && (
        <div style={{
          fontFamily: MONO, fontWeight: 700,
          fontSize: 'clamp(2rem,10vw,3.5rem)',
          letterSpacing: '0.15em',
          color: '#22c55e',
          animation: 'slamIn 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both, glowPulseGreen 2s ease 0.5s infinite',
          marginBottom: '2rem',
        }}>
          COMPLETE
        </div>
      )}

      {/* Habit name + stats */}
      {phase >= 3 && (
        <div style={{ textAlign: 'center', animation: 'statPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
          <div style={{ fontFamily: GROTESK, fontSize: 'clamp(1rem,4vw,1.25rem)', color: '#aaa', marginBottom: '1.25rem' }}>
            {habit.emoji} {habit.name}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            {habit.total_completions > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: '1.5rem', color: '#22c55e' }}>{habit.total_completions}</div>
                <div style={{ fontFamily: MONO, fontSize: '0.5rem', color: '#555', letterSpacing: '0.15em' }}>COMPLETIONS</div>
              </div>
            )}
            {habit.streak > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: '1.5rem', color: '#f59e0b' }}>🔥 {habit.streak}</div>
                <div style={{ fontFamily: MONO, fontSize: '0.5rem', color: '#555', letterSpacing: '0.15em' }}>DAY STREAK</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Continue button */}
      {phase >= 4 && (
        <button
          onClick={onFinish}
          style={{
            position: 'absolute', bottom: '3rem',
            background: 'transparent', border: '1px solid #333',
            color: '#555', fontFamily: MONO, fontSize: '0.65rem',
            letterSpacing: '0.15em', padding: '0.75rem 2rem',
            cursor: 'pointer', borderRadius: 0,
            animation: 'continuePulse 1.5s ease infinite',
          }}
        >
          → CONTINUE
        </button>
      )}
    </div>
  )
}

function ContextField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <span style={{ fontFamily: MONO, fontSize: '0.5rem', color: C.text3, letterSpacing: '0.15em', display: 'block', marginBottom: '0.25rem' }}>
        {label}
      </span>
      <p style={{ fontFamily: GROTESK, fontSize: '0.85rem', color: C.text2, margin: 0, lineHeight: 1.5 }}>
        {value}
      </p>
    </div>
  )
}

// ─── Add View ──────────────────────────────────────────────────────────────────

function AddView({
  step,
  draft,
  habits,
  customName,
  customEmoji,
  loading,
  onStepChange,
  onDraftChange,
  onCustomNameChange,
  onCustomEmojiChange,
  onSubmit,
  onBack,
}: {
  step: number
  draft: AddDraft
  habits: Habit[]
  customName: string
  customEmoji: string
  loading: boolean
  onStepChange: (s: number) => void
  onDraftChange: (patch: Partial<AddDraft>) => void
  onCustomNameChange: (v: string) => void
  onCustomEmojiChange: (v: string) => void
  onSubmit: () => void
  onBack: () => void
}) {
  const totalSteps = 6
  const activeHabitNames = habits.map(h => h.name.toLowerCase())
  const availablePresets = PRESET_HABITS.filter(p => !activeHabitNames.includes(p.name.toLowerCase()))

  const handleAddCustom = () => {
    if (!customName.trim()) return
    onDraftChange({ name: customName.trim(), emoji: customEmoji })
    onCustomNameChange('')
  }

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: C.text3,
          fontFamily: MONO,
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          padding: '0 0 1.5rem 0',
          display: 'block',
        }}
      >
        ← CANCEL
      </button>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              background: i < step ? '#0ea5e9' : C.border,
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* Steps */}
      {step === 1 && (
        <StepShell
          title="What do you want to stay on top of?"
          sub="Pick one thing. Be specific."
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
            {availablePresets.map(p => (
              <button
                key={p.name}
                onClick={() => onDraftChange({ name: p.name, emoji: p.emoji })}
                style={{
                  background: draft.name === p.name ? 'rgba(229,40,26,0.08)' : C.s1,
                  border: `1px solid ${draft.name === p.name ? '#0ea5e9' : C.border}`,
                  color: C.text,
                  padding: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: GROTESK,
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  borderRadius: 0,
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>{p.emoji}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              value={customEmoji}
              onChange={e => onCustomEmojiChange(e.target.value)}
              placeholder="🎯"
              style={{
                width: 52,
                background: C.s1,
                border: `1px solid ${C.border}`,
                color: C.text,
                padding: '0.75rem',
                fontFamily: MONO,
                fontSize: '1rem',
                outline: 'none',
                borderRadius: 0,
                textAlign: 'center',
                flexShrink: 0,
              }}
            />
            <input
              value={customName}
              onChange={e => onCustomNameChange(e.target.value)}
              placeholder="Custom habit name..."
              onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
              style={{
                flex: 1,
                background: C.s1,
                border: `1px solid ${C.border}`,
                color: C.text,
                padding: '0.75rem 1rem',
                fontFamily: GROTESK,
                fontSize: '0.9rem',
                outline: 'none',
                borderRadius: 0,
              }}
            />
            <button
              onClick={handleAddCustom}
              disabled={!customName.trim()}
              style={{
                background: customName.trim() ? '#0ea5e9' : C.s2,
                border: 'none',
                color: '#fff',
                padding: '0.75rem 1rem',
                fontFamily: MONO,
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                cursor: customName.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s',
                borderRadius: 0,
                flexShrink: 0,
              }}
            >
              ADD
            </button>
          </div>

          {draft.name && (
            <div style={{ background: 'rgba(229,40,26,0.06)', border: `1px solid ${'#0ea5e9'}`, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontFamily: MONO, fontSize: '0.7rem', color: C.text }}>
              Selected: {draft.emoji} {draft.name}
            </div>
          )}

          <NavBtn disabled={!draft.name} onClick={() => onStepChange(2)} label="NEXT →" />
        </StepShell>
      )}

      {step === 2 && (
        <StepShell
          title="Why does this actually matter to you?"
          sub="Be honest. The more specific, the better we coach you."
        >
          <TextareaField
            value={draft.why}
            onChange={v => onDraftChange({ why: v })}
            placeholder="e.g. I want to get fit before summer. I've been saying this for 2 years and keep quitting."
            rows={5}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <NavBtn onClick={() => onStepChange(3)} label="NEXT →" />
            <SkipBtn onClick={() => onStepChange(3)} />
          </div>
        </StepShell>
      )}

      {step === 3 && (
        <StepShell
          title="What's your biggest excuse for skipping this?"
          sub="We'll call you out on it specifically."
        >
          <TextareaField
            value={draft.biggest_excuse}
            onChange={v => onDraftChange({ biggest_excuse: v })}
            placeholder="e.g. I'm too tired after work. I'll do it tomorrow. I don't have time."
            rows={5}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <NavBtn onClick={() => onStepChange(4)} label="NEXT →" />
            <SkipBtn onClick={() => onStepChange(4)} />
          </div>
        </StepShell>
      )}

      {step === 4 && (
        <StepShell
          title="What happens if you keep avoiding this?"
          sub="Make it real."
        >
          <TextareaField
            value={draft.stakes}
            onChange={v => onDraftChange({ stakes: v })}
            placeholder="e.g. I'll be in the same place next year. My health will get worse. I'll regret it."
            rows={5}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <NavBtn onClick={() => onStepChange(5)} label="NEXT →" />
            <SkipBtn onClick={() => onStepChange(5)} />
          </div>
        </StepShell>
      )}

      {step === 5 && (
        <StepShell
          title="When do you usually do this?"
          sub="We'll focus check-ins around this time."
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {TIME_OPTIONS.map(t => (
              <button
                key={t.value}
                onClick={() => onDraftChange({ time_of_day: t.value })}
                style={{
                  background: draft.time_of_day === t.value ? 'rgba(229,40,26,0.08)' : C.s1,
                  border: `1px solid ${draft.time_of_day === t.value ? '#0ea5e9' : C.border}`,
                  color: C.text,
                  padding: '1rem',
                  cursor: 'pointer',
                  fontFamily: GROTESK,
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  borderRadius: 0,
                  minHeight: 64,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>{t.label}</span>
                <span style={{ fontFamily: MONO, fontSize: '0.55rem', color: C.text3 }}>{t.sub}</span>
              </button>
            ))}
          </div>
          <NavBtn onClick={() => onStepChange(6)} label="NEXT →" />
        </StepShell>
      )}

      {step === 6 && (
        <StepShell
          title="How hard should we push you on this?"
          sub="This sets the tone for every message about this habit."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {COACH_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => onDraftChange({ coach_style: o.value })}
                style={{
                  background: draft.coach_style === o.value ? 'rgba(229,40,26,0.1)' : C.s1,
                  border: `1px solid ${draft.coach_style === o.value ? '#0ea5e9' : C.border}`,
                  color: C.text,
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  borderRadius: 0,
                  minHeight: 64,
                }}
              >
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', color: draft.coach_style === o.value ? '#0ea5e9' : C.text, marginBottom: '0.3rem' }}>
                  {o.label}
                </div>
                <div style={{ fontFamily: GROTESK, fontSize: '0.8rem', color: C.text3 }}>
                  {o.sub}
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={onSubmit}
            disabled={!draft.coach_style || loading}
            style={{
              width: '100%',
              background: draft.coach_style && !loading ? '#0ea5e9' : C.s2,
              border: 'none',
              color: '#fff',
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              padding: '1rem',
              cursor: draft.coach_style && !loading ? 'pointer' : 'default',
              transition: 'all 0.2s',
              borderRadius: 0,
              minHeight: 52,
            }}
          >
            {loading ? 'ACTIVATING...' : 'ACTIVATE →'}
          </button>
        </StepShell>
      )}
    </div>
  )
}

function StepShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: GROTESK, fontWeight: 700, fontSize: 'clamp(1.2rem,4vw,1.5rem)', color: C.text, margin: 0, marginBottom: '0.5rem', lineHeight: 1.3 }}>
        {title}
      </h2>
      <p style={{ fontFamily: GROTESK, fontSize: '0.85rem', color: C.text3, margin: 0, marginBottom: '1.75rem', lineHeight: 1.5 }}>
        {sub}
      </p>
      {children}
    </div>
  )
}

function TextareaField({ value, onChange, placeholder, rows }: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  rows: number
}) {
  return (
    <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          background: C.s1,
          border: `1px solid ${C.border}`,
          color: C.text,
          padding: '0.85rem 1rem',
          fontFamily: GROTESK,
          fontSize: '0.9rem',
          outline: 'none',
          borderRadius: 0,
          resize: 'vertical',
          lineHeight: 1.6,
          boxSizing: 'border-box',
        }}
      />
      <span style={{
        position: 'absolute',
        bottom: '0.5rem',
        right: '0.75rem',
        fontFamily: MONO,
        fontSize: '0.55rem',
        color: C.text3,
      }}>
        {value.length}
      </span>
    </div>
  )
}

function NavBtn({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        background: disabled ? C.s2 : '#0ea5e9',
        border: 'none',
        color: '#fff',
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        padding: '1rem',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.2s',
        borderRadius: 0,
        minHeight: 52,
      }}
    >
      {label}
    </button>
  )
}

function SkipBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        color: C.text3,
        fontFamily: MONO,
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
        cursor: 'pointer',
        padding: '0.5rem',
        textDecoration: 'underline',
        textDecorationColor: C.border,
      }}
    >
      Skip for now
    </button>
  )
}
