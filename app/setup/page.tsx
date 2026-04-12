"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MONO = "'Space Mono','Courier New',monospace";

const INTENSITIES = [
  { label: "Every 30 min", value: 30,  desc: "Relentless" },
  { label: "Every hour",   value: 60,  desc: "Aggressive" },
  { label: "Every 2 hrs",  value: 120, desc: "Steady" },
  { label: "Every 3 hrs",  value: 180, desc: "Light" },
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep]           = useState(1);
  const [phone, setPhone]         = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [freq, setFreq]           = useState(60);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime]     = useState("22:00");
  const [consent, setConsent]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
    return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  };

  const validatePhone = () => {
    if (phone.replace(/\D/g,"").length < 10) {
      setPhoneError("Enter a valid 10-digit US number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `+1${phone.replace(/\D/g,"")}`,
          frequency_minutes: freq,
          start_time: startTime,
          end_time: endTime,
          timezone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const root: React.CSSProperties = {
    minHeight: "100vh",
    background: "var(--c-root)",
    color: "var(--c-text)",
    fontFamily: MONO,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1.5rem",
  };

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: "480px",
  };

  const inputS: React.CSSProperties = {
    width: "100%",
    background: "var(--c-input)",
    border: "1px solid var(--c-input-bdr)",
    color: "var(--c-text)",
    padding: "0.9rem 1rem",
    fontSize: "1rem",
    fontFamily: MONO,
    outline: "none",
    boxSizing: "border-box",
    borderRadius: 0,
  };

  const lbl: React.CSSProperties = {
    fontSize: "0.55rem",
    letterSpacing: "0.2em",
    color: "var(--c-text3)",
    display: "block",
    marginBottom: "0.5rem",
  };

  return (
    <div style={root}>
      <div style={card}>

        {/* Logo */}
        <div style={{ fontSize: "1rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "2.5rem", textAlign: "center" }}>
          MOGGED<span style={{ color: "#0ea5e9" }}>AI</span>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "2rem" }}>
          {[1, 2].map(s => (
            <div key={s} style={{ height: "3px", flex: 1, background: s <= step ? "#0ea5e9" : "var(--c-border)", transition: "all 0.3s", opacity: s < step ? 0.5 : 1 }} />
          ))}
        </div>

        {/* ── STEP 1: Phone ── */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: "0.5rem", letterSpacing: "0.25em", color: "#0ea5e9", border: "1px solid rgba(14,165,233,0.4)", padding: "0.3rem 0.8rem", marginBottom: "1.25rem", display: "inline-block" }}>
              STEP 01 / 02
            </div>
            <h1 style={{ fontSize: "clamp(1.6rem,5vw,2.2rem)", fontWeight: "700", lineHeight: 1.15, marginBottom: "0.5rem", marginTop: 0 }}>
              Your number.<br />
              <span style={{ color: "#0ea5e9" }}>No excuses.</span>
            </h1>
            <p style={{ fontSize: "0.78rem", color: "var(--c-text3)", marginBottom: "1.75rem", lineHeight: "1.7" }}>
              This is where your AI coach will text you every day. US numbers only.
            </p>
            <label style={lbl}>PHONE NUMBER</label>
            <input
              style={{ ...inputS, fontSize: "1.3rem", borderColor: phoneError ? "#0ea5e9" : "var(--c-input-bdr)" }}
              type="tel"
              placeholder="(555) 000-0000"
              value={phone}
              onChange={e => setPhone(formatPhone(e.target.value))}
              onKeyDown={e => e.key === "Enter" && validatePhone() && setStep(2)}
              autoFocus
            />
            {phoneError && <p style={{ fontSize: "0.7rem", color: "#0ea5e9", marginTop: "0.4rem", marginBottom: 0 }}>{phoneError}</p>}
            <button
              onClick={() => validatePhone() && setStep(2)}
              style={{ width: "100%", background: "#0ea5e9", border: "none", color: "#fff", padding: "1rem", fontSize: "0.85rem", letterSpacing: "0.15em", cursor: "pointer", fontFamily: MONO, fontWeight: "700", marginTop: "1.25rem" }}
            >
              NEXT →
            </button>
          </div>
        )}

        {/* ── STEP 2: Schedule + Consent ── */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: "0.5rem", letterSpacing: "0.25em", color: "#0ea5e9", border: "1px solid rgba(14,165,233,0.4)", padding: "0.3rem 0.8rem", marginBottom: "1.25rem", display: "inline-block" }}>
              STEP 02 / 02
            </div>
            <h1 style={{ fontSize: "clamp(1.6rem,5vw,2.2rem)", fontWeight: "700", lineHeight: 1.15, marginBottom: "0.5rem", marginTop: 0 }}>
              When should we<br />
              <span style={{ color: "#0ea5e9" }}>check in?</span>
            </h1>
            <p style={{ fontSize: "0.78rem", color: "var(--c-text3)", marginBottom: "1.75rem", lineHeight: "1.7" }}>
              Set your active hours. You&apos;ll add your missions next inside the dashboard.
            </p>

            <label style={lbl}>CHECK-IN FREQUENCY</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "1.5rem" }}>
              {INTENSITIES.map(f => (
                <button key={f.value}
                  onClick={() => setFreq(f.value)}
                  style={{
                    background: freq === f.value ? "rgba(14,165,233,0.12)" : "var(--c-input)",
                    border: `1px solid ${freq === f.value ? "#0ea5e9" : "var(--c-input-bdr)"}`,
                    color: freq === f.value ? "var(--c-text)" : "var(--c-text3)",
                    padding: "0.9rem 1rem", cursor: "pointer", fontFamily: MONO,
                    textAlign: "left", transition: "all 0.15s", borderRadius: 0,
                  }}
                >
                  <div style={{ fontSize: "0.78rem", fontWeight: "700", marginBottom: "0.2rem" }}>{f.label}</div>
                  <div style={{ fontSize: "0.55rem", color: freq === f.value ? "#0ea5e9" : "var(--c-text3)" }}>{f.desc}</div>
                </button>
              ))}
            </div>

            <label style={lbl}>ACTIVE HOURS</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "0.75rem" }}>
              <div>
                <label style={{ ...lbl, marginBottom: "0.3rem" }}>FROM</label>
                <input style={inputS} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
              <div>
                <label style={{ ...lbl, marginBottom: "0.3rem" }}>UNTIL</label>
                <input style={inputS} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </div>
            <p style={{ fontSize: "0.55rem", color: "var(--c-text3)", marginBottom: "1.25rem", letterSpacing: "0.05em" }}>
              ⚡ Timezone auto-detected · Reply DONE to complete · Text STOP to unsubscribe
            </p>

            {/* SMS Consent */}
            <div
              onClick={() => setConsent(c => !c)}
              style={{ background: "var(--c-s1)", border: `1px solid ${consent ? "#0ea5e9" : "var(--c-input-bdr)"}`, padding: "1rem", marginBottom: "1.25rem", cursor: "pointer", transition: "all 0.15s" }}
            >
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: "16px", height: "16px", border: `2px solid ${consent ? "#0ea5e9" : "var(--c-text3)"}`, background: consent ? "#0ea5e9" : "transparent", flexShrink: 0, marginTop: "1px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                  {consent && <span style={{ color: "#fff", fontSize: "10px", fontWeight: "700", lineHeight: 1 }}>✓</span>}
                </div>
                <p style={{ fontSize: "0.62rem", color: "var(--c-text3)", lineHeight: "1.7", margin: 0 }}>
                  I agree to receive recurring automated SMS messages from MoggedAI at the number provided. Msg &amp; data rates may apply. Reply STOP to unsubscribe anytime.{" "}
                  <a href="/consent" target="_blank" style={{ color: "#0ea5e9", textDecoration: "none" }} onClick={e => e.stopPropagation()}>SMS Policy</a>
                </p>
              </div>
            </div>

            {error && <p style={{ fontSize: "0.7rem", color: "#ef4444", marginBottom: "0.75rem" }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !consent}
              style={{ width: "100%", background: "#0ea5e9", border: "none", color: "#fff", padding: "1rem", fontSize: "0.85rem", letterSpacing: "0.15em", cursor: loading || !consent ? "not-allowed" : "pointer", fontFamily: MONO, fontWeight: "700", opacity: !consent ? 0.4 : 1, transition: "opacity 0.2s" }}
            >
              {loading ? "SETTING UP..." : "GO TO DASHBOARD →"}
            </button>
            <button
              onClick={() => setStep(1)}
              style={{ background: "none", border: "none", color: "var(--c-text3)", fontSize: "0.65rem", cursor: "pointer", fontFamily: MONO, padding: "0.75rem 0", letterSpacing: "0.1em", display: "block", marginTop: "0.25rem" }}
            >
              ← back
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
