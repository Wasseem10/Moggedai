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

function PhoneMockup({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [convIndex, setConvIndex]       = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping]     = useState(false);
  const [typingFrom, setTypingFrom]     = useState<"ai"|"user">("ai");
  const [screenFade, setScreenFade]     = useState(false);
  const [delivered, setDelivered]       = useState(false);
  const [showNotif, setShowNotif]       = useState(false);
  const [notifExit, setNotifExit]       = useState(false);

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
    setShowNotif(false);
    setNotifExit(false);

    const conv = CONVERSATIONS[convIndex];
    let t = 400;

    // ── Lock-screen notification drop ────────────────────────────────────────
    go(t, () => { setShowNotif(true); setNotifExit(false); });
    t += 2400;
    go(t, () => setNotifExit(true));
    t += 500;
    go(t, () => setShowNotif(false));
    t += 200;

    // ── Messages ─────────────────────────────────────────────────────────────
    conv.messages.forEach((msg, idx) => {
      const typingDuration = msg.from === "ai"
        ? 1100 + msg.text.length * 17
        : 700  + msg.text.length * 11;

      go(t, () => {
        setTypingFrom(msg.from as "ai"|"user");
        setShowTyping(true);
        setDelivered(false);
      });
      t += typingDuration;

      go(t, () => {
        setShowTyping(false);
        setVisibleCount(idx + 1);
        if (msg.from === "user") go(320, () => setDelivered(true));
      });
      t += msg.from === "ai" ? 650 : 480;
    });

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
          0%   { opacity:0; transform:scale(0.80) translateY(16px); }
          52%  { opacity:1; transform:scale(1.05) translateY(-3px); }
          74%  { transform:scale(0.97) translateY(1px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes typingAppear {
          0%   { opacity:0; transform:scale(0.85) translateY(10px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes dot1 { 0%,60%,100%{transform:translateY(0);opacity:.28} 20%{transform:translateY(-5px);opacity:1} }
        @keyframes dot2 { 0%,60%,100%{transform:translateY(0);opacity:.28} 33%{transform:translateY(-5px);opacity:1} }
        @keyframes dot3 { 0%,60%,100%{transform:translateY(0);opacity:.28} 46%{transform:translateY(-5px);opacity:1} }
        @keyframes screenFadeOut {
          0%   { opacity:1; }
          100% { opacity:0; }
        }
        @keyframes deliveredFade {
          0%   { opacity:0; transform:translateY(-4px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes ambientPulse {
          0%,100% { opacity:0.55; transform:scale(1); }
          50%     { opacity:0.9;  transform:scale(1.07); }
        }
        @keyframes phoneFloat {
          0%,100% { transform:translateY(0px); }
          40%     { transform:translateY(-9px); }
          70%     { transform:translateY(-4px); }
        }
        @keyframes notifEnter {
          0%   { transform:translateY(-72px) scale(0.94); opacity:0; }
          60%  { transform:translateY(4px)  scale(1.01); opacity:1; }
          100% { transform:translateY(0)    scale(1);    opacity:1; }
        }
        @keyframes notifExit {
          0%   { transform:translateY(0)    scale(1);    opacity:1; }
          100% { transform:translateY(-72px) scale(0.94); opacity:0; }
        }
      `}</style>

      {/* ── Floating wrapper ─────────────────────────────────────────────── */}
      <div style={{ position:"relative", display:"inline-block", animation:"phoneFloat 7s ease-in-out infinite" }}>

        {/* Multi-layer ambient glow */}
        <div style={{
          position:"absolute", inset:"-44px",
          background:"radial-gradient(ellipse at 50% 56%, rgba(14,165,233,0.24) 0%, rgba(99,102,241,0.07) 45%, transparent 70%)",
          borderRadius:"110px",
          animation:"ambientPulse 5s ease-in-out infinite",
          pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute", inset:"-20px",
          background:"radial-gradient(ellipse at 50% 72%, rgba(14,165,233,0.13) 0%, transparent 62%)",
          borderRadius:"90px",
          animation:"ambientPulse 5s ease-in-out infinite 1.2s",
          pointerEvents:"none",
        }}/>

        {/* ── Titanium frame ───────────────────────────────────────────────── */}
        <div style={{
          width:"306px", height:"624px",
          background: theme === "light"
            ? "linear-gradient(158deg, #f8f8fa 0%, #e8e8ea 7%, #dddde0 28%, #c8c8cc 58%, #d2d2d5 84%, #e4e4e6 100%)"
            : "linear-gradient(158deg, #58585c 0%, #3c3c3e 7%, #2e2e30 28%, #1e1e20 58%, #2a2a2c 84%, #3e3e40 100%)",
          borderRadius:"56px",
          padding:"12px",
          boxShadow: theme === "light" ? `
            0 0 0 0.5px rgba(255,255,255,0.9),
            0 0 0 1px rgba(0,0,0,0.12),
            0 72px 140px rgba(0,0,0,0.22),
            0 32px 64px rgba(0,0,0,0.12),
            0 0 100px rgba(14,165,233,0.10),
            inset 0 1.5px 0 rgba(255,255,255,0.95),
            inset 0 -1px 0 rgba(0,0,0,0.08),
            inset 1px 0 0 rgba(255,255,255,0.7),
            inset -1px 0 0 rgba(0,0,0,0.06)
          ` : `
            0 0 0 0.5px rgba(255,255,255,0.22),
            0 0 0 1px rgba(0,0,0,0.9),
            0 72px 140px rgba(0,0,0,0.95),
            0 32px 64px rgba(0,0,0,0.65),
            0 0 100px rgba(14,165,233,0.15),
            inset 0 1.5px 0 rgba(255,255,255,0.16),
            inset 0 -1px 0 rgba(0,0,0,0.6),
            inset 1px 0 0 rgba(255,255,255,0.07),
            inset -1px 0 0 rgba(0,0,0,0.4)
          `,
          position:"relative",
          flexShrink:0,
        }}>

          {/* Titanium chamfer highlight */}
          <div style={{
            position:"absolute", inset:0, borderRadius:"56px",
            background: theme === "light"
              ? "linear-gradient(130deg, rgba(255,255,255,0.85) 0%, transparent 36%, transparent 64%, rgba(255,255,255,0.45) 100%)"
              : "linear-gradient(130deg, rgba(255,255,255,0.12) 0%, transparent 36%, transparent 64%, rgba(255,255,255,0.05) 100%)",
            pointerEvents:"none",
          }}/>

          {/* Mute switch */}
          <div style={{ position:"absolute", left:-3.5, top:90,  width:3.5, height:24, background: theme==="light" ? "linear-gradient(90deg,#b8b8bc,#d8d8dc)" : "linear-gradient(90deg,#1c1c1e,#323234)", borderRadius:"3px 0 0 3px", boxShadow: theme==="light" ? "-1px 0 0 rgba(255,255,255,0.7),-1px 0 4px rgba(0,0,0,0.12)" : "-1px 0 0 rgba(255,255,255,0.09),-1px 0 4px rgba(0,0,0,0.5)" }}/>
          {/* Volume up */}
          <div style={{ position:"absolute", left:-3.5, top:126, width:3.5, height:38, background: theme==="light" ? "linear-gradient(90deg,#b8b8bc,#d8d8dc)" : "linear-gradient(90deg,#1c1c1e,#323234)", borderRadius:"3px 0 0 3px", boxShadow: theme==="light" ? "-1px 0 0 rgba(255,255,255,0.7),-1px 0 4px rgba(0,0,0,0.12)" : "-1px 0 0 rgba(255,255,255,0.09),-1px 0 4px rgba(0,0,0,0.5)" }}/>
          {/* Volume down */}
          <div style={{ position:"absolute", left:-3.5, top:174, width:3.5, height:38, background: theme==="light" ? "linear-gradient(90deg,#b8b8bc,#d8d8dc)" : "linear-gradient(90deg,#1c1c1e,#323234)", borderRadius:"3px 0 0 3px", boxShadow: theme==="light" ? "-1px 0 0 rgba(255,255,255,0.7),-1px 0 4px rgba(0,0,0,0.12)" : "-1px 0 0 rgba(255,255,255,0.09),-1px 0 4px rgba(0,0,0,0.5)" }}/>
          {/* Power */}
          <div style={{ position:"absolute", right:-3.5, top:138, width:3.5, height:68, background: theme==="light" ? "linear-gradient(270deg,#b8b8bc,#d8d8dc)" : "linear-gradient(270deg,#1c1c1e,#323234)", borderRadius:"0 3px 3px 0", boxShadow: theme==="light" ? "1px 0 0 rgba(255,255,255,0.7),1px 0 4px rgba(0,0,0,0.12)" : "1px 0 0 rgba(255,255,255,0.09),1px 0 4px rgba(0,0,0,0.5)" }}/>

          {/* ── Screen ─────────────────────────────────────────────────────── */}
          <div style={{
            width:"100%", height:"100%",
            background: theme === "light" ? "#f2f2f7" : "#000",
            borderRadius:"46px",
            overflow:"hidden",
            display:"flex",
            flexDirection:"column",
            position:"relative",
            animation: screenFade ? "screenFadeOut 0.65s cubic-bezier(0.4,0,0.2,1) forwards" : "none",
          }}>

            {/* OLED inner edge glow */}
            <div style={{
              position:"absolute", inset:0, borderRadius:"46px",
              boxShadow: theme === "light"
                ? "inset 0 0 0 1px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)"
                : "inset 0 0 0 1px rgba(255,255,255,0.048), inset 0 1px 0 rgba(255,255,255,0.08)",
              pointerEvents:"none", zIndex:52,
            }}/>

            {/* Glass reflection */}
            <div style={{
              position:"absolute", inset:0, borderRadius:"46px",
              background: theme === "light"
                ? "linear-gradient(132deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 26%, transparent 50%)"
                : "linear-gradient(132deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.014) 26%, transparent 50%)",
              pointerEvents:"none", zIndex:51,
            }}/>

            {/* Dynamic Island — narrower so it doesn't overlap the time */}
            <div style={{
              position:"absolute", top:14, left:"50%",
              transform:"translateX(-50%)",
              width:96, height:30,
              background:"#000",
              borderRadius:20,
              zIndex:20,
              boxShadow:"0 0 0 1px rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.95)",
            }}/>

            {/* ── Lock-screen notification ──────────────────────────────── */}
            {showNotif && (
              <div style={{
                position:"absolute",
                top:62, left:12, right:12,
                zIndex:40,
                background: theme === "light" ? "rgba(235,235,240,0.92)" : "rgba(26,26,28,0.88)",
                backdropFilter:"blur(24px)",
                WebkitBackdropFilter:"blur(24px)",
                borderRadius:18,
                padding:"11px 13px",
                display:"flex", alignItems:"center", gap:11,
                boxShadow: theme === "light"
                  ? "0 10px 40px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.08)"
                  : "0 10px 40px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.11)",
                animation: notifExit
                  ? "notifExit 0.38s cubic-bezier(0.4,0,1,1) forwards"
                  : "notifEnter 0.48s cubic-bezier(0.34,1.56,0.64,1) forwards",
              }}>
                <div style={{
                  width:38, height:38, borderRadius:9,
                  background:"linear-gradient(145deg,#0ea5e9,#0369a1)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, flexShrink:0,
                  boxShadow:"0 3px 10px rgba(14,165,233,0.45)",
                }}>🤖</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                    <span style={{ fontSize:12, fontWeight:600, color: theme==="light" ? "#1c1c1e" : "#fff", fontFamily:"-apple-system,'SF Pro Text',sans-serif" }}>MoggedAI</span>
                    <span style={{ fontSize:10, color: theme==="light" ? "rgba(0,0,0,0.38)" : "rgba(255,255,255,0.42)", fontFamily:"-apple-system,'SF Pro Text',sans-serif" }}>now</span>
                  </div>
                  <div style={{
                    fontSize:12, color: theme==="light" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.68)",
                    fontFamily:"-apple-system,'SF Pro Text',sans-serif",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                    lineHeight:1.35,
                  }}>{conv.messages[0].text}</div>
                </div>
              </div>
            )}

            {/* Status bar — sits ABOVE the Dynamic Island on both sides */}
            <div style={{
              display:"flex", justifyContent:"space-between", alignItems:"flex-start",
              padding:"18px 26px 0",
              fontFamily:"-apple-system,'SF Pro Text',sans-serif",
              flexShrink:0, height:54,
              position:"relative", zIndex:25,
            }}>
              <span style={{ fontSize:15, fontWeight:600, color: theme==="light" ? "#1c1c1e" : "#fff", letterSpacing:"-0.4px", lineHeight:1 }}>
                {conv.time}
              </span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                  <rect x="0"  y="8" width="3" height="4"  rx="0.8" fill={theme==="light" ? "#1c1c1e" : "white"}/>
                  <rect x="4.7" y="5.5" width="3" height="6.5" rx="0.8" fill={theme==="light" ? "#1c1c1e" : "white"}/>
                  <rect x="9.3" y="3" width="3" height="9"  rx="0.8" fill={theme==="light" ? "#1c1c1e" : "white"}/>
                  <rect x="14" y="0" width="3" height="12" rx="0.8" fill={theme==="light" ? "#1c1c1e" : "white"} opacity="0.28"/>
                </svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M8 10a1.2 1.2 0 1 1 0-2.4A1.2 1.2 0 0 1 8 10z" fill={theme==="light" ? "#1c1c1e" : "white"}/>
                  <path d="M4.5 7C5.6 5.8 6.7 5.2 8 5.2s2.4.6 3.5 1.8" stroke={theme==="light" ? "#1c1c1e" : "white"} strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M1.5 4.2C3.2 2.3 5.5 1.2 8 1.2s4.8 1.1 6.5 3" stroke={theme==="light" ? "#1c1c1e" : "white"} strokeWidth="1.4" strokeLinecap="round" opacity="0.38"/>
                </svg>
                <div style={{ display:"flex", alignItems:"center" }}>
                  <div style={{ width:24, height:12, border: theme==="light" ? "1px solid rgba(0,0,0,0.32)" : "1px solid rgba(255,255,255,0.38)", borderRadius:3.5, position:"relative", overflow:"hidden", padding:"1.5px" }}>
                    <div style={{ width:"75%", height:"100%", background: theme==="light" ? "#1c1c1e" : "#fff", borderRadius:2 }}/>
                  </div>
                  <div style={{ width:2, height:5, background: theme==="light" ? "rgba(0,0,0,0.32)" : "rgba(255,255,255,0.38)", borderRadius:"0 1px 1px 0", marginLeft:0.5 }}/>
                </div>
              </div>
            </div>

            {/* iMessage nav */}
            <div style={{
              display:"flex", alignItems:"center",
              padding:"4px 16px 10px",
              flexShrink:0,
              borderBottom: theme==="light" ? "0.5px solid rgba(0,0,0,0.1)" : "0.5px solid rgba(255,255,255,0.07)",
              fontFamily:"-apple-system,'SF Pro Text',sans-serif",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:3, marginRight:"auto" }}>
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                  <path d="M8 2 2.5 8 8 14" stroke="#0B84FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize:16, color:"#0B84FF", fontWeight:400 }}>3</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                <div style={{
                  width:38, height:38, borderRadius:"50%",
                  background:"linear-gradient(145deg,#0ea5e9,#0369a1)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:19, boxShadow:"0 3px 10px rgba(14,165,233,0.5)",
                }}>🤖</div>
                <span style={{ fontSize:11, color: theme==="light" ? "#1c1c1e" : "#fff", fontWeight:600 }}>MoggedAI</span>
              </div>
              <div style={{ display:"flex", gap:16, marginLeft:"auto" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 10l4.55-2.275A1 1 0 0 1 21 8.618V15.38a1 1 0 0 1-1.45.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" stroke="#0B84FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="m22 16.92-.09-3.37a2 2 0 0 0-1.34-1.83l-2.56-.85a2 2 0 0 0-2.18.63l-.9 1.1a15.1 15.1 0 0 1-6.53-6.53l1.1-.9a2 2 0 0 0 .63-2.18l-.85-2.56A2 2 0 0 0 8 .09L4.63 0A2 2 0 0 0 2.5 2C2.5 13.85 10.15 21.5 22 21.5a2 2 0 0 0 2-2.09z" fill="#0B84FF"/>
                </svg>
              </div>
            </div>

            {/* Date chip */}
            <div style={{ display:"flex", justifyContent:"center", padding:"8px 0 2px", flexShrink:0 }}>
              <span style={{
                fontSize:11, color: theme==="light" ? "rgba(0,0,0,0.38)" : "rgba(255,255,255,0.36)",
                fontFamily:"-apple-system,'SF Pro Text',sans-serif",
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
                const isUser  = msg.from === "user";
                const isLast  = i === visibleCount - 1;
                const prevSame = i > 0 && conv.messages[i-1].from === msg.from;
                const nextSame = i < visibleCount - 1 && conv.messages[i+1].from === msg.from;

                const tl = isUser ? 18 : (prevSame ? 5 : 18);
                const tr = isUser ? (prevSame ? 5 : 18) : 18;
                const br = isUser ? (nextSame ? 5 : 5) : 18;
                const bl = isUser ? 18 : (nextSame ? 5 : 5);

                return (
                  <div key={`${convIndex}-${i}`} style={{
                    display:"flex", flexDirection:"column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                    animation:"msgSpring 0.46s cubic-bezier(0.34,1.56,0.64,1) forwards",
                  }}>
                    <div style={{
                      background: isUser
                        ? "linear-gradient(175deg,#2a9fff 0%,#007AFF 40%,#0063CC 100%)"
                        : (theme === "light" ? "#e5e5ea" : "#1C1C1E"),
                      color: isUser ? "#fff" : (theme === "light" ? "#1c1c1e" : "#fff"),
                      borderRadius:`${tl}px ${tr}px ${br}px ${bl}px`,
                      padding:"9px 13px",
                      fontSize:13,
                      lineHeight:1.45,
                      maxWidth:"82%",
                      fontFamily:"-apple-system,'SF Pro Text',sans-serif",
                      fontWeight:400,
                      letterSpacing:-0.15,
                      boxShadow: isUser
                        ? "0 2px 10px rgba(0,122,255,0.38), 0 1px 3px rgba(0,0,0,0.22)"
                        : (theme === "light"
                            ? "0 1px 3px rgba(0,0,0,0.08)"
                            : "0 1px 3px rgba(0,0,0,0.45), inset 0 0 0 0.5px rgba(255,255,255,0.06)"),
                    }}>
                      {msg.text}
                    </div>
                    {isUser && isLast && delivered && (
                      <span style={{
                        fontSize:10, color: theme==="light" ? "rgba(0,0,0,0.33)" : "rgba(255,255,255,0.33)",
                        marginTop:3,
                        fontFamily:"-apple-system,'SF Pro Text',sans-serif",
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
                  animation:"typingAppear 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards",
                }}>
                  <div style={{
                    background: typingFrom === "user"
                      ? "linear-gradient(175deg,#2a9fff 0%,#007AFF 100%)"
                      : (theme === "light" ? "#e5e5ea" : "#1C1C1E"),
                    borderRadius:18,
                    padding:"11px 15px",
                    display:"flex", gap:5, alignItems:"center",
                    boxShadow: typingFrom === "user"
                      ? "0 2px 10px rgba(0,122,255,0.38)"
                      : (theme === "light" ? "0 1px 3px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.45)"),
                  }}>
                    {["dot1","dot2","dot3"].map(d => (
                      <div key={d} style={{
                        width:7, height:7, borderRadius:"50%",
                        background: typingFrom === "user" || theme === "dark" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.45)",
                        animation:`${d} 1.1s ease-in-out infinite`,
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
              borderTop: theme==="light" ? "0.5px solid rgba(0,0,0,0.1)" : "0.5px solid rgba(255,255,255,0.07)",
              flexShrink:0,
            }}>
              <div style={{
                width:30, height:30, borderRadius:"50%",
                background: theme==="light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.09)",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke={theme==="light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)"} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{
                flex:1, background: theme==="light" ? "#e5e5ea" : "#1C1C1E",
                borderRadius:22, padding:"8px 14px",
                fontSize:13, color: theme==="light" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.22)",
                border: theme==="light" ? "0.5px solid rgba(0,0,0,0.08)" : "0.5px solid rgba(255,255,255,0.08)",
                fontFamily:"-apple-system,'SF Pro Text',sans-serif",
              }}>iMessage</div>
              <div style={{
                width:30, height:30, borderRadius:"50%",
                background: theme==="light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.09)",
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0,
              }}>
                <svg width="12" height="17" viewBox="0 0 12 17" fill="none">
                  <rect x="3.5" y="0.5" width="5" height="9.5" rx="2.5" stroke={theme==="light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)"} strokeWidth="1.3"/>
                  <path d="M1 8a5 5 0 0 0 10 0" stroke={theme==="light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)"} strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M6 13v3.5" stroke={theme==="light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)"} strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* Home indicator */}
            <div style={{ display:"flex", justifyContent:"center", padding:"6px 0 10px", flexShrink:0 }}>
              <div style={{ width:120, height:4.5, background: theme==="light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.32)", borderRadius:3 }}/>
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
  const [theme, setTheme] = useState<"dark"|"light">("dark");
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  // Sync theme from localStorage / data-theme attribute (set by dashboard toggle)
  useEffect(() => {
    const stored = localStorage.getItem("mogged-theme") as "dark"|"light"|null;
    const initial = stored ?? (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
    setTheme(initial);

    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      setTheme(t);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

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
        * { box-sizing: border-box; }
        .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
        .who-row { transition: all 0.18s; cursor: default; }
        .who-row:hover { background: rgba(14,165,233,0.05) !important; padding-left: 1.5rem !important; }
        .who-row:hover .who-emoji { transform: scale(1.2); }
        .who-emoji { transition: transform 0.18s; display:inline-block; }
        .step-line { transition: background 0.3s; }
        .hero-btns { max-width: 480px; }
        @media (max-width: 640px) {
          .hero-btns { max-width: 100%; }
          .hero-primary-btn { font-size: 0.75rem !important; padding: 1rem 1rem !important; }
          .hero-secondary-btn { font-size: 0.75rem !important; padding: 1rem 1rem !important; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; }
          .nav-btns .sign-out-btn { display: none; }
          .phone-wrap { transform: scale(0.82); transform-origin: center top; margin-bottom: -60px; }
          .cta-btn { width: 100% !important; }
          .section-pad { padding-left: 1rem !important; padding-right: 1rem !important; }
          .how-timeline { flex-direction: column !important; }
          .how-step { flex-direction: row !important; gap: 1rem !important; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <div style={grid}/>
      <div style={{ position:"fixed", top:`${(ticker*2)%100}%`, left:0, right:0, height:"2px", background:"rgba(14,165,233,0.08)", pointerEvents:"none", transition:"none" }}/>

      <nav style={nav}>
        <div style={logoS}>MOGGED<span style={{ color:"#0ea5e9" }}>AI</span></div>
        <div className="nav-btns" style={{ display:"flex", gap:"0.5rem" }}>
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
          STOP DREAMING.<br/><span style={{ color:"#0ea5e9" }}>START</span><br/>DOING.
        </h1>
        <p style={{ fontSize:"clamp(0.9rem,2.5vw,1.05rem)", color:"var(--c-text4)", maxWidth:"480px", lineHeight:"1.9", marginBottom:"2rem" }}>
          An AI that texts you all day and won&apos;t let you make excuses.<br/>Set it once. Stay accountable forever.
        </p>
        <div className="hero-btns" style={{ display:"flex", gap:"0.75rem" }}>
          <button className="hero-primary-btn" style={{ background:"#0ea5e9", border:"none", color:"#fff", padding:"1rem 2.5rem", fontSize:"0.85rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", flex:1 }} onClick={() => isSignedIn ? router.push("/dashboard") : router.push("/sign-up")}>
            GET STARTED FREE →
          </button>
          {isSignedIn ? (
            <button className="hero-secondary-btn" style={{ background:"transparent", border:"1px solid var(--c-border)", color:"var(--c-text)", padding:"1rem 2rem", fontSize:"0.85rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", flex:1 }} onClick={() => router.push("/dashboard")}>
              DASHBOARD
            </button>
          ) : (
            <button className="hero-secondary-btn" style={{ background:"transparent", border:"1px solid var(--c-border)", color:"var(--c-text)", padding:"1rem 2rem", fontSize:"0.85rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", flex:1 }} onClick={() => router.push("/sign-in")}>
              LOG IN
            </button>
          )}
        </div>
      </div>

      {/* WHO IT'S FOR */}
      <div style={{ padding:"6rem 1.25rem 5rem", maxWidth:"920px", margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"1.5rem", marginBottom:"3rem" }}>
          <div>
            <div style={{ fontSize:"0.65rem", letterSpacing:"0.3em", color:"#0ea5e9", fontWeight:"700", marginBottom:"0.5rem" }}>WHO IT&apos;S FOR</div>
            <h2 style={{ fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:"700", lineHeight:1.1, margin:0, letterSpacing:"-0.02em" }}>
              Sound familiar?
            </h2>
          </div>
        </div>

        {/* Statement cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:"1rem" }}>
          {[
            { emoji:"📚", who:"Students",      line:"Study for 15 min, end up on YouTube for 2 hours." },
            { emoji:"💻", who:"Builders",       line:"Always planning the side project. Never building it." },
            { emoji:"💪", who:"Athletes",       line:"Skip workouts then feel guilty about it all day." },
            { emoji:"📋", who:"Professionals",  line:"Putting off the one task that actually matters." },
            { emoji:"🎨", who:"Creatives",      line:"Waiting for motivation instead of just starting." },
            { emoji:"🚀", who:"Entrepreneurs",  line:"Busy with everything except the thing that moves the needle." },
          ].map(f => (
            <div key={f.who} style={{
              border:"1px solid var(--c-border)",
              borderRadius:"8px",
              padding:"1.4rem 1.2rem",
              background:"var(--c-s1)",
              display:"flex",
              flexDirection:"column",
              gap:"0.75rem",
            }}>
              <span style={{ fontSize:"1.8rem" }}>{f.emoji}</span>
              <span style={{ fontSize:"0.7rem", fontWeight:"700", letterSpacing:"0.15em", color:"var(--c-text)" }}>{f.who.toUpperCase()}</span>
              <span style={{ fontSize:"0.88rem", color:"var(--c-text4)", lineHeight:1.6 }}>{f.line}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background:"var(--c-s1)", borderTop:"1px solid var(--c-border)", borderBottom:"1px solid var(--c-border)", width:"100%" }}>
      <div style={{ padding:"5rem 1.25rem 6rem", maxWidth:"920px", margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
        <div style={{ marginBottom:"3rem" }}>
          <div style={{ fontSize:"0.65rem", letterSpacing:"0.3em", color:"#0ea5e9", fontWeight:"700", marginBottom:"0.5rem" }}>HOW IT WORKS</div>
          <h2 style={{ fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:"700", lineHeight:1.1, margin:0, letterSpacing:"-0.02em" }}>
            Set it once. Works all day.
          </h2>
        </div>

        {/* Timeline steps */}
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {[
            { n:"01", title:"Set your goals",        desc:"Pick what you need to stay on top of — gym, studying, work, anything.", color:"#0ea5e9" },
            { n:"02", title:"Pick your coach style", desc:"Brutal, direct, or motivating. Every single message adapts to you.",    color:"#8b5cf6" },
            { n:"03", title:"Get texted all day",    desc:"We check in throughout the day. Every message is unique and personal.", color:"#10b981" },
            { n:"04", title:'Reply "done"',          desc:'Mark it complete. We track your streak. No reply? We follow up.',      color:"#f59e0b" },
          ].map((f, i, arr) => (
            <div key={f.n} style={{ display:"flex", gap:"1.5rem", alignItems:"stretch" }}>
              {/* Left: number + line */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                <div style={{
                  width:44, height:44, borderRadius:"50%",
                  background:`${f.color}18`,
                  border:`1.5px solid ${f.color}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.65rem", fontWeight:"700", color:f.color, letterSpacing:"0.05em",
                  flexShrink:0,
                }}>{f.n}</div>
                {i < arr.length - 1 && (
                  <div style={{ width:1, flex:1, background:`linear-gradient(${f.color}, ${arr[i+1].color})`, opacity:0.3, minHeight:32 }}/>
                )}
              </div>
              {/* Right: content */}
              <div style={{ paddingBottom: i < arr.length - 1 ? "2rem" : 0, paddingTop:"0.6rem" }}>
                <div style={{ fontSize:"0.78rem", fontWeight:"700", letterSpacing:"0.08em", color:"var(--c-text)", marginBottom:"0.4rem" }}>{f.title.toUpperCase()}</div>
                <div style={{ fontSize:"0.9rem", color:"var(--c-text4)", lineHeight:1.7 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
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
        <div className="phone-wrap" style={{ display:"flex", justifyContent:"center" }}>
          <PhoneMockup theme={theme} />
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"3rem 1.5rem 4rem", maxWidth:"920px", margin:"0 auto", textAlign:"center" }}>
        <button className="cta-btn" style={{ background:"#0ea5e9", border:"none", color:"#fff", padding:"1.1rem 3rem", fontSize:"0.9rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700" }} onClick={() => isSignedIn ? router.push("/dashboard") : router.push("/sign-up")}>
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
