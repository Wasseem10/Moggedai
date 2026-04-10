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
  { id: "study", emoji: "📚", label: "Studying", placeholder: "e.g. Finish studying chapters 4-6 for my bio exam on Friday. No more Netflix." },
  { id: "build", emoji: "💻", label: "Building", placeholder: "e.g. Ship the MVP of my SaaS by Friday. 3 features left. Stop getting distracted." },
  { id: "fitness", emoji: "💪", label: "Fitness", placeholder: "e.g. Hit the gym 5x this week and stick to my meal plan. No more skipping." },
  { id: "work", emoji: "📋", label: "Work", placeholder: "e.g. Finish the quarterly report by Thursday. Stop procrastinating on the data section." },
  { id: "creative", emoji: "🎨", label: "Creative", placeholder: "e.g. Write 1000 words a day on my novel. No more waiting for inspiration." },
  { id: "other", emoji: "🎯", label: "Other", placeholder: "e.g. Be specific — what exactly do you need to stop avoiding?" },
];

const INTENSITIES = [
  { label: "Every 30 min", value: 30, desc: "Maximum pressure", color: "#dc2626" },
  { label: "Every hour", value: 60, desc: "High pressure", color: "#ea580c" },
  { label: "Every 2 hours", value: 120, desc: "Steady pressure", color: "#ca8a04" },
  { label: "Every 3 hours", value: 180, desc: "Light nudges", color: "#16a34a" },
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
    intervalRef.current = setInterval(() => {
      setCurrentMsg((p) => (p + 1) % MESSAGES.length);
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTicker((p) => p + 1), 50);
    return () => clearInterval(t);
  }, []);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const validatePhone = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) { setPhoneError("Enter a valid 10-digit US number"); return false; }
    setPhoneError(""); return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ""),
          goal: `[${category.toUpperCase()}] ${goal}`,
          frequency_minutes: freq,
          start_time: startTime,
          end_time: endTime,
        }),
      });
      if (!res.ok) throw new Error("Something went wrong");
      router.push("/dashboard");
    } catch {
      setSubmitError("Failed to sign up. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const noise = Math.sin(ticker * 0.3) * 2;
  const selectedCategory = CATEGORIES.find(c => c.id === category);

  const S: Record<string, React.CSSProperties> = {
    root: { minHeight: "100vh", background: "#080808", color: "#f0f0f0", fontFamily: "'Space Mono', 'Courier New', monospace", position: "relative", overflow: "hidden" },
    grid: { position: "fixed", inset: 0, backgroundImage: `linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" },
    scanline: { position: "fixed", top: `${(ticker * 2) % 100}%`, left: 0, right: 0, height: "2px", background: "rgba(220,38,38,0.12)", pointerEvents: "none", transition: "none" },
    nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(220,38,38,0.2)", background: "rgba(8,8,8,0.9)", backdropFilter: "blur(8px)" },
    logo: { fontSize: "1.1rem", fontWeight: "700", letterSpacing: "0.15em", color: "#f0f0f0", cursor: "pointer" },
    navBtn: { background: "transparent", border: "1px solid #dc2626", color: "#dc2626", padding: "0.4rem 1rem", fontSize: "0.7rem", letterSpacing: "0.1em", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
    tag: { fontSize: "0.6rem", letterSpacing: "0.25em", color: "#dc2626", border: "1px solid rgba(220,38,38,0.4)", padding: "0.3rem 0.8rem", marginBottom: "2rem", display: "inline-block" },
    onboard: { minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "5rem 1.5rem 3rem", maxWidth: "580px", margin: "0 auto" },
    stepDots: { display: "flex", gap: "6px", marginBottom: "2.5rem" },
    title: { fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: "700", lineHeight: 1.2, marginBottom: "0.5rem" },
    sub: { fontSize: "0.8rem", color: "#555", marginBottom: "2rem", lineHeight: "1.6" },
    label: { fontSize: "0.6rem", letterSpacing: "0.2em", color: "#555", display: "block", marginBottom: "0.5rem" },
    input: { width: "100%", background: "#111", border: "1px solid #222", color: "#f0f0f0", padding: "0.9rem 1rem", fontSize: "1rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
    textarea: { width: "100%", background: "#111", border: "1px solid #222", color: "#f0f0f0", padding: "0.9rem 1rem", fontSize: "0.9rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: "90px", lineHeight: "1.6" },
    primaryBtn: { width: "100%", background: "#dc2626", border: "none", color: "#fff", padding: "1rem", fontSize: "0.85rem", letterSpacing: "0.15em", cursor: "pointer", fontFamily: "inherit", fontWeight: "700", marginTop: "1rem" },
    backBtn: { background: "transparent", border: "none", color: "#444", fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit", padding: "0.5rem 0", letterSpacing: "0.1em", marginTop: "0.75rem", display: "block" },
    errorMsg: { fontSize: "0.7rem", color: "#dc2626", marginTop: "0.4rem" },
    timeRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1.5rem" },
  };

  const stepDot = (active: boolean, done: boolean): React.CSSProperties => ({
    height: "3px", flex: 1,
    background: done || active ? "#dc2626" : "#1e1e1e",
    opacity: active ? 1 : done ? 0.5 : 1,
    transition: "all 0.3s",
  });

  const catBtn = (selected: boolean): React.CSSProperties => ({
    background: selected ? "rgba(220,38,38,0.12)" : "#111",
    border: selected ? "1px solid #dc2626" : "1px solid #1e1e1e",
    color: selected ? "#f0f0f0" : "#555",
    padding: "0.9rem 0.75rem",
    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
    transition: "all 0.15s",
  });

  const intensityBtn = (selected: boolean, color: string): React.CSSProperties => ({
    background: selected ? `${color}18` : "#111",
    border: selected ? `1px solid ${color}` : "1px solid #1e1e1e",
    color: selected ? "#f0f0f0" : "#555",
    padding: "1rem", cursor: "pointer", fontFamily: "inherit",
    textAlign: "left", transition: "all 0.15s",
  });

  if (page === "onboard") {
    return (
      <div style={S.root}>
        <div style={S.grid} />
        <nav style={S.nav}>
          <div style={S.logo} onClick={() => { setPage("landing"); setStep(1); }}>MOGGED<span style={{ color: "#dc2626" }}>AI</span></div>
        </nav>
        <div style={S.onboard}>
          <div style={S.stepDots}>
            {[1, 2, 3, 4].map((s) => <div key={s} style={stepDot(s === step, s < step)} />)}
          </div>

          {/* STEP 1 — Phone */}
          {step === 1 && (
            <div>
              <div style={S.tag}>STEP 01 / 04</div>
              <h2 style={S.title}>your number.<br /><span style={{ color: "#dc2626" }}>no excuses.</span></h2>
              <p style={S.sub}>We&apos;ll text you here. US numbers only. Make sure it&apos;s real.</p>
              <label style={S.label}>PHONE NUMBER</label>
              <input
                style={{ ...S.input, borderColor: phoneError ? "#dc2626" : "#222" }}
                type="tel" placeholder="(555) 000-0000"
                value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))}
              />
              {phoneError && <p style={S.errorMsg}>{phoneError}</p>}
              <button style={S.primaryBtn} onClick={() => { if (validatePhone()) setStep(2); }}>
                LOCK IN →
              </button>
            </div>
          )}

          {/* STEP 2 — Category */}
          {step === 2 && (
            <div>
              <div style={S.tag}>STEP 02 / 04</div>
              <h2 style={S.title}>what are you<br /><span style={{ color: "#dc2626" }}>avoiding?</span></h2>
              <p style={S.sub}>Pick what you keep procrastinating on.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "1.5rem" }}>
                {CATEGORIES.map((c) => (
                  <button key={c.id} style={catBtn(category === c.id)} onClick={() => setCategory(c.id)}>
                    <div style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>{c.emoji}</div>
                    <div style={{ fontSize: "0.8rem", fontWeight: "700", letterSpacing: "0.05em" }}>{c.label}</div>
                  </button>
                ))}
              </div>
              <button
                style={{ ...S.primaryBtn, opacity: !category ? 0.4 : 1 }}
                onClick={() => { if (category) setStep(3); }}
                disabled={!category}
              >
                NEXT →
              </button>
              <button style={S.backBtn} onClick={() => setStep(1)}>← back</button>
            </div>
          )}

          {/* STEP 3 — Goal */}
          {step === 3 && (
            <div>
              <div style={S.tag}>STEP 03 / 04</div>
              <h2 style={S.title}>be specific.<br /><span style={{ color: "#dc2626" }}>no vague goals.</span></h2>
              <p style={S.sub}>The more specific you are, the harder we&apos;ll push. Vague goals get ignored.</p>
              <label style={S.label}>{selectedCategory?.emoji} YOUR {selectedCategory?.label.toUpperCase()} GOAL</label>
              <textarea
                style={S.textarea}
                placeholder={selectedCategory?.placeholder}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <div style={{ fontSize: "0.65rem", color: goal.length > 20 ? "#dc2626" : "#333", textAlign: "right", marginTop: "0.25rem" }}>
                {goal.length > 20 ? "good. keep going." : `${20 - goal.length} more chars to unlock`}
              </div>
              <button
                style={{ ...S.primaryBtn, opacity: goal.trim().length < 20 ? 0.4 : 1 }}
                onClick={() => { if (goal.trim().length >= 20) setStep(4); }}
                disabled={goal.trim().length < 20}
              >
                NEXT →
              </button>
              <button style={S.backBtn} onClick={() => setStep(2)}>← back</button>
            </div>
          )}

          {/* STEP 4 — Schedule */}
          {step === 4 && (
            <div>
              <div style={S.tag}>STEP 04 / 04</div>
              <h2 style={S.title}>how hard should<br /><span style={{ color: "#dc2626" }}>we push you?</span></h2>
              <p style={S.sub}>Pick your check-in frequency. You can change this later.</p>
              <label style={S.label}>CHECK-IN FREQUENCY</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "1.5rem" }}>
                {INTENSITIES.map((f) => (
                  <button key={f.value} style={intensityBtn(freq === f.value, f.color)} onClick={() => setFreq(f.value)}>
                    <div style={{ fontSize: "0.85rem", fontWeight: "700", display: "block", marginBottom: "0.25rem" }}>{f.label}</div>
                    <div style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: freq === f.value ? f.color : "#444" }}>{f.desc}</div>
                  </button>
                ))}
              </div>
              <label style={S.label}>ACTIVE HOURS (when should we text you?)</label>
              <div style={S.timeRow}>
                <div>
                  <label style={{ ...S.label, marginBottom: "0.35rem" }}>FROM</label>
                  <input style={S.input} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div>
                  <label style={{ ...S.label, marginBottom: "0.35rem" }}>UNTIL</label>
                  <input style={S.input} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
              {submitError && <p style={S.errorMsg}>{submitError}</p>}
              <button
                style={{ ...S.primaryBtn, opacity: loading ? 0.6 : 1 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "ACTIVATING..." : "START GETTING MOGGED →"}
              </button>
              <button style={S.backBtn} onClick={() => setStep(3)}>← back</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // LANDING PAGE
  return (
    <div style={S.root}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div style={S.grid} />
      <div style={S.scanline} />
      <nav style={S.nav}>
        <div style={S.logo}>MOGGED<span style={{ color: "#dc2626" }}>AI</span></div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button style={{ ...S.navBtn, borderColor: "#333", color: "#555" }} onClick={() => router.push("/sign-in")}>LOG IN</button>
          <button style={S.navBtn} onClick={() => setPage("onboard")}>GET STARTED</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "5rem 1.5rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={S.tag}>AI ACCOUNTABILITY · SMS · NO MERCY</div>
        <h1 style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)", fontWeight: "700", lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: "0.5rem", transform: `translateX(${noise * 0.3}px)` }}>
          STOP<br /><span style={{ color: "#dc2626" }}>SLACKING.</span><br />START NOW.
        </h1>
        <div style={{ height: "2.5rem", overflow: "hidden", marginBottom: "2rem", marginTop: "1rem", borderLeft: "3px solid #dc2626", paddingLeft: "1rem" }}>
          <p style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)", color: "#888", lineHeight: "2.5rem", margin: 0 }}>{MESSAGES[currentMsg]}</p>
        </div>
        <p style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)", color: "#555", maxWidth: "520px", lineHeight: "1.9", marginBottom: "2.5rem" }}>
          Whether you&apos;re studying, building, working, or training — MoggedAI texts you when you go off track. No app to open. No dashboard to ignore. Just your phone buzzing until you get back to it.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button style={{ background: "#dc2626", border: "none", color: "#fff", padding: "1rem 2.5rem", fontSize: "0.85rem", letterSpacing: "0.15em", cursor: "pointer", fontFamily: "inherit", fontWeight: "700" }} onClick={() => setPage("onboard")}>
            STOP AVOIDING IT →
          </button>
          <button style={{ background: "transparent", border: "1px solid #222", color: "#555", padding: "1rem 1.5rem", fontSize: "0.8rem", letterSpacing: "0.1em", cursor: "pointer", fontFamily: "inherit" }}>
            SEE HOW IT WORKS ↓
          </button>
        </div>

        {/* Phone mockup + stats */}
        <div style={{ marginTop: "5rem", display: "flex", alignItems: "flex-end", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ width: "180px", background: "#111", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "1.25rem 1rem" }}>
            <div style={{ fontSize: "0.5rem", color: "#dc2626", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>MOGGEDAI</div>
            {[currentMsg, (currentMsg + 1) % MESSAGES.length].map((i, idx) => (
              <div key={idx} style={{ background: "#1a1a1a", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px 10px 10px 0", padding: "0.6rem", fontSize: "0.6rem", color: "#ccc", lineHeight: "1.5", marginBottom: "0.4rem", opacity: idx === 0 ? 1 : 0.5 }}>
                {MESSAGES[i]}
                <div style={{ fontSize: "0.45rem", color: "#444", textAlign: "right", marginTop: "0.2rem" }}>just now</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              { num: "8–12", label: "TEXTS PER DAY" },
              { num: "100%", label: "AI-PERSONALIZED" },
              { num: "0", label: "EXCUSES ACCEPTED" },
            ].map((s) => (
              <div key={s.label} style={{ borderLeft: "2px solid #dc2626", paddingLeft: "1rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: "700", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: "0.6rem", color: "#555", letterSpacing: "0.1em", marginTop: "0.2rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* USE CASES */}
      <div style={{ padding: "5rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "#444", marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          WHO IT&apos;S FOR <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "#1a1a1a", border: "1px solid #1a1a1a" }}>
          {[
            { emoji: "📚", who: "Students", line: "Studying for 10 min then on TikTok for 2 hours" },
            { emoji: "💻", who: "Builders", line: "Always 'about to start' their side project" },
            { emoji: "💪", who: "Athletes", line: "Skipping workouts and making excuses" },
            { emoji: "📋", who: "Professionals", line: "Putting off the hard tasks all day" },
            { emoji: "🎨", who: "Creatives", line: "Waiting for motivation that never shows up" },
            { emoji: "🎯", who: "Anyone", line: "Who knows what to do but still doesn't do it" },
          ].map((f) => (
            <div key={f.who} style={{ background: "#080808", padding: "1.75rem" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{f.emoji}</div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.4rem", letterSpacing: "0.05em" }}>{f.who.toUpperCase()}</div>
              <div style={{ fontSize: "0.7rem", color: "#444", lineHeight: "1.6" }}>{f.line}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: "5rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "#444", marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          HOW IT WORKS <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "#1a1a1a", border: "1px solid #1a1a1a" }}>
          {[
            { n: "01", title: "Tell us what you're avoiding", desc: "Study, build, train, work — whatever you keep putting off. Be specific." },
            { n: "02", title: "Set your hours", desc: "Pick when you want to be held accountable. We only text during your active window." },
            { n: "03", title: "AI writes every message", desc: "Every text is unique, references your specific goal, and hits different." },
            { n: "04", title: "Your phone buzzes", desc: "No app to open. No dashboard. Just relentless, personalized accountability." },
          ].map((f) => (
            <div key={f.n} style={{ background: "#080808", padding: "1.75rem" }}>
              <div style={{ fontSize: "0.7rem", color: "#dc2626", fontWeight: "700", marginBottom: "1rem", letterSpacing: "0.1em" }}>{f.n} ——</div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>{f.title.toUpperCase()}</div>
              <div style={{ fontSize: "0.7rem", color: "#444", lineHeight: "1.7" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "4rem 1.5rem 6rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", padding: "3rem 0", margin: "0 0 4rem" }}>
          <p style={{ fontSize: "clamp(1.3rem, 3.5vw, 2.2rem)", fontWeight: "700", lineHeight: 1.3, margin: 0 }}>
            &ldquo;You already know what you should be doing.<br />
            <span style={{ color: "#dc2626" }}>You just need someone to hold you to it.&rdquo;</span>
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <button style={{ background: "#dc2626", border: "none", color: "#fff", padding: "1.25rem 3rem", fontSize: "0.9rem", letterSpacing: "0.15em", cursor: "pointer", fontFamily: "inherit", fontWeight: "700" }} onClick={() => setPage("onboard")}>
            GET MOGGED — IT&apos;S FREE
          </button>
          <p style={{ fontSize: "0.6rem", color: "#2a2a2a", marginTop: "1rem", letterSpacing: "0.1em" }}>
            US numbers only · SMS rates may apply · Text STOP to unsubscribe
          </p>
        </div>
      </div>

      <footer style={{ borderTop: "1px solid #111", padding: "2rem", textAlign: "center", fontSize: "0.6rem", color: "#222", letterSpacing: "0.1em" }}>
        <p style={{ margin: "0 0 0.5rem" }}>MOGGEDAI — AI ACCOUNTABILITY VIA SMS</p>
        <p style={{ margin: 0 }}>© 2026 · BUILT DIFFERENT</p>
      </footer>
    </div>
  );
}
