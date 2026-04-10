"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const MESSAGES = [
  "you've been 'about to start' for 3 hours. get up.",
  "your competition isn't taking breaks. why are you?",
  "you told yourself today would be different. prove it.",
  "every second you waste, someone else is getting ahead.",
  "log off. phone down. get back to it. now.",
  "you know exactly what you should be doing right now.",
  "discipline is doing it even when you don't feel like it.",
  "the version of you that made it didn't scroll for 2 hours.",
  "stop planning. start doing.",
  "you're not tired. you're avoiding it.",
  "one hour of real focus beats 5 hours of pretending to work.",
  "nobody is coming to save you. get back to work.",
];

const CATEGORIES = [
  { id: "studying", emoji: "📚", label: "Studying" },
  { id: "building", emoji: "💻", label: "Building" },
  { id: "fitness", emoji: "💪", label: "Fitness" },
  { id: "work", emoji: "📋", label: "Work" },
  { id: "creative", emoji: "🎨", label: "Creative" },
  { id: "other", emoji: "🎯", label: "Other" },
];

const PLACEHOLDERS: Record<string, string> = {
  studying: "e.g. Study chapters 4-6 for my bio exam Friday. No YouTube until it's done.",
  building: "e.g. Ship the MVP by Friday. 3 features left. Stop getting distracted.",
  fitness: "e.g. Hit the gym 5x this week. No more skipping leg day.",
  work: "e.g. Finish the Q2 report by Thursday. Stop avoiding the data section.",
  creative: "e.g. Write 1000 words a day on my novel. No more waiting for inspiration.",
  other: "Be specific — what exactly do you need to stop avoiding?",
};

const INTENSITIES = [
  { label: "Every 30 min", value: 30, desc: "Maximum pressure", color: "#dc2626" },
  { label: "Every hour", value: 60, desc: "High pressure", color: "#ea580c" },
  { label: "Every 2 hrs", value: 120, desc: "Steady nudges", color: "#ca8a04" },
  { label: "Every 3 hrs", value: 180, desc: "Light touch", color: "#16a34a" },
];

export default function MoggedAI() {
  const [page, setPage] = useState("landing");
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [freq, setFreq] = useState(60);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("22:00");
  const [currentMsg, setCurrentMsg] = useState(0);
  const [ticker, setTicker] = useState(0);
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  useEffect(() => {
    intervalRef.current = setInterval(() => setCurrentMsg(p => (p + 1) % MESSAGES.length), 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTicker(p => p + 1), 50);
    return () => clearInterval(t);
  }, []);

  const formatPhone = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  };

  const validatePhone = () => {
    if (phone.replace(/\D/g, "").length < 10) { setPhoneError("Enter a valid 10-digit US number"); return false; }
    setPhoneError(""); return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ""),
          goal: `[${category.toUpperCase()}] ${goal}`,
          frequency_minutes: freq,
          start_time: startTime,
          end_time: endTime,
          timezone,
        }),
      });
      if (!res.ok) throw new Error("failed");
      router.push("/dashboard");
    } catch {
      setSubmitError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const noise = Math.sin(ticker * 0.3) * 2;

  // ─── SHARED STYLES ────────────────────────────────────────────────────────
  const root: React.CSSProperties = { minHeight: "100vh", background: "#080808", color: "#f0f0f0", fontFamily: "'Space Mono', 'Courier New', monospace" };
  const grid: React.CSSProperties = { position: "fixed", inset: 0, backgroundImage: `linear-gradient(rgba(220,38,38,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(220,38,38,0.04) 1px,transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" };
  const nav: React.CSSProperties = { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(220,38,38,0.2)", background: "rgba(8,8,8,0.95)", backdropFilter: "blur(8px)" };
  const logoStyle: React.CSSProperties = { fontSize: "1.1rem", fontWeight: "700", letterSpacing: "0.15em", color: "#f0f0f0", cursor: "pointer" };
  const navBtn: React.CSSProperties = { background: "transparent", border: "1px solid #dc2626", color: "#dc2626", padding: "0.4rem 1rem", fontSize: "0.7rem", letterSpacing: "0.1em", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" };
  const tag: React.CSSProperties = { fontSize: "0.6rem", letterSpacing: "0.25em", color: "#dc2626", border: "1px solid rgba(220,38,38,0.4)", padding: "0.3rem 0.8rem", marginBottom: "1.5rem", display: "inline-block" };
  const primaryBtn = (disabled = false): React.CSSProperties => ({ width: "100%", background: "#dc2626", border: "none", color: "#fff", padding: "1rem", fontSize: "0.85rem", letterSpacing: "0.15em", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", fontWeight: "700", marginTop: "1rem", opacity: disabled ? 0.4 : 1 });
  const backBtn: React.CSSProperties = { background: "transparent", border: "none", color: "#444", fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit", padding: "0.5rem 0", letterSpacing: "0.1em", marginTop: "0.5rem", display: "block" };
  const inputStyle: React.CSSProperties = { width: "100%", background: "#111", border: "1px solid #222", color: "#f0f0f0", padding: "0.9rem 1rem", fontSize: "1rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { fontSize: "0.6rem", letterSpacing: "0.2em", color: "#555", display: "block", marginBottom: "0.5rem" };

  // ─── ONBOARDING ────────────────────────────────────────────────────────────
  if (page === "onboard") {
    return (
      <div style={root}>
        <div style={grid} />
        <nav style={nav}>
          <div style={logoStyle} onClick={() => { setPage("landing"); setStep(1); setCategory(""); setGoal(""); }}>
            MOGGED<span style={{ color: "#dc2626" }}>AI</span>
          </div>
        </nav>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "5rem 1.5rem 3rem", maxWidth: "560px", margin: "0 auto" }}>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "2.5rem" }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ height: "3px", flex: 1, background: s <= step ? "#dc2626" : "#1e1e1e", opacity: s < step ? 0.5 : 1, transition: "all 0.3s" }} />
            ))}
          </div>

          {/* ── STEP 1: Phone ── */}
          {step === 1 && (
            <div>
              <div style={tag}>STEP 01 / 03</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: "700", lineHeight: 1.15, marginBottom: "0.5rem" }}>
                your number.<br /><span style={{ color: "#dc2626" }}>no excuses.</span>
              </h2>
              <p style={{ fontSize: "0.8rem", color: "#555", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                US numbers only. We&apos;ll text you here directly.
              </p>
              <label style={labelStyle}>PHONE NUMBER</label>
              <input
                style={{ ...inputStyle, borderColor: phoneError ? "#dc2626" : "#222", fontSize: "1.2rem" }}
                type="tel" placeholder="(555) 000-0000"
                value={phone} onChange={e => setPhone(formatPhone(e.target.value))}
                onKeyDown={e => e.key === "Enter" && validatePhone() && setStep(2)}
                autoFocus
              />
              {phoneError && <p style={{ fontSize: "0.7rem", color: "#dc2626", marginTop: "0.4rem" }}>{phoneError}</p>}
              <button style={primaryBtn()} onClick={() => validatePhone() && setStep(2)}>NEXT →</button>
            </div>
          )}

          {/* ── STEP 2: Category + Goal ── */}
          {step === 2 && (
            <div>
              <div style={tag}>STEP 02 / 03</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: "700", lineHeight: 1.15, marginBottom: "0.5rem" }}>
                what are you<br /><span style={{ color: "#dc2626" }}>avoiding?</span>
              </h2>
              <p style={{ fontSize: "0.8rem", color: "#555", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                Pick a category, then be specific. We&apos;ll reference this in every text.
              </p>

              {/* Category pills */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "1.25rem" }}>
                {CATEGORIES.map(c => (
                  <button key={c.id}
                    style={{ background: category === c.id ? "rgba(220,38,38,0.12)" : "#111", border: category === c.id ? "1px solid #dc2626" : "1px solid #1e1e1e", color: category === c.id ? "#f0f0f0" : "#555", padding: "0.75rem 0.5rem", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "center" }}
                    onClick={() => setCategory(c.id)}
                  >
                    <div style={{ fontSize: "1.1rem", marginBottom: "0.2rem" }}>{c.emoji}</div>
                    <div style={{ fontSize: "0.65rem", fontWeight: "700", letterSpacing: "0.05em" }}>{c.label}</div>
                  </button>
                ))}
              </div>

              {/* Goal input — appears after category is picked */}
              {category && (
                <div style={{ animation: "fadeIn 0.2s ease" }}>
                  <label style={labelStyle}>YOUR SPECIFIC GOAL</label>
                  <textarea
                    style={{ width: "100%", background: "#111", border: "1px solid #222", color: "#f0f0f0", padding: "0.9rem 1rem", fontSize: "0.9rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "none", minHeight: "90px", lineHeight: "1.6", borderColor: goal.length > 15 ? "#dc2626" : "#222", transition: "border-color 0.2s" }}
                    placeholder={PLACEHOLDERS[category]}
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    autoFocus
                  />
                  <div style={{ fontSize: "0.6rem", color: goal.length > 15 ? "#dc2626" : "#333", textAlign: "right", marginTop: "0.2rem" }}>
                    {goal.length > 15 ? "✓ specific enough" : `${15 - goal.length} more chars needed`}
                  </div>
                </div>
              )}

              <button style={primaryBtn(!category || goal.trim().length < 15)} onClick={() => { if (category && goal.trim().length >= 15) setStep(3); }} disabled={!category || goal.trim().length < 15}>
                NEXT →
              </button>
              <button style={backBtn} onClick={() => setStep(1)}>← back</button>
            </div>
          )}

          {/* ── STEP 3: Schedule ── */}
          {step === 3 && (
            <div>
              <div style={tag}>STEP 03 / 03</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: "700", lineHeight: 1.15, marginBottom: "0.5rem" }}>
                how hard should<br /><span style={{ color: "#dc2626" }}>we push you?</span>
              </h2>
              <p style={{ fontSize: "0.8rem", color: "#555", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                Pick your check-in frequency. You can reply to any text and our AI will coach you back.
              </p>

              <label style={labelStyle}>CHECK-IN FREQUENCY</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "1.5rem" }}>
                {INTENSITIES.map(f => (
                  <button key={f.value}
                    style={{ background: freq === f.value ? `${f.color}18` : "#111", border: freq === f.value ? `1px solid ${f.color}` : "1px solid #1e1e1e", color: freq === f.value ? "#f0f0f0" : "#555", padding: "1rem", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.15s" }}
                    onClick={() => setFreq(f.value)}
                  >
                    <div style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.2rem" }}>{f.label}</div>
                    <div style={{ fontSize: "0.6rem", color: freq === f.value ? f.color : "#333", letterSpacing: "0.08em" }}>{f.desc}</div>
                  </button>
                ))}
              </div>

              <label style={labelStyle}>ACTIVE HOURS <span style={{ color: "#333" }}>(we won&apos;t text outside this window)</span></label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1rem" }}>
                <div>
                  <label style={{ ...labelStyle, marginBottom: "0.3rem" }}>FROM</label>
                  <input style={inputStyle} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
                <div>
                  <label style={{ ...labelStyle, marginBottom: "0.3rem" }}>UNTIL</label>
                  <input style={inputStyle} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
              </div>
              <p style={{ fontSize: "0.6rem", color: "#333", marginBottom: "0.5rem" }}>
                ⚡ Timezone auto-detected · Reply to any text for AI coaching · Text STOP to unsubscribe
              </p>

              {submitError && <p style={{ fontSize: "0.7rem", color: "#dc2626", margin: "0.4rem 0" }}>{submitError}</p>}
              <button style={primaryBtn(loading)} onClick={handleSubmit} disabled={loading}>
                {loading ? "ACTIVATING..." : "START GETTING MOGGED →"}
              </button>
              <button style={backBtn} onClick={() => setStep(2)}>← back</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── LANDING PAGE ──────────────────────────────────────────────────────────
  return (
    <div style={root}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div style={grid} />
      <div style={{ position: "fixed", top: `${(ticker * 2) % 100}%`, left: 0, right: 0, height: "2px", background: "rgba(220,38,38,0.1)", pointerEvents: "none", transition: "none" }} />

      <nav style={nav}>
        <div style={logoStyle}>MOGGED<span style={{ color: "#dc2626" }}>AI</span></div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button style={{ ...navBtn, borderColor: "#333", color: "#555" }} onClick={() => router.push("/sign-in")}>LOG IN</button>
          <button style={navBtn} onClick={() => setPage("onboard")}>GET STARTED</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "5rem 1.5rem 2rem", maxWidth: "920px", margin: "0 auto" }}>
        <div style={tag}>AI ACCOUNTABILITY · SMS · NO MERCY</div>
        <h1 style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)", fontWeight: "700", lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: "1rem", transform: `translateX(${noise * 0.3}px)` }}>
          STOP<br /><span style={{ color: "#dc2626" }}>SLACKING.</span><br />START NOW.
        </h1>
        <div style={{ height: "2.5rem", overflow: "hidden", marginBottom: "1.5rem", borderLeft: "3px solid #dc2626", paddingLeft: "1rem" }}>
          <p style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)", color: "#777", lineHeight: "2.5rem", margin: 0 }}>{MESSAGES[currentMsg]}</p>
        </div>
        <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: "#555", maxWidth: "500px", lineHeight: "1.9", marginBottom: "2rem" }}>
          Whether you&apos;re studying, building, working out, or creating — MoggedAI texts you when you go off track. Reply to any text and our AI coaches you back. No app. Just your phone buzzing until you get back to it.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "4rem" }}>
          <button style={{ background: "#dc2626", border: "none", color: "#fff", padding: "1rem 2.5rem", fontSize: "0.85rem", letterSpacing: "0.15em", cursor: "pointer", fontFamily: "inherit", fontWeight: "700" }} onClick={() => setPage("onboard")}>
            STOP AVOIDING IT →
          </button>
        </div>

        {/* Phone mockup + stats */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2.5rem", flexWrap: "wrap" }}>
          <div style={{ width: "190px", background: "#0e0e0e", border: "1px solid #1e1e1e", borderRadius: "18px", padding: "1.25rem 1rem" }}>
            <div style={{ fontSize: "0.5rem", color: "#dc2626", marginBottom: "0.75rem", letterSpacing: "0.15em" }}>MOGGEDAI</div>
            {[currentMsg, (currentMsg + 1) % MESSAGES.length].map((i, idx) => (
              <div key={idx} style={{ background: "#161616", border: "1px solid rgba(220,38,38,0.15)", borderRadius: "10px 10px 10px 0", padding: "0.65rem 0.75rem", fontSize: "0.6rem", color: "#ccc", lineHeight: "1.5", marginBottom: "0.5rem", opacity: idx === 0 ? 1 : 0.45 }}>
                {MESSAGES[i]}
                <div style={{ fontSize: "0.45rem", color: "#333", textAlign: "right", marginTop: "0.25rem" }}>just now</div>
              </div>
            ))}
            {/* Reply bubble */}
            <div style={{ background: "#dc262622", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "10px 10px 0 10px", padding: "0.5rem 0.75rem", fontSize: "0.55rem", color: "#dc2626", textAlign: "right", marginTop: "0.25rem" }}>
              ok i&apos;m back on it
              <div style={{ fontSize: "0.45rem", color: "#555", marginTop: "0.2rem" }}>you · just now</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[{ num: "8–12", label: "TEXTS PER DAY" }, { num: "2-WAY", label: "AI COACHING" }, { num: "0", label: "EXCUSES ACCEPTED" }].map(s => (
              <div key={s.label} style={{ borderLeft: "2px solid #dc2626", paddingLeft: "1rem" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: "700", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: "0.6rem", color: "#444", letterSpacing: "0.1em", marginTop: "0.2rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHO IT'S FOR */}
      <div style={{ padding: "5rem 1.5rem", maxWidth: "920px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "#333", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          WHO IT&apos;S FOR <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1px", background: "#151515", border: "1px solid #151515" }}>
          {[
            { emoji: "📚", who: "Students", line: "Studying for 10 min then on TikTok for 2 hours." },
            { emoji: "💻", who: "Builders", line: "Always 'about to start' the side project." },
            { emoji: "💪", who: "Athletes", line: "Skipping workouts and making excuses." },
            { emoji: "📋", who: "Professionals", line: "Putting off the hard work all day long." },
            { emoji: "🎨", who: "Creatives", line: "Waiting for motivation that never arrives." },
            { emoji: "🎯", who: "Anyone", line: "Who knows what to do and still doesn't do it." },
          ].map(f => (
            <div key={f.who} style={{ background: "#080808", padding: "1.5rem 1.25rem" }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "0.6rem" }}>{f.emoji}</div>
              <div style={{ fontSize: "0.8rem", fontWeight: "700", marginBottom: "0.35rem", letterSpacing: "0.05em" }}>{f.who.toUpperCase()}</div>
              <div style={{ fontSize: "0.7rem", color: "#3a3a3a", lineHeight: "1.6" }}>{f.line}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: "0 1.5rem 5rem", maxWidth: "920px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "#333", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          HOW IT WORKS <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1px", background: "#151515", border: "1px solid #151515" }}>
          {[
            { n: "01", title: "Enter your goal", desc: "Tell us what you keep putting off. Be specific — we'll reference it in every text." },
            { n: "02", title: "Set your hours", desc: "Pick when to be held accountable. We only text during your active window." },
            { n: "03", title: "Get texts", desc: "Every message is AI-written, unique, and references your exact goal." },
            { n: "04", title: "Reply back", desc: "Respond to any text. The AI coaches you based on what you say." },
          ].map(f => (
            <div key={f.n} style={{ background: "#080808", padding: "1.5rem 1.25rem" }}>
              <div style={{ fontSize: "0.7rem", color: "#dc2626", fontWeight: "700", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>{f.n} ——</div>
              <div style={{ fontSize: "0.8rem", fontWeight: "700", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>{f.title.toUpperCase()}</div>
              <div style={{ fontSize: "0.7rem", color: "#3a3a3a", lineHeight: "1.6" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: "3rem 1.5rem 6rem", maxWidth: "920px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ borderTop: "1px solid #151515", borderBottom: "1px solid #151515", padding: "2.5rem 0", marginBottom: "3rem" }}>
          <p style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: "700", lineHeight: 1.4, margin: 0 }}>
            &ldquo;You know what you should be doing.<br />
            <span style={{ color: "#dc2626" }}>You just need someone to hold you to it.&rdquo;</span>
          </p>
        </div>
        <button style={{ background: "#dc2626", border: "none", color: "#fff", padding: "1.1rem 3rem", fontSize: "0.9rem", letterSpacing: "0.15em", cursor: "pointer", fontFamily: "inherit", fontWeight: "700" }} onClick={() => setPage("onboard")}>
          GET MOGGED — IT&apos;S FREE
        </button>
        <p style={{ fontSize: "0.6rem", color: "#1e1e1e", marginTop: "1rem", letterSpacing: "0.08em" }}>
          US numbers only · Reply STOP to unsubscribe anytime
        </p>
      </div>

      <footer style={{ borderTop: "1px solid #111", padding: "1.5rem", textAlign: "center", fontSize: "0.6rem", color: "#1e1e1e", letterSpacing: "0.1em" }}>
        MOGGEDAI — AI ACCOUNTABILITY VIA SMS · © 2026
      </footer>
    </div>
  );
}
