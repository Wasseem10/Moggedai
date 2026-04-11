"use client";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const FREQ_OPTIONS = [
  { label: "Every 30 min", value: 30 },
  { label: "Every hour",   value: 60 },
  { label: "Every 2 hrs",  value: 120 },
  { label: "Every 3 hrs",  value: 180 },
];

const HABIT_PRESETS = [
  { name: "Gym",        emoji: "💪" },
  { name: "Study",      emoji: "📚" },
  { name: "Work",       emoji: "💼" },
  { name: "Read",       emoji: "📖" },
  { name: "Meditate",   emoji: "🧘" },
  { name: "Sleep Early",emoji: "😴" },
  { name: "Diet",       emoji: "🥗" },
  { name: "Side Project",emoji: "🚀" },
  { name: "No Phone",   emoji: "📵" },
  { name: "Water",      emoji: "💧" },
];

type Habit = { id: string; name: string; emoji: string; streak: number; total_completions: number };
type UserData = { phone: string; frequency_minutes: number; start_time: string; end_time: string; active: boolean; timezone: string; coach_style: string };
type Stats = { total_texts: number; total_completions: number };
type Message = { message_text: string; sent_at: string; responded_at: string | null; habit_name: string | null; habit_emoji: string | null };

const mono = "'Space Mono', 'Courier New', monospace";
const C = { red: "#dc2626", bg: "#080808", card: "#0f0f0f", border: "#1a1a1a", text: "#f0f0f0", muted: "#444", muted2: "#666" };

const s = {
  root:     { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: mono } as React.CSSProperties,
  nav:      { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderBottom: `1px solid rgba(220,38,38,0.2)`, background: "rgba(8,8,8,0.97)", position: "sticky", top: 0, zIndex: 10 } as React.CSSProperties,
  logo:     { fontSize: "1.1rem", fontWeight: "700", letterSpacing: "0.15em", cursor: "pointer", color: C.text } as React.CSSProperties,
  body:     { maxWidth: "700px", margin: "0 auto", padding: "2.5rem 1.25rem 4rem" } as React.CSSProperties,
  card:     { background: C.card, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1rem" } as React.CSSProperties,
  lbl:      { fontSize: "0.55rem", letterSpacing: "0.25em", color: C.muted, display: "block", marginBottom: "0.4rem" } as React.CSSProperties,
  val:      { fontSize: "0.95rem", color: C.text, lineHeight: "1.5" } as React.CSSProperties,
  input:    { width: "100%", background: "#1a1a1a", border: `1px solid #2a2a2a`, color: C.text, padding: "0.75rem 1rem", fontSize: "0.9rem", fontFamily: mono, outline: "none", boxSizing: "border-box" as const },
  redBtn:   { background: C.red, border: "none", color: "#fff", padding: "0.65rem 1.4rem", fontSize: "0.72rem", letterSpacing: "0.1em", cursor: "pointer", fontFamily: mono, fontWeight: "700" } as React.CSSProperties,
  ghostBtn: { background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "0.65rem 1.4rem", fontSize: "0.72rem", letterSpacing: "0.1em", cursor: "pointer", fontFamily: mono } as React.CSSProperties,
  editBtn:  { background: "transparent", border: "none", color: C.muted, fontSize: "0.6rem", cursor: "pointer", fontFamily: mono, letterSpacing: "0.1em", padding: 0 } as React.CSSProperties,
  tag:      { fontSize: "0.55rem", letterSpacing: "0.2em", color: C.red, border: `1px solid rgba(220,38,38,0.3)`, padding: "0.2rem 0.6rem", display: "inline-block", marginBottom: "0.75rem" } as React.CSSProperties,
};

export default function Dashboard() {
  const router = useRouter();

  const [userData, setUserData]   = useState<UserData | null>(null);
  const [habits, setHabits]       = useState<Habit[]>([]);
  const [stats, setStats]         = useState<Stats>({ total_texts: 0, total_completions: 0 });
  const [messages, setMessages]   = useState<Message[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);

  // Schedule edit
  const [editSched, setEditSched]   = useState(false);
  const [freqDraft, setFreqDraft]   = useState(60);
  const [startDraft, setStartDraft] = useState("08:00");
  const [endDraft, setEndDraft]     = useState("22:00");

  // Add habit
  const [showAddHabit, setShowAddHabit]   = useState(false);
  const [customHabitName, setCustomHabitName] = useState("");
  const [customHabitEmoji, setCustomHabitEmoji] = useState("");

  const loadData = async () => {
    try {
      const res = await fetch("/api/user");
      const d = await res.json();
      if (d.user) {
        setUserData(d.user);
        setFreqDraft(d.user.frequency_minutes ?? 60);
        setStartDraft(d.user.start_time ?? "08:00");
        setEndDraft(d.user.end_time ?? "22:00");
      }
      setHabits(d.habits ?? []);
      setStats(d.stats ?? { total_texts: 0, total_completions: 0 });
      setMessages(d.recent_messages ?? []);
    } catch (err) {
      console.error("Failed to load user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const patch = async (body: object) => {
    setSaving(true);
    await fetch("/api/user", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    await loadData();
    setSaving(false);
  };

  const toggleActive  = () => patch({ active: !userData?.active });
  const removeHabit   = (id: string) => patch({ remove_habit_id: id });
  const saveSched     = async () => { await patch({ frequency_minutes: freqDraft, start_time: startDraft, end_time: endDraft }); setEditSched(false); };

  const addHabit = async (name: string, emoji: string) => {
    if (!name.trim()) return;
    await patch({ add_habit: { name: name.trim(), emoji: emoji || "🎯" } });
    setShowAddHabit(false);
    setCustomHabitName("");
    setCustomHabitEmoji("");
  };

  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const coachLabel: Record<string, string> = { brutal: "BRUTAL", direct: "DIRECT", motivating: "MOTIVATING" };

  if (loading) return (
    <div style={{ ...s.root, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
      loading...
    </div>
  );

  return (
    <div style={s.root}>
      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.logo} onClick={() => router.push("/")}>MOGGED<span style={{ color: C.red }}>AI</span></div>
        <UserButton />
      </nav>

      <div style={s.body}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={s.tag}>DASHBOARD</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>your accountability hub.</h1>
          </div>
          {userData && (
            <button
              style={{ ...s.redBtn, background: userData.active ? "transparent" : C.red, border: `1px solid ${userData.active ? "#333" : C.red}`, color: userData.active ? C.muted : "#fff" }}
              onClick={toggleActive} disabled={saving}
            >
              {saving ? "..." : userData.active ? "PAUSE TEXTS" : "RESUME TEXTS"}
            </button>
          )}
        </div>

        {!userData ? (
          <div style={s.card}>
            <p style={{ color: C.muted, marginBottom: "1.5rem", fontSize: "0.85rem" }}>You haven&apos;t set up your account yet.</p>
            <button style={s.redBtn} onClick={() => router.push("/")}>GET STARTED →</button>
          </div>
        ) : (
          <>
            {/* ── Stats row ───────────────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: C.border, border: `1px solid ${C.border}`, marginBottom: "1rem" }}>
              {[
                { n: stats.total_texts.toString(),       l: "TEXTS SENT" },
                { n: stats.total_completions.toString(), l: "HABITS DONE" },
                { n: userData.active ? "ACTIVE" : "PAUSED", l: "STATUS", color: userData.active ? C.red : C.muted2 },
              ].map(item => (
                <div key={item.l} style={{ background: C.card, padding: "1.25rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.6rem", fontWeight: "700", color: item.color ?? C.text, lineHeight: 1 }}>{item.n}</div>
                  <div style={{ fontSize: "0.5rem", letterSpacing: "0.15em", color: C.muted, marginTop: "0.35rem" }}>{item.l}</div>
                </div>
              ))}
            </div>

            {/* ── Habits ──────────────────────────────────────────────── */}
            <div style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <span style={s.lbl}>YOUR HABITS ({habits.length}/5)</span>
                {habits.length < 5 && (
                  <button style={s.editBtn} onClick={() => setShowAddHabit(!showAddHabit)}>
                    {showAddHabit ? "CANCEL" : "+ ADD HABIT"}
                  </button>
                )}
              </div>

              {/* Habit list */}
              {habits.length === 0 ? (
                <p style={{ color: C.muted, fontSize: "0.8rem", margin: "0 0 1rem" }}>No habits yet. Add one below.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: showAddHabit ? "1.25rem" : 0 }}>
                  {habits.map(h => (
                    <div key={h.id} style={{ display: "flex", alignItems: "center", background: "#111", border: `1px solid #1e1e1e`, padding: "0.9rem 1rem", gap: "1rem" }}>
                      <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>{h.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.85rem", color: C.text, fontWeight: "700", marginBottom: "0.2rem" }}>{h.name}</div>
                        <div style={{ fontSize: "0.55rem", letterSpacing: "0.1em", color: C.muted }}>
                          {h.streak > 0
                            ? <span style={{ color: "#f59e0b" }}>🔥 {h.streak} DAY STREAK · </span>
                            : null
                          }
                          {h.total_completions} COMPLETIONS
                        </div>
                      </div>
                      <button
                        style={{ background: "transparent", border: "none", color: "#333", fontSize: "0.7rem", cursor: "pointer", fontFamily: mono, padding: "0.25rem 0.5rem" }}
                        onClick={() => removeHabit(h.id)}
                        disabled={saving}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add habit panel */}
              {showAddHabit && (
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.25rem" }}>
                  <div style={{ ...s.lbl, marginBottom: "0.75rem" }}>PICK A HABIT OR TYPE YOUR OWN</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px", marginBottom: "1rem" }}>
                    {HABIT_PRESETS.filter(p => !habits.find(h => h.name === p.name)).slice(0, 8).map(p => (
                      <button
                        key={p.name}
                        style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: C.text, padding: "0.6rem 0.75rem", cursor: "pointer", fontFamily: mono, fontSize: "0.75rem", textAlign: "left", display: "flex", alignItems: "center", gap: "0.5rem" }}
                        onClick={() => addHabit(p.name, p.emoji)}
                        disabled={saving}
                      >
                        <span>{p.emoji}</span> {p.name}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      style={{ ...s.input, flex: 1 }}
                      placeholder="Custom habit name..."
                      value={customHabitName}
                      onChange={e => setCustomHabitName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addHabit(customHabitName, customHabitEmoji)}
                    />
                    <input
                      style={{ ...s.input, width: "56px", textAlign: "center", padding: "0.75rem 0.5rem" }}
                      placeholder="🎯"
                      value={customHabitEmoji}
                      onChange={e => setCustomHabitEmoji(e.target.value)}
                    />
                    <button style={s.redBtn} onClick={() => addHabit(customHabitName, customHabitEmoji)} disabled={saving || !customHabitName.trim()}>ADD</button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Schedule ────────────────────────────────────────────── */}
            <div style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={s.lbl}>CHECK-IN SCHEDULE</span>
                {!editSched && <button style={s.editBtn} onClick={() => setEditSched(true)}>EDIT ✎</button>}
              </div>
              {editSched ? (
                <>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <div style={s.lbl}>FREQUENCY</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      {FREQ_OPTIONS.map(f => (
                        <button key={f.value}
                          style={{ background: freqDraft === f.value ? "rgba(220,38,38,0.12)" : "#1a1a1a", border: freqDraft === f.value ? `1px solid ${C.red}` : "1px solid #2a2a2a", color: freqDraft === f.value ? C.text : C.muted, padding: "0.65rem", cursor: "pointer", fontFamily: mono, fontSize: "0.72rem" }}
                          onClick={() => setFreqDraft(f.value)}
                        >{f.label}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={s.lbl}>FROM</div>
                      <input style={s.input} type="time" value={startDraft} onChange={e => setStartDraft(e.target.value)} />
                    </div>
                    <div>
                      <div style={s.lbl}>UNTIL</div>
                      <input style={s.input} type="time" value={endDraft} onChange={e => setEndDraft(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button style={s.redBtn} onClick={saveSched} disabled={saving}>{saving ? "..." : "SAVE"}</button>
                    <button style={s.ghostBtn} onClick={() => setEditSched(false)}>CANCEL</button>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  <div><span style={s.lbl}>FREQUENCY</span><div style={s.val}>{FREQ_OPTIONS.find(f => f.value === userData.frequency_minutes)?.label ?? `Every ${userData.frequency_minutes} min`}</div></div>
                  <div><span style={s.lbl}>ACTIVE HOURS</span><div style={s.val}>{userData.start_time} – {userData.end_time}</div></div>
                  <div><span style={s.lbl}>TIMEZONE</span><div style={{ ...s.val, fontSize: "0.78rem", color: C.muted2 }}>{userData.timezone ?? "—"}</div></div>
                </div>
              )}
            </div>

            {/* ── Account info ────────────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div style={s.card}>
                <span style={s.lbl}>PHONE</span>
                <div style={s.val}>{userData.phone}</div>
              </div>
              <div style={s.card}>
                <span style={s.lbl}>COACH STYLE</span>
                <div style={{ ...s.val, color: C.red }}>{coachLabel[userData.coach_style] ?? userData.coach_style?.toUpperCase() ?? "DIRECT"}</div>
              </div>
            </div>

            {/* ── Message history ─────────────────────────────────────── */}
            <div style={{ ...s.card, marginTop: "0.5rem" }}>
              <span style={{ ...s.lbl, marginBottom: "1rem", display: "block" }}>RECENT CHECK-INS</span>
              {messages.length === 0 ? (
                <p style={{ color: C.muted, fontSize: "0.8rem", margin: 0 }}>No texts sent yet — check-ins will appear here once your cron is running.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {messages.map((m, i) => (
                    <div key={i} style={{ borderLeft: `2px solid ${m.responded_at ? C.red : "#2a2a2a"}`, paddingLeft: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                        {m.habit_emoji && <span style={{ fontSize: "0.9rem" }}>{m.habit_emoji}</span>}
                        {m.habit_name && <span style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: C.muted }}>{m.habit_name.toUpperCase()}</span>}
                        {m.responded_at && <span style={{ fontSize: "0.5rem", letterSpacing: "0.1em", color: C.red, marginLeft: "auto" }}>✓ REPLIED</span>}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: C.text, lineHeight: "1.6", marginBottom: "0.25rem" }}>{m.message_text}</div>
                      <div style={{ fontSize: "0.52rem", color: C.muted, letterSpacing: "0.1em" }}>{fmt(m.sent_at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── SMS Commands cheatsheet ─────────────────────────────── */}
            <div style={{ ...s.card, marginTop: "1rem", background: "transparent", border: `1px solid #1a1a1a` }}>
              <span style={{ ...s.lbl, marginBottom: "1rem", display: "block" }}>SMS COMMANDS</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { cmd: "DONE",    desc: "Mark current habit complete + log streak" },
                  { cmd: "SKIP",    desc: "Skip this check-in" },
                  { cmd: "STREAK",  desc: "See your current streaks for all habits" },
                  { cmd: "HABITS",  desc: "List your active habits + completion counts" },
                  { cmd: "STOP",    desc: "Pause all texts" },
                  { cmd: "START",   desc: "Resume texts" },
                ].map(r => (
                  <div key={r.cmd} style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: "700", color: C.red, minWidth: "60px", letterSpacing: "0.05em" }}>{r.cmd}</span>
                    <span style={{ fontSize: "0.72rem", color: C.muted }}>{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
