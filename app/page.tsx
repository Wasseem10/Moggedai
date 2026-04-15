"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";

// ── PhoneMockup ──────────────────────────────────────────────────────────────
const CONVERSATIONS = [
  {
    label: "GYM",
    messages: [
      { from: "ai",   text: "you said you'd hit the gym this morning. it's 8am. you still in bed?" },
      { from: "user", text: "just got back actually 💪" },
      { from: "ai",   text: "7 day streak 🔥 don't stop now." },
    ],
  },
  {
    label: "STUDY",
    messages: [
      { from: "ai",   text: "you haven't touched that textbook all day. what's the excuse?" },
      { from: "user", text: "studying rn, 2 hrs deep" },
      { from: "ai",   text: "good. stay off your phone. you got this." },
    ],
  },
  {
    label: "SIDE PROJECT",
    messages: [
      { from: "ai",   text: "did you work on the app today or just think about it?" },
      { from: "user", text: "shipped a new feature 🔥" },
      { from: "ai",   text: "3 day streak. keep shipping. this is how it gets built." },
    ],
  },
];

function PhoneMockup() {
  const [convIndex, setConvIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const conv = CONVERSATIONS[convIndex];

    // Reset
    setVisibleCount(0);
    setShowTyping(false);
    setFading(false);

    // Helper: show next message with optional typing indicator before AI msgs
    const delays: number[] = [];
    let cursor = 0;

    const showNext = (idx: number) => {
      if (cancelled) return;
      if (idx >= conv.messages.length) {
        // After all messages visible, wait then fade out and advance
        const t = window.setTimeout(() => {
          if (cancelled) return;
          setFading(true);
          const t2 = window.setTimeout(() => {
            if (cancelled) return;
            setConvIndex(prev => (prev + 1) % CONVERSATIONS.length);
          }, 600);
          delays.push(t2);
        }, 3500);
        delays.push(t);
        return;
      }

      const msg = conv.messages[idx];
      if (msg.from === "ai") {
        // Show typing indicator first
        const t1 = window.setTimeout(() => {
          if (cancelled) return;
          setShowTyping(true);
          const t2 = window.setTimeout(() => {
            if (cancelled) return;
            setShowTyping(false);
            setVisibleCount(idx + 1);
            showNext(idx + 1);
          }, 1400);
          delays.push(t2);
        }, cursor);
        delays.push(t1);
        cursor += 1400 + 700;
      } else {
        const t = window.setTimeout(() => {
          if (cancelled) return;
          setVisibleCount(idx + 1);
          showNext(idx + 1);
        }, cursor);
        delays.push(t);
        cursor += 900;
      }
    };

    showNext(0);

    return () => {
      cancelled = true;
      delays.forEach(id => window.clearTimeout(id));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convIndex]);

  const conv = CONVERSATIONS[convIndex];

  return (
    <>
      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes phoneFade {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        {/* Phone shell */}
        <div style={{
          width: "260px",
          height: "520px",
          background: "#0a0a0a",
          borderRadius: "36px",
          border: "2px solid #2a2a2a",
          boxShadow: "0 0 0 1px #111, 0 32px 80px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          animation: fading ? "phoneFade 0.6s ease forwards" : "none",
        }}>

          {/* Notch */}
          <div style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "26px",
            background: "#0a0a0a",
            borderRadius: "0 0 18px 18px",
            zIndex: 10,
          }}/>

          {/* Status bar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px 0",
            fontSize: "11px",
            color: "#fff",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
            fontWeight: 600,
            flexShrink: 0,
            minHeight: "32px",
          }}>
            <span style={{ paddingTop: "4px" }}>9:41</span>
            <div style={{ display: "flex", gap: "4px", alignItems: "center", paddingTop: "4px" }}>
              {/* Signal dots */}
              {[10, 8, 6].map((h, i) => (
                <div key={i} style={{
                  width: "4px",
                  height: `${h}px`,
                  background: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                  borderRadius: "1px",
                }}/>
              ))}
              {/* Wifi */}
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ marginLeft: "2px" }}>
                <path d="M7 8.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="white"/>
                <path d="M3.5 5.5C4.5 4.4 5.7 3.8 7 3.8s2.5.6 3.5 1.7" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                <path d="M1 3C2.8 1.2 4.8.3 7 .3s4.2.9 6 2.7" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              </svg>
              {/* Battery */}
              <div style={{ display: "flex", alignItems: "center", marginLeft: "2px" }}>
                <div style={{ width: "20px", height: "10px", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "2px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "70%", background: "#4cd964", borderRadius: "1px" }}/>
                </div>
              </div>
            </div>
          </div>

          {/* Contact header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 16px 10px",
            borderBottom: "1px solid #1c1c1c",
            flexShrink: 0,
          }}>
            <div style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}>🤖</div>
            <div>
              <div style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#fff",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                letterSpacing: "0",
              }}>MoggedAI</div>
              <div style={{
                fontSize: "10px",
                color: "#4cd964",
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              }}>online · {conv.label}</div>
            </div>
          </div>

          {/* Messages area */}
          <div style={{
            flex: 1,
            padding: "12px 12px 8px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflowY: "hidden",
            justifyContent: "flex-end",
          }}>
            {conv.messages.slice(0, visibleCount).map((msg, i) => (
              <div
                key={`${convIndex}-${i}`}
                style={{
                  display: "flex",
                  justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                  animation: "bubbleIn 0.3s ease forwards",
                }}
              >
                <div style={{
                  background: msg.from === "ai" ? "#1c1c1e" : "#0ea5e9",
                  color: "#fff",
                  borderRadius: msg.from === "ai" ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                  padding: "9px 13px",
                  fontSize: "12px",
                  lineHeight: "1.55",
                  maxWidth: "80%",
                  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0",
                  boxShadow: msg.from === "ai"
                    ? "inset 0 0 0 1px rgba(255,255,255,0.06)"
                    : "none",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {showTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start", animation: "bubbleIn 0.2s ease forwards" }}>
                <div style={{
                  background: "#1c1c1e",
                  borderRadius: "16px 16px 16px 4px",
                  padding: "10px 14px",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#888",
                      animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}/>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* iMessage input bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 10px 14px",
            borderTop: "1px solid #1c1c1c",
            flexShrink: 0,
          }}>
            <div style={{
              flex: 1,
              background: "#1c1c1e",
              borderRadius: "18px",
              padding: "7px 12px",
              fontSize: "12px",
              color: "#555",
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              border: "1px solid #2c2c2e",
            }}>iMessage</div>
            <div style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              background: "#0ea5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2v8M2 6l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function MoggedAI() {
  const [ticker, setTicker] = useState(0);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  useEffect(() => {
    const t = setInterval(() => setTicker(p => p + 1), 50);
    return () => clearInterval(t);
  }, []);

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
          {isSignedIn ? (
            <>
              <button style={navBtn} onClick={() => router.push("/dashboard")}>DASHBOARD</button>
              <button style={{ ...navBtn, borderColor:"var(--c-border)", color:"var(--c-text3)" }} onClick={() => signOut({ redirectUrl: "/" })}>SIGN OUT</button>
            </>
          ) : (
            <>
              <button style={navBtn} onClick={() => router.push("/sign-in")}>LOG IN</button>
              <button style={navBtn} onClick={() => router.push("/sign-up")}>GET STARTED</button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-start", padding:"8rem 1.5rem 4rem", maxWidth:"920px", margin:"0 auto" }}>
        <div style={tag}>AI ACCOUNTABILITY · SMS · BUILT FOR RESULTS</div>
        <h1 style={{ fontSize:"clamp(2.8rem,8vw,5.5rem)", fontWeight:"700", lineHeight:0.95, letterSpacing:"-0.02em", wordSpacing:"-0.15em", marginBottom:"1rem", transform:`translateX(${noise*0.3}px)` }}>
          STOP<br/><span style={{ color:"#0ea5e9" }}>SLACKING.</span><br/>START NOW.
        </h1>
        <p style={{ fontSize:"clamp(0.95rem,2vw,1.05rem)", color:"var(--c-text4)", maxWidth:"500px", lineHeight:"1.9", marginBottom:"2rem" }}>
          Get daily habit reminders by text.<br/>Built to make sure you follow through.
        </p>
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
          <button style={{ background:"#0ea5e9", border:"none", color:"#fff", padding:"1rem 2.5rem", fontSize:"0.85rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700" }} onClick={() => isSignedIn ? router.push("/dashboard") : router.push("/sign-up")}>
            GET STARTED FREE →
          </button>
        </div>
      </div>

      {/* WHO IT'S FOR */}
      <div style={{ padding:"5rem 1.5rem", maxWidth:"920px", margin:"0 auto" }}>
        <div style={{ fontSize:"0.85rem", letterSpacing:"0.25em", color:"var(--c-text)", fontWeight:"700", marginBottom:"0.5rem", display:"flex", alignItems:"center", gap:"1rem" }}>
          WHO IT&apos;S FOR <div style={{ flex:1, height:"1px", background:"var(--c-border)" }}/>
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
        <div style={{ fontSize:"0.85rem", letterSpacing:"0.25em", color:"var(--c-text)", fontWeight:"700", marginBottom:"2rem", display:"flex", alignItems:"center", gap:"1rem" }}>
          HOW IT WORKS <div style={{ flex:1, height:"1px", background:"var(--c-border)" }}/>
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

      {/* SEE IT IN ACTION */}
      <div style={{ padding:"2rem 1.5rem 5rem", maxWidth:"920px", margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontSize:"0.85rem", letterSpacing:"0.25em", color:"var(--c-text)", fontWeight:"700", marginBottom:"0.5rem", display:"flex", alignItems:"center", gap:"1rem" }}>
          <div style={{ flex:1, height:"1px", background:"var(--c-border)" }}/> SEE IT IN ACTION <div style={{ flex:1, height:"1px", background:"var(--c-border)" }}/>
        </div>
        <p style={{ fontSize:"0.78rem", color:"var(--c-text4)", marginBottom:"2.5rem", letterSpacing:"0.05em" }}>
          This is what lands on your phone.
        </p>
        <div style={{ display:"flex", justifyContent:"center" }}>
          <PhoneMockup />
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"3rem 1.5rem 4rem", maxWidth:"920px", margin:"0 auto", textAlign:"center" }}>
        <button style={{ background:"#0ea5e9", border:"none", color:"#fff", padding:"1.1rem 3rem", fontSize:"0.9rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700" }} onClick={() => isSignedIn ? router.push("/dashboard") : router.push("/sign-up")}>
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
              <div style={{ display:"flex", gap:"0.75rem", marginBottom:"1rem" }}>
                {[
                  { label:"IG", href:"https://instagram.com/moggedai" },
                  { label:"TT", href:"https://tiktok.com/@moggedai" },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"32px", height:"32px", border:"1px solid var(--c-border2)", color:"var(--c-text3)", fontSize:"0.65rem", fontWeight:"700", textDecoration:"none", letterSpacing:"0.05em" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor="#0ea5e9"; (e.currentTarget as HTMLAnchorElement).style.color="#0ea5e9"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor="var(--c-border2)"; (e.currentTarget as HTMLAnchorElement).style.color="var(--c-text3)"; }}
                  >{s.label}</a>
                ))}
              </div>
              <a href="mailto:wasseem800@gmail.com"
                style={{ fontSize:"0.68rem", color:"var(--c-text3)", textDecoration:"none", letterSpacing:"0.05em" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color="#0ea5e9"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color="var(--c-text3)"; }}
              >wasseem800@gmail.com</a>
            </div>

            {/* Product */}
            <div>
              <div style={{ fontSize:"0.5rem", letterSpacing:"0.25em", color:"#666", marginBottom:"1rem" }}>PRODUCT</div>
              {[
                { label:"How It Works", href:"/how-it-works" },
                { label:"FAQ",          href:"/faq" },
                { label:"Get Started",  href:"/#get-started" },
              ].map(l => (
                <div key={l.label} style={{ marginBottom:"0.6rem" }}>
                  <a href={l.href}
                    style={{ fontSize:"0.68rem", color:"var(--c-text3)", textDecoration:"none", letterSpacing:"0.05em" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color="var(--c-text)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color="var(--c-text3)"; }}
                  >{l.label}</a>
                </div>
              ))}
            </div>

            {/* Support */}
            <div>
              <div style={{ fontSize:"0.5rem", letterSpacing:"0.25em", color:"#666", marginBottom:"1rem" }}>SUPPORT</div>
              {[
                { label:"FAQ",             href:"/faq" },
                { label:"Contact Us",      href:"mailto:wasseem800@gmail.com" },
                { label:"SMS Help",        href:"mailto:wasseem800@gmail.com" },
                { label:"Report a Bug",    href:"mailto:wasseem800@gmail.com?subject=Bug Report" },
              ].map(l => (
                <div key={l.label} style={{ marginBottom:"0.6rem" }}>
                  <a href={l.href}
                    style={{ fontSize:"0.68rem", color:"var(--c-text3)", textDecoration:"none", letterSpacing:"0.05em" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color="var(--c-text)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color="var(--c-text3)"; }}
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
                { label:"Unsubscribe",       href:"mailto:wasseem800@gmail.com?subject=Unsubscribe" },
              ].map(l => (
                <div key={l.label} style={{ marginBottom:"0.6rem" }}>
                  <a href={l.href}
                    style={{ fontSize:"0.68rem", color:"var(--c-text3)", textDecoration:"none", letterSpacing:"0.05em" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color="var(--c-text)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color="var(--c-text3)"; }}
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
