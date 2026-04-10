"use client";

import { useState, useEffect, useRef } from "react";

const MESSAGES = [
  "bro you've been 'about to start' for 3 hours. get up.",
  "your competition isn't taking breaks. why are you?",
  "you told yourself today would be different. prove it.",
  "every second you waste, someone hungrier is eating your lunch.",
  "log off. phone down. work. now.",
  "you know exactly what you should be doing right now.",
  "discipline is doing it even when you don't feel like it.",
  "the version of you that made it didn't scroll for 2 hours.",
  "stop planning. start building.",
  "you're not tired. you're avoiding it.",
];

const FREQUENCIES = [
  { label: "Every 30 min", value: 30, desc: "Relentless" },
  { label: "Every hour", value: 60, desc: "Aggressive" },
  { label: "Every 2 hours", value: 120, desc: "Standard" },
  { label: "Every 3 hours", value: 180, desc: "Light" },
];

export default function MoggedAI() {
  const [page, setPage] = useState("landing");
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
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

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentMsg((p) => (p + 1) % MESSAGES.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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
    if (digits.length < 10) { setPhoneError("Enter a valid 10-digit number"); return false; }
    setPhoneError("");
    return true;
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
          goal,
          frequency_minutes: freq,
          start_time: startTime,
          end_time: endTime,
        }),
      });
      if (!res.ok) throw new Error("Something went wrong");
      setPage("success");
    } catch {
      setSubmitError("Failed to sign up. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const noise = Math.sin(ticker * 0.3) * 2;

  const styles: Record<string, React.CSSProperties> = {
    root: {
      minHeight: "100vh",
      background: "#080808",
      color: "#f0f0f0",
      fontFamily: "'Space Mono', 'Courier New', monospace",
      position: "relative",
      overflow: "hidden",
    },
    grid: {
      position: "fixed",
      inset: 0,
      backgroundImage: `linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)`,
      backgroundSize: "48px 48px",
      pointerEvents: "none",
    },
    scanline: {
      position: "fixed",
      top: `${(ticker * 2) % 100}%`,
      left: 0,
      right: 0,
      height: "2px",
      background: "rgba(220,38,38,0.15)",
      pointerEvents: "none",
      transition: "none",
    },
    nav: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1.25rem 2rem",
      borderBottom: "1px solid rgba(220,38,38,0.2)",
      background: "rgba(8,8,8,0.9)",
      backdropFilter: "blur(8px)",
    },
    logo: {
      fontSize: "1.1rem",
      fontWeight: "700",
      letterSpacing: "0.15em",
      color: "#f0f0f0",
    },
    logoAccent: { color: "#dc2626" },
    navBtn: {
      background: "transparent",
      border: "1px solid #dc2626",
      color: "#dc2626",
      padding: "0.4rem 1.2rem",
      fontSize: "0.75rem",
      letterSpacing: "0.1em",
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.15s",
    },
    hero: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "8rem 2rem 4rem",
      maxWidth: "900px",
      margin: "0 auto",
      position: "relative",
    },
    tag: {
      fontSize: "0.65rem",
      letterSpacing: "0.25em",
      color: "#dc2626",
      border: "1px solid rgba(220,38,38,0.4)",
      padding: "0.3rem 0.8rem",
      marginBottom: "2rem",
      display: "inline-block",
    },
    h1: {
      fontSize: "clamp(3.5rem, 10vw, 7rem)",
      fontWeight: "700",
      lineHeight: 0.95,
      letterSpacing: "-0.02em",
      marginBottom: "0.5rem",
      transform: `translateX(${noise * 0.3}px)`,
    },
    h1Red: { color: "#dc2626" },
    ticker: {
      height: "2.5rem",
      overflow: "hidden",
      marginBottom: "2.5rem",
      borderLeft: "3px solid #dc2626",
      paddingLeft: "1rem",
    },
    tickerText: {
      fontSize: "clamp(0.8rem, 2vw, 1rem)",
      color: "#888",
      lineHeight: "2.5rem",
    },
    desc: {
      fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
      color: "#666",
      maxWidth: "520px",
      lineHeight: "1.8",
      marginBottom: "3rem",
    },
    ctaRow: {
      display: "flex",
      gap: "1rem",
      alignItems: "center",
      flexWrap: "wrap",
    },
    ctaBtn: {
      background: "#dc2626",
      border: "none",
      color: "#fff",
      padding: "1rem 2.5rem",
      fontSize: "0.85rem",
      letterSpacing: "0.15em",
      cursor: "pointer",
      fontFamily: "inherit",
      fontWeight: "700",
      transition: "all 0.15s",
    },
    ghostBtn: {
      background: "transparent",
      border: "1px solid #333",
      color: "#666",
      padding: "1rem 2rem",
      fontSize: "0.8rem",
      letterSpacing: "0.1em",
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.15s",
    },
    phone: {
      marginTop: "6rem",
      display: "flex",
      alignItems: "flex-end",
      gap: "2rem",
      flexWrap: "wrap",
    },
    phoneFrame: {
      width: "180px",
      background: "#111",
      border: "1px solid #222",
      borderRadius: "16px",
      padding: "1.5rem 1rem",
      position: "relative",
    },
    phoneBubble: {
      background: "#1a1a1a",
      border: "1px solid rgba(220,38,38,0.3)",
      borderRadius: "12px 12px 12px 0",
      padding: "0.75rem",
      fontSize: "0.65rem",
      color: "#ccc",
      lineHeight: "1.5",
      marginBottom: "0.5rem",
    },
    phoneSender: {
      fontSize: "0.55rem",
      color: "#dc2626",
      marginBottom: "0.25rem",
      letterSpacing: "0.1em",
    },
    phoneTime: {
      fontSize: "0.5rem",
      color: "#444",
      textAlign: "right",
      marginTop: "0.25rem",
    },
    stats: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    stat: {
      borderLeft: "2px solid #dc2626",
      paddingLeft: "1rem",
    },
    statNum: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#f0f0f0",
      lineHeight: 1,
    },
    statLabel: {
      fontSize: "0.65rem",
      color: "#555",
      letterSpacing: "0.1em",
      marginTop: "0.25rem",
    },
    section: {
      padding: "6rem 2rem",
      maxWidth: "900px",
      margin: "0 auto",
    },
    sectionTag: {
      fontSize: "0.6rem",
      letterSpacing: "0.3em",
      color: "#555",
      marginBottom: "3rem",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    sectionLine: {
      flex: 1,
      height: "1px",
      background: "#1e1e1e",
    },
    featureGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "1px",
      background: "#1a1a1a",
      border: "1px solid #1a1a1a",
    },
    feature: {
      background: "#080808",
      padding: "2rem",
    },
    featureTitle: {
      fontSize: "0.9rem",
      fontWeight: "700",
      marginBottom: "0.5rem",
      letterSpacing: "0.05em",
    },
    featureDesc: {
      fontSize: "0.75rem",
      color: "#555",
      lineHeight: "1.7",
    },
    bigQuote: {
      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
      fontWeight: "700",
      lineHeight: 1.3,
      color: "#f0f0f0",
      borderTop: "1px solid #1e1e1e",
      borderBottom: "1px solid #1e1e1e",
      padding: "3rem 0",
      margin: "4rem 0",
    },
    footer: {
      borderTop: "1px solid #111",
      padding: "2rem",
      textAlign: "center",
      fontSize: "0.65rem",
      color: "#333",
      letterSpacing: "0.1em",
    },
    onboard: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "6rem 2rem",
      maxWidth: "560px",
      margin: "0 auto",
    },
    stepIndicator: {
      display: "flex",
      gap: "6px",
      marginBottom: "3rem",
    },
    onboardTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      lineHeight: 1.2,
      marginBottom: "0.5rem",
    },
    onboardSub: {
      fontSize: "0.8rem",
      color: "#555",
      marginBottom: "2.5rem",
      lineHeight: "1.6",
    },
    inputGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      fontSize: "0.65rem",
      letterSpacing: "0.2em",
      color: "#555",
      display: "block",
      marginBottom: "0.5rem",
    },
    input: {
      width: "100%",
      background: "#111",
      border: "1px solid #222",
      color: "#f0f0f0",
      padding: "0.9rem 1rem",
      fontSize: "1rem",
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s",
    },
    textarea: {
      width: "100%",
      background: "#111",
      border: "1px solid #222",
      color: "#f0f0f0",
      padding: "0.9rem 1rem",
      fontSize: "0.9rem",
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box",
      resize: "vertical",
      minHeight: "100px",
      lineHeight: "1.6",
    },
    errorMsg: {
      fontSize: "0.7rem",
      color: "#dc2626",
      marginTop: "0.4rem",
    },
    freqGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px",
      marginBottom: "2rem",
    },
    nextBtn: {
      width: "100%",
      background: "#dc2626",
      border: "none",
      color: "#fff",
      padding: "1rem",
      fontSize: "0.85rem",
      letterSpacing: "0.15em",
      cursor: "pointer",
      fontFamily: "inherit",
      fontWeight: "700",
      marginTop: "1rem",
    },
    backBtn: {
      background: "transparent",
      border: "none",
      color: "#444",
      fontSize: "0.75rem",
      cursor: "pointer",
      fontFamily: "inherit",
      padding: "0.5rem 0",
      letterSpacing: "0.1em",
      marginTop: "0.75rem",
      display: "block",
    },
    success: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "4rem 2rem",
    },
    successTitle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "1rem",
    },
    successSub: {
      fontSize: "0.85rem",
      color: "#555",
      maxWidth: "400px",
      lineHeight: "1.8",
      marginBottom: "3rem",
    },
    mockTexts: {
      background: "#111",
      border: "1px solid #1e1e1e",
      borderRadius: "8px",
      padding: "1.5rem",
      maxWidth: "340px",
      width: "100%",
      textAlign: "left",
    },
    mockHeader: {
      fontSize: "0.6rem",
      letterSpacing: "0.15em",
      color: "#444",
      marginBottom: "1rem",
      textAlign: "center",
    },
    mockBubble: {
      background: "#1a1a1a",
      borderRadius: "12px 12px 12px 0",
      padding: "0.75rem 1rem",
      fontSize: "0.8rem",
      color: "#ccc",
      lineHeight: "1.6",
      marginBottom: "0.75rem",
      borderLeft: "2px solid #dc2626",
    },
  };

  const stepDot = (active: boolean, done: boolean): React.CSSProperties => ({
    height: "3px",
    flex: 1,
    background: done ? "#dc2626" : active ? "#dc2626" : "#1e1e1e",
    opacity: active ? 1 : done ? 0.6 : 1,
    transition: "background 0.3s",
  });

  const freqBtn = (selected: boolean): React.CSSProperties => ({
    background: selected ? "rgba(220,38,38,0.1)" : "#111",
    border: selected ? "1px solid #dc2626" : "1px solid #222",
    color: selected ? "#f0f0f0" : "#555",
    padding: "1rem",
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    transition: "all 0.15s",
  });

  const freqDesc = (selected: boolean): React.CSSProperties => ({
    fontSize: "0.65rem",
    color: selected ? "#dc2626" : "#444",
    letterSpacing: "0.1em",
  });

  if (page === "onboard") {
    return (
      <div style={styles.root}>
        <div style={styles.grid} />
        <nav style={styles.nav}>
          <div style={styles.logo}>MOGGED<span style={styles.logoAccent}>AI</span></div>
        </nav>
        <div style={styles.onboard}>
          <div style={styles.stepIndicator}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={stepDot(s === step, s < step)} />
            ))}
          </div>

          {step === 1 && (
            <div>
              <div style={styles.tag}>STEP 01 / 03</div>
              <h2 style={styles.onboardTitle}>your number.<br /><span style={{ color: "#dc2626" }}>no excuses.</span></h2>
              <p style={styles.onboardSub}>We&apos;ll text you here. Make sure it&apos;s real.</p>
              <div style={styles.inputGroup}>
                <label style={styles.label}>PHONE NUMBER (US)</label>
                <input
                  style={{ ...styles.input, borderColor: phoneError ? "#dc2626" : "#222" }}
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                />
                {phoneError && <p style={styles.errorMsg}>{phoneError}</p>}
              </div>
              <button style={styles.nextBtn} onClick={() => { if (validatePhone()) setStep(2); }}>
                LOCK IN →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={styles.tag}>STEP 02 / 03</div>
              <h2 style={styles.onboardTitle}>what are you<br /><span style={{ color: "#dc2626" }}>actually building?</span></h2>
              <p style={styles.onboardSub}>Be specific. We&apos;ll reference this in your texts.</p>
              <div style={styles.inputGroup}>
                <label style={styles.label}>YOUR MISSION</label>
                <textarea
                  style={styles.textarea}
                  placeholder="e.g. Ship the MVP of my SaaS by Friday. 3 features left. No more YouTube."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <button
                style={{ ...styles.nextBtn, opacity: goal.trim().length < 10 ? 0.4 : 1 }}
                onClick={() => { if (goal.trim().length >= 10) setStep(3); }}
                disabled={goal.trim().length < 10}
              >
                NEXT →
              </button>
              <button style={styles.backBtn} onClick={() => setStep(1)}>← back</button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={styles.tag}>STEP 03 / 03</div>
              <h2 style={styles.onboardTitle}>set your<br /><span style={{ color: "#dc2626" }}>punishment schedule.</span></h2>
              <p style={styles.onboardSub}>How often should we check in?</p>
              <label style={styles.label}>FREQUENCY</label>
              <div style={styles.freqGrid}>
                {FREQUENCIES.map((f) => (
                  <button key={f.value} style={freqBtn(freq === f.value)} onClick={() => setFreq(f.value)}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", display: "block", marginBottom: "0.2rem" }}>{f.label}</span>
                    <span style={freqDesc(freq === f.value)}>{f.desc}</span>
                  </button>
                ))}
              </div>
              <label style={styles.label}>ACTIVE HOURS</label>
              <div style={styles.timeRow}>
                <div>
                  <label style={{ ...styles.label, marginBottom: "0.35rem" }}>FROM</label>
                  <input style={styles.input} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div>
                  <label style={{ ...styles.label, marginBottom: "0.35rem" }}>UNTIL</label>
                  <input style={styles.input} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
              {submitError && <p style={styles.errorMsg}>{submitError}</p>}
              <button
                style={{ ...styles.nextBtn, opacity: loading ? 0.6 : 1 }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "ACTIVATING..." : "ACTIVATE →"}
              </button>
              <button style={styles.backBtn} onClick={() => setStep(2)}>← back</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (page === "success") {
    const freqLabel = FREQUENCIES.find((f) => f.value === freq)?.label;
    return (
      <div style={styles.root}>
        <div style={styles.grid} />
        <nav style={styles.nav}>
          <div style={styles.logo}>MOGGED<span style={styles.logoAccent}>AI</span></div>
        </nav>
        <div style={styles.success}>
          <div style={{ fontSize: "3rem", marginBottom: "2rem", color: "#dc2626" }}>⚡</div>
          <h2 style={styles.successTitle}>you&apos;re <span style={{ color: "#dc2626" }}>locked in.</span></h2>
          <p style={styles.successSub}>
            Texts start rolling in {freqLabel?.toLowerCase()} between {startTime} and {endTime}. No way out now.
          </p>
          <div style={styles.mockTexts}>
            <p style={styles.mockHeader}>INCOMING — SAMPLE TEXTS</p>
            {[0, 1, 2].map((i) => (
              <div key={i} style={styles.mockBubble}>
                {MESSAGES[(currentMsg + i) % MESSAGES.length]}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div style={styles.grid} />
      <div style={styles.scanline} />
      <nav style={styles.nav}>
        <div style={styles.logo}>MOGGED<span style={styles.logoAccent}>AI</span></div>
        <button style={styles.navBtn} onClick={() => setPage("onboard")}>GET STARTED</button>
      </nav>
      <div style={styles.hero}>
        <div style={styles.tag}>AI ACCOUNTABILITY · SMS · NO MERCY</div>
        <h1 style={styles.h1}>
          STOP<br /><span style={styles.h1Red}>BEING</span><br />LAZY.
        </h1>
        <div style={styles.ticker}>
          <p style={styles.tickerText}>{MESSAGES[currentMsg]}</p>
        </div>
        <p style={styles.desc}>
          MoggedAI texts you throughout the day when you should be working. No app to open. No dashboard to ignore. Just your phone buzzing until you get back to work.
        </p>
        <div style={styles.ctaRow}>
          <button style={styles.ctaBtn} onClick={() => setPage("onboard")}>START GETTING MOGGED</button>
          <button style={styles.ghostBtn}>SEE HOW IT WORKS ↓</button>
        </div>
        <div style={styles.phone}>
          <div style={styles.phoneFrame}>
            <div style={styles.phoneSender}>MOGGEDAI</div>
            {[currentMsg, (currentMsg + 1) % MESSAGES.length].map((i, idx) => (
              <div key={idx} style={{ ...styles.phoneBubble, opacity: idx === 0 ? 1 : 0.5 }}>
                {MESSAGES[i]}
                <div style={styles.phoneTime}>just now</div>
              </div>
            ))}
          </div>
          <div style={styles.stats}>
            {[
              { num: "8–12", label: "TEXTS PER DAY" },
              { num: "100%", label: "AI-GENERATED SHAME" },
              { num: "0", label: "DAYS OFF" },
            ].map((s) => (
              <div key={s.label} style={styles.stat}>
                <div style={styles.statNum}>{s.num}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTag}>HOW IT WORKS<div style={styles.sectionLine} /></div>
        <div style={styles.featureGrid}>
          {[
            { icon: "01", title: "Set your goal", desc: "Tell us what you're building. Be specific. 'Grind harder' is not a goal." },
            { icon: "02", title: "Pick your schedule", desc: "Every 30 min, hourly, or custom. Set your active hours so we don't text you at 3am." },
            { icon: "03", title: "AI writes the message", desc: "Each text is unique. No repetitive copy-paste. Real, sharp accountability messages." },
            { icon: "04", title: "Your phone buzzes", desc: "No app. No login. Just your phone, relentlessly reminding you what matters." },
          ].map((f) => (
            <div key={f.icon} style={styles.feature}>
              <div style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "#dc2626", fontWeight: "700", marginBottom: "1rem" }}>{f.icon} ——</div>
              <div style={styles.featureTitle}>{f.title.toUpperCase()}</div>
              <div style={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.section, paddingTop: 0 }}>
        <div style={styles.bigQuote}>
          &ldquo;The version of you that succeeded<br />
          <span style={{ color: "#dc2626" }}>didn&apos;t wait to feel motivated.&rdquo;</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <button style={{ ...styles.ctaBtn, padding: "1.25rem 3rem", fontSize: "0.9rem" }} onClick={() => setPage("onboard")}>
            LOCK IN NOW — IT&apos;S FREE
          </button>
          <p style={{ fontSize: "0.65rem", color: "#333", marginTop: "1rem", letterSpacing: "0.1em" }}>
            US numbers only · SMS rates may apply · Text STOP to unsubscribe
          </p>
        </div>
      </div>

      <footer style={styles.footer}>
        <p style={{ margin: "0 0 0.5rem" }}>MOGGEDAI.COM — AI ACCOUNTABILITY VIA SMS</p>
        <p style={{ margin: 0, color: "#222" }}>© 2025 · BUILT DIFFERENT</p>
      </footer>
    </div>
  );
}
