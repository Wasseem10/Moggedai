"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";



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
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"5rem 1.5rem 2rem", maxWidth:"920px", margin:"0 auto" }}>
        <div style={tag}>AI ACCOUNTABILITY · SMS · BUILT FOR RESULTS</div>
        <h1 style={{ fontSize:"clamp(2.8rem,8vw,5.5rem)", fontWeight:"700", lineHeight:0.95, letterSpacing:"-0.02em", wordSpacing:"-0.15em", marginBottom:"1rem", transform:`translateX(${noise*0.3}px)` }}>
          STOP<br/><span style={{ color:"#0ea5e9" }}>SLACKING.</span><br/>START NOW.
        </h1>
        <p style={{ fontSize:"clamp(0.95rem,2vw,1.05rem)", color:"var(--c-text4)", maxWidth:"500px", lineHeight:"1.9", marginBottom:"2rem" }}>
          Get daily habit reminders by text.<br/>Built to make sure you follow through.
        </p>
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"5rem" }}>
          <button style={{ background:"#0ea5e9", border:"none", color:"#fff", padding:"1rem 2.5rem", fontSize:"0.85rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700" }} onClick={() => isSignedIn ? router.push("/dashboard") : router.push("/sign-up")}>
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
              <div key={c.habit} style={{ background:"var(--c-s1)", border:"1px solid var(--c-border)", borderRadius:"16px", padding:"1.25rem", display:"flex", flexDirection:"column", gap:"8px" }}>
                <div style={{ fontSize:"0.5rem", color:"#0ea5e9", letterSpacing:"0.2em", marginBottom:"4px" }}>{c.habit}</div>
                {/* Coach message */}
                <div style={{ background:"var(--c-s2)", borderRadius:"10px 10px 10px 0", padding:"0.7rem 0.85rem" }}>
                  <div style={{ fontSize:"0.75rem", color:"var(--c-text2)", lineHeight:"1.6" }}>{c.msg}</div>
                  <div style={{ fontSize:"0.45rem", color:"var(--c-text3)", textAlign:"right", marginTop:"6px" }}>{c.time1}</div>
                </div>
                {/* User reply */}
                <div style={{ background:"#0ea5e9", borderRadius:"10px 10px 0 10px", padding:"0.6rem 0.85rem", alignSelf:"flex-end", maxWidth:"80%" }}>
                  <div style={{ fontSize:"0.68rem", color:"#fff" }}>{c.reply}</div>
                  <div style={{ fontSize:"0.45rem", color:"rgba(255,255,255,0.6)", textAlign:"right", marginTop:"4px" }}>{c.time2}</div>
                </div>
                {/* Coach response */}
                <div style={{ background:"var(--c-s2)", borderRadius:"10px 10px 10px 0", padding:"0.7rem 0.85rem" }}>
                  <div style={{ fontSize:"0.75rem", color:"var(--c-text2)", lineHeight:"1.6" }}>{c.response}</div>
                  <div style={{ fontSize:"0.45rem", color:"var(--c-text3)", textAlign:"right", marginTop:"6px" }}>{c.time3}</div>
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

      {/* CTA */}
      <div style={{ padding:"3rem 1.5rem 4rem", maxWidth:"920px", margin:"0 auto", textAlign:"center" }}>
        <button style={{ background:"#0ea5e9", border:"none", color:"#fff", padding:"1.1rem 3rem", fontSize:"0.9rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700" }} onClick={() => isSignedIn ? router.push("/dashboard") : router.push("/sign-up")}>
          GET STARTED — IT&apos;S FREE
        </button>
        <p style={{ fontSize:"0.6rem", color:"#555", marginTop:"1rem" }}>US numbers only · Reply STOP to unsubscribe anytime</p>
      </div>

      {/* PRICING */}
      <div style={{ padding:"5rem 1.5rem", maxWidth:"920px", margin:"0 auto" }}>
        <div style={{ fontSize:"0.85rem", letterSpacing:"0.25em", color:"var(--c-text)", fontWeight:"700", marginBottom:"0.5rem", display:"flex", alignItems:"center", gap:"1rem" }}>
          PRICING <div style={{ flex:1, height:"1px", background:"var(--c-border)" }}/>
        </div>
        <p style={{ fontSize:"0.85rem", color:"var(--c-text4)", lineHeight:"1.8", marginBottom:"3rem", maxWidth:"520px" }}>
          Less than a coffee. No excuses.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1px", background:"var(--c-border)" }}>
          {/* Free */}
          <div style={{ background:"var(--c-root)", padding:"2rem 1.5rem" }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.55rem", letterSpacing:"0.2em", color:"var(--c-text3)", marginBottom:"0.75rem" }}>FREE</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontWeight:700, fontSize:"2.5rem", color:"var(--c-text)", lineHeight:1, marginBottom:"0.25rem" }}>$0</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.55rem", color:"var(--c-text3)", marginBottom:"1.5rem" }}>forever</div>
            {["1 active mission","Check-ins every 2 hours","Direct coach style","Basic AI responses"].map(f => (
              <div key={f} style={{ display:"flex", gap:"0.6rem", alignItems:"center", marginBottom:"0.6rem" }}>
                <span style={{ color:"#22c55e", fontSize:"0.75rem", lineHeight:1 }}>✓</span>
                <span style={{ fontSize:"0.8rem", color:"var(--c-text2)" }}>{f}</span>
              </div>
            ))}
            <button
              onClick={() => router.push("/sign-up")}
              style={{ width:"100%", background:"transparent", border:"1px solid var(--c-border2)", color:"var(--c-text)", padding:"0.85rem", fontSize:"0.7rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", marginTop:"1.5rem" }}
            >
              GET STARTED FREE →
            </button>
          </div>
          {/* Pro */}
          <div style={{ background:"var(--c-root)", padding:"2rem 1.5rem", position:"relative", outline:"2px solid #0ea5e9", outlineOffset:"-1px" }}>
            <div style={{ position:"absolute", top:0, right:"1.5rem", background:"#0ea5e9", color:"#fff", fontFamily:"'Space Mono',monospace", fontSize:"0.5rem", letterSpacing:"0.15em", fontWeight:700, padding:"0.25rem 0.65rem" }}>MOST POPULAR</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.55rem", letterSpacing:"0.2em", color:"#0ea5e9", marginBottom:"0.75rem" }}>PRO</div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:"0.25rem", marginBottom:"0.25rem" }}>
              <span style={{ fontFamily:"'Space Mono',monospace", fontWeight:700, fontSize:"2.5rem", color:"var(--c-text)", lineHeight:1 }}>$2.99</span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.55rem", color:"var(--c-text3)", paddingBottom:"0.4rem" }}>/mo</span>
            </div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"0.55rem", color:"var(--c-text3)", marginBottom:"1.5rem" }}>or $1.99/mo billed yearly</div>
            {["Up to 5 missions","Check-ins every 30 min","All 4 coach styles","Full AI personalization","Weekly & monthly recap","Mission complete history"].map(f => (
              <div key={f} style={{ display:"flex", gap:"0.6rem", alignItems:"center", marginBottom:"0.6rem" }}>
                <span style={{ color:"#0ea5e9", fontSize:"0.75rem", lineHeight:1 }}>✓</span>
                <span style={{ fontSize:"0.8rem", color:"var(--c-text2)" }}>{f}</span>
              </div>
            ))}
            <button
              onClick={() => router.push("/sign-up")}
              style={{ width:"100%", background:"#0ea5e9", border:"none", color:"#fff", padding:"0.85rem", fontSize:"0.7rem", letterSpacing:"0.15em", cursor:"pointer", fontFamily:"inherit", fontWeight:"700", marginTop:"1.5rem" }}
            >
              GET PRO →
            </button>
          </div>
        </div>
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
              <a href="mailto:support@moggedai.com"
                style={{ fontSize:"0.68rem", color:"var(--c-text3)", textDecoration:"none", letterSpacing:"0.05em" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color="#0ea5e9"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color="var(--c-text3)"; }}
              >support@moggedai.com</a>
            </div>

            {/* Product */}
            <div>
              <div style={{ fontSize:"0.5rem", letterSpacing:"0.25em", color:"#666", marginBottom:"1rem" }}>PRODUCT</div>
              {[
                { label:"How It Works", href:"/how-it-works" },
                { label:"Pricing",      href:"/pricing" },
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
                { label:"Contact Us",      href:"mailto:support@moggedai.com" },
                { label:"SMS Help",        href:"mailto:support@moggedai.com" },
                { label:"Report a Bug",    href:"mailto:support@moggedai.com?subject=Bug Report" },
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
                { label:"Unsubscribe",       href:"mailto:support@moggedai.com?subject=Unsubscribe" },
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
