"use client";
import { useRouter } from "next/navigation";

const mono = "'Space Mono','Courier New',monospace";
const C = { bg: "#080808", text: "#f0f0f0", red: "#38bdf8", muted: "#888", border: "#1a1a1a", card: "#0d0d0d" };

export default function ConsentPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: mono }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderBottom: `1px solid rgba(56,189,248,0.2)`, background: "rgba(8,8,8,0.97)" }}>
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
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.25em", color: C.red, border: `1px solid rgba(56,189,248,0.3)`, padding: "0.25rem 0.7rem", display: "inline-block", marginBottom: "1rem" }}>SMS CONSENT & OPT-IN</div>
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: "700", lineHeight: 1.1, margin: "0 0 1rem" }}>
            SMS Messaging<br /><span style={{ color: C.red }}>Consent & Opt-In</span>
          </h1>
          <p style={{ fontSize: "0.82rem", color: C.muted, lineHeight: "1.9", margin: 0 }}>
            Last updated: April 11, 2026
          </p>
        </div>

        {/* What you're agreeing to */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.75rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: C.red, marginBottom: "0.75rem" }}>WHAT YOU ARE AGREEING TO</div>
          <p style={{ fontSize: "0.82rem", color: C.muted, lineHeight: "1.9", margin: "0 0 1rem" }}>
            By entering your phone number on <strong style={{ color: C.text }}>moggedai.com</strong> and clicking <strong style={{ color: C.text }}>"Activate My Account"</strong>, you expressly consent to receive recurring automated SMS text messages from MoggedAI at the phone number you provide.
          </p>
          <p style={{ fontSize: "0.82rem", color: C.muted, lineHeight: "1.9", margin: 0 }}>
            These messages include AI-generated accountability check-ins, habit reminders, follow-up messages, and responses to your replies. Message frequency varies based on the schedule you select (up to several messages per day).
          </p>
        </div>

        {/* Consent is voluntary */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.75rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: C.red, marginBottom: "0.75rem" }}>CONSENT IS VOLUNTARY</div>
          <p style={{ fontSize: "0.82rem", color: C.muted, lineHeight: "1.9", margin: 0 }}>
            Consent to receive SMS messages is <strong style={{ color: C.text }}>not required</strong> as a condition of any purchase or use of any service. You can use MoggedAI only if you agree to receive SMS messages, as SMS is the core feature of the service.
          </p>
        </div>

        {/* How to opt out */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.75rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: C.red, marginBottom: "0.75rem" }}>HOW TO OPT OUT (UNSUBSCRIBE)</div>
          <p style={{ fontSize: "0.82rem", color: C.muted, lineHeight: "1.9", margin: "0 0 1rem" }}>
            You can opt out of SMS messages at any time by replying <strong style={{ color: C.text }}>STOP</strong> to any message you receive from us. After texting STOP, you will receive one final confirmation message and no further messages will be sent.
          </p>
          <p style={{ fontSize: "0.82rem", color: C.muted, lineHeight: "1.9", margin: 0 }}>
            You can also pause messages from your dashboard, or contact us at <a href="mailto:support@moggedai.com" style={{ color: C.red, textDecoration: "none" }}>support@moggedai.com</a> to be removed.
          </p>
        </div>

        {/* Help */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.75rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: C.red, marginBottom: "0.75rem" }}>HELP</div>
          <p style={{ fontSize: "0.82rem", color: C.muted, lineHeight: "1.9", margin: 0 }}>
            Reply <strong style={{ color: C.text }}>HELP</strong> to any message for assistance. You can also email us at <a href="mailto:support@moggedai.com" style={{ color: C.red, textDecoration: "none" }}>support@moggedai.com</a>.
          </p>
        </div>

        {/* Costs */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.75rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: C.red, marginBottom: "0.75rem" }}>MESSAGE & DATA RATES</div>
          <p style={{ fontSize: "0.82rem", color: C.muted, lineHeight: "1.9", margin: 0 }}>
            MoggedAI does not charge for SMS messages. However, <strong style={{ color: C.text }}>message and data rates may apply</strong> depending on your mobile carrier and plan. Contact your carrier for details about your messaging plan.
          </p>
        </div>

        {/* Supported carriers */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.75rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: C.red, marginBottom: "0.75rem" }}>SUPPORTED CARRIERS</div>
          <p style={{ fontSize: "0.82rem", color: C.muted, lineHeight: "1.9", margin: "0 0 0.75rem" }}>
            MoggedAI works with all major US carriers including:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["AT&T", "T-Mobile", "Verizon", "Sprint", "Boost Mobile", "Cricket Wireless", "Metro by T-Mobile", "US Cellular", "Google Fi"].map(carrier => (
              <span key={carrier} style={{ background: "#111", border: `1px solid ${C.border}`, padding: "0.3rem 0.75rem", fontSize: "0.65rem", color: C.muted }}>
                {carrier}
              </span>
            ))}
          </div>
          <p style={{ fontSize: "0.72rem", color: "#555", marginTop: "0.75rem", marginBottom: 0 }}>
            Carriers are not liable for delayed or undelivered messages.
          </p>
        </div>

        {/* Privacy */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.75rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: C.red, marginBottom: "0.75rem" }}>YOUR PRIVACY</div>
          <p style={{ fontSize: "0.82rem", color: C.muted, lineHeight: "1.9", margin: 0 }}>
            We will never share, sell, or rent your phone number or personal information to third parties for marketing purposes. Your phone number is used solely to deliver MoggedAI accountability messages. View our full <a href="/privacy" style={{ color: C.red, textDecoration: "none" }}>Privacy Policy</a>.
          </p>
        </div>

        {/* How opt-in works on our site */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "1.75rem", marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: C.red, marginBottom: "0.75rem" }}>HOW OPT-IN WORKS ON MOGGEDAI.COM</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              "User visits moggedai.com and clicks GET STARTED",
              "User enters their US mobile phone number",
              "User selects their habits, coach style, and schedule",
              "User clicks \"Activate My Account\" — this is the explicit opt-in action",
              "User receives a confirmation SMS and begins receiving accountability check-ins",
              "User can reply STOP at any time to immediately unsubscribe",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "0.6rem", color: C.red, fontWeight: "700", minWidth: "20px", paddingTop: "2px" }}>0{i + 1}</span>
                <span style={{ fontSize: "0.78rem", color: C.muted, lineHeight: "1.7" }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "2rem", background: C.card, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.5rem" }}>Ready to get started?</p>
          <p style={{ fontSize: "0.72rem", color: C.muted, marginBottom: "1.5rem" }}>By signing up you agree to receive SMS messages from MoggedAI.</p>
          <button
            style={{ background: C.red, border: "none", color: "#fff", padding: "0.9rem 2.5rem", fontSize: "0.8rem", letterSpacing: "0.15em", cursor: "pointer", fontFamily: mono, fontWeight: "700" }}
            onClick={() => router.push("/")}
          >
            GET STARTED →
          </button>
          <p style={{ fontSize: "0.55rem", color: "#333", marginTop: "0.75rem" }}>
            US numbers only · Reply STOP to unsubscribe anytime · Msg & data rates may apply
          </p>
        </div>

      </div>
    </div>
  );
}
