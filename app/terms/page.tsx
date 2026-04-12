"use client";
import { useRouter } from "next/navigation";

const MONO = "'Space Mono','Courier New',monospace";
const GROTESK = "'Space Grotesk',-apple-system,BlinkMacSystemFont,sans-serif";

export default function TermsPage() {
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
        <h1 style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(1.4rem,4vw,2rem)", marginBottom: "0.5rem", color: "var(--c-text)" }}>Terms of Service</h1>
        <p style={{ fontFamily: MONO, fontSize: "0.65rem", color: "var(--c-text3)", marginBottom: "3rem", letterSpacing: "0.1em" }}>
          Last updated: April 12, 2025
        </p>

        {[
          {
            title: "1. Acceptance of Terms",
            body: `By accessing or using MoggedAI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.

MoggedAI is operated by Wasseem Dabbas. These terms apply to all users of the Service.`,
          },
          {
            title: "2. Description of Service",
            body: `MoggedAI is an SMS-based AI accountability platform. Once you sign up and configure your habits and schedule, our AI will send you personalized text messages throughout the day to keep you accountable to your goals.

The Service includes:
• A web dashboard for managing habits and account settings
• Recurring SMS check-ins delivered to your phone number
• AI-generated responses to your text replies
• Habit tracking and streak statistics`,
          },
          {
            title: "3. Eligibility",
            body: `You must be at least 13 years old to use MoggedAI. By using the Service, you represent that you meet this requirement.

You must provide a valid US phone number capable of receiving SMS messages. MoggedAI currently operates in the United States only.`,
          },
          {
            title: "4. SMS Consent",
            body: `By providing your phone number and completing setup, you expressly consent to receive recurring automated SMS text messages from MoggedAI at the phone number you provided.

• Message frequency depends on your chosen schedule
• Standard message and data rates may apply
• You can opt out at any time by texting STOP
• Text HELP for help, STOP to cancel

Opting out of SMS messages does not delete your account.`,
          },
          {
            title: "5. User Accounts",
            body: `You are responsible for maintaining the security of your account. You must provide accurate information when signing up and keep it updated.

You may not share your account with others or use the Service on behalf of another person without their consent.

We reserve the right to suspend or terminate accounts that violate these terms.`,
          },
          {
            title: "6. Acceptable Use",
            body: `You agree not to:

• Use the Service for any unlawful purpose
• Attempt to reverse-engineer, hack, or disrupt the Service
• Submit false or misleading information
• Use the Service to harass or harm others
• Attempt to access other users' data

We reserve the right to terminate your account if you violate these terms.`,
          },
          {
            title: "7. Intellectual Property",
            body: `All content, features, and functionality of MoggedAI — including the website, dashboard, branding, and AI-generated messages — are owned by MoggedAI and protected by applicable intellectual property laws.

You may not copy, reproduce, or distribute any part of the Service without written permission.`,
          },
          {
            title: "8. AI-Generated Content",
            body: `The text messages you receive are generated by artificial intelligence (Google Gemini). While we design these messages to be helpful and motivating, we do not guarantee their accuracy, completeness, or fitness for any particular purpose.

AI-generated messages are not a substitute for professional advice (medical, psychological, legal, or otherwise). If you are struggling with mental health, please contact a qualified professional.`,
          },
          {
            title: "9. Disclaimer of Warranties",
            body: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.

We do not guarantee that using MoggedAI will result in any specific outcomes, habit changes, or improvements in your life.`,
          },
          {
            title: "10. Limitation of Liability",
            body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, MOGGEDAI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.

Our total liability to you for any claims arising from these terms or the Service shall not exceed the amount you paid us in the 3 months prior to the claim.`,
          },
          {
            title: "11. Changes to Terms",
            body: `We may update these Terms of Service at any time. We will notify you of material changes via email or through the Service. Continued use of MoggedAI after changes take effect constitutes acceptance of the updated terms.`,
          },
          {
            title: "12. Termination",
            body: `You may stop using the Service at any time. To delete your account, contact us at wasseem@moggedai.com.

We reserve the right to suspend or terminate your access to the Service at our discretion, with or without notice, for violation of these terms or any other reason.`,
          },
          {
            title: "13. Governing Law",
            body: `These Terms are governed by the laws of the United States. Any disputes arising from these terms or the Service will be resolved in accordance with applicable US law.`,
          },
          {
            title: "14. Contact",
            body: `For questions about these Terms of Service, contact us:

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
