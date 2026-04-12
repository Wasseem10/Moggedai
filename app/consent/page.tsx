"use client";
import { useRouter } from "next/navigation";

const MONO = "'Space Mono','Courier New',monospace";
const GROTESK = "'Space Grotesk',-apple-system,BlinkMacSystemFont,sans-serif";

export default function ConsentPage() {
  const router = useRouter();
  const sections = [
    {
      title: "What You're Agreeing To",
      body: `When you provide your phone number and check the consent box during MoggedAI setup, you are agreeing to receive recurring automated SMS text messages from MoggedAI at the phone number you provided.\n\nThese messages are AI-generated accountability check-ins related to the habits you set up in your dashboard.`,
    },
    {
      title: "Message Frequency",
      body: `Message frequency varies based on the schedule you choose during setup:\n\n• Every 30 minutes (most frequent)\n• Every hour\n• Every 2 hours\n• Every 3 hours\n\nYou can adjust your schedule or pause messages at any time from your dashboard.`,
    },
    {
      title: "Costs",
      body: `MoggedAI does not charge for SMS messages. However, standard message and data rates from your mobile carrier may apply.`,
    },
    {
      title: "How to Opt Out",
      body: `Text STOP to +1 (844) 991-1147 at any time to unsubscribe. You will receive a confirmation and no further messages will be sent. Text START to re-enable, or manage from your dashboard.`,
    },
    {
      title: "How to Get Help",
      body: `Text HELP to +1 (844) 991-1147, or email wasseem@moggedai.com`,
    },
    {
      title: "Your Privacy",
      body: `Your phone number is used only to deliver the MoggedAI service. We do not sell your number. See our full Privacy Policy at moggedai-production.up.railway.app/privacy`,
    },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"var(--c-root)", color:"var(--c-text)", fontFamily:GROTESK }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <nav style={{ position:"sticky", top:0, zIndex:50, background:"var(--c-nav)", borderBottom:"1px solid var(--c-border)", padding:"0 1.5rem", backdropFilter:"blur(8px)" }}>
        <div style={{ maxWidth:720, margin:"0 auto", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button onClick={() => router.push("/")} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:MONO, fontSize:"0.85rem", letterSpacing:"0.05em", color:"var(--c-text)" }}>
            MOGGED<span style={{ color:"#0ea5e9" }}>AI</span>
          </button>
          <button onClick={() => router.back()} style={{ background:"none", border:"1px solid var(--c-border)", color:"var(--c-text3)", fontFamily:MONO, fontSize:"0.6rem", letterSpacing:"0.1em", padding:"0.35rem 0.75rem", cursor:"pointer" }}>
            ← BACK
          </button>
        </div>
      </nav>
      <div style={{ maxWidth:720, margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>
        <div style={{ fontFamily:MONO, fontSize:"0.6rem", color:"#0ea5e9", letterSpacing:"0.25em", marginBottom:"0.75rem" }}>LEGAL</div>
        <h1 style={{ fontFamily:MONO, fontWeight:700, fontSize:"clamp(1.4rem,4vw,2rem)", marginBottom:"0.5rem", color:"var(--c-text)" }}>SMS Consent</h1>
        <p style={{ fontFamily:MONO, fontSize:"0.65rem", color:"var(--c-text3)", marginBottom:"3rem", letterSpacing:"0.1em" }}>Last updated: April 12, 2025</p>
        {sections.map((s) => (
          <div key={s.title} style={{ marginBottom:"2.5rem" }}>
            <h2 style={{ fontFamily:MONO, fontWeight:700, fontSize:"0.85rem", letterSpacing:"0.1em", color:"#0ea5e9", marginBottom:"0.85rem" }}>{s.title}</h2>
            <div style={{ fontSize:"0.9rem", color:"var(--c-text2)", lineHeight:1.8, whiteSpace:"pre-line" }}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
