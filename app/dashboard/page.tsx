"use client";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const FREQ_OPTIONS = [
  { label: "Every 30 min", value: 30 },
  { label: "Every hour", value: 60 },
  { label: "Every 2 hours", value: 120 },
  { label: "Every 3 hours", value: 180 },
];

type UserData = {
  phone: string;
  goal_text: string;
  frequency_minutes: number;
  start_time: string;
  end_time: string;
  active: boolean;
  timezone: string;
};

type Stats = { total_texts: number; active_days: number };
type Message = { message_text: string; sent_at: string };

const mono = "'Space Mono', 'Courier New', monospace";
const C = { red: "#dc2626", bg: "#080808", card: "#0f0f0f", border: "#1a1a1a", text: "#f0f0f0", muted: "#444" };

export default function Dashboard() {
  const router = useRouter();
  const [data, setData]   = useState<UserData | null>(null);
  const [stats, setStats] = useState<Stats>({ total_texts: 0, active_days: 0 });
  const [msgs, setMsgs]   = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  // Edit states
  const [editGoal, setEditGoal]   = useState(false);
  const [editSched, setEditSched] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");
  const [freqDraft, setFreqDraft] = useState(60);
  const [startDraft, setStartDraft] = useState("08:00");
  const [endDraft, setEndDraft]     = useState("22:00");

  useEffect(() => {
    fetch("/api/user").then(r => r.json()).then(d => {
      setData(d.user);
      setStats(d.stats ?? { total_texts: 0, active_days: 0 });
      setMsgs(d.recent_messages ?? []);
      if (d.user) {
        setGoalDraft(d.user.goal_text ?? "");
        setFreqDraft(d.user.frequency_minutes ?? 60);
        setStartDraft(d.user.start_time ?? "08:00");
        setEndDraft(d.user.end_time ?? "22:00");
      }
      setLoading(false);
    });
  }, []);

  const patch = async (body: object) => {
    setSaving(true);
    await fetch("/api/user", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await fetch("/api/user").then(r => r.json());
    setData(d.user); setStats(d.stats ?? stats); setMsgs(d.recent_messages ?? msgs);
    setSaving(false);
  };

  const saveGoal = async () => {
    await patch({ goal_text: goalDraft });
    setEditGoal(false);
  };

  const saveSched = async () => {
    await patch({ frequency_minutes: freqDraft, start_time: startDraft, end_time: endDraft });
    setEditSched(false);
  };

  const toggleActive = () => patch({ active: !data?.active });

  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  // ── styles ────────────────────────────────────────────────────────────────
  const s = {
    root:  { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: mono } as React.CSSProperties,
    nav:   { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderBottom: `1px solid rgba(220,38,38,0.2)`, background: "rgba(8,8,8,0.95)" } as React.CSSProperties,
    logo:  { fontSize: "1.1rem", fontWeight: "700", letterSpacing: "0.15em", cursor: "pointer", color: C.text } as React.CSSProperties,
    body:  { maxWidth: "680px", margin: "0 auto", padding: "3rem 1.5rem" } as React.CSSProperties,
    card:  { background: C.card, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1rem" } as React.CSSProperties,
    lbl:   { fontSize: "0.55rem", letterSpacing: "0.25em", color: C.muted, display: "block", marginBottom: "0.4rem" } as React.CSSProperties,
    val:   { fontSize: "0.95rem", color: C.text, lineHeight: "1.5" } as React.CSSProperties,
    input: { width: "100%", background: "#1a1a1a", border: `1px solid #2a2a2a`, color: C.text, padding: "0.75rem 1rem", fontSize: "0.9rem", fontFamily: mono, outline: "none", boxSizing: "border-box" } as React.CSSProperties,
    textarea: { width: "100%", background: "#1a1a1a", border: `1px solid #2a2a2a`, color: C.text, padding: "0.75rem 1rem", fontSize: "0.85rem", fontFamily: mono, outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: "80px", lineHeight: "1.6" } as React.CSSProperties,
    redBtn: { background: C.red, border: "none", color: "#fff", padding: "0.65rem 1.5rem", fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer", fontFamily: mono, fontWeight: "700" } as React.CSSProperties,
    ghostBtn: { background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "0.65rem 1.5rem", fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer", fontFamily: mono } as React.CSSProperties,
    editBtn: { background: "transparent", border: "none", color: C.muted, fontSize: "0.65rem", cursor: "pointer", fontFamily: mono, letterSpacing: "0.1em", padding: 0 } as React.CSSProperties,
  };

  if (loading) return <div style={{ ...s.root, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>loading...</div>;

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <div style={s.logo} onClick={() => router.push("/")}>MOGGED<span style={{ color: C.red }}>AI</span></div>
        <UserButton />
      </nav>

      <div style={s.body}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.55rem", letterSpacing: "0.25em", color: C.red, border: `1px solid rgba(220,38,38,0.3)`, padding: "0.25rem 0.7rem", display: "inline-block", marginBottom: "0.75rem" }}>DASHBOARD</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>your accountability hub.</h1>
          </div>
          {data && (
            <button
              style={{ ...s.redBtn, background: data.active ? "transparent" : C.red, border: `1px solid ${data.active ? "#333" : C.red}`, color: data.active ? C.muted : "#fff" }}
              onClick={toggleActive} disabled={saving}
            >
              {saving ? "..." : data.active ? "PAUSE TEXTS" : "RESUME TEXTS"}
            </button>
          )}
        </div>

        {!data ? (
          <div style={s.card}>
            <p style={{ color: C.muted, marginBottom: "1.5rem", fontSize: "0.85rem" }}>You haven&apos;t subscribed yet.</p>
            <button style={s.redBtn} onClick={() => router.push("/")}>GET STARTED →</button>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: C.border, border: `1px solid ${C.border}`, marginBottom: "1rem" }}>
              {[
                { n: stats.total_texts.toString(), l: "TEXTS SENT" },
                { n: stats.active_days.toString(), l: "ACTIVE DAYS" },
                { n: data.active ? "ON" : "OFF", l: "STATUS", color: data.active ? C.red : C.muted },
              ].map(item => (
                <div key={item.l} style={{ background: C.card, padding: "1.25rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: "700", color: item.color ?? C.text, lineHeight: 1 }}>{item.n}</div>
                  <div style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: C.muted, marginTop: "0.35rem" }}>{item.l}</div>
                </div>
              ))}
            </div>

            {/* Goal card */}
            <div style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={s.lbl}>YOUR GOAL</span>
                {!editGoal && <button style={s.editBtn} onClick={() => setEditGoal(true)}>EDIT ✎</button>}
              </div>
              {editGoal ? (
                <>
                  <textarea style={s.textarea} value={goalDraft} onChange={e => setGoalDraft(e.target.value)} />
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <button style={s.redBtn} onClick={saveGoal} disabled={saving}>{saving ? "..." : "SAVE"}</button>
                    <button style={s.ghostBtn} onClick={() => { setEditGoal(false); setGoalDraft(data.goal_text); }}>CANCEL</button>
                  </div>
                </>
              ) : (
                <div style={s.val}>{data.goal_text}</div>
              )}
            </div>

            {/* Schedule card */}
            <div style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={s.lbl}>CHECK-IN SCHEDULE</span>
                {!editSched && <button style={s.editBtn} onClick={() => setEditSched(true)}>EDIT ✎</button>}
              </div>
              {editSched ? (
                <>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={s.lbl}>FREQUENCY</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      {FREQ_OPTIONS.map(f => (
                        <button key={f.value}
                          style={{ background: freqDraft === f.value ? "rgba(220,38,38,0.12)" : "#1a1a1a", border: freqDraft === f.value ? `1px solid ${C.red}` : "1px solid #2a2a2a", color: freqDraft === f.value ? C.text : C.muted, padding: "0.65rem", cursor: "pointer", fontFamily: mono, fontSize: "0.75rem" }}
                          onClick={() => setFreqDraft(f.value)}
                        >{f.label}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "0.75rem" }}>
                    <div>
                      <label style={s.lbl}>FROM</label>
                      <input style={s.input} type="time" value={startDraft} onChange={e => setStartDraft(e.target.value)} />
                    </div>
                    <div>
                      <label style={s.lbl}>UNTIL</label>
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
                  <div><span style={s.lbl}>FREQUENCY</span><div style={s.val}>{FREQ_OPTIONS.find(f => f.value === data.frequency_minutes)?.label ?? `Every ${data.frequency_minutes} min`}</div></div>
                  <div><span style={s.lbl}>HOURS</span><div style={s.val}>{data.start_time} – {data.end_time}</div></div>
                  <div><span style={s.lbl}>TIMEZONE</span><div style={{ ...s.val, fontSize: "0.8rem", color: C.muted }}>{data.timezone ?? "Auto-detected"}</div></div>
                </div>
              )}
            </div>

            {/* Phone */}
            <div style={s.card}>
              <span style={s.lbl}>PHONE</span>
              <div style={s.val}>{data.phone}</div>
            </div>

            {/* Message history */}
            <div style={{ ...s.card, marginTop: "1.5rem" }}>
              <span style={{ ...s.lbl, marginBottom: "1rem", display: "block" }}>RECENT TEXTS SENT TO YOU</span>
              {msgs.length === 0 ? (
                <p style={{ color: C.muted, fontSize: "0.8rem", margin: 0 }}>No texts sent yet — check-ins will appear here.</p>
              ) : (
                msgs.map((m, i) => (
                  <div key={i} style={{ borderLeft: `2px solid ${C.red}`, paddingLeft: "1rem", marginBottom: "1.25rem" }}>
                    <div style={{ fontSize: "0.85rem", color: C.text, lineHeight: "1.6", marginBottom: "0.25rem" }}>{m.message_text}</div>
                    <div style={{ fontSize: "0.55rem", color: C.muted, letterSpacing: "0.1em" }}>{fmt(m.sent_at)}</div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
