"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MONO = "'Space Mono','Courier New',monospace";
const GROTESK = "'Space Grotesk',-apple-system,BlinkMacSystemFont,sans-serif";

const FREE_FEATURES = [
  { text: "1 active mission", included: true },
  { text: "Check-ins every 2 hours", included: true },
  { text: "Direct coach style", included: true },
  { text: "Basic AI responses", included: true },
  { text: "Habit completion tracking", included: true },
  { text: "Up to 5 missions", included: false },
  { text: "Check-ins every 30 min", included: false },
  { text: "All 4 coach styles", included: false },
  { text: "Full AI personalization", included: false },
  { text: "Weekly & monthly recap", included: false },
];

const PRO_FEATURES = [
  { text: "Up to 5 active missions", included: true },
  { text: "Check-ins every 30 min", included: true },
  { text: "All 4 coach styles", included: true },
  { text: "Full AI personalization", included: true },
  { text: "Weekly & monthly recap", included: true },
  { text: "Habit completion tracking", included: true },
  { text: "Custom active hours", included: true },
  { text: "Mission complete history", included: true },
  { text: "Priority support", included: true },
  { text: "Early access to new features", included: true },
];

export default function PricingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const monthlyPrice = 2.99;
  const yearlyPrice = 1.99;
  const price = billing === "monthly" ? monthlyPrice : yearlyPrice;
  const savings = Math.round((1 - yearlyPrice / monthlyPrice) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-root)", color: "var(--c-text)", fontFamily: GROTESK }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .price-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .price-card:hover { transform: translateY(-2px); }
      `}</style>

      {/* Nav */}
      <nav style={{ position:"sticky", top:0, zIndex:50, background:"var(--c-nav)", borderBottom:"1px solid var(--c-border)", padding:"0 1.5rem", backdropFilter:"blur(8px)" }}>
        <div style={{ maxWidth:900, margin:"0 auto", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button onClick={() => router.push("/")} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:MONO, fontSize:"0.85rem", letterSpacing:"0.05em", color:"var(--c-text)" }}>
            MOGGED<span style={{ color:"#0ea5e9" }}>AI</span>
          </button>
          <div style={{ display:"flex", gap:"0.5rem" }}>
            <button onClick={() => router.push("/sign-in")} style={{ background:"none", border:"1px solid var(--c-border)", color:"var(--c-text3)", fontFamily:MONO, fontSize:"0.6rem", letterSpacing:"0.1em", padding:"0.35rem 0.75rem", cursor:"pointer" }}>LOG IN</button>
            <button onClick={() => router.push("/sign-up")} style={{ background:"#0ea5e9", border:"none", color:"#fff", fontFamily:MONO, fontSize:"0.6rem", letterSpacing:"0.1em", padding:"0.35rem 0.75rem", cursor:"pointer", fontWeight:700 }}>GET STARTED</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"4rem 1.5rem 6rem" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"3rem", animation:"fadeUp 0.5s ease both" }}>
          <div style={{ fontFamily:MONO, fontSize:"0.6rem", color:"#0ea5e9", letterSpacing:"0.25em", marginBottom:"1rem" }}>PRICING</div>
          <h1 style={{ fontFamily:MONO, fontWeight:700, fontSize:"clamp(1.8rem,5vw,2.8rem)", color:"var(--c-text)", marginBottom:"1rem", lineHeight:1.1 }}>
            STOP MAKING EXCUSES.<br />START TODAY.
          </h1>
          <p style={{ fontFamily:GROTESK, fontSize:"1rem", color:"var(--c-text3)", maxWidth:480, margin:"0 auto", lineHeight:1.7 }}>
            No fluff. No bloated subscriptions. Just an AI that texts you until you do the thing.
          </p>
        </div>

        {/* Billing toggle */}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"1rem", marginBottom:"3rem", animation:"fadeUp 0.5s ease 0.1s both" }}>
          <button
            onClick={() => setBilling("monthly")}
            style={{ background:"none", border:"none", fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.1em", cursor:"pointer", color: billing === "monthly" ? "var(--c-text)" : "var(--c-text3)", borderBottom: billing === "monthly" ? "2px solid #0ea5e9" : "2px solid transparent", paddingBottom:"0.25rem" }}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setBilling("yearly")}
            style={{ background:"none", border:"none", fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.1em", cursor:"pointer", color: billing === "yearly" ? "var(--c-text)" : "var(--c-text3)", borderBottom: billing === "yearly" ? "2px solid #0ea5e9" : "2px solid transparent", paddingBottom:"0.25rem", display:"flex", alignItems:"center", gap:"0.5rem" }}
          >
            YEARLY
            <span style={{ background:"#22c55e", color:"#000", fontFamily:MONO, fontSize:"0.5rem", padding:"0.15rem 0.4rem", fontWeight:700, letterSpacing:"0.05em" }}>
              SAVE {savings}%
            </span>
          </button>
        </div>

        {/* Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"1.5rem", animation:"fadeUp 0.5s ease 0.2s both" }}>

          {/* Free */}
          <div className="price-card" style={{ border:"1px solid var(--c-border)", background:"var(--c-s1)", padding:"2rem", display:"flex", flexDirection:"column" }}>
            <div style={{ marginBottom:"1.5rem" }}>
              <div style={{ fontFamily:MONO, fontSize:"0.6rem", letterSpacing:"0.2em", color:"var(--c-text3)", marginBottom:"0.5rem" }}>FREE</div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:"0.25rem", marginBottom:"0.5rem" }}>
                <span style={{ fontFamily:MONO, fontWeight:700, fontSize:"clamp(2.2rem,6vw,3rem)", color:"var(--c-text)", lineHeight:1 }}>$0</span>
                <span style={{ fontFamily:MONO, fontSize:"0.65rem", color:"var(--c-text3)", paddingBottom:"0.4rem" }}>/mo</span>
              </div>
              <p style={{ fontFamily:GROTESK, fontSize:"0.85rem", color:"var(--c-text3)", margin:0, lineHeight:1.6 }}>
                Get started and see if the AI actually keeps you accountable.
              </p>
            </div>

            <div style={{ flex:1, marginBottom:"2rem" }}>
              {FREE_FEATURES.map((f, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.5rem 0", borderBottom:`1px solid var(--c-border)` }}>
                  <span style={{ fontSize:"0.85rem", lineHeight:1, flexShrink:0, color: f.included ? "#22c55e" : "var(--c-text3)" }}>
                    {f.included ? "✓" : "✕"}
                  </span>
                  <span style={{ fontFamily:GROTESK, fontSize:"0.85rem", color: f.included ? "var(--c-text)" : "var(--c-text3)" }}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/sign-up")}
              style={{ width:"100%", background:"transparent", border:"1px solid var(--c-border)", color:"var(--c-text)", fontFamily:MONO, fontSize:"0.7rem", letterSpacing:"0.15em", fontWeight:700, padding:"1rem", cursor:"pointer" }}
            >
              START FOR FREE →
            </button>
          </div>

          {/* Pro */}
          <div className="price-card" style={{ border:"2px solid #0ea5e9", background:"var(--c-s1)", padding:"2rem", display:"flex", flexDirection:"column", position:"relative" }}>

            {/* Badge */}
            <div style={{ position:"absolute", top:"-1px", right:"1.5rem", background:"#0ea5e9", color:"#fff", fontFamily:MONO, fontSize:"0.5rem", letterSpacing:"0.15em", fontWeight:700, padding:"0.3rem 0.75rem" }}>
              MOST POPULAR
            </div>

            <div style={{ marginBottom:"1.5rem" }}>
              <div style={{ fontFamily:MONO, fontSize:"0.6rem", letterSpacing:"0.2em", color:"#0ea5e9", marginBottom:"0.5rem" }}>PRO</div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:"0.25rem", marginBottom:"0.25rem" }}>
                <span style={{ fontFamily:MONO, fontWeight:700, fontSize:"clamp(2.2rem,6vw,3rem)", color:"var(--c-text)", lineHeight:1 }}>${price.toFixed(2)}</span>
                <span style={{ fontFamily:MONO, fontSize:"0.65rem", color:"var(--c-text3)", paddingBottom:"0.4rem" }}>
                  /mo{billing === "yearly" ? " billed yearly" : ""}
                </span>
              </div>
              {billing === "yearly" && (
                <div style={{ fontFamily:MONO, fontSize:"0.55rem", color:"#22c55e", letterSpacing:"0.1em", marginBottom:"0.5rem" }}>
                  ${(yearlyPrice * 12).toFixed(2)}/year — save ${((monthlyPrice - yearlyPrice) * 12).toFixed(2)}
                </div>
              )}
              <p style={{ fontFamily:GROTESK, fontSize:"0.85rem", color:"var(--c-text3)", margin:0, lineHeight:1.6 }}>
                Full access. The AI that actually gets in your face and makes you do it.
              </p>
            </div>

            <div style={{ flex:1, marginBottom:"2rem" }}>
              {PRO_FEATURES.map((f, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.5rem 0", borderBottom:`1px solid var(--c-border)` }}>
                  <span style={{ fontSize:"0.85rem", lineHeight:1, flexShrink:0, color:"#0ea5e9" }}>✓</span>
                  <span style={{ fontFamily:GROTESK, fontSize:"0.85rem", color:"var(--c-text)" }}>{f.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/sign-up")}
              style={{ width:"100%", background:"#0ea5e9", border:"none", color:"#fff", fontFamily:MONO, fontSize:"0.7rem", letterSpacing:"0.15em", fontWeight:700, padding:"1rem", cursor:"pointer" }}
            >
              GET PRO →
            </button>
          </div>
        </div>

        {/* Bottom note */}
        <div style={{ textAlign:"center", marginTop:"2.5rem", animation:"fadeUp 0.5s ease 0.3s both" }}>
          <p style={{ fontFamily:MONO, fontSize:"0.6rem", color:"var(--c-text3)", letterSpacing:"0.1em", lineHeight:1.8 }}>
            No credit card required for free tier · Cancel anytime · Standard SMS rates may apply
          </p>
        </div>

        {/* FAQ teaser */}
        <div style={{ marginTop:"4rem", borderTop:"1px solid var(--c-border)", paddingTop:"3rem", textAlign:"center" }}>
          <p style={{ fontFamily:MONO, fontSize:"0.65rem", color:"var(--c-text3)", letterSpacing:"0.15em", marginBottom:"1rem" }}>HAVE QUESTIONS?</p>
          <button
            onClick={() => router.push("/faq")}
            style={{ background:"none", border:"1px solid var(--c-border)", color:"var(--c-text2)", fontFamily:MONO, fontSize:"0.65rem", letterSpacing:"0.1em", padding:"0.65rem 1.5rem", cursor:"pointer" }}
          >
            VIEW FAQ →
          </button>
        </div>
      </div>
    </div>
  );
}
