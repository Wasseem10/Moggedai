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
          width:"308px", height:"668px",
          background: theme === "light"
            ? "linear-gradient(158deg, #f8f8fa 0%, #e8e8ea 7%, #dddde0 28%, #c8c8cc 58%, #d2d2d5 84%, #e4e4e6 100%)"
            : "linear-gradient(158deg, #58585c 0%, #3c3c3e 7%, #2e2e30 28%, #1e1e20 58%, #2a2a2c 84%, #3e3e40 100%)",
          borderRadius:"55px",
          padding:"9px",
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
            position:"absolute", inset:0, borderRadius:"55px",
            background: theme === "light"
              ? "linear-gradient(130deg, rgba(255,255,255,0.85) 0%, transparent 36%, transparent 64%, rgba(255,255,255,0.45) 100%)"
              : "linear-gradient(130deg, rgba(255,255,255,0.12) 0%, transparent 36%, transparent 64%, rgba(255,255,255,0.05) 100%)",
            pointerEvents:"none",
          }}/>

          {/* Action button (Pro 15+) */}
          <div style={{ position:"absolute", left:-3.5, top:104, width:3.5, height:30, background: theme==="light" ? "linear-gradient(90deg,#b8b8bc,#d8d8dc)" : "linear-gradient(90deg,#1c1c1e,#323234)", borderRadius:"3px 0 0 3px", boxShadow: theme==="light" ? "-1px 0 0 rgba(255,255,255,0.7),-1px 0 4px rgba(0,0,0,0.12)" : "-1px 0 0 rgba(255,255,255,0.09),-1px 0 4px rgba(0,0,0,0.5)" }}/>
          {/* Volume up */}
          <div style={{ position:"absolute", left:-3.5, top:152, width:3.5, height:46, background: theme==="light" ? "linear-gradient(90deg,#b8b8bc,#d8d8dc)" : "linear-gradient(90deg,#1c1c1e,#323234)", borderRadius:"3px 0 0 3px", boxShadow: theme==="light" ? "-1px 0 0 rgba(255,255,255,0.7),-1px 0 4px rgba(0,0,0,0.12)" : "-1px 0 0 rgba(255,255,255,0.09),-1px 0 4px rgba(0,0,0,0.5)" }}/>
          {/* Volume down */}
          <div style={{ position:"absolute", left:-3.5, top:208, width:3.5, height:46, background: theme==="light" ? "linear-gradient(90deg,#b8b8bc,#d8d8dc)" : "linear-gradient(90deg,#1c1c1e,#323234)", borderRadius:"3px 0 0 3px", boxShadow: theme==="light" ? "-1px 0 0 rgba(255,255,255,0.7),-1px 0 4px rgba(0,0,0,0.12)" : "-1px 0 0 rgba(255,255,255,0.09),-1px 0 4px rgba(0,0,0,0.5)" }}/>
          {/* Power */}
          <div style={{ position:"absolute", right:-3.5, top:170, width:3.5, height:78, background: theme==="light" ? "linear-gradient(270deg,#b8b8bc,#d8d8dc)" : "linear-gradient(270deg,#1c1c1e,#323234)", borderRadius:"0 3px 3px 0", boxShadow: theme==="light" ? "1px 0 0 rgba(255,255,255,0.7),1px 0 4px rgba(0,0,0,0.12)" : "1px 0 0 rgba(255,255,255,0.09),1px 0 4px rgba(0,0,0,0.5)" }}/>

          {/* ── Screen ─────────────────────────────────────────────────────── */}
          <div style={{
            width:"100%", height:"100%",
            background: theme === "light" ? "#f2f2f7" : "#000",
            borderRadius:"47px",
            overflow:"hidden",
            display:"flex",
            flexDirection:"column",
            position:"relative",
            animation: screenFade ? "screenFadeOut 0.65s cubic-bezier(0.4,0,0.2,1) forwards" : "none",
          }}>

            {/* OLED inner edge glow */}
            <div style={{
              position:"absolute", inset:0, borderRadius:"47px",
              boxShadow: theme === "light"
                ? "inset 0 0 0 1px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)"
                : "inset 0 0 0 1px rgba(255,255,255,0.048), inset 0 1px 0 rgba(255,255,255,0.08)",
              pointerEvents:"none", zIndex:52,
            }}/>

            {/* Glass reflection */}
            <div style={{
              position:"absolute", inset:0, borderRadius:"47px",
              background: theme === "light"
                ? "linear-gradient(132deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 26%, transparent 50%)"
                : "linear-gradient(132deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.014) 26%, transparent 50%)",
              pointerEvents:"none", zIndex:51,
            }}/>

            {/* Dynamic Island */}
            <div style={{
              position:"absolute", top:11, left:"50%",
              transform:"translateX(-50%)",
              width:118, height:33,
              background:"#000",
              borderRadius:22,
              zIndex:20,
              boxShadow:"0 0 0 1px rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.95)",
            }}>
              {/* Front camera lens */}
              <div style={{
                position:"absolute", right:13, top:"50%", transform:"translateY(-50%)",
                width:9, height:9, borderRadius:"50%",
                background:"radial-gradient(circle at 35% 35%, #1a2433 0%, #000 70%)",
                boxShadow:"inset 0 0 1px rgba(80,120,200,0.35)",
              }}/>
            </div>

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
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"19px 28px 0",
              fontFamily:"-apple-system,'SF Pro Text',sans-serif",
              flexShrink:0, height:55,
              position:"relative", zIndex:25,
            }}>
              <span style={{ fontSize:14, fontWeight:600, color: theme==="light" ? "#1c1c1e" : "#fff", letterSpacing:"-0.3px", lineHeight:1, fontFamily:"-apple-system,'SF Pro Display',sans-serif" }}>
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
              display:"grid",
              gridTemplateColumns:"1fr auto 1fr",
              alignItems:"center",
              padding:"6px 14px 10px",
              flexShrink:0,
              borderBottom: theme==="light" ? "0.5px solid rgba(0,0,0,0.1)" : "0.5px solid rgba(255,255,255,0.08)",
              fontFamily:"-apple-system,'SF Pro Text',sans-serif",
            }}>
              {/* Back arrow with badge */}
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
                  <path d="M9 2 2.5 9 9 16" stroke="#0B84FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{
                  fontSize:11, color:"#fff", fontWeight:600,
                  background:"#FF3B30",
                  padding:"1px 6px",
                  borderRadius:10,
                  minWidth:18, textAlign:"center", lineHeight:1.4,
                }}>3</span>
              </div>
              {/* Centered avatar + name */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                <div style={{
                  width:30, height:30, borderRadius:"50%",
                  background:"linear-gradient(145deg,#0ea5e9,#0369a1)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:16, boxShadow:"0 2px 6px rgba(14,165,233,0.4)",
                }}>🤖</div>
                <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                  <span style={{ fontSize:10, color: theme==="light" ? "#1c1c1e" : "#fff", fontWeight:500, letterSpacing:"-0.1px" }}>MoggedAI</span>
                  <svg width="6" height="9" viewBox="0 0 6 9" fill="none">
                    <path d="M1 1l3 3.5L1 8" stroke={theme==="light" ? "rgba(0,0,0,0.32)" : "rgba(255,255,255,0.42)"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {/* Right side actions */}
              <div style={{ display:"flex", gap:18, justifyContent:"flex-end", paddingRight:2 }}>
                <svg width="22" height="14" viewBox="0 0 24 16" fill="none">
                  <rect x="1" y="2" width="15" height="12" rx="3" stroke="#0B84FF" strokeWidth="1.7"/>
                  <path d="M16 6.5l6-3v9l-6-3v-3z" fill="#0B84FF"/>
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
            <div style={{ display:"flex", justifyContent:"center", padding:"7px 0 8px", flexShrink:0 }}>
              <div style={{ width:134, height:5, background: theme==="light" ? "rgba(0,0,0,0.85)" : "#fff", borderRadius:3, opacity: theme==="light" ? 0.85 : 1 }}/>
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
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Gate first paint on knowing auth state — prevents the flash-of-landing-page
  // that signed-in users were seeing before the client-side redirect fires.
  const [readyToRender, setReadyToRender] = useState(false);

  // Auto-redirect signed-in users to their dashboard — but only on the
  // post-auth landing (e.g. Clerk OAuth callback). If the URL contains
  // ?home=1 (set by the dashboard logo), let them stay on the landing page.
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { setReadyToRender(true); return; }
    const params = new URLSearchParams(window.location.search);
    if (params.get("home") === "1") { setReadyToRender(true); return; }
    router.replace("/dashboard");
  }, [isLoaded, isSignedIn, router]);

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

  // ── Mobile detection — for iMessage / SMS deeplink ───────────────────────
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    setIsMobile(/iphone|ipad|ipod|android/i.test(navigator.userAgent));
  }, []);

  // SMS deeplink — opens Messages on iOS / Android with number + body prefilled.
  // iOS expects `&body=`, Android expects `?body=`. The form below works on both
  // because iOS treats the leading `?` as a no-op separator.
  const SMS_NUMBER = "+18449911147";
  const SMS_BODY  = "Hey! I want to try MoggedAI - can you help me get started?";
  const smsHref   = `sms:${SMS_NUMBER}?&body=${encodeURIComponent(SMS_BODY)}`;

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
  // Blank screen until we know whether the user is signed in and whether to
  // redirect to the dashboard — avoids the flash-of-landing-page glitch.
  if (!readyToRender) {
    return <div style={{ minHeight:"100vh", background:"var(--c-root)" }} />;
  }

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

        /* ── Hero layout ── */
        .hero-outer { padding: 6.5rem 1.5rem 3rem; max-width: 1080px; margin: 0 auto; width: 100%; min-height: 82vh; display: flex; align-items: center; }
        .hero-inner { display: flex; align-items: center; gap: 3rem; width: 100%; }
        .hero-left  { flex: 1; min-width: 0; }
        .hero-right { flex-shrink: 0; display: flex; justify-content: center; }
        .hero-btns  { display: flex; gap: 0.75rem; margin-top: 2rem; max-width: 440px; }

        /* ── Section ── */
        .section-inner { max-width: 1080px; margin: 0 auto; width: 100%; padding-left: 1.5rem; padding-right: 1.5rem; }
        .who-grid-inner { grid-template-columns: repeat(3, 1fr); }

        /* ── CTA ── */
        .cta-section { padding: 4rem 1.5rem 5rem; max-width: 1080px; margin: 0 auto; text-align: center; }

        /* ─── Mobile ─────────────────────────────── */
        @media (max-width: 860px) {
          .hero-outer  { min-height: auto; }
          .hero-inner  { flex-direction: column; gap: 2.5rem; }
          .hero-right  { width: 100%; }
          .hero-btns   { max-width: 100%; }
          .who-grid-inner { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .hero-outer  { padding: 5rem 1.1rem 2rem; }
          .hero-btns   { flex-direction: column; }
          .hero-primary-btn  { font-size: 0.8rem !important; padding: 0.9rem 1rem !important; text-align: center; }
          .hero-secondary-btn{ font-size: 0.8rem !important; padding: 0.9rem 1rem !important; text-align: center; }
          .hero-right  { transform: scale(0.78); transform-origin: center top; margin-bottom: -90px; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; }
          .who-grid-inner { grid-template-columns: 1fr !important; }
          .cta-btn     { width: 100% !important; }
          .section-inner { padding-left: 1.1rem !important; padding-right: 1.1rem !important; }
          .cta-section { padding: 3rem 1.1rem 4rem; }
        }
        @media (max-width: 400px) {
          .hero-right { transform: scale(0.68); transform-origin: center top; margin-bottom: -115px; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap" rel="stylesheet"/>
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
      <div className="hero-outer">
        <div className="hero-inner">

          {/* Left: copy */}
          <div className="hero-left">
            <div style={tag}>AI ACCOUNTABILITY · SMS · BUILT FOR RESULTS</div>
            <h1 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"clamp(4rem,8vw,7.5rem)", fontWeight:"400", lineHeight:0.95, letterSpacing:"0.02em", margin:"0 0 1.5rem", transform:`translateX(${noise*0.3}px)` }}>
              WIN THE DAY.<br/>
              <span style={{ color:"#0ea5e9" }}>EVERYDAY.</span>
            </h1>
            <p style={{ fontSize:"clamp(0.88rem,1.6vw,1rem)", color:"var(--c-text4)", maxWidth:"420px", lineHeight:"1.85", margin:0 }}>
              An AI coach that texts you throughout the day, holds you accountable, and won&apos;t let you make excuses. Set it once. Stay on track forever.
            </p>
            <div className="hero-btns">
              <button className="hero-primary-btn" style={{ background:"#0ea5e9", border:"none", color:"#fff", padding:"1rem 2rem", fontSize:"0.82rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", flex:1 }} onClick={() => isSignedIn ? router.push("/dashboard") : router.push("/sign-up")}>
                GET STARTED FREE →
              </button>
              {isSignedIn ? (
                <button className="hero-secondary-btn" style={{ background:"transparent", border:"1px solid var(--c-border)", color:"var(--c-text)", padding:"1rem 1.5rem", fontSize:"0.82rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", flex:1 }} onClick={() => router.push("/dashboard")}>
                  DASHBOARD
                </button>
              ) : (
                <button className="hero-secondary-btn" style={{ background:"transparent", border:"1px solid var(--c-border)", color:"var(--c-text)", padding:"1rem 1.5rem", fontSize:"0.82rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", flex:1 }} onClick={() => router.push("/sign-in")}>
                  LOG IN
                </button>
              )}
            </div>
            {/* iMessage CTA */}
            <a
              href={smsHref}
              style={{
                display:"inline-flex",
                alignItems:"center",
                gap:"0.55rem",
                marginTop:"1.25rem",
                background:"#34C759",
                border:"none",
                color:"#fff",
                padding:"0.85rem 1.5rem",
                fontSize:"0.82rem",
                letterSpacing:"0.12em",
                fontFamily:"inherit",
                fontWeight:"700",
                textDecoration:"none",
                cursor:"pointer",
                maxWidth:"440px",
                width:"100%",
                boxSizing:"border-box",
                justifyContent:"center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.477 2 2 6.258 2 11.5c0 2.577 1.09 4.91 2.862 6.615L3.5 22l4.197-1.33A10.7 10.7 0 0 0 12 21c5.523 0 10-4.258 10-9.5S17.523 2 12 2z"/>
              </svg>
              TEXT US ON IMESSAGE →
            </a>

            {/* Social proof nudge */}
            <div style={{ marginTop:"1.25rem", display:"flex", alignItems:"center", gap:"0.6rem" }}>
              <div style={{ display:"flex" }}>
                {["🧑","👩","🧔","👨","🙋"].map((e,i) => (
                  <div key={i} style={{ width:26, height:26, borderRadius:"50%", background:"var(--c-s2)", border:"2px solid var(--c-root)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, marginLeft: i===0 ? 0 : -8 }}>{e}</div>
                ))}
              </div>
              <span style={{ fontSize:"0.68rem", color:"var(--c-text3)", letterSpacing:"0.04em" }}>Join people hitting their goals daily</span>
            </div>
          </div>

          {/* Right: phone */}
          <div className="hero-right">
            <PhoneMockup theme={theme} />
          </div>

        </div>
      </div>

      {/* WHO IT'S FOR — premium 3-card spread */}
      <div style={{ padding:"6rem 0 6rem", borderTop:"1px solid var(--c-border)", background:"#eceff3" }}>
        <div className="section-inner" style={{ maxWidth:"1080px" }}>

          <div style={{ marginBottom:"3rem", maxWidth:"640px" }}>
            <div style={{ fontSize:"0.6rem", letterSpacing:"0.3em", color:"#0ea5e9", fontWeight:"700", marginBottom:"0.75rem" }}>
              WHO IT&apos;S FOR
            </div>
            <h2 style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(2.4rem,5.5vw,4rem)",
              fontWeight:"400",
              lineHeight:0.98,
              letterSpacing:"0.01em",
              margin:"0 0 1rem",
            }}>
              Built for anyone who <span style={{ color:"#0ea5e9" }}>follows through.</span>
            </h2>
            <p style={{ fontSize:"1rem", color:"var(--c-text3)", lineHeight:1.7, margin:0 }}>
              People already using MoggedAI to stop missing the thing that actually matters.
            </p>
          </div>

          <div className="who-cards" style={{
            display:"grid",
            gridTemplateColumns:"repeat(3, 1fr)",
            gap:"1rem",
          }}>
            {[
              {
                num:"01",
                title:"Students",
                line:"For the study sessions that turn into TikTok breaks. We quiz you, keep you off your phone, and get you through finals week without the all-nighter.",
                quote:"“Check in on my studying every hour from 4–9pm.”",
                tag:"USE CASE · EXAMS · ESSAYS · LOCK-IN",
              },
              {
                num:"02",
                title:"Builders",
                line:"For the side project collecting dust. We text you to ship one thing every day — because momentum beats motivation.",
                quote:"“Make sure I push code before bed.”",
                tag:"USE CASE · STARTUPS · PROJECTS · SHIPPING",
              },
              {
                num:"03",
                title:"Athletes",
                line:"For the 6am workouts you keep sleeping through. We wake you up, hold your streak, and call you out when you try to skip.",
                quote:"“Text me at 5:45. Don't let me snooze.”",
                tag:"USE CASE · GYM · RUNS · NUTRITION",
              },
            ].map((c) => (
              <div
                key={c.num}
                className="who-card"
                style={{
                  position:"relative",
                  background:"#fff",
                  border:"1px solid var(--c-border)",
                  padding:"1.75rem 1.5rem 1.5rem",
                  display:"flex",
                  flexDirection:"column",
                  gap:"1rem",
                  minHeight:"320px",
                  overflow:"hidden",
                  transition:"border-color 0.2s, transform 0.2s",
                }}
              >
                {/* Accent corner line */}
                <div aria-hidden style={{
                  position:"absolute",
                  top:0, left:0,
                  width:"40px", height:"2px",
                  background:"#0ea5e9",
                }}/>

                {/* Number */}
                <div style={{
                  fontFamily:"'Space Mono','Courier New',monospace",
                  fontSize:"0.6rem",
                  letterSpacing:"0.25em",
                  color:"var(--c-text5)",
                }}>
                  {c.num} / 03
                </div>

                {/* Title */}
                <div style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"2.25rem",
                  lineHeight:1,
                  letterSpacing:"0.015em",
                  color:"var(--c-text)",
                }}>
                  {c.title}
                </div>

                {/* Description */}
                <div style={{
                  fontSize:"0.95rem",
                  color:"var(--c-text3)",
                  lineHeight:1.55,
                  letterSpacing:"-0.005em",
                  flex:1,
                }}>
                  {c.line}
                </div>

                {/* Quote */}
                <div style={{
                  fontSize:"0.92rem",
                  color:"var(--c-text)",
                  fontStyle:"italic",
                  lineHeight:1.5,
                  paddingLeft:"0.85rem",
                  borderLeft:"2px solid #0ea5e9",
                }}>
                  {c.quote}
                </div>

                {/* Foot tag */}
                <div style={{
                  fontFamily:"'Space Mono','Courier New',monospace",
                  fontSize:"0.58rem",
                  letterSpacing:"0.2em",
                  color:"var(--c-text5)",
                  paddingTop:"0.75rem",
                  borderTop:"1px solid var(--c-border)",
                }}>
                  {c.tag}
                </div>
              </div>
            ))}
          </div>

          <p style={{
            marginTop:"2.5rem",
            fontSize:"1rem",
            color:"var(--c-text3)",
            lineHeight:1.7,
            maxWidth:"500px",
          }}>
            One hits too close? Good. That&apos;s exactly who we built this for.
          </p>
        </div>

        <style>{`
          .who-card:hover { border-color: #0ea5e9 !important; transform: translateY(-2px); }
          @media (max-width: 860px) {
            .who-cards { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 560px) {
            .who-cards { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background:"var(--c-s1)", borderTop:"1px solid var(--c-border)", borderBottom:"1px solid var(--c-border)", width:"100%" }}>
      <div style={{ padding:"5rem 0 5rem" }}>
        <div className="section-inner">
          <div style={{ marginBottom:"2.5rem" }}>
            <div style={{ fontSize:"0.6rem", letterSpacing:"0.3em", color:"#0ea5e9", fontWeight:"700", marginBottom:"0.5rem" }}>HOW IT WORKS</div>
            <h2 style={{ fontSize:"clamp(1.9rem,4vw,2.6rem)", fontWeight:"800", lineHeight:1.05, margin:0, letterSpacing:"-0.025em" }}>
              Set it once. <span style={{ color:"#0ea5e9" }}>Works all day.</span>
            </h2>
          </div>

          {/* Timeline steps — 2-col on desktop, 1-col on mobile */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"0" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {[
            { n:"01", title:"Set your goals",        desc:"Pick what you need to stay on top of — gym, studying, work, anything.", color:"#0ea5e9" },
            { n:"02", title:"Pick your coach style", desc:"Brutal, direct, or motivating. Every single message adapts to you.",    color:"#8b5cf6" },
            { n:"03", title:"Get texted all day",    desc:"We check in throughout the day. Every message is unique and personal.", color:"#10b981" },
            { n:"04", title:'Reply "done"',          desc:'Mark it complete. We track your streak. No reply? We follow up.',      color:"#f59e0b" },
          ].map((f, i, arr) => (
            <div key={f.n} style={{ display:"flex", gap:"1.5rem", alignItems:"stretch" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                <div style={{
                  width:54, height:54, borderRadius:"50%",
                  background:f.color,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.9rem", fontWeight:"800", color:"#fff", letterSpacing:"0.02em",
                  flexShrink:0,
                  boxShadow:`0 6px 20px ${f.color}55`,
                }}>{f.n}</div>
                {i < arr.length - 1 && (
                  <div style={{ width:2, flex:1, background:`linear-gradient(${f.color}, ${arr[i+1].color})`, opacity:0.55, minHeight:32 }}/>
                )}
              </div>
              <div style={{ paddingBottom: i < arr.length - 1 ? "2rem" : 0, paddingTop:"0.65rem" }}>
                <div style={{ fontSize:"1rem", fontWeight:"800", letterSpacing:"0.06em", color:"var(--c-text)", marginBottom:"0.5rem" }}>{f.title.toUpperCase()}</div>
                <div style={{ fontSize:"0.98rem", color:"var(--c-text2)", lineHeight:1.65, maxWidth:"440px" }}>{f.desc}</div>
              </div>
            </div>
          ))}
          </div>
          </div>
        </div>
      </div>
      </div>

      {/* FAQ */}
      <div style={{ width:"100%", borderBottom:"1px solid var(--c-border)" }}>
        <div style={{ padding:"5rem 0 5rem" }}>
          <div className="section-inner">
            <div style={{ marginBottom:"2.5rem" }}>
              <div style={{ fontSize:"0.6rem", letterSpacing:"0.3em", color:"#0ea5e9", fontWeight:"700", marginBottom:"0.5rem" }}>FAQ</div>
              <h2 style={{ fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:"700", lineHeight:1.1, margin:0, letterSpacing:"-0.02em" }}>
                Questions? We got you.
              </h2>
            </div>

            <div style={{ display:"flex", flexDirection:"column", borderTop:"1px solid var(--c-border)" }}>
              {[
                { q:"How does MoggedAI work?",                     a:"You sign up, add your goals (gym, studying, side project — whatever you're trying to stay on top of), and set a schedule. From there, your AI coach texts you throughout the day to check in. You reply back naturally and the AI responds like a real person — not a bot." },
                { q:"Do I need to open the app every day?",        a:"No. That's the whole point. Everything happens over text. The AI reaches out to you. You reply. You might not open the dashboard for weeks — and that's fine." },
                { q:"What do I text back?",                         a:"Whatever you'd text a friend. 'just did it', 'not today', 'i'm tired bro' — the AI understands normal replies. You don't need to say specific commands." },
                { q:"How often will I get texts?",                  a:"You choose during setup — every 30 minutes, every hour, every 2 hours, or every 3 hours. You also set active hours so you're not getting texts at 3am." },
                { q:"What are the different coach styles?",         a:"Direct — no fluff. Brutal — tough love that calls out your excuses. Savage — maximum pressure, no filter. Motivating — hype energy, reminds you of your why. You set this per goal." },
                { q:"Will it cost me anything to receive texts?",   a:"MoggedAI does not charge for text messages. Standard message and data rates from your mobile carrier may apply." },
                { q:"How do I stop getting texts?",                 a:"Text STOP to +1 (844) 991-1147 at any time. You'll get one confirmation and nothing after. You can re-enable from your dashboard or by texting START." },
                { q:"Is my information safe?",                      a:"Yes. Your data is stored on secure servers. We don't sell your phone number or personal information to anyone. Read our full Privacy Policy for details." },
              ].map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} style={{ borderBottom:"1px solid var(--c-border)" }}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      style={{
                        width:"100%", background:"transparent", border:"none", color:"var(--c-text)",
                        padding:"1.25rem 0", cursor:"pointer", fontFamily:"inherit", textAlign:"left",
                        display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem",
                        fontSize:"0.95rem", fontWeight:"600", letterSpacing:"-0.005em",
                      }}
                    >
                      <span>{item.q}</span>
                      <span style={{ color:"#0ea5e9", fontSize:"1.25rem", lineHeight:1, flexShrink:0, transform: isOpen ? "rotate(45deg)" : "none", transition:"transform 0.2s" }}>+</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding:"0 0 1.25rem", fontSize:"0.88rem", color:"var(--c-text4)", lineHeight:1.75, maxWidth:"640px" }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop:"2rem", textAlign:"center" }}>
              <a href="/faq" style={{ fontSize:"0.72rem", letterSpacing:"0.15em", color:"var(--c-text3)", textDecoration:"none", borderBottom:"1px solid var(--c-border)", paddingBottom:"0.25rem" }}>
                SEE ALL QUESTIONS →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <div style={{ fontSize:"0.6rem", letterSpacing:"0.3em", color:"#0ea5e9", fontWeight:"700", marginBottom:"1rem" }}>READY TO WIN?</div>
        <h2 style={{ fontSize:"clamp(1.6rem,4vw,2.6rem)", fontWeight:"700", letterSpacing:"-0.02em", lineHeight:1.1, marginBottom:"0.75rem" }}>
          Start winning your days.<br/>
          <span style={{ color:"#0ea5e9" }}>Right now.</span>
        </h2>
        <p style={{ fontSize:"0.88rem", color:"var(--c-text4)", marginBottom:"2rem", lineHeight:1.8 }}>
          Takes 2 minutes to set up. No app download needed.
        </p>
        <button className="cta-btn" style={{ background:"#0ea5e9", border:"none", color:"#fff", padding:"1.1rem 3.5rem", fontSize:"0.88rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700" }} onClick={() => isSignedIn ? router.push("/dashboard") : router.push("/sign-up")}>
          GET STARTED — IT&apos;S FREE →
        </button>
        <p style={{ fontSize:"0.6rem", color:"var(--c-text5)", marginTop:"1rem" }}>US numbers only · Reply STOP to unsubscribe anytime</p>
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
