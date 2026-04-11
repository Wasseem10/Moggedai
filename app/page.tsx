"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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
  const [currentMsg, setCurrentMsg] = useState(0);
  const [ticker, setTicker]     = useState(0);
  const router = useRouter();
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
          phone: phone.replace(/\D/g,""),
          habits,
          coach_style: coachStyle,
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

  // ── shared styles ────────────────────────────────────────────────────────
  const root: React.CSSProperties  = { minHeight:"100vh", background:"#080808", color:"#f0f0f0", fontFamily:"'Space Mono','Courier New',monospace" };
  const grid: React.CSSProperties  = { position:"fixed", inset:0, backgroundImage:`linear-gradient(rgba(220,38,38,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(220,38,38,0.04) 1px,transparent 1px)`, backgroundSize:"48px 48px", pointerEvents:"none" };
  const nav: React.CSSProperties   = { position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1rem 1.5rem", borderBottom:"1px solid rgba(220,38,38,0.2)", background:"rgba(8,8,8,0.95)", backdropFilter:"blur(8px)" };
  const logoS: React.CSSProperties = { fontSize:"1.1rem", fontWeight:"700", letterSpacing:"0.15em", color:"#f0f0f0", cursor:"pointer" };
  const navBtn: React.CSSProperties = { background:"transparent", border:"1px solid #dc2626", color:"#dc2626", padding:"0.4rem 1rem", fontSize:"0.7rem", letterSpacing:"0.1em", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" };
  const primaryBtn = (disabled=false): React.CSSProperties => ({ width:"100%", background:"#dc2626", border:"none", color:"#fff", padding:"1rem", fontSize:"0.85rem", letterSpacing:"0.15em", cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit", fontWeight:"700", marginTop:"1rem", opacity:disabled?0.4:1 });
  const backBtn: React.CSSProperties = { background:"transparent", border:"none", color:"#444", fontSize:"0.7rem", cursor:"pointer", fontFamily:"inherit", padding:"0.5rem 0", letterSpacing:"0.1em", marginTop:"0.5rem", display:"block" };
  const inputS: React.CSSProperties = { width:"100%", background:"#111", border:"1px solid #222", color:"#f0f0f0", padding:"0.9rem 1rem", fontSize:"1rem", fontFamily:"inherit", outline:"none", boxSizing:"border-box" };
  const tag: React.CSSProperties = { fontSize:"0.6rem", letterSpacing:"0.25em", color:"#dc2626", border:"1px solid rgba(220,38,38,0.4)", padding:"0.3rem 0.8rem", marginBottom:"1.5rem", display:"inline-block" };
  const lbl: React.CSSProperties = { fontSize:"0.6rem", letterSpacing:"0.2em", color:"#555", display:"block", marginBottom:"0.5rem" };

  // ── ONBOARDING ────────────────────────────────────────────────────────────
  if (page === "onboard") {
    return (
      <div style={root}>
        <div style={grid}/>
        <nav style={nav}>
          <div style={logoS} onClick={() => { setPage("landing"); setStep(1); }}>
            MOGGED<span style={{ color:"#dc2626" }}>AI</span>
          </div>
        </nav>
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"5rem 1.5rem 3rem", maxWidth:"580px", margin:"0 auto" }}>

          {/* Progress */}
          <div style={{ display:"flex", gap:"6px", marginBottom:"2.5rem" }}>
            {[1,2,3,4].map(s => (
              <div key={s} style={{ height:"3px", flex:1, background:s<=step?"#dc2626":"#1e1e1e", opacity:s<step?0.5:1, transition:"all 0.3s" }}/>
            ))}
          </div>

          {/* ── STEP 1: Phone ── */}
          {step === 1 && (
            <div>
              <div style={tag}>STEP 01 / 04</div>
              <h2 style={{ fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:"700", lineHeight:1.15, marginBottom:"0.5rem" }}>
                your number.<br/><span style={{ color:"#dc2626" }}>no excuses.</span>
              </h2>
              <p style={{ fontSize:"0.8rem", color:"#555", marginBottom:"1.5rem", lineHeight:"1.6" }}>US numbers only. This is where your coach will text you.</p>
              <label style={lbl}>PHONE NUMBER</label>
              <input style={{ ...inputS, fontSize:"1.2rem", borderColor:phoneError?"#dc2626":"#222" }}
                type="tel" placeholder="(555) 000-0000" value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                onKeyDown={e => e.key==="Enter" && validatePhone() && setStep(2)} autoFocus/>
              {phoneError && <p style={{ fontSize:"0.7rem", color:"#dc2626", marginTop:"0.4rem" }}>{phoneError}</p>}
              <button style={primaryBtn()} onClick={() => validatePhone() && setStep(2)}>NEXT →</button>
            </div>
          )}

          {/* ── STEP 2: Coach style ── */}
          {step === 2 && (
            <div>
              <div style={tag}>STEP 02 / 04</div>
              <h2 style={{ fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:"700", lineHeight:1.15, marginBottom:"0.5rem" }}>
                how should we<br/><span style={{ color:"#dc2626" }}>talk to you?</span>
              </h2>
              <p style={{ fontSize:"0.8rem", color:"#555", marginBottom:"1.5rem", lineHeight:"1.6" }}>
                This shapes every message we send. Be honest.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"1.5rem" }}>
                {COACH_STYLES.map(s => (
                  <button key={s.id}
                    style={{ background:coachStyle===s.id?"rgba(220,38,38,0.12)":"#111", border:coachStyle===s.id?"1px solid #dc2626":"1px solid #1e1e1e", color:coachStyle===s.id?"#f0f0f0":"#555", padding:"1.1rem 1.25rem", cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:"all 0.15s" }}
                    onClick={() => setCoachStyle(s.id)}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                      <span style={{ fontSize:"1.3rem" }}>{s.emoji}</span>
                      <div>
                        <div style={{ fontSize:"0.9rem", fontWeight:"700", marginBottom:"0.15rem" }}>{s.label}</div>
                        <div style={{ fontSize:"0.65rem", color:coachStyle===s.id?"#888":"#333" }}>{s.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button style={primaryBtn(!coachStyle)} onClick={() => coachStyle && setStep(3)} disabled={!coachStyle}>NEXT →</button>
              <button style={backBtn} onClick={() => setStep(1)}>← back</button>
            </div>
          )}

          {/* ── STEP 3: Habits ── */}
          {step === 3 && (
            <div>
              <div style={tag}>STEP 03 / 04</div>
              <h2 style={{ fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:"700", lineHeight:1.15, marginBottom:"0.5rem" }}>
                what do you need<br/><span style={{ color:"#dc2626" }}>to stay on top of?</span>
              </h2>
              <p style={{ fontSize:"0.8rem", color:"#555", marginBottom:"1.5rem", lineHeight:"1.6" }}>
                Pick up to 5. We&apos;ll text you about each one. Tap to add or remove.
              </p>

              {/* Common habits grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(120px,1fr))", gap:"8px", marginBottom:"1rem" }}>
                {COMMON_HABITS.map(h => {
                  const selected = !!habits.find(x => x.name === h.name);
                  return (
                    <button key={h.name}
                      style={{ background:selected?"rgba(220,38,38,0.12)":"#111", border:selected?"1px solid #dc2626":"1px solid #1e1e1e", color:selected?"#f0f0f0":"#555", padding:"0.75rem 0.5rem", cursor:habits.length>=5&&!selected?"not-allowed":"pointer", fontFamily:"inherit", textAlign:"center", transition:"all 0.15s", opacity:habits.length>=5&&!selected?0.4:1 }}
                      onClick={() => toggleHabit(h)}
                    >
                      <div style={{ fontSize:"1.1rem", marginBottom:"0.25rem" }}>{h.emoji}</div>
                      <div style={{ fontSize:"0.65rem", fontWeight:"700" }}>{h.name}</div>
                    </button>
                  );
                })}
              </div>

              {/* Custom habit input */}
              <div style={{ display:"flex", gap:"8px", marginBottom:"1rem" }}>
                <input style={{ ...inputS, flex:1, padding:"0.7rem 1rem", fontSize:"0.85rem" }}
                  placeholder="Add your own..." value={customHabit}
                  onChange={e => setCustomHabit(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && addCustom()}
                  disabled={habits.length >= 5}/>
                <button
                  style={{ background:"#dc2626", border:"none", color:"#fff", padding:"0.7rem 1.25rem", cursor:"pointer", fontFamily:"inherit", fontSize:"0.8rem", fontWeight:"700" }}
                  onClick={addCustom} disabled={habits.length >= 5}>ADD</button>
              </div>

              {/* Selected habits */}
              {habits.length > 0 && (
                <div style={{ marginBottom:"1rem" }}>
                  <div style={lbl}>SELECTED ({habits.length}/5)</div>
                  <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                    {habits.map(h => (
                      <span key={h.name}
                        style={{ background:"rgba(220,38,38,0.12)", border:"1px solid #dc2626", color:"#f0f0f0", padding:"0.35rem 0.75rem", fontSize:"0.7rem", cursor:"pointer" }}
                        onClick={() => toggleHabit(h)}>
                        {h.emoji} {h.name} ✕
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button style={primaryBtn(!habits.length)} onClick={() => habits.length && setStep(4)} disabled={!habits.length}>NEXT →</button>
              <button style={backBtn} onClick={() => setStep(2)}>← back</button>
            </div>
          )}

          {/* ── STEP 4: Schedule ── */}
          {step === 4 && (
            <div>
              <div style={tag}>STEP 04 / 04</div>
              <h2 style={{ fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:"700", lineHeight:1.15, marginBottom:"0.5rem" }}>
                how often should<br/><span style={{ color:"#dc2626" }}>we check in?</span>
              </h2>
              <p style={{ fontSize:"0.8rem", color:"#555", marginBottom:"1.5rem", lineHeight:"1.6" }}>
                We&apos;ll rotate through your habits. Reply &quot;done&quot; to mark complete. No reply = follow-up in 5 min.
              </p>

              <label style={lbl}>CHECK-IN FREQUENCY</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"1.5rem" }}>
                {INTENSITIES.map(f => (
                  <button key={f.value}
                    style={{ background:freq===f.value?"rgba(220,38,38,0.12)":"#111", border:freq===f.value?"1px solid #dc2626":"1px solid #1e1e1e", color:freq===f.value?"#f0f0f0":"#555", padding:"1rem", cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:"all 0.15s" }}
                    onClick={() => setFreq(f.value)}>
                    <div style={{ fontSize:"0.85rem", fontWeight:"700", marginBottom:"0.2rem" }}>{f.label}</div>
                    <div style={{ fontSize:"0.6rem", color:freq===f.value?"#dc2626":"#333" }}>{f.desc}</div>
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
              <p style={{ fontSize:"0.6rem", color:"#2a2a2a", marginBottom:"0.5rem" }}>
                ⚡ Timezone auto-detected · Reply &quot;done&quot; to mark complete · Text STOP to unsubscribe
              </p>
              {submitError && <p style={{ fontSize:"0.7rem", color:"#dc2626", margin:"0.4rem 0" }}>{submitError}</p>}
              <button style={primaryBtn(loading)} onClick={handleSubmit} disabled={loading}>
                {loading ? "ACTIVATING..." : "START GETTING MOGGED →"}
              </button>
              <button style={backBtn} onClick={() => setStep(3)}>← back</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── LANDING PAGE ──────────────────────────────────────────────────────────
  return (
    <div style={root}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <div style={grid}/>
      <div style={{ position:"fixed", top:`${(ticker*2)%100}%`, left:0, right:0, height:"2px", background:"rgba(220,38,38,0.08)", pointerEvents:"none", transition:"none" }}/>

      <nav style={nav}>
        <div style={logoS}>MOGGED<span style={{ color:"#dc2626" }}>AI</span></div>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <button style={{ ...navBtn, borderColor:"#222", color:"#444" }} onClick={() => router.push("/sign-in")}>LOG IN</button>
          <button style={navBtn} onClick={() => setPage("onboard")}>GET STARTED</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"5rem 1.5rem 2rem", maxWidth:"920px", margin:"0 auto" }}>
        <div style={tag}>AI ACCOUNTABILITY · SMS · NO MERCY</div>
        <h1 style={{ fontSize:"clamp(2.8rem,8vw,5.5rem)", fontWeight:"700", lineHeight:0.95, letterSpacing:"-0.02em", marginBottom:"1rem", transform:`translateX(${noise*0.3}px)` }}>
          STOP<br/><span style={{ color:"#dc2626" }}>SLACKING.</span><br/>START NOW.
        </h1>
        <div style={{ height:"2.5rem", overflow:"hidden", marginBottom:"1.5rem", borderLeft:"3px solid #dc2626", paddingLeft:"1rem" }}>
          <p style={{ fontSize:"clamp(0.8rem,2vw,1rem)", color:"#666", lineHeight:"2.5rem", margin:0 }}>{MESSAGES[currentMsg]}</p>
        </div>
        <p style={{ fontSize:"clamp(0.85rem,2vw,1rem)", color:"#444", maxWidth:"500px", lineHeight:"1.9", marginBottom:"2rem" }}>
          Set up your habits once. We text you all day, every day. Reply &quot;done&quot; when you finish. No reply? We follow up. No app. No dashboard. Just results.
        </p>
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"5rem" }}>
          <button style={{ background:"#dc2626", border:"none", color:"#fff", padding:"1rem 2.5rem", fontSize:"0.85rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700" }} onClick={() => setPage("onboard")}>
            GET MOGGED FREE →
          </button>
        </div>

        {/* Phone mockup */}
        <div style={{ display:"flex", alignItems:"flex-end", gap:"2.5rem", flexWrap:"wrap" }}>
          <div style={{ width:"200px", background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:"20px", padding:"1.25rem 1rem" }}>
            <div style={{ fontSize:"0.5rem", color:"#dc2626", marginBottom:"0.75rem", letterSpacing:"0.15em" }}>MOGGEDAI</div>
            <div style={{ background:"#161616", border:"1px solid rgba(220,38,38,0.15)", borderRadius:"10px 10px 10px 0", padding:"0.65rem 0.75rem", fontSize:"0.6rem", color:"#ccc", lineHeight:"1.5", marginBottom:"0.5rem" }}>
              yo have you hit the gym yet? you said you would this morning.
              <div style={{ fontSize:"0.45rem", color:"#333", textAlign:"right", marginTop:"0.25rem" }}>10:00 AM</div>
            </div>
            <div style={{ background:"rgba(220,38,38,0.15)", border:"1px solid rgba(220,38,38,0.25)", borderRadius:"10px 10px 0 10px", padding:"0.5rem 0.75rem", fontSize:"0.6rem", color:"#dc2626", textAlign:"right", marginBottom:"0.5rem" }}>
              done
              <div style={{ fontSize:"0.45rem", color:"#555", marginTop:"0.2rem" }}>you · 10:03 AM</div>
            </div>
            <div style={{ background:"#161616", border:"1px solid rgba(220,38,38,0.15)", borderRadius:"10px 10px 10px 0", padding:"0.65rem 0.75rem", fontSize:"0.6rem", color:"#ccc", lineHeight:"1.5", marginBottom:"0.5rem" }}>
              3 day streak. keep going. don&apos;t break it now.
              <div style={{ fontSize:"0.45rem", color:"#333", textAlign:"right", marginTop:"0.25rem" }}>10:03 AM</div>
            </div>
            <div style={{ background:"#161616", border:"1px solid rgba(220,38,38,0.15)", borderRadius:"10px 10px 10px 0", padding:"0.65rem 0.75rem", fontSize:"0.6rem", color:"#ccc", lineHeight:"1.5" }}>
              you haven&apos;t opened that textbook all day. what are you doing?
              <div style={{ fontSize:"0.45rem", color:"#333", textAlign:"right", marginTop:"0.25rem" }}>2:00 PM</div>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
            {[
              { num:"5", label:"HABITS TRACKED" },
              { num:"5 MIN", label:"FOLLOW-UP TIME" },
              { num:"2-WAY", label:"AI COACHING" },
            ].map(s => (
              <div key={s.label} style={{ borderLeft:"2px solid #dc2626", paddingLeft:"1rem" }}>
                <div style={{ fontSize:"1.8rem", fontWeight:"700", lineHeight:1 }}>{s.num}</div>
                <div style={{ fontSize:"0.6rem", color:"#333", letterSpacing:"0.1em", marginTop:"0.2rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHO IT'S FOR */}
      <div style={{ padding:"5rem 1.5rem", maxWidth:"920px", margin:"0 auto" }}>
        <div style={{ fontSize:"0.6rem", letterSpacing:"0.3em", color:"#2a2a2a", marginBottom:"2rem", display:"flex", alignItems:"center", gap:"1rem" }}>
          WHO IT&apos;S FOR <div style={{ flex:1, height:"1px", background:"#111" }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1px", background:"#111", border:"1px solid #111" }}>
          {[
            { emoji:"📚", who:"Students", line:"You study for 15 min then end up on YouTube for 2 hours." },
            { emoji:"💻", who:"Builders", line:"Always planning the side project. Never actually building it." },
            { emoji:"💪", who:"Athletes", line:"You skip workouts then feel bad about it all day." },
            { emoji:"📋", who:"Professionals", line:"Putting off the one task that actually matters." },
            { emoji:"🎨", who:"Creatives", line:"Waiting for motivation instead of just starting." },
            { emoji:"🎯", who:"Anyone", line:"Who knows exactly what they should be doing and still doesn't do it." },
          ].map(f => (
            <div key={f.who} style={{ background:"#080808", padding:"1.5rem 1.25rem" }}>
              <div style={{ fontSize:"1.4rem", marginBottom:"0.6rem" }}>{f.emoji}</div>
              <div style={{ fontSize:"0.8rem", fontWeight:"700", marginBottom:"0.35rem", letterSpacing:"0.05em" }}>{f.who.toUpperCase()}</div>
              <div style={{ fontSize:"0.7rem", color:"#2a2a2a", lineHeight:"1.6" }}>{f.line}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding:"0 1.5rem 5rem", maxWidth:"920px", margin:"0 auto" }}>
        <div style={{ fontSize:"0.6rem", letterSpacing:"0.3em", color:"#2a2a2a", marginBottom:"2rem", display:"flex", alignItems:"center", gap:"1rem" }}>
          HOW IT WORKS <div style={{ flex:1, height:"1px", background:"#111" }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1px", background:"#111", border:"1px solid #111" }}>
          {[
            { n:"01", title:"Set up your habits", desc:"Pick what you need to stay on top of. Study, gym, work, anything. Up to 5 habits." },
            { n:"02", title:"Pick your coach style", desc:"Brutal, direct, or motivating. Every message adapts to how you want to be pushed." },
            { n:"03", title:"Get texted all day", desc:"We rotate through your habits and check in. Every message is unique and personalized." },
            { n:"04", title:'Reply "done"', desc:"Mark it complete. We track your streak. No reply? We follow up in 5 minutes." },
          ].map(f => (
            <div key={f.n} style={{ background:"#080808", padding:"1.5rem 1.25rem" }}>
              <div style={{ fontSize:"0.7rem", color:"#dc2626", fontWeight:"700", marginBottom:"0.75rem", letterSpacing:"0.1em" }}>{f.n} ——</div>
              <div style={{ fontSize:"0.8rem", fontWeight:"700", marginBottom:"0.4rem", letterSpacing:"0.05em" }}>{f.title.toUpperCase()}</div>
              <div style={{ fontSize:"0.7rem", color:"#2a2a2a", lineHeight:"1.6" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"3rem 1.5rem 6rem", maxWidth:"920px", margin:"0 auto", textAlign:"center" }}>
        <div style={{ borderTop:"1px solid #111", borderBottom:"1px solid #111", padding:"2.5rem 0", marginBottom:"3rem" }}>
          <p style={{ fontSize:"clamp(1.2rem,3vw,2rem)", fontWeight:"700", lineHeight:1.4, margin:0 }}>
            &ldquo;You already know what you should be doing.<br/>
            <span style={{ color:"#dc2626" }}>You just need someone who won&apos;t let you forget it.&rdquo;</span>
          </p>
        </div>
        <button style={{ background:"#dc2626", border:"none", color:"#fff", padding:"1.1rem 3rem", fontSize:"0.9rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700" }} onClick={() => setPage("onboard")}>
          GET MOGGED — IT&apos;S FREE
        </button>
        <p style={{ fontSize:"0.6rem", color:"#1a1a1a", marginTop:"1rem" }}>US numbers only · Reply STOP to unsubscribe anytime</p>
      </div>

      <footer style={{ borderTop:"1px solid #0e0e0e", padding:"1.5rem", textAlign:"center", fontSize:"0.6rem", color:"#1a1a1a", letterSpacing:"0.1em" }}>
        MOGGEDAI — AI ACCOUNTABILITY VIA SMS · © 2026
      </footer>
    </div>
  );
}
