'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'

// ─── Types ────────────────────────────────────────────────────────────────────

type Goals = {
  goal_text: string
  deadline: string
  stakes: string
  why_it_matters: string
  procrastination_triggers: string[]
  weakness: string
  tone: string
  competition: string
  sacrifice: string
  success_vision: string
}

type Schedule = {
  frequency_minutes: number
  start_time: string
  end_time: string
  active_days: string[]
  active: boolean
}

type Stats = {
  total_texts: number
  streak: number
}

type Message = {
  message_text: string
  sent_at: string
  responded_at: string | null
}

type ProfileData = {
  user: { phone: string; active: boolean } | null
  goals: Goals
  schedule: Schedule
  stats: Stats
  recent_messages: Message[]
}

type ToastState = { msg: string; type: 'success' | 'error' } | null
type ModalType = 'pause' | 'unsubscribe' | 'delete' | 'export' | 'phone' | null

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  bg: '#0c0c0c',
  s1: '#131313',
  s2: '#191919',
  border: '#1f1f1f',
  red: '#e5281a',
  text: '#f0f0f0',
  text2: '#b0b0b0',
  text3: '#707070',
}

const MONO = "'Space Mono', 'Courier New', monospace"
const GROTESK = "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif"

const FREQ_OPTIONS = [
  { label: '30m', value: 30 },
  { label: '1hr', value: 60 },
  { label: '2hr', value: 120 },
  { label: '3hr', value: 180 },
]

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const TONE_OPTIONS = ['firm', 'brutal', 'savage']

const TABS = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'profile', label: 'MY PROFILE' },
  { id: 'schedule', label: 'SCHEDULE' },
  { id: 'texts', label: 'RECENT TEXTS' },
  { id: 'settings', label: 'SETTINGS' },
]

const DEFAULT_GOALS: Goals = {
  goal_text: '',
  deadline: '',
  stakes: '',
  why_it_matters: '',
  procrastination_triggers: [],
  weakness: '',
  tone: 'firm',
  competition: '',
  sacrifice: '',
  success_vision: '',
}

const DEFAULT_SCHEDULE: Schedule = {
  frequency_minutes: 60,
  start_time: '08:00',
  end_time: '22:00',
  active_days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  active: true,
}

// ─── Shared style helpers ─────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: C.s1,
  border: `1px solid ${C.border}`,
  color: C.text,
  padding: '0.75rem 1rem',
  fontSize: '0.9rem',
  fontFamily: MONO,
  outline: 'none',
  borderRadius: 0,
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.55rem',
  letterSpacing: '0.2em',
  color: C.text3,
  display: 'block',
  marginBottom: '0.4rem',
  fontFamily: MONO,
}

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '2rem',
}

const redBtnStyle: React.CSSProperties = {
  background: C.red,
  border: 'none',
  color: '#fff',
  padding: '0.65rem 1.4rem',
  fontSize: '0.72rem',
  letterSpacing: '0.1em',
  cursor: 'pointer',
  fontFamily: MONO,
  fontWeight: '700',
  borderRadius: 0,
}

const ghostBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: `1px solid ${C.border}`,
  color: C.text3,
  padding: '0.65rem 1.4rem',
  fontSize: '0.72rem',
  letterSpacing: '0.1em',
  cursor: 'pointer',
  fontFamily: MONO,
  borderRadius: 0,
}

function SectionNum({ n, title }: { n: string; title: string }) {
  return (
    <div style={sectionHeaderStyle}>
      <span
        style={{
          fontFamily: MONO,
          fontSize: '0.65rem',
          color: C.red,
          letterSpacing: '0.1em',
        }}
      >
        {n} ——
      </span>
      <h2
        style={{
          fontFamily: GROTESK,
          fontSize: '1.4rem',
          fontWeight: 700,
          color: C.text,
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  )
}

function StyledInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  maxLength,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  maxLength?: number
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          borderColor: focused ? C.red : C.border,
        }}
      />
    </div>
  )
}

function StyledTextarea({
  label,
  value,
  onChange,
  rows = 3,
  maxLength,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  maxLength?: number
  placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          resize: 'vertical',
          lineHeight: '1.6',
          borderColor: focused ? C.red : C.border,
        }}
      />
      {maxLength && (
        <span
          style={{
            position: 'absolute',
            bottom: '0.5rem',
            right: '0.75rem',
            fontSize: '0.6rem',
            fontFamily: MONO,
            color: value.length > maxLength - 20 ? C.red : C.text3,
          }}
        >
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  )
}

// ─── Score calc ───────────────────────────────────────────────────────────────

function calcScore(goals: Goals): number {
  const fields = [
    goals.goal_text,
    goals.deadline,
    goals.stakes,
    goals.why_it_matters,
    goals.procrastination_triggers.length > 0 ? 'yes' : '',
    goals.weakness,
    goals.tone,
    goals.competition,
    goals.sacrifice,
    goals.success_vision,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / 10) * 100)
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter()
  const { user: clerkUser } = useUser()

  // Data state
  const [userData, setUserData] = useState<{ phone: string; active: boolean } | null>(null)
  const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS)
  const [schedule, setSchedule] = useState<Schedule>(DEFAULT_SCHEDULE)
  const [stats, setStats] = useState<Stats>({ total_texts: 0, streak: 0 })
  const [recentMessages, setRecentMessages] = useState<Message[]>([])

  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)
  const [modal, setModal] = useState<ModalType>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [tagInput, setTagInput] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [apiError, setApiError] = useState<string | null>(null)

  // Saved values for dirty check
  const savedData = useRef<ProfileData | null>(null)

  // Section refs for IntersectionObserver
  const overviewRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const scheduleRef = useRef<HTMLDivElement>(null)
  const textsRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/user/profile')
      const d = await res.json()
      if (!res.ok) {
        setApiError(d.error ?? 'API error')
        setLoading(false)
        return
      }
      setApiError(null)
      savedData.current = d
      if (d.user) {
        setUserData(d.user)
        setGoals(d.goals ?? DEFAULT_GOALS)
        setSchedule(d.schedule ?? DEFAULT_SCHEDULE)
        setStats(d.stats ?? { total_texts: 0, streak: 0 })
        setRecentMessages(d.recent_messages ?? [])
      } else {
        setUserData(null)
      }
    } catch (err) {
      console.error('Failed to load profile:', err)
      setApiError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // IntersectionObserver for active tab
  useEffect(() => {
    const refs = [
      { ref: overviewRef, id: 'overview' },
      { ref: profileRef, id: 'profile' },
      { ref: scheduleRef, id: 'schedule' },
      { ref: textsRef, id: 'texts' },
      { ref: settingsRef, id: 'settings' },
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const found = refs.find((r) => r.ref.current === entry.target)
            if (found) setActiveTab(found.id)
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )

    refs.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [loading])

  const markDirty = () => setIsDirty(true)

  const patchGoal = <K extends keyof Goals>(key: K, val: Goals[K]) => {
    setGoals((prev) => ({ ...prev, [key]: val }))
    markDirty()
  }

  const patchSchedule = <K extends keyof Schedule>(key: K, val: Schedule[K]) => {
    setSchedule((prev) => ({ ...prev, [key]: val }))
    markDirty()
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...goals, ...schedule }),
      })
      if (!res.ok) throw new Error('Save failed')
      setIsDirty(false)
      showToast('Changes saved.', 'success')
      await loadData()
    } catch {
      showToast('Failed to save. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = async () => {
    setIsDirty(false)
    setLoading(true)
    await loadData()
  }

  const handleToggleActive = async () => {
    if (!userData) return
    try {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !userData.active }),
      })
      await loadData()
    } catch {
      showToast('Failed to toggle.', 'error')
    }
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'MORNING'
    if (h < 17) return 'AFTERNOON'
    return 'EVENING'
  }

  const daysLeft = (deadline: string): number | null => {
    if (!deadline) return null
    return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
  }

  const freqLabel = (mins: number) => {
    if (mins === 30) return 'EVERY 30 MIN'
    if (mins === 60) return 'EVERY HOUR'
    if (mins === 120) return 'EVERY 2 HRS'
    if (mins === 180) return 'EVERY 3 HRS'
    return `EVERY ${mins}M`
  }

  const fmtMsg = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const score = calcScore(goals)
  const filledCount = Math.round((score / 100) * 10)
  const scoreColor = score < 60 ? C.red : score < 80 ? '#f59e0b' : '#22c55e'

  const displayName =
    clerkUser?.firstName ??
    clerkUser?.username ??
    userData?.phone ??
    'ACCOUNTABILITY SEEKER'

  // ─── Loading / not set up ────────────────────────────────────────────────

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: C.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: C.text3,
          fontFamily: MONO,
          fontSize: '0.8rem',
          letterSpacing: '0.1em',
        }}
      >
        loading...
      </div>
    )
  }

  if (apiError) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: C.s1, border: `1px solid ${C.red}`, padding: '2rem', maxWidth: '500px', width: '100%', fontFamily: MONO }}>
          <div style={{ fontSize: '0.6rem', color: C.red, letterSpacing: '0.2em', marginBottom: '0.75rem' }}>DATABASE ERROR</div>
          <p style={{ color: C.text, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Something went wrong loading your account:</p>
          <code style={{ display: 'block', background: C.bg, border: `1px solid ${C.border}`, padding: '0.75rem', fontSize: '0.72rem', color: '#f59e0b', marginBottom: '1.5rem', wordBreak: 'break-all', lineHeight: 1.6 }}>{apiError}</code>
          <p style={{ color: C.text3, fontSize: '0.72rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            If this says <strong style={{color:C.text}}>&quot;column clerk_id does not exist&quot;</strong> — run the SQL from the chat in Railway Postgres Query tab, then refresh.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={redBtnStyle} onClick={() => { setLoading(true); setApiError(null); loadData(); }}>RETRY</button>
            <button style={ghostBtnStyle} onClick={() => router.push('/')}>← HOME</button>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: C.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            background: C.s1,
            border: `1px solid ${C.border}`,
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: C.text2,
              fontSize: '0.9rem',
              fontFamily: MONO,
              marginBottom: '1.5rem',
            }}
          >
            You haven&apos;t set up your account yet.
          </p>
          <button style={redBtnStyle} onClick={() => router.push('/')}>
            GET STARTED →
          </button>
        </div>
      </div>
    )
  }

  // ─── Main render ──────────────────────────────────────────────────────────

  return (
    <>
      {/* Google Fonts */}
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          minHeight: '100vh',
          background: C.bg,
          color: C.text,
          fontFamily: MONO,
        }}
      >
        {/* ── Nav ─────────────────────────────────────────────────────────── */}
        <nav
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: C.bg,
            borderBottom: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            height: '56px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontFamily: MONO,
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              color: C.text,
              flexShrink: 0,
            }}
            onClick={() => router.push('/')}
          >
            MOGGED<span style={{ color: C.red }}>AI</span>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollTo(tab.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: isActive ? `2px solid ${C.red}` : '2px solid transparent',
                    color: isActive ? C.red : C.text3,
                    padding: '0 1rem',
                    height: '56px',
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    fontFamily: MONO,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Right: status + user */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                background: userData.active
                  ? 'rgba(34,197,94,0.12)'
                  : 'rgba(112,112,112,0.12)',
                color: userData.active ? '#22c55e' : C.text3,
                border: `1px solid ${userData.active ? 'rgba(34,197,94,0.3)' : C.border}`,
              }}
            >
              ● {userData.active ? 'ACTIVE' : 'PAUSED'}
            </span>
            <UserButton />
          </div>
        </nav>

        {/* ── Page body ────────────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '3rem 2rem 8rem',
          }}
        >
          {/* ── Section: Overview ───────────────────────────────────────── */}
          <section id="overview" ref={overviewRef} style={{ marginBottom: '5rem' }}>
            {/* Hero row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: '0.6rem',
                    letterSpacing: '0.25em',
                    color: C.text3,
                    marginBottom: '0.5rem',
                  }}
                >
                  GOOD {greeting()}
                </div>
                <div
                  style={{
                    fontFamily: GROTESK,
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: C.text,
                    lineHeight: 1.1,
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {displayName}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: '0.75rem',
                    color: C.text3,
                  }}
                >
                  Next text in ~{schedule.frequency_minutes}m · 🔥 {stats.streak} day streak
                </div>
              </div>
              <button
                style={
                  userData.active
                    ? {
                        ...ghostBtnStyle,
                        color: C.text2,
                      }
                    : {
                        ...redBtnStyle,
                      }
                }
                onClick={handleToggleActive}
              >
                {userData.active ? '⏸ PAUSE TEXTS' : '▶ RESUME TEXTS'}
              </button>
            </div>

            {/* Stat strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                border: `1px solid ${C.border}`,
                overflow: 'hidden',
              }}
            >
              {[
                {
                  value: String(stats.total_texts),
                  label: 'TEXTS SENT',
                  color: C.text,
                },
                {
                  value: stats.streak > 0 ? `🔥 ${stats.streak}` : String(stats.streak),
                  label: 'DAY STREAK',
                  color: stats.streak > 0 ? '#f59e0b' : C.text,
                },
                {
                  value: freqLabel(schedule.frequency_minutes),
                  label: 'FREQUENCY',
                  color: C.text,
                  small: true,
                },
                {
                  value: '0',
                  label: 'EXCUSES',
                  color: C.text3,
                },
                {
                  value: `${score}%`,
                  label: 'AI QUALITY',
                  color: scoreColor,
                },
              ].map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    background: i % 2 === 0 ? C.s1 : C.s2,
                    borderLeft: i > 0 ? `1px solid ${C.border}` : 'none',
                    padding: '1.25rem 0.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: item.small ? '0.8rem' : '1.5rem',
                      fontWeight: 700,
                      color: item.color,
                      lineHeight: 1.1,
                      fontFamily: item.small ? MONO : GROTESK,
                      marginBottom: '0.4rem',
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      fontSize: '0.5rem',
                      letterSpacing: '0.15em',
                      color: C.text3,
                      fontFamily: MONO,
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 01: My Profile ───────────────────────────────────── */}
          <section id="profile" ref={profileRef} style={{ marginBottom: '5rem' }}>
            <SectionNum n="01" title="My Accountability Profile" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Goal */}
              <StyledTextarea
                label="WHAT ARE YOU WORKING TOWARDS?"
                value={goals.goal_text}
                onChange={(v) => patchGoal('goal_text', v)}
                rows={4}
                maxLength={300}
                placeholder="Be specific. Vague goals get vague results."
              />

              {/* Deadline + Stakes */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <label style={labelStyle}>HARD DEADLINE</label>
                  <input
                    type="date"
                    value={goals.deadline}
                    onChange={(e) => patchGoal('deadline', e.target.value)}
                    style={inputStyle}
                  />
                  {goals.deadline && (() => {
                    const d = daysLeft(goals.deadline)
                    if (d === null) return null
                    return (
                      <div
                        style={{
                          fontSize: '0.65rem',
                          fontFamily: MONO,
                          color: d <= 3 ? C.red : d > 30 ? '#22c55e' : C.text3,
                          marginTop: '0.4rem',
                        }}
                      >
                        {d > 0 ? `${d} days left` : d === 0 ? 'TODAY' : `${Math.abs(d)} days overdue`}
                      </div>
                    )
                  })()}
                </div>
                <StyledInput
                  label="WHAT HAPPENS IF YOU MISS IT"
                  value={goals.stakes}
                  onChange={(v) => patchGoal('stakes', v)}
                  placeholder="Make it painful."
                />
              </div>

              {/* Why */}
              <StyledTextarea
                label="WHY DOES THIS ACTUALLY MATTER?"
                value={goals.why_it_matters}
                onChange={(v) => patchGoal('why_it_matters', v)}
                rows={3}
                placeholder="The real reason, not the surface one."
              />

              {/* Tags + Weakness */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <label style={labelStyle}>WHAT DO YOU DO WHEN YOU PROCRASTINATE?</label>
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const v = tagInput.trim()
                        if (
                          v &&
                          goals.procrastination_triggers.length < 8 &&
                          !goals.procrastination_triggers.includes(v)
                        ) {
                          patchGoal('procrastination_triggers', [
                            ...goals.procrastination_triggers,
                            v,
                          ])
                          setTagInput('')
                        }
                      }
                    }}
                    placeholder="Type and press Enter..."
                    style={inputStyle}
                  />
                  {goals.procrastination_triggers.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        marginTop: '0.6rem',
                      }}
                    >
                      {goals.procrastination_triggers.map((t) => (
                        <span
                          key={t}
                          style={{
                            background: 'rgba(229,40,26,0.1)',
                            border: `1px solid rgba(229,40,26,0.3)`,
                            color: C.text2,
                            fontSize: '0.65rem',
                            fontFamily: MONO,
                            padding: '0.25rem 0.6rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          {t}
                          <span
                            style={{
                              cursor: 'pointer',
                              color: C.red,
                              lineHeight: 1,
                            }}
                            onClick={() => {
                              patchGoal(
                                'procrastination_triggers',
                                goals.procrastination_triggers.filter((x) => x !== t)
                              )
                            }}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <StyledInput
                  label="YOUR BIGGEST WEAKNESS / EXCUSE"
                  value={goals.weakness}
                  onChange={(v) => patchGoal('weakness', v)}
                  placeholder="Be honest."
                />
              </div>

              {/* Tone selector */}
              <div>
                <label style={labelStyle}>HOW HARD SHOULD WE PUSH YOU?</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {TONE_OPTIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => patchGoal('tone', t)}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        fontSize: '0.72rem',
                        letterSpacing: '0.1em',
                        fontFamily: MONO,
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderRadius: 0,
                        background:
                          goals.tone === t
                            ? 'rgba(229,40,26,0.1)'
                            : 'transparent',
                        border:
                          goals.tone === t
                            ? `1px solid ${C.red}`
                            : `1px solid ${C.border}`,
                        color: goals.tone === t ? C.text : C.text3,
                        textTransform: 'uppercase' as const,
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3-col: competition, sacrifice, success */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                }}
              >
                <StyledInput
                  label="WHO ARE YOU COMPETING AGAINST?"
                  value={goals.competition}
                  onChange={(v) => patchGoal('competition', v)}
                  placeholder="Past you? Someone else?"
                />
                <StyledInput
                  label="WHAT ARE YOU SACRIFICING FOR THIS?"
                  value={goals.sacrifice}
                  onChange={(v) => patchGoal('sacrifice', v)}
                  placeholder="What's it costing you?"
                />
                <StyledInput
                  label="WHAT DOES SUCCESS LOOK LIKE?"
                  value={goals.success_vision}
                  onChange={(v) => patchGoal('success_vision', v)}
                  placeholder="Paint the picture."
                />
              </div>

              {/* AI Quality Score bar */}
              <div
                style={{
                  background: C.s1,
                  border: `1px solid ${C.border}`,
                  padding: '1.25rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.6rem',
                      letterSpacing: '0.15em',
                      color: C.text3,
                      fontFamily: MONO,
                    }}
                  >
                    AI PROFILE QUALITY
                  </span>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: scoreColor,
                      fontFamily: GROTESK,
                    }}
                  >
                    {score}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    background: C.border,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${score}%`,
                      height: '100%',
                      background: scoreColor,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: '0.6rem',
                    color: C.text3,
                    fontFamily: MONO,
                    marginTop: '0.6rem',
                  }}
                >
                  {filledCount} of 10 fields complete — more detail = smarter texts
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 02: Schedule ─────────────────────────────────────── */}
          <section id="schedule" ref={scheduleRef} style={{ marginBottom: '5rem' }}>
            <SectionNum n="02" title="Check-In Schedule" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Frequency */}
              <div>
                <label style={labelStyle}>FREQUENCY</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {FREQ_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => patchSchedule('frequency_minutes', f.value)}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        fontSize: '0.72rem',
                        letterSpacing: '0.1em',
                        fontFamily: MONO,
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderRadius: 0,
                        background:
                          schedule.frequency_minutes === f.value
                            ? 'rgba(229,40,26,0.1)'
                            : 'transparent',
                        border:
                          schedule.frequency_minutes === f.value
                            ? `1px solid ${C.red}`
                            : `1px solid ${C.border}`,
                        color:
                          schedule.frequency_minutes === f.value ? C.text : C.text3,
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Hours */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <label style={labelStyle}>FROM</label>
                  <input
                    type="time"
                    value={schedule.start_time}
                    onChange={(e) => patchSchedule('start_time', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>TO</label>
                  <input
                    type="time"
                    value={schedule.end_time}
                    onChange={(e) => patchSchedule('end_time', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Active Days */}
              <div>
                <label style={labelStyle}>ACTIVE DAYS</label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {DAYS.map((day) => {
                    const isOn = schedule.active_days.includes(day)
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          const next = isOn
                            ? schedule.active_days.filter((d) => d !== day)
                            : [...schedule.active_days, day]
                          patchSchedule('active_days', next)
                        }}
                        style={{
                          flex: 1,
                          minWidth: '44px',
                          padding: '0.65rem 0.5rem',
                          fontSize: '0.65rem',
                          letterSpacing: '0.08em',
                          fontFamily: MONO,
                          fontWeight: 700,
                          cursor: 'pointer',
                          borderRadius: 0,
                          background: isOn ? 'rgba(229,40,26,0.1)' : 'transparent',
                          border: isOn ? `1px solid ${C.red}` : `1px solid ${C.border}`,
                          color: isOn ? C.text : C.text3,
                        }}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 03: Recent Texts ─────────────────────────────────── */}
          <section id="texts" ref={textsRef} style={{ marginBottom: '5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
              }}
            >
              <SectionNum n="03" title="Recent Texts" />
              <button style={ghostBtnStyle}>VIEW ALL</button>
            </div>

            {recentMessages.length === 0 ? (
              <div
                style={{
                  background: C.s1,
                  border: `1px solid ${C.border}`,
                  padding: '2rem',
                  color: C.text3,
                  fontFamily: MONO,
                  fontSize: '0.8rem',
                  lineHeight: 1.6,
                }}
              >
                No texts sent yet. Set up your schedule and we&apos;ll start checking in.
              </div>
            ) : (
              <div>
                {recentMessages.map((m, i) => {
                  const isRecent =
                    Date.now() - new Date(m.sent_at).getTime() < 86400000
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        padding: '1rem',
                        background: i % 2 === 0 ? C.s1 : C.s2,
                        borderLeft: `2px solid ${isRecent ? C.red : C.border}`,
                        opacity: isRecent ? 1 : 0.6,
                        gap: '1rem',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.82rem',
                          color: C.text2,
                          lineHeight: 1.6,
                          fontFamily: MONO,
                          flex: 1,
                        }}
                      >
                        {m.message_text}
                      </div>
                      <div
                        style={{
                          fontSize: '0.65rem',
                          color: C.text3,
                          fontFamily: MONO,
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {fmtMsg(m.sent_at)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* ── Section 04: Settings ─────────────────────────────────────── */}
          <section id="settings" ref={settingsRef} style={{ marginBottom: '5rem' }}>
            <SectionNum n="04" title="Account & Settings" />

            {[
              {
                label: 'PHONE NUMBER',
                detail: userData.phone,
                btnLabel: 'CHANGE →',
                onBtn: () => {
                  setPhoneInput(userData.phone)
                  setModal('phone')
                },
                danger: false,
              },
              {
                label: 'EXPORT DATA',
                detail: 'Download all your data as JSON',
                btnLabel: 'EXPORT →',
                onBtn: () => setModal('export'),
                danger: false,
              },
              {
                label: 'PAUSE TEXTS',
                detail: 'Temporarily stop check-ins',
                btnLabel: userData.active ? '⏸ PAUSE' : '▶ RESUME',
                onBtn: handleToggleActive,
                danger: false,
              },
              {
                label: 'UNSUBSCRIBE',
                detail: 'Stop texts permanently',
                btnLabel: 'UNSUBSCRIBE →',
                onBtn: () => setModal('unsubscribe'),
                danger: true,
                outlined: true,
              },
              {
                label: 'DELETE ACCOUNT',
                detail: 'Remove all data permanently',
                btnLabel: 'DELETE ACCOUNT →',
                onBtn: () => setModal('delete'),
                danger: true,
                filled: true,
              },
            ].map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `1px solid ${C.border}`,
                  padding: '1rem 0',
                  gap: '1rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.15em',
                      fontFamily: MONO,
                      color: C.text,
                      marginBottom: '0.25rem',
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: C.text3,
                      fontFamily: MONO,
                    }}
                  >
                    {row.detail}
                  </div>
                </div>
                <button
                  onClick={row.onBtn}
                  style={
                    row.filled
                      ? { ...redBtnStyle }
                      : row.outlined
                      ? {
                          ...ghostBtnStyle,
                          border: `1px solid ${C.red}`,
                          color: C.red,
                        }
                      : ghostBtnStyle
                  }
                >
                  {row.btnLabel}
                </button>
              </div>
            ))}
          </section>
        </div>

        {/* ── Sticky Save Bar ──────────────────────────────────────────────── */}
        {isDirty && (
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: C.bg,
              borderTop: `2px solid ${C.red}`,
              padding: '1rem 2rem',
              zIndex: 40,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <button style={ghostBtnStyle} onClick={handleDiscard}>
              DISCARD
            </button>
            <button
              style={{ ...redBtnStyle, opacity: saving ? 0.6 : 1 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'SAVING...' : 'SAVE ALL CHANGES →'}
            </button>
          </div>
        )}

        {/* ── Toast ────────────────────────────────────────────────────────── */}
        {toast && (
          <div
            style={{
              position: 'fixed',
              bottom: '5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: toast.type === 'success' ? '#22c55e' : C.red,
              color: '#fff',
              padding: '0.75rem 1.5rem',
              fontFamily: MONO,
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              zIndex: 60,
              whiteSpace: 'nowrap',
            }}
          >
            {toast.msg}
          </div>
        )}

        {/* ── Modals ───────────────────────────────────────────────────────── */}
        {modal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}
            onClick={() => setModal(null)}
          >
            <div
              style={{
                maxWidth: '480px',
                width: '100%',
                background: C.s1,
                border: `1px solid ${C.border}`,
                padding: '2rem',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {modal === 'phone' && (
                <>
                  <h3
                    style={{
                      fontFamily: GROTESK,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      marginBottom: '1.25rem',
                      color: C.text,
                    }}
                  >
                    Change Phone Number
                  </h3>
                  <label style={labelStyle}>NEW PHONE NUMBER</label>
                  <input
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    style={{ ...inputStyle, marginBottom: '1rem' }}
                    placeholder="+1 555 000 0000"
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={redBtnStyle}
                      onClick={() => {
                        showToast('Phone number updated.', 'success')
                        setModal(null)
                      }}
                    >
                      SAVE
                    </button>
                    <button style={ghostBtnStyle} onClick={() => setModal(null)}>
                      CANCEL
                    </button>
                  </div>
                </>
              )}

              {modal === 'export' && (
                <>
                  <h3
                    style={{
                      fontFamily: GROTESK,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      marginBottom: '1rem',
                      color: C.text,
                    }}
                  >
                    Export Your Data
                  </h3>
                  <p
                    style={{
                      color: C.text3,
                      fontSize: '0.8rem',
                      fontFamily: MONO,
                      marginBottom: '1.5rem',
                      lineHeight: 1.6,
                    }}
                  >
                    Exporting your data...
                  </p>
                  <button
                    style={redBtnStyle}
                    onClick={() => {
                      console.log('Export data:', {
                        userData,
                        goals,
                        schedule,
                        stats,
                        recentMessages,
                      })
                      showToast('Data exported to console.', 'success')
                      setModal(null)
                    }}
                  >
                    DOWNLOAD JSON
                  </button>
                </>
              )}

              {modal === 'unsubscribe' && (
                <>
                  <h3
                    style={{
                      fontFamily: GROTESK,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      marginBottom: '1rem',
                      color: C.red,
                    }}
                  >
                    Are you sure?
                  </h3>
                  <p
                    style={{
                      color: C.text2,
                      fontSize: '0.82rem',
                      fontFamily: MONO,
                      marginBottom: '1.5rem',
                      lineHeight: 1.6,
                    }}
                  >
                    This will permanently stop all text messages. You can always sign up
                    again, but your streak will be gone.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{
                        ...redBtnStyle,
                        background: 'transparent',
                        border: `1px solid ${C.red}`,
                        color: C.red,
                      }}
                      onClick={() => {
                        showToast('Unsubscribed.', 'error')
                        setModal(null)
                      }}
                    >
                      YES, UNSUBSCRIBE
                    </button>
                    <button style={ghostBtnStyle} onClick={() => setModal(null)}>
                      CANCEL
                    </button>
                  </div>
                </>
              )}

              {modal === 'delete' && (
                <>
                  <h3
                    style={{
                      fontFamily: GROTESK,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      marginBottom: '1rem',
                      color: C.red,
                    }}
                  >
                    Delete Account
                  </h3>
                  <p
                    style={{
                      color: C.text2,
                      fontSize: '0.82rem',
                      fontFamily: MONO,
                      marginBottom: '1.25rem',
                      lineHeight: 1.6,
                    }}
                  >
                    This cannot be undone. All your data, goals, streaks, and messages
                    will be permanently deleted.
                  </p>
                  <label style={labelStyle}>TYPE &quot;DELETE&quot; TO CONFIRM</label>
                  <input
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    style={{ ...inputStyle, marginBottom: '1rem' }}
                    placeholder="DELETE"
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{
                        ...redBtnStyle,
                        opacity: deleteConfirm === 'DELETE' ? 1 : 0.4,
                        cursor:
                          deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed',
                      }}
                      disabled={deleteConfirm !== 'DELETE'}
                      onClick={() => {
                        showToast('Account deleted.', 'error')
                        setModal(null)
                        setDeleteConfirm('')
                      }}
                    >
                      DELETE ACCOUNT
                    </button>
                    <button
                      style={ghostBtnStyle}
                      onClick={() => {
                        setModal(null)
                        setDeleteConfirm('')
                      }}
                    >
                      CANCEL
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
