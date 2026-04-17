"use client";
import { useRouter } from "next/navigation";

const MONO = "'Space Mono','Courier New',monospace";
const GROTESK = "'Space Grotesk',-apple-system,BlinkMacSystemFont,sans-serif";

/**
 * Public opt-in evidence page for carrier / Twilio toll-free verification.
 * Reviewers should be able to reach this URL with NO authentication and
 * see the exact consent language + a visual recreation of the opt-in form
 * users fill out at /setup (which is behind auth).
 */
export default function OptInPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-root)", color: "var(--c-text)", fontFamily: GROTESK }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--c-nav)",
          borderBottom: "1px solid var(--c-border)",
          padding: "0 1.5rem",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: MONO,
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
              color: "var(--c-text)",
            }}
          >
            MOGGED<span style={{ color: "#0ea5e9" }}>AI</span>
          </button>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <a
              href="/consent"
              style={{
                textDecoration: "none",
                border: "1px solid var(--c-border)",
                color: "var(--c-text3)",
                fontFamily: MONO,
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                padding: "0.35rem 0.75rem",
              }}
            >
              SMS POLICY
            </a>
            <a
              href="/privacy"
              style={{
                textDecoration: "none",
                border: "1px solid var(--c-border)",
                color: "var(--c-text3)",
                fontFamily: MONO,
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                padding: "0.35rem 0.75rem",
              }}
            >
              PRIVACY
            </a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        {/* Header */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: "0.6rem",
            color: "#0ea5e9",
            letterSpacing: "0.25em",
            marginBottom: "0.75rem",
          }}
        >
          SMS OPT-IN · EVIDENCE OF CONSENT
        </div>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            margin: "0 0 1rem",
          }}
        >
          How users opt in to MoggedAI SMS
        </h1>
        <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--c-text)", margin: "0 0 2.5rem" }}>
          MoggedAI is an AI-powered SMS accountability coach. Users opt in to receive recurring
          automated text messages by completing the web form below during account setup at{" "}
          <strong>moggedai.com/setup</strong>. Consent is explicit, express, and written — the
          checkbox is unchecked by default and the submit button stays disabled until the user
          both enters their phone number and checks the consent box.
        </p>

        {/* Business info */}
        <div
          style={{
            border: "1px solid var(--c-border)",
            padding: "1.25rem 1.5rem",
            marginBottom: "2.5rem",
            fontSize: "0.9rem",
            lineHeight: 1.8,
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: "#0ea5e9", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
            BUSINESS
          </div>
          <div><strong>Brand:</strong> MoggedAI</div>
          <div><strong>Website:</strong> https://www.moggedai.com</div>
          <div><strong>Use case:</strong> Account notifications — AI accountability check-ins for user-selected habits</div>
          <div><strong>Messaging number:</strong> +1 (844) 991-1147</div>
          <div><strong>Support email:</strong> wasseem800@gmail.com</div>
        </div>

        {/* Visual opt-in form replica */}
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 1rem" }}>
          Step 1 of setup — the opt-in form users see
        </h2>
        <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--c-text3)", margin: "0 0 1.5rem" }}>
          The following is a visual replica of the live opt-in form at{" "}
          <strong>moggedai.com/setup</strong> (which is behind authentication). The phone field
          and consent language below are identical to what a real user sees and submits.
        </p>

        <div
          style={{
            border: "1px solid var(--c-border)",
            background: "var(--c-s1)",
            padding: "2rem 1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Fake logo */}
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              marginBottom: "2rem",
              textAlign: "center",
              fontFamily: MONO,
            }}
          >
            MOGGED<span style={{ color: "#0ea5e9" }}>AI</span>
          </div>

          {/* Headline */}
          <div
            style={{
              fontFamily: MONO,
              fontSize: "0.5rem",
              letterSpacing: "0.25em",
              color: "#0ea5e9",
              border: "1px solid rgba(14,165,233,0.4)",
              padding: "0.3rem 0.8rem",
              marginBottom: "1.25rem",
              display: "inline-block",
            }}
          >
            STEP 01 / 04
          </div>
          <h3
            style={{
              fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              margin: "0 0 0.5rem",
            }}
          >
            Your number.{" "}
            <span style={{ color: "#0ea5e9" }}>No excuses.</span>
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--c-text)", margin: "0 0 1.5rem", lineHeight: 1.7 }}>
            This is where your AI coach will text you every day. US numbers only.
          </p>

          {/* Phone input (visual only) */}
          <label
            style={{
              fontFamily: MONO,
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "var(--c-text)",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            PHONE NUMBER
          </label>
          <div
            aria-label="Phone number input (visual replica)"
            style={{
              width: "100%",
              background: "var(--c-input)",
              border: "1px solid var(--c-input-bdr)",
              color: "var(--c-text3)",
              padding: "0.9rem 1rem",
              fontSize: "1.3rem",
              fontFamily: MONO,
              boxSizing: "border-box",
              marginBottom: "1.25rem",
            }}
          >
            (555) 000-0000
          </div>

          {/* Consent checkbox + disclosure */}
          <div
            style={{
              background: "var(--c-s1)",
              border: "1px solid var(--c-input-bdr)",
              padding: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
              <div
                aria-label="Consent checkbox (unchecked by default)"
                style={{
                  width: 20,
                  height: 20,
                  border: "2px solid var(--c-text3)",
                  background: "transparent",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <p style={{ fontSize: "0.92rem", color: "var(--c-text)", lineHeight: 1.75, margin: 0, fontFamily: GROTESK }}>
                By checking this box, I provide my <strong>express written consent</strong> to
                receive recurring automated SMS text messages from MoggedAI at the phone number
                above. Message frequency varies. Msg &amp; data rates may apply. Reply{" "}
                <strong>STOP</strong> to cancel, <strong>HELP</strong> for help.{" "}
                <a href="/consent" style={{ color: "#0ea5e9", textDecoration: "underline" }}>
                  SMS Policy
                </a>{" "}
                &amp;{" "}
                <a href="/privacy" style={{ color: "#0ea5e9", textDecoration: "underline" }}>
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Submit button (visual only, disabled state) */}
          <div
            aria-label="Submit button (disabled until phone is entered and consent box is checked)"
            style={{
              width: "100%",
              background: "#0ea5e9",
              color: "#fff",
              padding: "1rem",
              fontSize: "0.85rem",
              letterSpacing: "0.15em",
              fontFamily: MONO,
              fontWeight: 700,
              textAlign: "center",
              opacity: 0.4,
            }}
          >
            NEXT →
          </div>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--c-text3)",
              marginTop: "0.75rem",
              fontFamily: MONO,
              letterSpacing: "0.05em",
            }}
          >
            (Button is disabled until the user both enters a valid 10-digit US phone number and
            checks the consent box above.)
          </p>
        </div>

        {/* What the user is agreeing to */}
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 1rem" }}>
          What the user is agreeing to
        </h2>
        <ul style={{ fontSize: "0.95rem", lineHeight: 1.9, color: "var(--c-text)", margin: "0 0 2.5rem", paddingLeft: "1.25rem" }}>
          <li>Recurring automated SMS messages from MoggedAI (AI accountability check-ins).</li>
          <li>Message frequency varies — user selects 30 min / 1 hr / 2 hr / 3 hr during setup.</li>
          <li>Msg &amp; data rates may apply through their carrier.</li>
          <li>Reply <strong>STOP</strong> to +1 (844) 991-1147 to opt out at any time.</li>
          <li>Reply <strong>HELP</strong> to +1 (844) 991-1147 for support.</li>
          <li>Consent is not a condition of any purchase.</li>
        </ul>

        {/* Sample messages */}
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 1rem" }}>
          Sample messages the user will receive
        </h2>
        <div
          style={{
            border: "1px solid var(--c-border)",
            padding: "1.25rem 1.5rem",
            marginBottom: "2.5rem",
            fontSize: "0.9rem",
            lineHeight: 1.7,
            fontFamily: MONO,
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <strong>Welcome:</strong> “You&apos;re in. I&apos;ll check in on your goals throughout the
            day. Reply STOP to cancel, HELP for help. Msg &amp; data rates may apply.”
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Check-in:</strong> “How many pages have you actually read today? Be honest.”
          </div>
          <div>
            <strong>Opt-out confirmation:</strong> “You&apos;re unsubscribed from MoggedAI. No more
            messages will be sent. Reply START to re-enable.”
          </div>
        </div>

        {/* Opt-out */}
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 1rem" }}>
          How users opt out
        </h2>
        <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--c-text)", margin: "0 0 2.5rem" }}>
          Users can reply <strong>STOP</strong> to <strong>+1 (844) 991-1147</strong> at any time
          to unsubscribe. They will receive a confirmation message and no further messages will be
          sent. Users may also pause or cancel messaging from their dashboard at any time.
        </p>

        {/* Footer links */}
        <div
          style={{
            borderTop: "1px solid var(--c-border)",
            paddingTop: "1.5rem",
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            fontSize: "0.8rem",
            fontFamily: MONO,
            letterSpacing: "0.1em",
            color: "var(--c-text3)",
          }}
        >
          <a href="/consent" style={{ color: "var(--c-text3)" }}>SMS POLICY</a>
          <a href="/privacy" style={{ color: "var(--c-text3)" }}>PRIVACY POLICY</a>
          <a href="/terms" style={{ color: "var(--c-text3)" }}>TERMS OF SERVICE</a>
          <a href="/" style={{ color: "var(--c-text3)" }}>HOME</a>
        </div>
      </div>
    </div>
  );
}
