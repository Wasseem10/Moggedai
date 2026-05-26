"use client";

import { useEffect, useState } from "react";

const timeline = [900, 1100, 1200, 1100, 2000, 2600];

type Bubble = {
  id: string;
  from: "bot" | "user";
  text: string;
  badge?: string;
};

const messages: Bubble[] = [
  {
    id: "m1",
    from: "bot",
    text: "quick memory check: you wanted to follow up with Alex before noon.",
  },
  {
    id: "m2",
    from: "user",
    text: "push it to 2pm and remind me what it's about",
  },
  {
    id: "m3",
    from: "bot",
    text: "done. it's about the beta invite, pricing note, and Friday demo.",
  },
  {
    id: "m4",
    from: "user",
    text: "also remember to book the dentist this week",
  },
  {
    id: "m5",
    from: "bot",
    text: "saved. I'll ping you tomorrow morning with both.",
    badge: "🧠 2 things remembered",
  },
];

function SignalIcon() {
  return (
    <svg viewBox="0 0 22 14" aria-hidden="true">
      <rect x="1" y="8" width="3" height="5" rx="1" />
      <rect x="6" y="6" width="3" height="7" rx="1" />
      <rect x="11" y="3" width="3" height="10" rx="1" />
      <rect x="16" y="1" width="3" height="12" rx="1" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 18 14" aria-hidden="true">
      <path d="M2 5.3c4.5-3.7 9.5-3.7 14 0" />
      <path d="M5 8.2c2.6-2.1 5.4-2.1 8 0" />
      <path d="M8.1 11.1c.6-.5 1.2-.5 1.8 0" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 28 14" aria-hidden="true">
      <rect x="1" y="2" width="22" height="10" rx="3" />
      <path d="M25 5v4" />
      <rect x="3.5" y="4.3" width="17" height="5.4" rx="1.8" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="12" height="10" rx="3" />
      <path d="m15 10 5-3v10l-5-3z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-bubble" aria-label="StayPinged is typing">
      <span />
      <span />
      <span />
    </div>
  );
}

function MessageBubble({ message }: { message: Bubble }) {
  const isUser = message.from === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "bot"}`}>
      {!isUser && <div className="bot-avatar">🤖</div>}
      <div>
        <div className={`bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
          {message.text}
        </div>
        {message.badge && <div className="memory-badge">{message.badge}</div>}
      </div>
    </div>
  );
}

export default function MoggedAIPhoneMockup() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setStep((current) => (current + 1) % timeline.length);
    }, timeline[step]);

    return () => window.clearTimeout(timeout);
  }, [step]);

  const visibleMessages = step >= 5 ? messages : messages.slice(0, step);

  return (
    <div className="phone-stage" aria-label="Animated StayPinged iMessage preview">
      <div className="side-button mute" />
      <div className="side-button volume volume-up" />
      <div className="side-button volume volume-down" />
      <div className="side-button power" />

      <div className="phone-frame">
        <div className="phone-bezel">
          <div className="dynamic-island" />
          <div className="phone-screen">
            <div className="status-bar">
              <span>7:00</span>
              <div className="status-icons">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </div>
            </div>

            <div className="message-nav">
              <div className="nav-left">
                <span className="back">‹</span>
                <div className="avatar">🤖</div>
                <div>
                  <p>StayPinged</p>
                  <span>iMessage</span>
                </div>
              </div>
              <button aria-label="Start video call">
                <VideoIcon />
              </button>
            </div>

            <div className="conversation">
              {visibleMessages.map((message) => (
                <MessageBubble key={`${message.id}-${step}`} message={message} />
              ))}
              {step === 4 && (
                <div className="message-row bot" key={`typing-${step}`}>
                  <div className="bot-avatar">🤖</div>
                  <TypingIndicator />
                </div>
              )}
            </div>

            <div className="input-bar">
              <button aria-label="Add attachment">+</button>
              <div className="input-pill">iMessage</div>
              <button aria-label="Record audio">
                <MicIcon />
              </button>
            </div>
            <div className="home-indicator" />
          </div>
        </div>
      </div>

      <style>{`
        .phone-stage {
          position: relative;
          width: min(336px, 78vw);
          padding: 0;
          border-radius: 60px;
          background: transparent;
        }

        .phone-frame {
          position: relative;
          border-radius: 56px;
          padding: 4px;
          background:
            linear-gradient(135deg, #f7f7f2 0%, #9c9f9f 18%, #f0eee8 42%, #686d70 68%, #f7f5ef 100%);
          box-shadow:
            0 30px 80px rgba(11, 15, 26, 0.24),
            inset 0 0 0 1px rgba(255, 255, 255, 0.78),
            inset 0 0 0 3px rgba(18, 20, 24, 0.1);
        }

        .phone-frame::before {
          content: "";
          position: absolute;
          inset: 2px;
          border-radius: 54px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          pointer-events: none;
        }

        .phone-bezel {
          position: relative;
          border-radius: 52px;
          padding: 6px;
          background: #111;
        }

        .phone-screen {
          position: relative;
          height: 646px;
          overflow: hidden;
          border-radius: 46px;
          background:
            linear-gradient(180deg, #f9fafc 0%, #eef4fb 58%, #fbfbfd 100%);
          color: #0b0f1a;
        }

        .dynamic-island {
          position: absolute;
          top: 17px;
          left: 50%;
          z-index: 5;
          width: 92px;
          height: 28px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #050505;
          box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.08);
        }

        .side-button {
          position: absolute;
          z-index: 0;
          width: 4px;
          border-radius: 999px;
          background: linear-gradient(180deg, #d9d7cf, #7d8285);
          box-shadow: 0 8px 14px rgba(11, 15, 26, 0.14);
        }

        .mute {
          left: -5px;
          top: 122px;
          height: 34px;
        }

        .volume {
          left: -5px;
          height: 58px;
        }

        .volume-up {
          top: 178px;
        }

        .volume-down {
          top: 250px;
        }

        .power {
          right: -5px;
          top: 204px;
          height: 86px;
        }

        .status-bar {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 54px;
          padding: 14px 24px 0;
          font-size: 13px;
          font-weight: 700;
        }

        .status-icons {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .status-icons svg {
          width: 18px;
          height: 14px;
          fill: #0b0f1a;
          stroke: #0b0f1a;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .status-icons svg:last-child {
          width: 28px;
          fill: none;
        }

        .status-icons svg:last-child rect:last-child {
          fill: #0b0f1a;
          stroke: none;
        }

        .message-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 18px 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          background: rgba(249, 250, 252, 0.82);
          backdrop-filter: blur(18px);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .back {
          color: #229ED9;
          font-size: 34px;
          line-height: 1;
          transform: translateY(-1px);
        }

        .avatar {
          display: flex;
          width: 34px;
          height: 34px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(145deg, #ffffff, #e9eef5);
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
          font-size: 18px;
        }

        .message-nav p {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
        }

        .message-nav span {
          display: block;
          font-size: 10px;
          color: #8b8f98;
        }

        .message-nav button,
        .input-bar button {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          background: transparent;
          color: #229ED9;
        }

        .message-nav button svg,
        .input-bar button svg {
          width: 22px;
          height: 22px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .conversation {
          display: flex;
          height: 454px;
          flex-direction: column;
          justify-content: flex-end;
          gap: 9px;
          padding: 16px 14px;
        }

        .message-row {
          display: flex;
          align-items: flex-end;
          gap: 7px;
          animation: messageIn 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .message-row.user {
          justify-content: flex-end;
        }

        .bot-avatar {
          display: flex;
          width: 24px;
          height: 24px;
          flex: 0 0 24px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(11, 15, 26, 0.08);
        }

        .bubble {
          max-width: 218px;
          border-radius: 20px;
          padding: 10px 12px;
          font-size: 13px;
          line-height: 1.32;
          letter-spacing: -0.01em;
          box-shadow: 0 6px 18px rgba(11, 15, 26, 0.06);
        }

        .bot-bubble {
          border-bottom-left-radius: 7px;
          background: #ffffff;
          color: #111827;
        }

        .user-bubble {
          border-bottom-right-radius: 7px;
          background: #229ED9;
          color: #ffffff;
        }

        .memory-badge {
          display: inline-flex;
          margin-top: 6px;
          margin-left: 2px;
          border-radius: 999px;
          background: rgba(239, 77, 35, 0.11);
          padding: 5px 9px;
          color: #ef4d23;
          font-size: 11px;
          font-weight: 800;
          animation: messageIn 360ms 120ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .typing-bubble {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          min-width: 58px;
          border-radius: 20px;
          border-bottom-left-radius: 7px;
          background: #ffffff;
          padding: 13px 14px;
          box-shadow: 0 6px 18px rgba(11, 15, 26, 0.06);
          animation: messageIn 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .typing-bubble span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #9ca3af;
          animation: typingDot 900ms infinite ease-in-out;
        }

        .typing-bubble span:nth-child(2) {
          animation-delay: 140ms;
        }

        .typing-bubble span:nth-child(3) {
          animation-delay: 280ms;
        }

        .input-bar {
          position: absolute;
          right: 12px;
          bottom: 23px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-bar button {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          border-radius: 50%;
          background: #eef0f4;
          font-size: 22px;
          font-weight: 300;
        }

        .input-pill {
          display: flex;
          height: 36px;
          flex: 1;
          align-items: center;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: #ffffff;
          padding: 0 14px;
          color: #a1a1aa;
          font-size: 13px;
        }

        .home-indicator {
          position: absolute;
          bottom: 8px;
          left: 50%;
          width: 118px;
          height: 4px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #111;
        }

        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typingDot {
          0%, 70%, 100% {
            transform: translateY(0);
            opacity: 0.42;
          }
          35% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .phone-stage {
            width: min(310px, 88vw);
          }

          .phone-screen {
            height: 592px;
          }

          .conversation {
            height: 404px;
          }
        }
      `}</style>
    </div>
  );
}
