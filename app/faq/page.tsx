"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MONO = "'Space Mono','Courier New',monospace";
const GROTESK = "'Space Grotesk',-apple-system,BlinkMacSystemFont,sans-serif";

const FAQS = [
  {
    q: "How does MoggedAI work?",
    a: "You sign up, add your habits (gym, studying, side project — whatever you're trying to stay on top of), and set a schedule. From there, your AI coach texts you throughout the day to check in. You reply back naturally and the AI responds like a real person — not a bot.",
  },
  {
    q: "Do I need to open the app every day?",
    a: "No. That's the whole point. Everything happens over text. The AI reaches out to you. You reply. You might not open the dashboard for weeks — and that's fine.",
  },
  {
    q: "What do I text back?",
    a: "Whatever you'd text a friend. 'just did it', 'not today', 'i'm tired bro' — the AI understands normal replies. You don't need to say specific commands. Just respond naturally.",
  },
  {
    q: "How often will I get texts?",
    a: "You choose when you set up your account — every 30 minutes, every hour, every 2 hours, or every 3 hours. You also set active hours so you're not getting texts at 3am.",
  },
  {
    q: "Can I change my schedule after signing up?",
    a: "Yes. Go to your dashboard and update your schedule or pause messages anytime. You can also text STOP to immediately stop all messages.",
  },
  {
    q: "What are the different coach styles?",
    a: "Direct — no fluff, just facts. Brutal — tough love, calls out your excuses. Savage — maximum pressure, no filter. Motivating — hype energy, reminds you of your why. You set this per mission.",
  },
  {
    q: "What is a mission?",
    a: "That's what we call a habit. You can have up to 5 active missions at a time. Each one has its own context — your why, your go-to excuse, what's at stake — which the AI uses to make messages personal to you.",
  },
  {
    q: "Will it cost me anything to receive texts?",
    a: "MoggedAI does not charge for text messages. Standard message and data rates from your mobile carrier may apply.",
  },
  {
    q: "How do I stop getting texts?",
    a: "Text STOP to +1 (844) 991-1147 at any time. You'll get one confirmation message and nothing after that. You can re-enable from your dashboard or by texting START.",
  },
  {
    q: "Is my information safe?",
    a: "Yes. Your data is stored on secure servers. We don't sell your phone number or personal information to anyone. Read our full Privacy Policy for details.",
  },
  {
    q: "What if I miss a day?",
    a: "The AI will notice and might call you out on it depending on your coach style. Streaks reset but your history stays. Just get back on it.",
  },
  {
    q: "Can I add my own custom habit?",
    a: "Yes. When adding a mission you can type any habit name and emoji you want — you're not limited to the presets.",
  },
];

export default function FAQPage() {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-root)", color: "var(--c-text)", fontFamily: GROTESK }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--c-nav)", borderBottom: "1px solid var(--c-border)", padding: "0 1.5rem", backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: MONO, fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--c-text)" }}>
            MOGGED<span style={{ color: "#0ea5e9" }}>AI</span>
          </button>
          <button onClick={() => router.back()} style={{ background: "none", border: "1px solid var(--c-border)", color: "var(--c-text3)", fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em", padding: "0.35rem 0.75rem", cursor: "pointer" }}>
            ← BACK
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: "#0ea5e9", letterSpacing: "0.25em", marginBottom: "0.75rem" }}>SUPPORT</div>
        <h1 style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(1.4rem,4vw,2rem)", marginBottom: "0.5rem", color: "var(--c-text)" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontFamily: GROTESK, fontSize: "0.95rem", color: "var(--c-text3)", marginBottom: "3rem", lineHeight: 1.7 }}>
          Everything you need to know about MoggedAI.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                borderTop: i === 0 ? `1px solid var(--c-border)` : undefined,
                borderBottom: `1px solid var(--c-border)`,
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "1.25rem 0",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  textAlign: "left",
                }}
              >
                <span style={{ fontFamily: GROTESK, fontWeight: 600, fontSize: "0.95rem", color: "var(--c-text)", lineHeight: 1.5 }}>
                  {faq.q}
                </span>
                <span style={{
                  fontFamily: MONO, fontSize: "1rem", color: "#0ea5e9",
                  flexShrink: 0, lineHeight: 1,
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  display: "inline-block",
                }}>
                  +
                </span>
              </button>
              {open === i && (
                <div style={{
                  fontFamily: GROTESK, fontSize: "0.9rem", color: "var(--c-text2)",
                  lineHeight: 1.8, paddingBottom: "1.25rem",
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem", padding: "1.5rem", background: "var(--c-s1)", border: "1px solid var(--c-border)", textAlign: "center" }}>
          <p style={{ fontFamily: MONO, fontSize: "0.65rem", color: "var(--c-text3)", letterSpacing: "0.1em", margin: "0 0 0.75rem 0" }}>
            STILL HAVE QUESTIONS?
          </p>
          <a
            href="mailto:wasseem@moggedai.com"
            style={{ fontFamily: MONO, fontSize: "0.7rem", color: "#0ea5e9", letterSpacing: "0.1em", textDecoration: "none" }}
          >
            wasseem@moggedai.com
          </a>
        </div>
      </div>
    </div>
  );
}
