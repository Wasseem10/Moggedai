"use client";
import { useRouter } from "next/navigation";

const MONO = "'Space Mono','Courier New',monospace";
const GROTESK = "'Space Grotesk',-apple-system,BlinkMacSystemFont,sans-serif";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-root)", color: "var(--c-text)", fontFamily: GROTESK }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Nav */}
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
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: "#0ea5e9", letterSpacing: "0.25em", marginBottom: "0.75rem" }}>LEGAL</div>
        <h1 style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(1.4rem,4vw,2rem)", marginBottom: "0.5rem", color: "var(--c-text)" }}>Privacy Policy</h1>
        <p style={{ fontFamily: MONO, fontSize: "0.65rem", color: "var(--c-text3)", marginBottom: "3rem", letterSpacing: "0.1em" }}>
          Last updated: April 12, 2025
        </p>

        {[
          {
            title: "1. Overview",
            body: `MoggedAI ("we", "us", or "our") operates moggedai.com and provides an SMS-based AI accountability service. This Privacy Policy explains how we collect, use, and protect your personal information when you use our service.

By using MoggedAI, you agree to the collection and use of information as described in this policy.`,
          },
          {
            title: "2. Information We Collect",
            body: `We collect the following information when you sign up and use MoggedAI:

• Name and email address (via Clerk authentication)
• Phone number (for SMS delivery)
• Habit information you provide (habit name, your "why", goals, excuses)
• SMS message history between you and the AI coach
• Completion logs (when you mark habits as done)
• Schedule preferences (active hours, frequency)
• Device timezone`,
          },
          {
            title: "3. How We Use Your Information",
            body: `We use your information solely to provide and improve the MoggedAI service:

• To send you personalized AI accountability text messages via SMS
• To track your habit streaks and completion history
• To personalize AI coaching messages based on your goals and context
• To operate and maintain the platform
• To contact you with service-related updates

We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
          },
          {
            title: "4. SMS Messaging",
            body: `By providing your phone number and consenting during setup, you agree to receive recurring automated SMS messages from MoggedAI. These messages are sent via Twilio, our SMS delivery provider.

Message frequency varies based on your chosen schedule (every 30 minutes to every 3 hours). Standard message and data rates may apply.

You can opt out at any time by texting STOP to our number. You will receive a confirmation and no further messages will be sent. Text START to re-enable messages.`,
          },
          {
            title: "5. Data Storage & Security",
            body: `Your data is stored on secure servers hosted by Railway (railway.app). We use industry-standard security measures to protect your information.

Authentication is handled by Clerk (clerk.com), which manages your login credentials securely. We do not store your password.

SMS messages are delivered through Twilio (twilio.com). Twilio may retain message metadata as per their own privacy policy.`,
          },
          {
            title: "6. Third-Party Services",
            body: `MoggedAI uses the following third-party services:

• Clerk — authentication and user management (clerk.com/privacy)
• Twilio — SMS delivery (twilio.com/legal/privacy)
• Railway — hosting and database (railway.app/legal/privacy)
• Google Gemini — AI message generation (ai.google.dev)

Each service has its own privacy policy governing how they handle data.`,
          },
          {
            title: "7. Data Retention",
            body: `We retain your data for as long as your account is active. If you delete your account, your personal data will be removed from our systems within 30 days, except where retention is required by law.

Message logs and completion history may be retained in anonymized form for service improvement.`,
          },
          {
            title: "8. Your Rights",
            body: `You have the right to:

• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your account and data
• Opt out of SMS messages at any time (text STOP)
• Contact us with any privacy concerns

To exercise these rights, email us at: wasseem@moggedai.com`,
          },
          {
            title: "9. Children's Privacy",
            body: `MoggedAI is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete it immediately.`,
          },
          {
            title: "10. Changes to This Policy",
            body: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the app. Continued use of MoggedAI after changes constitutes acceptance of the updated policy.`,
          },
          {
            title: "11. Contact Us",
            body: `If you have any questions about this Privacy Policy, please contact us:

Email: wasseem@moggedai.com
Website: moggedai.com`,
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: MONO, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", color: "#0ea5e9", marginBottom: "0.85rem" }}>
              {section.title}
            </h2>
            <div style={{ fontSize: "0.9rem", color: "var(--c-text2)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {section.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
