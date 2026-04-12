"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const MESSAGES = [
  "you've been 'about to start' for 3 hours. get up.",
  "your competition isn't taking breaks. why are you?",
  "you told yourself today would be different. prove it.",
  "every second you waste, someone else is getting ahead.",
  "log off. phone down. get back to it. now.",
  "discipline is doing it even when you don't feel like it.",
  "stop planning. start doing.",
  "you're not tired. you're avoiding it.",
  "one hour of real focus beats 5 hours of pretending to work.",
  "nobody is coming to save you. get back to work.",
];

const COACH_STYLES = [
  { id: "brutal", emoji: "🔥", label: "Brutal", desc: "No mercy. No sympathy. Get called out hard." },
  { id: "direct", emoji: "💪", label: "Direct", desc: "Sharp, clear, no BS. Just get it done." },
  { id: "motivating", emoji: "⚡", label: "Motivating", desc: "Intense but positive. Pushed forward, not down." },
];

const COMMON_HABITS = [
  { name: "Study", emoji: "📚" },
  { name: "Gym", emoji: "💪" },
  { name: "Work", emoji: "💼" },
  { name: "Read", emoji: "📖" },
  { name: "Meditate", emoji: "🧘" },
  { name: "Sleep Early", emoji: "😴" },
  { name: "Diet", emoji: "🥗" },
  { name: "Side Project", emoji: "🚀" },
  { name: "No Phone", emoji: "📵" },
  { name: "Water", emoji: "💧" },
];

const INTENSITIES = [
  { label: "Every 30 min", value: 30, desc: "Relentless" },
  { label: "Every hour", value: 60, desc: "Aggressive" },
  { label: "Every 2 hrs", value: 120, desc: "Steady" },
  { label: "Every 3 hrs", value: 180, desc: "Light" },
];

type Habit = { name: string; emoji: string };

export default function MoggedAI() {
  const [page, setPage]         = useState("landing");
  const [step, setStep]         = useState(1);
  const [phone, setPhone]       = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [coachStyle, setCoachStyle] = useState("");
  const [habits, setHabits]     = useState<Habit[]>([]);
  const [customHabit, setCustomHabit] = useState("");
  const [freq, setFreq]         = useState(60);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime]   = useState("22:00");
  const [loading, setLoading]   = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [smsConsent, setSmsConsent]   = useState(false);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [ticker, setTicker]     = useState(0);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setCurrentMsg(p => (p + 1) % MESSAGES.length), 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTicker(p => p + 1), 50);
    return () => clearInterval(t);
  }, []);

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
    return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  };

  const validatePhone = () => {
    if (phone.replace(/\D/g,"").length < 10) { setPhoneError("Enter a valid 10-digit US number"); return false; }
    setPhoneError(""); return true;
  };

  const toggleHabit = (h: Habit) => {
    const exists = habits.find(x => x.name === h.name);
    if (exists) setHabits(habits.filter(x => x.name !== h.name));
    else if (habits.length < 5) setHabits([...habits, h]);
  };

  const addCustom = () => {
    const name = customHabit.trim();
    if (!name || habits.length >= 5) return;
    if (!habits.find(x => x.name === name)) setHabits([...habits, { name, emoji: "🎯" }]);
    setCustomHabit("");
  };

  const handleSubmit = async () => {
    setLoading(true); setSubmitError("");
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
      if (!res.ok) throw new Error(data.error || "failed");
      router.push("/dashboard");
    } catch {
      setSubmitError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const noise = Math.sin(ticker * 0.3) * 2;

  // ── shared styles ────────────────────────────────────────────────────────
  const root: React.CSSProperties  = { minHeight:"100vh", background:"var(--c-root)", color:"var(--c-text)", fontFamily:"'Space Mono','Courier New',monospace" };
  const grid: React.CSSProperties  = { position:"fixed", inset:0, backgroundImage:`linear-gradient(var(--c-grid) 1px,transparent 1px),linear-gradient(90deg,var(--c-grid) 1px,transparent 1px)`, backgroundSize:"48px 48px", pointerEvents:"none" };
  const nav: React.CSSProperties   = { position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1rem 1.5rem", borderBottom:"1px solid var(--c-accent-bdr)", background:"var(--c-nav)", backdropFilter:"blur(8px)" };
  const logoS: React.CSSProperties = { fontSize:"1.1rem", fontWeight:"700", letterSpacing:"0.15em", color:"var(--c-text)", cursor:"pointer" };
  const navBtn: React.CSSProperties = { background:"transparent", border:"1px solid #0ea5e9", color:"#0ea5e9", padding:"0.4rem 1rem", fontSize:"0.7rem", letterSpacing:"0.1em", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" };
  const primaryBtn = (disabled=false): React.CSSProperties => ({ width:"100%", background:"#0ea5e9", border:"none", color:"#fff", padding:"1rem", fontSize:"0.85rem", letterSpacing:"0.15em", cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit", fontWeight:"700", marginTop:"1rem", opacity:disabled?0.4:1 });
  const backBtn: React.CSSProperties = { background:"transparent", border:"none", color:"var(--c-text3)", fontSize:"0.7rem", cursor:"pointer", fontFamily:"inherit", padding:"0.5rem 0", letterSpacing:"0.1em", marginTop:"0.5rem", display:"block" };
  const inputS: React.CSSProperties = { width:"100%", background:"var(--c-input)", border:"1px solid var(--c-input-bdr)", color:"var(--c-text)", padding:"0.9rem 1rem", fontSize:"1rem", fontFamily:"inherit", outline:"none", boxSizing:"border-box" };
  const tag: React.CSSProperties = { fontSize:"0.6rem", letterSpacing:"0.25em", color:"#0ea5e9", border:"1px solid rgba(14,165,233,0.4)", padding:"0.3rem 0.8rem", marginBottom:"1.5rem", display:"inline-block" };
  const lbl: React.CSSProperties = { fontSize:"0.6rem", letterSpacing:"0.2em", color:"var(--c-text3)", display:"block", marginBottom:"0.5rem" };

  // ── ONBOARDING ────────────────────────────────────────────────────────────
  if (page === "onboard") {
    return (
      <div style={root}>
        <div style={grid}/>
        <nav style={nav}>
          <div style={logoS} onClick={() => { setPage("landing"); setStep(1); }}>
            MOGGED<span style={{ color:"#0ea5e9" }}>AI</span>
          </div>
        </nav>
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"5rem 1.5rem 3rem", maxWidth:"580px", margin:"0 auto" }}>

          {/* Progress */}
          <div style={{ display:"flex", gap:"6px", marginBottom:"2.5rem" }}>
            {[1,2].map(s => (
              <div key={s} style={{ height:"3px", flex:1, background:s<=step?"#0ea5e9":"var(--c-border)", opacity:s<step?0.5:1, transition:"all 0.3s" }}/>
            ))}
          </div>

          {/* ── STEP 1: Phone ── */}
          {step === 1 && (
            <div>
              <div style={tag}>STEP 01 / 02</div>
              <h2 style={{ fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:"700", lineHeight:1.15, marginBottom:"0.5rem" }}>
                your number.<br/><span style={{ color:"#0ea5e9" }}>no excuses.</span>
              </h2>
              <p style={{ fontSize:"0.8rem", color:"var(--c-text3)", marginBottom:"1.5rem", lineHeight:"1.6" }}>
                US numbers only. This is where your AI coach will text you every day.
              </p>
              <label style={lbl}>PHONE NUMBER</label>
              <input style={{ ...inputS, fontSize:"1.2rem", borderColor:phoneError?"#0ea5e9":"var(--c-input-bdr)" }}
                type="tel" placeholder="(555) 000-0000" value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                onKeyDown={e => e.key==="Enter" && validatePhone() && setStep(2)} autoFocus/>
              {phoneError && <p style={{ fontSize:"0.7rem", color:"#0ea5e9", marginTop:"0.4rem" }}>{phoneError}</p>}
              <button style={primaryBtn()} onClick={() => validatePhone() && setStep(2)}>NEXT →</button>
            </div>
          )}

          {/* ── STEP 2: Schedule + consent ── */}
          {step === 2 && (
            <div>
              <div style={tag}>STEP 02 / 02</div>
              <h2 style={{ fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:"700", lineHeight:1.15, marginBottom:"0.5rem" }}>
                when should we<br/><span style={{ color:"#0ea5e9" }}>check in?</span>
              </h2>
              <p style={{ fontSize:"0.8rem", color:"var(--c-text3)", marginBottom:"1.5rem", lineHeight:"1.6" }}>
                Set your active hours. You&apos;ll add your missions inside the dashboard.
              </p>

              <label style={lbl}>CHECK-IN FREQUENCY</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"1.5rem" }}>
                {INTENSITIES.map(f => (
                  <button key={f.value}
                    style={{ background:freq===f.value?"rgba(14,165,233,0.12)":"var(--c-input)", border:freq===f.value?"1px solid #0ea5e9":"1px solid var(--c-input-bdr)", color:freq===f.value?"var(--c-text)":"var(--c-text3)", padding:"1rem", cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:"all 0.15s" }}
                    onClick={() => setFreq(f.value)}>
                    <div style={{ fontSize:"0.85rem", fontWeight:"700", marginBottom:"0.2rem" }}>{f.label}</div>
                    <div style={{ fontSize:"0.6rem", color:freq===f.value?"#0ea5e9":"var(--c-text3)" }}>{f.desc}</div>
                  </button>
                ))}
              </div>

              <label style={lbl}>ACTIVE HOURS</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"0.75rem" }}>
                <div>
                  <label style={{ ...lbl, marginBottom:"0.3rem" }}>FROM</label>
                  <input style={inputS} type="time" value={startTime} onChange={e => setStartTime(e.target.value)}/>
                </div>
                <div>
                  <label style={{ ...lbl, marginBottom:"0.3rem" }}>UNTIL</label>
                  <input style={inputS} type="time" value={endTime} onChange={e => setEndTime(e.target.value)}/>
                </div>
              </div>
              <p style={{ fontSize:"0.6rem", color:"var(--c-text3)", marginBottom:"1rem" }}>
                ⚡ Timezone auto-detected · Reply DONE to mark complete · Text STOP to unsubscribe
              </p>

              {/* SMS Consent */}
              <div style={{ background:"var(--c-s1)", border:`1px solid ${smsConsent ? "#0ea5e9" : "var(--c-input-bdr)"}`, padding:"1rem", marginBottom:"1rem", cursor:"pointer" }} onClick={() => setSmsConsent(!smsConsent)}>
                <div style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start" }}>
                  <div style={{ width:"16px", height:"16px", border:`2px solid ${smsConsent ? "#0ea5e9" : "var(--c-text3)"}`, background:smsConsent ? "#0ea5e9" : "transparent", flexShrink:0, marginTop:"1px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {smsConsent && <span style={{ color:"#fff", fontSize:"10px", fontWeight:"700", lineHeight:1 }}>✓</span>}
                  </div>
                  <p style={{ fontSize:"0.65rem", color:"var(--c-text3)", lineHeight:"1.7", margin:0 }}>
                    I agree to receive recurring automated SMS messages from MoggedAI. Msg &amp; data rates may apply. Reply STOP to unsubscribe.{" "}
                    <a href="/consent" target="_blank" style={{ color:"#0ea5e9", textDecoration:"none" }} onClick={e => e.stopPropagation()}>SMS Policy</a>
                  </p>
                </div>
              </div>

              {submitError && <p style={{ fontSize:"0.7rem", color:"#0ea5e9", margin:"0.4rem 0" }}>{submitError}</p>}
              <button style={primaryBtn(loading || !smsConsent)} onClick={handleSubmit} disabled={loading || !smsConsent}>
                {loading ? "SETTING UP..." : "CREATE MY ACCOUNT →"}
              </button>
              <button style={backBtn} onClick={() => setStep(1)}>← back</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── LANDING PAGE ──────────────────────────────────────────────────────────
  return (
    <div style={root}>
      <style>{`
        .who-grid { grid-template-columns: repeat(4, 1fr); }
        .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
        @media (max-width: 640px) {
          .who-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-grid { grid-template-columns: 1fr 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <div style={grid}/>
      <div style={{ position:"fixed", top:`${(ticker*2)%100}%`, left:0, right:0, height:"2px", background:"rgba(14,165,233,0.08)", pointerEvents:"none", transition:"none" }}/>

      <nav style={nav}>
        <div style={logoS}>MOGGED<span style={{ color:"#0ea5e9" }}>AI</span></div>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <button style={navBtn} onClick={() => router.push(isSignedIn ? "/dashboard" : "/sign-in")}>
            {isSignedIn ? "DASHBOARD" : "LOG IN"}
          </button>
          <button style={navBtn} onClick={() => isSignedIn ? router.push("/dashboard") : setPage("onboard")}>GET STARTED</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"5rem 1.5rem 2rem", maxWidth:"920px", margin:"0 auto" }}>
        <div style={tag}>AI ACCOUNTABILITY · SMS · BUILT FOR RESULTS</div>
        <h1 style={{ fontSize:"clamp(2.8rem,8vw,5.5rem)", fontWeight:"700", lineHeight:0.95, letterSpacing:"-0.02em", marginBottom:"1rem", transform:`translateX(${noise*0.3}px)` }}>
          STOP<br/><span style={{ color:"#0ea5e9" }}>SLACKING.</span><br/>START NOW.
        </h1>
        <div style={{ height:"2.5rem", overflow:"hidden", marginBottom:"1.5rem", borderLeft:"3px solid #0ea5e9", paddingLeft:"1rem" }}>
          <p style={{ fontSize:"clamp(0.9rem,2vw,1.05rem)", color:"var(--c-text4)", lineHeight:"2.5rem", margin:0 }}>{MESSAGES[currentMsg]}</p>
        </div>
        <p style={{ fontSize:"clamp(0.95rem,2vw,1.05rem)", color:"var(--c-text4)", maxWidth:"500px", lineHeight:"1.9", marginBottom:"2rem" }}>
          Get daily habit reminders by text.<br/>Built to make sure you follow through.
        </p>
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"5rem" }}>
          <button style={{ background:"#0ea5e9", border:"none", color:"#fff", padding:"1rem 2.5rem", fontSize:"0.85rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700" }} onClick={() => isSignedIn ? router.push("/dashboard") : setPage("onboard")}>
            GET STARTED FREE →
          </button>
        </div>

        {/* SMS Conversation showcase */}
        <div style={{ width:"100%" }}>
          {/* 3 conversation cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"12px", marginBottom:"12px" }}>
            {[
              {
                habit:"💪 GYM", time1:"8:14 AM", time2:"8:17 AM", time3:"8:17 AM",
                msg:"you said you'd hit the gym this morning. it's 8am. you still in bed?",
                reply:"done just got back",
                response:"7 day streak. that's what it looks like. don't stop now.",
              },
              {
                habit:"📚 STUDY", time1:"2:00 PM", time2:"2:06 PM", time3:"2:06 PM",
                msg:"you haven't opened that textbook all day. what are you doing?",
                reply:"done studying now",
                response:"good. stay off your phone. two hours minimum.",
              },
              {
                habit:"🚀 SIDE PROJECT", time1:"7:30 PM", time2:"7:35 PM", time3:"7:35 PM",
                msg:"did you work on the side project today or did you just think about it?",
                reply:"done shipped a feature",
                response:"3 day streak. keep shipping. this is how it gets built.",
              },
            ].map(c => (
              <div key={c.habit} style={{ background:"#0a0a0a", border:"1px solid var(--c-border2)", borderRadius:"16px", padding:"1.25rem", display:"flex", flexDirection:"column", gap:"8px" }}>
                <div style={{ fontSize:"0.5rem", color:"#0ea5e9", letterSpacing:"0.2em", marginBottom:"4px" }}>{c.habit}</div>
                {/* Coach message */}
                <div style={{ background:"#141414", borderRadius:"10px 10px 10px 0", padding:"0.7rem 0.85rem" }}>
                  <div style={{ fontSize:"0.75rem", color:"#ccc", lineHeight:"1.6" }}>{c.msg}</div>
                  <div style={{ fontSize:"0.45rem", color:"#666", textAlign:"right", marginTop:"6px" }}>{c.time1}</div>
                </div>
                {/* User reply */}
                <div style={{ background:"rgba(14,165,233,0.12)", border:"1px solid rgba(14,165,233,0.2)", borderRadius:"10px 10px 0 10px", padding:"0.6rem 0.85rem", alignSelf:"flex-end", maxWidth:"80%" }}>
                  <div style={{ fontSize:"0.68rem", color:"#0ea5e9" }}>{c.reply}</div>
                  <div style={{ fontSize:"0.45rem", color:"#555", textAlign:"right", marginTop:"4px" }}>{c.time2}</div>
                </div>
                {/* Coach response */}
                <div style={{ background:"#141414", borderRadius:"10px 10px 10px 0", padding:"0.7rem 0.85rem" }}>
                  <div style={{ fontSize:"0.75rem", color:"#ccc", lineHeight:"1.6" }}>{c.response}</div>
                  <div style={{ fontSize:"0.45rem", color:"#666", textAlign:"right", marginTop:"6px" }}>{c.time3}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", background:"var(--c-s1)", border:"1px solid var(--c-border)" }}>
            {[
              { num:"5", label:"HABITS TRACKED" },
              { num:"5 MIN", label:"FOLLOW-UP TIME" },
              { num:"2-WAY", label:"AI COACHING" },
            ].map(s => (
              <div key={s.label} style={{ background:"var(--c-root)", padding:"1.25rem", textAlign:"center" }}>
                <div style={{ fontSize:"1.5rem", fontWeight:"700", color:"#0ea5e9", lineHeight:1 }}>{s.num}</div>
                <div style={{ fontSize:"0.5rem", color:"#666", letterSpacing:"0.15em", marginTop:"0.3rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHO IT'S FOR */}
      <div style={{ padding:"5rem 1.5rem", maxWidth:"920px", margin:"0 auto" }}>
        <div style={{ fontSize:"0.85rem", letterSpacing:"0.25em", color:"#e0e0e0", fontWeight:"700", marginBottom:"0.5rem", display:"flex", alignItems:"center", gap:"1rem" }}>
          WHO IT&apos;S FOR <div style={{ flex:1, height:"1px", background:"#2a2a2a" }}/>
        </div>
        <p style={{ fontSize:"0.85rem", color:"var(--c-text4)", lineHeight:"1.8", marginBottom:"2rem", maxWidth:"520px" }}>
          If you know what you should be doing but keep finding reasons not to — this is for you.
        </p>
        <div className="who-grid" style={{ display:"grid", gap:"1px", background:"var(--c-border2)", border:"1px solid var(--c-border2)" }}>
          {[
            { emoji:"📚", who:"Students",      line:"You study for 15 min then end up on YouTube for 2 hours." },
            { emoji:"💻", who:"Builders",       line:"Always planning the side project. Never actually building it." },
            { emoji:"💪", who:"Athletes",       line:"You skip workouts and feel guilty about it all day." },
            { emoji:"📋", who:"Professionals",  line:"Putting off the one task that actually matters." },
            { emoji:"🎨", who:"Creatives",      line:"Waiting for motivation instead of just starting." },
            { emoji:"🚀", who:"Entrepreneurs",  line:"Busy with everything except the thing that moves the needle." },
            { emoji:"💆", who:"Anyone Stressed",line:"Overwhelmed, avoiding, and telling yourself tomorrow." },
            { emoji:"🎯", who:"Everyone Else",  line:"Who knows exactly what they should do and still doesn't do it." },
          ].map(f => (
            <div key={f.who} style={{ background:"var(--c-root)", padding:"1.75rem 1.25rem" }}>
              <div style={{ fontSize:"1.6rem", marginBottom:"0.75rem" }}>{f.emoji}</div>
              <div style={{ fontSize:"0.78rem", fontWeight:"700", marginBottom:"0.5rem", letterSpacing:"0.08em", color:"var(--c-text)" }}>{f.who.toUpperCase()}</div>
              <div style={{ fontSize:"0.78rem", color:"var(--c-text4)", lineHeight:"1.75" }}>{f.line}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding:"0 1.5rem 5rem", maxWidth:"920px", margin:"0 auto" }}>
        <div style={{ fontSize:"0.85rem", letterSpacing:"0.25em", color:"#e0e0e0", fontWeight:"700", marginBottom:"2rem", display:"flex", alignItems:"center", gap:"1rem" }}>
          HOW IT WORKS <div style={{ flex:1, height:"1px", background:"#2a2a2a" }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1px", background:"var(--c-s1)", border:"1px solid var(--c-border)" }}>
          {[
            { n:"01", title:"Set up your habits", desc:"Pick what you need to stay on top of. Study, gym, work, anything. Up to 5 habits." },
            { n:"02", title:"Pick your coach style", desc:"Brutal, direct, or motivating. Every message adapts to how you want to be pushed." },
            { n:"03", title:"Get texted all day", desc:"We rotate through your habits and check in. Every message is unique and personalized." },
            { n:"04", title:'Reply "done"', desc:"Mark it complete. We track your streak. No reply? We follow up in 5 minutes." },
          ].map(f => (
            <div key={f.n} style={{ background:"var(--c-root)", padding:"1.5rem 1.25rem" }}>
              <div style={{ fontSize:"0.7rem", color:"#0ea5e9", fontWeight:"700", marginBottom:"0.75rem", letterSpacing:"0.1em" }}>{f.n} ——</div>
              <div style={{ fontSize:"0.8rem", fontWeight:"700", marginBottom:"0.4rem", letterSpacing:"0.05em" }}>{f.title.toUpperCase()}</div>
              <div style={{ fontSize:"0.8rem", color:"var(--c-text4)", lineHeight:"1.7" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"3rem 1.5rem 6rem", maxWidth:"920px", margin:"0 auto", textAlign:"center" }}>
        <div style={{ borderTop:"1px solid #111", borderBottom:"1px solid #111", padding:"2.5rem 0", marginBottom:"3rem" }}>
          <p style={{ fontSize:"clamp(1.2rem,3vw,2rem)", fontWeight:"700", lineHeight:1.4, margin:0 }}>
            &ldquo;You already know what you should be doing.<br/>
            <span style={{ color:"#0ea5e9" }}>You just need someone who won&apos;t let you forget it.&rdquo;</span>
          </p>
        </div>
        <button style={{ background:"#0ea5e9", border:"none", color:"#fff", padding:"1.1rem 3rem", fontSize:"0.9rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700" }} onClick={() => isSignedIn ? router.push("/dashboard") : setPage("onboard")}>
          GET STARTED — IT&apos;S FREE
        </button>
        <p style={{ fontSize:"0.6rem", color:"#555", marginTop:"1rem" }}>US numbers only · Reply STOP to unsubscribe anytime</p>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid #1a1a1a", background:"var(--c-bg)", padding:"3rem 1.5rem 2rem", fontFamily:"'Space Mono','Courier New',monospace" }}>
        <div style={{ maxWidth:"920px", margin:"0 auto" }}>

          {/* Top row: brand + columns */}
          <div className="footer-grid" style={{ display:"grid", gap:"2rem", marginBottom:"2.5rem" }}>

            {/* Brand */}
            <div className="footer-brand">
              <div style={{ fontSize:"1.1rem", fontWeight:"700", letterSpacing:"0.15em", color:"var(--c-text)", marginBottom:"0.75rem" }}>
                MOGGED<span style={{ color:"#0ea5e9" }}>AI</span>
              </div>
              <p style={{ fontSize:"0.72rem", color:"var(--c-text4)", lineHeight:"1.8", margin:"0 0 1.25rem" }}>
                The AI accountability coach that texts you all day and doesn&apos;t let you make excuses. Set it once. Stay accountable forever.
              </p>
              <div style={{ display:"flex", gap:"0.75rem" }}>
                {[
                  { label:"𝕏", href:"https://twitter.com/moggedai" },
                  { label:"IG", href:"https://instagram.com/moggedai" },
                  { label:"TT", href:"https://tiktok.com/@moggedai" },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"32px", height:"32px", border:"1px solid var(--c-border2)", color:"#444", fontSize:"0.65rem", fontWeight:"700", textDecoration:"none", letterSpacing:"0.05em" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor="#0ea5e9"; (e.currentTarget as HTMLAnchorElement).style.color="#0ea5e9"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor="#1a1a1a"; (e.currentTarget as HTMLAnchorElement).style.color="#444"; }}
                  >{s.label}</a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <div style={{ fontSize:"0.5rem", letterSpacing:"0.25em", color:"#666", marginBottom:"1rem" }}>PRODUCT</div>
              {[
                { label:"How It Works", href:"/how-it-works" },
                { label:"Pricing",      href:"/#pricing" },
                { label:"FAQ",          href:"/faq" },
                { label:"Get Started",  href:"/#get-started" },
              ].map(l => (
                <div key={l.label} style={{ marginBottom:"0.6rem" }}>
                  <a href={l.href}
                    style={{ fontSize:"0.68rem", color:"var(--c-text3)", textDecoration:"none", letterSpacing:"0.05em" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color="#f0f0f0"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color="#777"; }}
                  >{l.label}</a>
                </div>
              ))}
            </div>

            {/* Support */}
            <div>
              <div style={{ fontSize:"0.5rem", letterSpacing:"0.25em", color:"#666", marginBottom:"1rem" }}>SUPPORT</div>
              {[
                { label:"FAQ",             href:"/faq" },
                { label:"Contact Us",      href:"mailto:support@moggedai.com" },
                { label:"SMS Help",        href:"mailto:support@moggedai.com" },
                { label:"Report a Bug",    href:"mailto:support@moggedai.com?subject=Bug Report" },
              ].map(l => (
                <div key={l.label} style={{ marginBottom:"0.6rem" }}>
                  <a href={l.href}
                    style={{ fontSize:"0.68rem", color:"var(--c-text3)", textDecoration:"none", letterSpacing:"0.05em" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color="#f0f0f0"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color="#777"; }}
                  >{l.label}</a>
                </div>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontSize:"0.5rem", letterSpacing:"0.25em", color:"#666", marginBottom:"1rem" }}>LEGAL</div>
              {[
                { label:"Privacy Policy",    href:"/privacy" },
                { label:"Terms of Service",  href:"/terms" },
                { label:"SMS Consent",       href:"/consent" },
                { label:"Unsubscribe",       href:"mailto:support@moggedai.com?subject=Unsubscribe" },
              ].map(l => (
                <div key={l.label} style={{ marginBottom:"0.6rem" }}>
                  <a href={l.href}
                    style={{ fontSize:"0.68rem", color:"var(--c-text3)", textDecoration:"none", letterSpacing:"0.05em" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color="#f0f0f0"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color="#777"; }}
                  >{l.label}</a>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop:"1px solid #111", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"0.75rem" }}>
            <div style={{ fontSize:"0.55rem", color:"#555", letterSpacing:"0.1em" }}>
              © 2026 MOGGEDAI · ALL RIGHTS RESERVED
            </div>
            <div style={{ fontSize:"0.55rem", color:"#555", letterSpacing:"0.08em" }}>
              US NUMBERS ONLY · TEXT STOP TO UNSUBSCRIBE ANYTIME
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
