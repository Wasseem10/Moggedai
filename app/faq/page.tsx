"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const mono = "'Space Mono','Courier New',monospace";
const C = { bg: "#080808", text: "#f0f0f0", red: "#38bdf8", muted: "#444", border: "#1a1a1a", card: "#0d0d0d" };

const FAQS = [
  {
    category: "GETTING STARTED",
    items: [
      {
        q: "How does MoggedAI work?",
        a: "You set up your habits once on our website — takes about 2 minutes. Then we text your phone throughout the day checking in on each habit. Reply 'done' when you finish something. If you don't reply, we follow up in 5 minutes. That's it. No app to open.",
      },
      {
        q: "Do I need to download an app?",
        a: "No. MoggedAI runs entirely over SMS. You set up on our website once and everything else happens through text messages. Your phone is already the app.",
      },
      {
        q: "What phone numbers are supported?",
        a: "Currently US numbers only (+1). International support is coming soon.",
      },
      {
        q: "Is it free?",
        a: "Yes, free during our launch period. We'll introduce paid plans later with advanced features, but early users will always get a great deal.",
      },
    ],
  },
  {
    category: "SMS & TEXTING",
    items: [
      {
        q: "What do I text to mark something done?",
        a: "Just reply 'done' to any check-in text. We'll log your completion, update your streak, and send a coach response.",
      },
      {
        q: "What other commands can I text?",
        a: "'STREAK' — see your current streak for all habits.\n'HABITS' — list all your active habits and how many times you've completed each.\n'SKIP' — acknowledge you're skipping a check-in.\n'STOP' — pause all texts.\n'START' — resume texts after pausing.",
      },
      {
        q: "What if I text something other than 'done' or a command?",
        a: "Our AI coach reads your message and responds. Vent, explain yourself, make excuses — the coach will fire back based on your selected style.",
      },
      {
        q: "Why am I not getting texts?",
        a: "Check that your active hours are set correctly in your dashboard. Texts only send during your active window in your local timezone. Also make sure your schedule isn't paused.",
      },
      {
        q: "How do I stop texts?",
        a: "Text STOP to our number and we'll immediately pause your account. Text START anytime to resume. You can also toggle this in your dashboard.",
      },
    ],
  },
  {
    category: "HABITS & STREAKS",
    items: [
      {
        q: "How many habits can I track?",
        a: "Up to 5 habits at once. We rotate through them throughout the day so each one gets attention.",
      },
      {
        q: "How does the streak system work?",
        a: "Every day you complete a habit by replying 'done' counts toward your streak. Miss a day and the streak resets. You can view all streaks by texting STREAK or checking your dashboard.",
      },
      {
        q: "Can I add or remove habits after signing up?",
        a: "Yes. Go to your dashboard and you can add new habits or remove existing ones at any time. Changes take effect immediately.",
      },
      {
        q: "How does habit rotation work?",
        a: "We pick whichever habit was checked in on least recently, so every habit gets equal attention throughout the day. If you have 3 habits and get texted 3 times, each habit gets one check-in.",
      },
    ],
  },
  {
    category: "COACH STYLES",
    items: [
      {
        q: "What are the coach styles?",
        a: "Brutal: No mercy. Harsh, blunt, zero sympathy. Gets in your face.\nDirect: Sharp and no-nonsense. No fluff, just clarity.\nMotivating: Intense but positive. Pushes you forward without tearing you down.",
      },
      {
        q: "Can I change my coach style?",
        a: "Yes — re-do the onboarding (takes 2 minutes) or contact support and we'll update it for you. Dashboard coach style editing is coming soon.",
      },
    ],
  },
  {
    category: "PRIVACY & ACCOUNT",
    items: [
      {
        q: "What data do you store?",
        a: "We store your phone number, habits, check-in messages, and completion history. We do not sell your data to third parties. Read our full Privacy Policy for details.",
      },
      {
        q: "How do I delete my account?",
        a: "Email support@moggedai.com with your phone number and we'll delete all your data within 24 hours.",
      },
      {
        q: "Is my data secure?",
        a: "Yes. All data is encrypted in transit and at rest. We use industry-standard security practices.",
      },
    ],
  },
];

export default function FAQ() {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: mono }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderBottom: `1px solid rgba(56,189,248,0.2)`, background: "rgba(8,8,8,0.97)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ fontSize: "1.1rem", fontWeight: "700", letterSpacing: "0.15em", cursor: "pointer" }} onClick={() => router.push("/")}>
          MOGGED<span style={{ color: C.red }}>AI</span>
        </div>
        <button
          style={{ background: C.red, border: "none", color: "#fff", padding: "0.5rem 1.25rem", fontSize: "0.7rem", letterSpacing: "0.1em", cursor: "pointer", fontFamily: mono, fontWeight: "700" }}
          onClick={() => router.push("/")}
        >
          GET STARTED →
        </button>
      </nav>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.25rem 6rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.25em", color: C.red, border: `1px solid rgba(56,189,248,0.3)`, padding: "0.25rem 0.7rem", display: "inline-block", marginBottom: "1rem" }}>FAQ</div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: "700", lineHeight: 1.1, margin: "0 0 0.75rem" }}>
            Frequently asked<br /><span style={{ color: C.red }}>questions.</span>
          </h1>
          <p style={{ fontSize: "0.8rem", color: C.muted, lineHeight: "1.8", margin: 0 }}>
            Can&apos;t find what you&apos;re looking for? Email us at{" "}
            <a href="mailto:support@moggedai.com" style={{ color: C.red, textDecoration: "none" }}>support@moggedai.com</a>
          </p>
        </div>

        {/* FAQ sections */}
        {FAQS.map(section => (
          <div key={section.category} style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "0.5rem", letterSpacing: "0.3em", color: "#333", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              {section.category}
              <div style={{ flex: 1, height: "1px", background: "#111" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: C.border }}>
              {section.items.map(item => {
                const isOpen = open === item.q;
                return (
                  <div key={item.q} style={{ background: C.card }}>
                    <button
                      onClick={() => setOpen(isOpen ? null : item.q)}
                      style={{ width: "100%", background: "transparent", border: "none", color: C.text, padding: "1.1rem 1.25rem", cursor: "pointer", fontFamily: mono, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}
                    >
                      <span style={{ fontSize: "0.78rem", fontWeight: "700", lineHeight: "1.4" }}>{item.q}</span>
                      <span style={{ color: C.red, fontSize: "1rem", flexShrink: 0, transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "0 1.25rem 1.1rem", borderTop: `1px solid ${C.border}` }}>
                        {item.a.split("\n").map((line, i) => (
                          <p key={i} style={{ fontSize: "0.75rem", color: C.muted, lineHeight: "1.8", margin: i === 0 ? "0.75rem 0 0" : "0.5rem 0 0" }}>
                            {line}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "2rem", textAlign: "center", marginTop: "3rem" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.5rem" }}>Still have questions?</p>
          <p style={{ fontSize: "0.7rem", color: C.muted, marginBottom: "1.5rem" }}>We&apos;ll get back to you within 24 hours.</p>
          <a href="mailto:support@moggedai.com"
            style={{ background: C.red, color: "#fff", padding: "0.75rem 2rem", fontSize: "0.72rem", letterSpacing: "0.1em", fontWeight: "700", textDecoration: "none", fontFamily: mono, display: "inline-block" }}>
            EMAIL SUPPORT →
          </a>
        </div>
      </div>
    </div>
  );
}
