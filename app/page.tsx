"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";

// ── PhoneMockup ──────────────────────────────────────────────────────────────
const CONVERSATIONS = [
  {
    label: "💪 GYM",
    time: "8:14 AM",
    messages: [
      { from: "ai",   text: "yo it's 7am. you said gym before work today. clock's running ⏰" },
      { from: "user", text: "walking in right now" },
      { from: "ai",   text: "let's go 🔥 6 day streak. don't you dare break it." },
      { from: "user", text: "done. PR on bench too 💪" },
      { from: "ai",   text: "that's different. we're built different. rest day tomorrow, go hard today." },
    ],
  },
  {
    label: "📚 STUDY",
    time: "2:03 PM",
    messages: [
      { from: "ai",   text: "how many pages have you actually read today. be honest" },
      { from: "user", text: "..like 3 lol" },
      { from: "ai",   text: "3 pages. you said 30 by tonight. put the phone down and start now." },
      { from: "user", text: "ok ok im going" },
      { from: "ai",   text: "good. i'll check back in 90 minutes. no excuses." },
    ],
  },
  {
    label: "🚀 SIDE PROJECT",
    time: "9:41 PM",
    messages: [
      { from: "ai",   text: "did you open the code editor today or just think about opening it" },
      { from: "user", text: "shipped a whole feature actually 🔥" },
      { from: "ai",   text: "okay. that's real. 3 day streak building." },
      { from: "user", text: "feels good ngl" },
      { from: "ai",   text: "stay consistent. this is how products get made. same time tomorrow." },
    ],
  },
];

function PhoneMockup() {
  const [convIndex, setConvIndex]   = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [typingFrom, setTypingFrom] = useState<"ai"|"user">("ai");
  const [screenFade, setScreenFade] = useState(false);
  const [delivered, setDelivered]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    const ids: ReturnType<typeof setTimeout>[] = [];
    const go = (ms: number, fn: () => void) => {
      const id = setTimeout(() => { if (!cancelled) fn(); }, ms);
      ids.push(id);
    };

    setVisibleCount(0);
    setShowTyping(false);
    setScreenFade(false);
    setDelivered(false);

    const conv = CONVERSATIONS[convIndex];
    let t = 600;

    conv.messages.forEach((msg, idx) => {
      const typingDuration = msg.from === "ai"
        ? 1200 + msg.text.length * 18
        : 800 + msg.text.length * 12;

      // show typing
      go(t, () => {
        setTypingFrom(msg.from as "ai" | "user");
        setShowTyping(true);
        setDelivered(false);
      });
      t += typingDuration;

      // show message
      go(t, () => {
        setShowTyping(false);
        setVisibleCount(idx + 1);
        if (msg.from === "user") go(300, () => setDelivered(true));
      });
      t += msg.from === "ai" ? 700 : 500;
    });

    // hold, then fade screen out and advance
    t += 2800;
    go(t, () => setScreenFade(true));
    go(t + 700, () => setConvIndex(c => (c + 1) % CONVERSATIONS.length));

    return () => { cancelled = true; ids.forEach(clearTimeout); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convIndex]);

  const conv = CONVERSATIONS[convIndex];

  return (
    <>
      <style>{`
        @keyframes msgSpring {
          0%   { opacity:0; transform: scale(0.82) translateY(14px); }
          55%  { opacity:1; transform: scale(1.03) translateY(-2px); }
          75%  { transform: scale(0.98) translateY(1px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes typingAppear {
          0%   { opacity:0; transform: scale(0.88) translateY(8px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes dot1 { 0%,66%,100%{transform:translateY(0);opacity:.35} 22%{transform:translateY(-5px);opacity:1} }
        @keyframes dot2 { 0%,66%,100%{transform:translateY(0);opacity:.35} 33%{transform:translateY(-5px);opacity:1} }
        @keyframes dot3 { 0%,66%,100%{transform:translateY(0);opacity:.35} 44%{transform:translateY(-5px);opacity:1} }
        @keyframes screenFadeOut {
          0%   { opacity:1; }
          100% { opacity:0; }
        }
        @keyframes deliveredFade {
          0%   { opacity:0; transform:translateY(-4px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes ambientGlow {
          0%,100% { opacity:0.5; transform:scale(1); }
          50%     { opacity:0.8; transform:scale(1.06); }
        }
      `}</style>

      {/* Outer ambient glow */}
      <div style={{ position:"relative", display:"inline-block" }}>
        <div style={{
          position:"absolute", inset:"-24px",
          background:"radial-gradient(ellipse at 50% 60%, rgba(14,165,233,0.18) 0%, transparent 70%)",
          borderRadius:"80px",
          animation:"ambientGlow 4s ease-in-out infinite",
          pointerEvents:"none",
        }}/>

        {/* Phone frame — titanium dark finish */}
        <div style={{
          width:"272px", height:"572px",
          background:"linear-gradient(160deg, #2c2c2e 0%, #1a1a1c 45%, #232325 100%)",
          borderRadius:"52px",
          padding:"10px",
          boxShadow:`
            0 0 0 1px rgba(255,255,255,0.13),
            0 0 0 1.5px rgba(0,0,0,0.8),
            0 50px 100px rgba(0,0,0,0.85),
            0 20px 40px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.08)
          `,
          position:"relative",
          flexShrink:0,
        }}>

          {/* Volume up */}
          <div style={{ position:"absolute", left:-3, top:108, width:3, height:28, background:"#2a2a2c", borderRadius:"2px 0 0 2px", boxShadow:"-1px 0 0 rgba(255,255,255,0.07)" }}/>
          {/* Volume down */}
          <div style={{ position:"absolute", left:-3, top:145, width:3, height:28, background:"#2a2a2c", borderRadius:"2px 0 0 2px", boxShadow:"-1px 0 0 rgba(255,255,255,0.07)" }}/>
          {/* Mute */}
          <div style={{ position:"absolute", left:-3, top:78, width:3, height:20, background:"#2a2a2c", borderRadius:"2px 0 0 2px", boxShadow:"-1px 0 0 rgba(255,255,255,0.07)" }}/>
          {/* Power */}
          <div style={{ position:"absolute", right:-3, top:120, width:3, height:52, background:"#2a2a2c", borderRadius:"0 2px 2px 0", boxShadow:"1px 0 0 rgba(255,255,255,0.07)" }}/>

          {/* Screen */}
          <div style={{
            width:"100%", height:"100%",
            background:"#000",
            borderRadius:"42px",
            overflow:"hidden",
            display:"flex",
            flexDirection:"column",
            position:"relative",
            animation: screenFade ? "screenFadeOut 0.65s cubic-bezier(0.4,0,0.2,1) forwards" : "none",
          }}>

            {/* Dynamic Island */}
            <div style={{
              position:"absolute", top:12, left:"50%",
              transform:"translateX(-50%)",
              width:88, height:26,
              background:"#000",
              borderRadius:20,
              zIndex:20,
              boxShadow:"0 0 0 1px rgba(255,255,255,0.06)",
            }}/>

            {/* Status bar */}
            <div style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"16px 22px 0",
              fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif",
              flexShrink:0, height:46,
            }}>
              <span style={{ fontSize:14, fontWeight:600, color:"#fff", letterSpacing:0 }}>
                {conv.time}
              </span>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                {/* Signal */}
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                  <rect x="0" y="7" width="3" height="4" rx="0.5" fill="white"/>
                  <rect x="4.5" y="4.5" width="3" height="6.5" rx="0.5" fill="white"/>
                  <rect x="9" y="2" width="3" height="9" rx="0.5" fill="white"/>
                  <rect x="13.5" y="0" width="2.5" height="11" rx="0.5" fill="white" opacity="0.3"/>
                </svg>
                {/* Wifi */}
                <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                  <path d="M7.5 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="white"/>
                  <path d="M4.2 6.3C5.1 5.3 6.2 4.7 7.5 4.7s2.4.6 3.3 1.6" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M1.5 3.8C3 2.1 5.1 1.1 7.5 1.1s4.5 1 6 2.7" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.4"/>
                </svg>
                {/* Battery */}
                <div style={{ display:"flex", alignItems:"center", gap:1 }}>
                  <div style={{ width:22, height:11, border:"1px solid rgba(255,255,255,0.35)", borderRadius:3, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", inset:1, width:"72%", background:"#fff", borderRadius:2 }}/>
                  </div>
                  <div style={{ width:2, height:5, background:"rgba(255,255,255,0.35)", borderRadius:"0 1px 1px 0" }}/>
                </div>
              </div>
            </div>

            {/* iMessage nav header */}
            <div style={{
              display:"flex", alignItems:"center",
              padding:"4px 14px 10px",
              flexShrink:0,
              borderBottom:"0.5px solid rgba(255,255,255,0.08)",
              fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif",
            }}>
              {/* Back */}
              <div style={{ display:"flex", alignItems:"center", gap:3, marginRight:"auto" }}>
                <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
                  <path d="M7.5 1.5 2 7.5l5.5 6" stroke="#0B84FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize:16, color:"#0B84FF", fontWeight:400 }}>4</span>
              </div>
              {/* Center: avatar + name */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <div style={{
                  width:36, height:36, borderRadius:"50%",
                  background:"linear-gradient(145deg,#0ea5e9,#0369a1)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:18, boxShadow:"0 2px 8px rgba(14,165,233,0.4)",
                }}>🤖</div>
                <span style={{ fontSize:11, color:"#fff", fontWeight:500, letterSpacing:0 }}>MoggedAI</span>
              </div>
              {/* Right icons */}
              <div style={{ display:"flex", gap:14, marginLeft:"auto" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15.5 8.5a4 4 0 0 1 0 7M3 8.5a9 9 0 0 1 9-4.5m0 0a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9" stroke="#0B84FF" strokeWidth="1.6" strokeLinecap="round"/>
                  <circle cx="12" cy="13" r="2.5" fill="#0B84FF"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="m22 16.92-.09-3.37a2 2 0 0 0-1.34-1.83l-2.56-.85a2 2 0 0 0-2.18.63l-.9 1.1a15.1 15.1 0 0 1-6.53-6.53l1.1-.9a2 2 0 0 0 .63-2.18l-.85-2.56A2 2 0 0 0 8 .09L4.63 0A2 2 0 0 0 2.5 2C2.5 13.85 10.15 21.5 22 21.5a2 2 0 0 0 2-2.09z" fill="#0B84FF"/>
                </svg>
              </div>
            </div>

            {/* Conversation label chip */}
            <div style={{
              display:"flex", justifyContent:"center",
              padding:"10px 0 4px",
              flexShrink:0,
            }}>
              <span style={{
                fontSize:11,
                color:"rgba(255,255,255,0.4)",
                fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif",
                letterSpacing:0.2,
              }}>{conv.label} · Today {conv.time}</span>
            </div>

            {/* Messages */}
            <div style={{
              flex:1,
              padding:"4px 12px 6px",
              display:"flex",
              flexDirection:"column",
              justifyContent:"flex-end",
              gap:3,
              overflowY:"hidden",
            }}>
              {conv.messages.slice(0, visibleCount).map((msg, i) => {
                const isUser = msg.from === "user";
                const isLast = i === visibleCount - 1;
                const prevSame = i > 0 && conv.messages[i-1].from === msg.from;
                const nextSame = i < visibleCount - 1 && conv.messages[i+1].from === msg.from;

                // Bubble radius based on position in group
                const tl = isUser ? 18 : (prevSame ? 6 : 18);
                const tr = isUser ? (prevSame ? 6 : 18) : 18;
                const br = isUser ? (nextSame ? 6 : 18) : 18;
                const bl = isUser ? 18 : (nextSame ? 6 : 18);

                return (
                  <div key={`${convIndex}-${i}`} style={{
                    display:"flex",
                    flexDirection:"column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                    animation:"msgSpring 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards",
                  }}>
                    <div style={{
                      background: isUser ? "#0B84FF" : "#1C1C1E",
                      color:"#fff",
                      borderRadius:`${tl}px ${tr}px ${br}px ${bl}px`,
                      padding:"9px 14px",
                      fontSize:13,
                      lineHeight:1.45,
                      maxWidth:"82%",
                      fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif",
                      fontWeight:400,
                      letterSpacing:-0.1,
                      boxShadow: isUser
                        ? "0 1px 4px rgba(11,132,255,0.3)"
                        : "0 1px 3px rgba(0,0,0,0.4), inset 0 0 0 0.5px rgba(255,255,255,0.07)",
                    }}>
                      {msg.text}
                    </div>
                    {/* Delivered tag under last user msg */}
                    {isUser && isLast && delivered && (
                      <span style={{
                        fontSize:10,
                        color:"rgba(255,255,255,0.35)",
                        marginTop:2,
                        fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif",
                        animation:"deliveredFade 0.3s ease forwards",
                      }}>Delivered</span>
                    )}
                  </div>
                );
              })}

              {/* Typing bubble */}
              {showTyping && (
                <div style={{
                  display:"flex",
                  justifyContent: typingFrom === "user" ? "flex-end" : "flex-start",
                  animation:"typingAppear 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
                }}>
                  <div style={{
                    background: typingFrom === "user" ? "#0B84FF" : "#1C1C1E",
                    borderRadius:18,
                    padding:"11px 15px",
                    display:"flex", gap:5, alignItems:"center",
                    boxShadow:"0 1px 3px rgba(0,0,0,0.4)",
                  }}>
                    {[
                      { anim:"dot1 1.1s ease-in-out infinite" },
                      { anim:"dot2 1.1s ease-in-out infinite" },
                      { anim:"dot3 1.1s ease-in-out infinite" },
                    ].map((d, i) => (
                      <div key={i} style={{
                        width:7, height:7,
                        borderRadius:"50%",
                        background:"rgba(255,255,255,0.75)",
                        animation:d.anim,
                      }}/>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div style={{
              padding:"6px 10px 10px",
              display:"flex", alignItems:"center", gap:7,
              borderTop:"0.5px solid rgba(255,255,255,0.07)",
              flexShrink:0,
              fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif",
            }}>
              {/* + button */}
              <div style={{
                width:28, height:28, borderRadius:"50%",
                background:"#1C1C1E",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              {/* Text field */}
              <div style={{
                flex:1, background:"#1C1C1E",
                borderRadius:20, padding:"7px 13px",
                fontSize:13, color:"rgba(255,255,255,0.25)",
                border:"0.5px solid rgba(255,255,255,0.1)",
              }}>iMessage</div>
            </div>

            {/* Home indicator */}
            <div style={{
              display:"flex", justifyContent:"center",
              padding:"4px 0 8px", flexShrink:0,
            }}>
              <div style={{ width:100, height:4, background:"rgba(255,255,255,0.3)", borderRadius:3 }}/>
            </div>

          </div>{/* /screen */}
        </div>{/* /frame */}
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
        .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
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
      <div style={{ padding:"6rem 1.25rem 2.5rem", maxWidth:"920px", margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
        <div style={tag}>AI ACCOUNTABILITY · SMS · BUILT FOR RESULTS</div>
        <h1 style={{ fontSize:"clamp(2.4rem,9vw,5.5rem)", fontWeight:"700", lineHeight:0.95, letterSpacing:"-0.02em", wordSpacing:"-0.15em", marginBottom:"1rem", transform:`translateX(${noise*0.3}px)` }}>
          STOP<br/><span style={{ color:"#0ea5e9" }}>SLACKING.</span><br/>START NOW.
        </h1>
        <p style={{ fontSize:"clamp(0.9rem,2.5vw,1.05rem)", color:"var(--c-text4)", maxWidth:"480px", lineHeight:"1.9", marginBottom:"2rem" }}>
          An AI that texts you all day and won&apos;t let you make excuses.<br/>Set it once. Stay accountable forever.
        </p>
        <button style={{ background:"#0ea5e9", border:"none", color:"#fff", padding:"1rem 2.5rem", fontSize:"0.85rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", width:"100%", maxWidth:320 }} onClick={() => isSignedIn ? router.push("/dashboard") : router.push("/sign-up")}>
          GET STARTED FREE →
        </button>
      </div>

      {/* WHO IT'S FOR */}
      <div style={{ padding:"3rem 1.25rem 3rem", maxWidth:"920px", margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
        <div style={{ fontSize:"0.75rem", letterSpacing:"0.25em", color:"var(--c-text)", fontWeight:"700", marginBottom:"0.4rem", display:"flex", alignItems:"center", gap:"1rem" }}>
          WHO IT&apos;S FOR <div style={{ flex:1, height:"1px", background:"var(--c-border)" }}/>
        </div>
        <p style={{ fontSize:"0.82rem", color:"var(--c-text4)", lineHeight:"1.8", marginBottom:"1.5rem", maxWidth:"520px" }}>
          If you know what you should be doing but keep finding reasons not to — this is for you.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1px", background:"var(--c-border2)", border:"1px solid var(--c-border2)" }}>
          {[
            { emoji:"📚", who:"Students",      line:"Study for 15 min, end up on YouTube for 2 hours." },
            { emoji:"💻", who:"Builders",       line:"Always planning the side project. Never building it." },
            { emoji:"💪", who:"Athletes",       line:"Skip workouts then feel guilty about it all day." },
            { emoji:"📋", who:"Professionals",  line:"Putting off the one task that actually matters." },
            { emoji:"🎨", who:"Creatives",      line:"Waiting for motivation instead of just starting." },
            { emoji:"🚀", who:"Entrepreneurs",  line:"Busy with everything except the thing that moves the needle." },
          ].map(f => (
            <div key={f.who} style={{ background:"var(--c-root)", padding:"1.25rem 1rem" }}>
              <div style={{ fontSize:"1.4rem", marginBottom:"0.5rem" }}>{f.emoji}</div>
              <div style={{ fontSize:"0.72rem", fontWeight:"700", marginBottom:"0.35rem", letterSpacing:"0.08em", color:"var(--c-text)" }}>{f.who.toUpperCase()}</div>
              <div style={{ fontSize:"0.72rem", color:"var(--c-text4)", lineHeight:"1.7" }}>{f.line}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding:"0 1.25rem 3rem", maxWidth:"920px", margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
        <div style={{ fontSize:"0.75rem", letterSpacing:"0.25em", color:"var(--c-text)", fontWeight:"700", marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:"1rem" }}>
          HOW IT WORKS <div style={{ flex:1, height:"1px", background:"var(--c-border)" }}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1px", background:"var(--c-s1)", border:"1px solid var(--c-border)" }}>
          {[
            { n:"01", title:"Set your missions", desc:"Pick what you need to stay on top of — gym, studying, work, anything." },
            { n:"02", title:"Pick your coach style", desc:"Brutal, direct, or motivating. Every message adapts to you." },
            { n:"03", title:"Get texted all day", desc:"We check in throughout the day. Every message is unique and personal." },
            { n:"04", title:'Reply "done"', desc:"Mark it complete. We track your streak. No reply? We follow up." },
          ].map(f => (
            <div key={f.n} style={{ background:"var(--c-root)", padding:"1.25rem 1rem" }}>
              <div style={{ fontSize:"0.65rem", color:"#0ea5e9", fontWeight:"700", marginBottom:"0.6rem", letterSpacing:"0.1em" }}>{f.n} ——</div>
              <div style={{ fontSize:"0.72rem", fontWeight:"700", marginBottom:"0.35rem", letterSpacing:"0.05em" }}>{f.title.toUpperCase()}</div>
              <div style={{ fontSize:"0.72rem", color:"var(--c-text4)", lineHeight:"1.7" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SEE IT IN ACTION */}
      <div style={{ padding:"1rem 1.25rem 3rem", maxWidth:"920px", margin:"0 auto", textAlign:"center", width:"100%", boxSizing:"border-box" }}>
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
