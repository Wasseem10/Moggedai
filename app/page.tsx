"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const telegramHref =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ||
  "https://t.me/StaypingedBot?start=website";

const whoCards = [
  {
    title: "Students",
    body: "For the study sessions that turn into TikTok breaks. We quiz you, keep you off your phone, and get you through finals week without the all-nighter.",
    quote: "Check in on my studying every hour from 4-8pm.",
    tags: ["EXAMS", "ESSAYS", "LOCK-IN"],
  },
  {
    title: "Builders",
    body: "For the side project collecting dust. We text you to ship one thing every day - because momentum beats motivation.",
    quote: "Make sure I push code before bed.",
    tags: ["STARTUPS", "PROJECTS", "SHIPPING"],
  },
  {
    title: "Athletes",
    body: "For the 6am workouts you keep sleeping through. We wake you up, hold your streak, and call you out when you try to skip.",
    quote: "Text me at 5:45. Don't let me snooze.",
    tags: ["GYM", "RUNS", "NUTRITION"],
  },
];

const steps = [
  {
    number: "01",
    title: "Set your goals",
    body: "Pick what you need to stay on top of - gym, studying, work, anything.",
    tone: "blue",
  },
  {
    number: "02",
    title: "Pick your coach style",
    body: "Brutal, direct, or motivating. Every single message adapts to you.",
    tone: "purple",
  },
  {
    number: "03",
    title: "Get texted all day",
    body: "We check in throughout the day. Every message is unique and personal.",
    tone: "green",
  },
  {
    number: "04",
    title: "Reply DONE",
    body: "Mark it complete. We track your streak. No reply? We follow up.",
    tone: "orange",
  },
];

const faqs = [
  {
    question: "How does MoggedAI work?",
    answer:
      "You tell MoggedAI what you want to stay accountable to, choose the tone, and the coach checks in through Telegram throughout the day.",
  },
  {
    question: "Do I need to open the app every day?",
    answer:
      "No. The point is that the accountability comes to you. Open Telegram, reply normally, and keep moving.",
  },
  {
    question: "What do I text back?",
    answer:
      "Text DONE when you completed it, say what happened if you slipped, or reply like you would to a coach. MoggedAI adapts from there.",
  },
];

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.8 3.4 18.5 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L5.8 13.6.8 12c-1.1-.3-1.1-1.1.2-1.6L20.5 2.9c.9-.3 1.7.2 1.3.5Z" />
    </svg>
  );
}

function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  return (
    <main className="landing">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&display=swap");

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        .landing {
          --blue: #1268ff;
          --blue-2: #34b8ff;
          --cyan: #9be8ff;
          --ink: #090b16;
          --muted: #5b6475;
          --line: rgba(25, 104, 255, 0.14);
          --mono: "SFMono-Regular", "Roboto Mono", "Cascadia Mono", "Liberation Mono", monospace;
          min-height: 100vh;
          overflow-x: hidden;
          background: #ffffff;
          color: var(--ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          letter-spacing: 0;
        }

        .hero {
          min-height: 980px;
          position: relative;
          overflow: hidden;
          padding: 24px 20px 0;
          background:
            radial-gradient(circle at 50% 26%, rgba(255, 255, 255, 0.3), transparent 26%),
            radial-gradient(circle at 20% 6%, rgba(72, 191, 255, 0.65), transparent 28%),
            radial-gradient(circle at 80% 12%, rgba(37, 111, 255, 0.52), transparent 28%),
            linear-gradient(180deg, #075bdc 0%, #158cff 36%, #8edcff 72%, #eaf9ff 100%);
        }

        .hero::before,
        .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .hero::before {
          opacity: 0.28;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.24) 1px, transparent 1px);
          background-size: 86px 86px;
          mask-image: linear-gradient(180deg, #000 0%, transparent 72%);
          -webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 72%);
        }

        .hero::after {
          background:
            linear-gradient(180deg, transparent 0%, rgba(234, 249, 255, 0.1) 58%, #eaf9ff 91%, #ffffff 100%);
        }

        .shell {
          width: min(1120px, 100%);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .nav {
          width: min(1000px, 100%);
          height: 64px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 9px 10px 9px 22px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.76);
          box-shadow: 0 24px 70px rgba(4, 68, 164, 0.2);
          backdrop-filter: blur(24px);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 0;
          background: transparent;
          color: #111827;
          font: inherit;
          font-weight: 900;
          letter-spacing: -0.02em;
          cursor: pointer;
        }

        .logo-mark {
          width: 27px;
          height: 27px;
          position: relative;
          display: inline-block;
          flex: 0 0 27px;
        }

        .logo-mark span {
          position: absolute;
          width: 11px;
          height: 11px;
          border-radius: 5px;
          border: 3px solid var(--blue);
          transform: rotate(45deg);
          background: rgba(255, 255, 255, 0.3);
        }

        .logo-mark span:nth-child(1) { left: 1px; top: 8px; }
        .logo-mark span:nth-child(2) { left: 8px; top: 1px; }
        .logo-mark span:nth-child(3) { right: 1px; top: 8px; }
        .logo-mark span:nth-child(4) { left: 8px; bottom: 1px; }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-link {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          background: transparent;
          color: #111827;
          font: inherit;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
          padding: 0 12px;
        }

        .btn {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.56);
          padding: 0 18px;
          font: inherit;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
          white-space: nowrap;
        }

        .btn svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        .btn-primary {
          color: #ffffff;
          background: linear-gradient(135deg, #0d6bff, #155cff);
          box-shadow: 0 16px 34px rgba(7, 91, 220, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.28);
        }

        .btn-ghost {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.38);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
        }

        .btn-light {
          color: var(--blue);
          background: #ffffff;
          border-color: rgba(255, 255, 255, 0.72);
          box-shadow: 0 16px 34px rgba(7, 91, 220, 0.18);
        }

        .hero-copy {
          width: min(820px, 100%);
          margin: 82px auto 0;
          text-align: center;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 28px;
          padding: 0 13px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.24);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #ffffff;
          font-size: 12px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.01em;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
        }

        .section-badge {
          background: #f1f4f8;
          border: 1px solid rgba(9, 11, 22, 0.05);
          color: #6b7280;
          box-shadow: none;
        }

        h1,
        h2,
        h3,
        p {
          margin: 0;
        }

        .hero h1 {
          margin-top: 24px;
          color: #ffffff;
          font-size: clamp(54px, 7vw, 92px);
          line-height: 0.95;
          font-weight: 900;
          letter-spacing: -0.055em;
          text-shadow: 0 2px 0 rgba(255, 255, 255, 0.08);
        }

        .hero h1 span {
          color: #dbf7ff;
        }

        .mobile-hero-title {
          display: none;
        }

        .hero-sub {
          width: min(720px, 100%);
          margin: 22px auto 0;
          color: rgba(255, 255, 255, 0.84);
          font-family: var(--mono);
          font-size: 15px;
          line-height: 1.8;
        }

        .hero-actions {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .proof {
          max-width: 100%;
          margin-top: 30px;
          color: rgba(255, 255, 255, 0.84);
          font-family: var(--mono);
          font-size: 13px;
          font-weight: 700;
        }

        .hero-cards {
          width: min(940px, 100%);
          min-height: 360px;
          margin: 70px auto 0;
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1.35fr 1fr;
          gap: 22px;
          align-items: start;
        }

        .social-card,
        .coach-card,
        .mini-card {
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.76);
          box-shadow: 0 24px 70px rgba(4, 68, 164, 0.18);
          backdrop-filter: blur(22px);
        }

        .social-card {
          padding: 18px;
          transform: translateY(18px);
        }

        .coach-card {
          padding: 20px;
        }

        .social-top,
        .coach-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #667085;
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 800;
        }

        .avatar {
          width: 100%;
          aspect-ratio: 1 / 0.86;
          margin-top: 13px;
          border-radius: 16px;
          overflow: hidden;
          background:
            radial-gradient(circle at 30% 22%, #ffffff 0 7%, transparent 8%),
            linear-gradient(145deg, #07152d, #186dff 52%, #9be8ff);
          position: relative;
        }

        .avatar::before,
        .avatar::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.82);
        }

        .avatar::before {
          width: 66px;
          height: 66px;
          left: 50%;
          top: 42%;
          transform: translate(-50%, -50%);
        }

        .avatar::after {
          width: 118px;
          height: 80px;
          left: 50%;
          bottom: -24px;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.56);
        }

        .social-card p {
          margin-top: 14px;
          color: #344054;
          font-family: var(--mono);
          font-size: 12px;
          line-height: 1.55;
        }

        .stat-row {
          margin-top: 14px;
          display: flex;
          gap: 14px;
          color: #7a8698;
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 800;
        }

        .coach-card {
          margin-top: 0;
        }

        .stars {
          color: #ffc247;
          letter-spacing: 0.14em;
          font-size: 17px;
        }

        .coach-card h3 {
          margin-top: 16px;
          color: #101828;
          font-size: 24px;
          line-height: 1.1;
          letter-spacing: -0.04em;
          font-weight: 900;
        }

        .coach-card p {
          margin-top: 12px;
          color: #475467;
          font-family: var(--mono);
          font-size: 13px;
          line-height: 1.7;
        }

        .message-strip {
          margin-top: 18px;
          display: grid;
          gap: 10px;
        }

        .message {
          border-radius: 14px;
          padding: 12px 14px;
          font-family: var(--mono);
          font-size: 12px;
          line-height: 1.45;
          background: #f2f7ff;
          color: #23314d;
          border: 1px solid rgba(18, 104, 255, 0.08);
        }

        .message.user {
          background: #1268ff;
          color: #ffffff;
          justify-self: end;
          width: 76%;
        }

        .coach-footer {
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #edf2f7;
          padding-top: 15px;
          color: #6b7280;
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 800;
        }

        .mini-stack {
          display: grid;
          gap: 18px;
          transform: translateY(28px);
        }

        .mini-card {
          min-height: 128px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.82);
        }

        .mini-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .mini-tile {
          height: 58px;
          border-radius: 14px;
          border: 1px solid rgba(18, 104, 255, 0.15);
          background:
            radial-gradient(circle at 28% 30%, rgba(255, 255, 255, 0.9), transparent 24%),
            linear-gradient(135deg, rgba(18, 104, 255, 0.2), rgba(155, 232, 255, 0.46));
        }

        .mini-card h4 {
          margin: 0 0 10px;
          color: #101828;
          font-size: 16px;
          letter-spacing: -0.03em;
        }

        .mini-card p {
          color: #64748b;
          font-family: var(--mono);
          font-size: 12px;
          line-height: 1.55;
        }

        .logo-strip {
          position: relative;
          z-index: 3;
          margin-top: 0;
          padding: 54px 20px 82px;
          background: linear-gradient(180deg, #eaf9ff 0%, #ffffff 72%);
          text-align: center;
        }

        .logo-strip p {
          color: #101828;
          font-size: 13px;
          font-weight: 900;
        }

        .logos {
          width: min(820px, 100%);
          margin: 28px auto 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(18px, 4vw, 54px);
          flex-wrap: wrap;
          color: rgba(9, 11, 22, 0.58);
          font-size: 17px;
          font-weight: 900;
          letter-spacing: -0.05em;
        }

        .logos span:nth-child(odd) {
          opacity: 0.44;
        }

        .section {
          padding: 88px 20px;
          background: #ffffff;
        }

        .section-soft {
          background: linear-gradient(180deg, #f6fbff 0%, #ffffff 100%);
        }

        .section-head {
          width: min(840px, 100%);
          margin: 0 auto 48px;
          text-align: center;
        }

        .section-head h2 {
          margin-top: 20px;
          color: #070a16;
          font-size: clamp(42px, 5vw, 70px);
          line-height: 1;
          letter-spacing: -0.06em;
          font-weight: 900;
        }

        .section-head h2 span {
          color: var(--blue);
        }

        .section-head p {
          width: min(670px, 100%);
          margin: 18px auto 0;
          color: var(--muted);
          font-family: var(--mono);
          font-size: 14px;
          line-height: 1.75;
        }

        .who-grid {
          width: min(1120px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .who-card {
          border-radius: 22px;
          padding: 26px;
          background: #ffffff;
          border: 1px solid var(--line);
          box-shadow: 0 28px 80px rgba(12, 86, 180, 0.08);
        }

        .card-icon {
          width: 46px;
          height: 46px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          color: #ffffff;
          background: linear-gradient(135deg, #1268ff, #30c2ff);
          font-size: 20px;
          font-weight: 900;
        }

        .who-card:nth-child(2) .card-icon {
          background: linear-gradient(135deg, #6b5cff, #b36cff);
        }

        .who-card:nth-child(3) .card-icon {
          background: linear-gradient(135deg, #14b86f, #ff9f31);
        }

        .who-card h3 {
          margin-top: 26px;
          color: #080b15;
          font-size: 28px;
          letter-spacing: -0.05em;
          font-weight: 900;
          text-transform: uppercase;
        }

        .who-card p {
          margin-top: 13px;
          color: #5c6678;
          font-family: var(--mono);
          font-size: 13px;
          line-height: 1.75;
        }

        .quote {
          margin-top: 22px;
          border-radius: 16px;
          padding: 16px;
          background: #f4f9ff;
          border: 1px solid rgba(18, 104, 255, 0.12);
          color: #17233c;
          font-family: var(--mono);
          font-size: 12px;
          line-height: 1.55;
          font-weight: 800;
        }

        .tag-row {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          min-height: 26px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 0 10px;
          background: #eef7ff;
          color: #1268ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.02em;
        }

        .feature-overview {
          width: min(1120px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 18px;
        }

        .platform-card {
          min-height: 320px;
          border-radius: 22px;
          border: 1px solid var(--line);
          background: linear-gradient(180deg, #ffffff, #f7fbff);
          box-shadow: 0 28px 80px rgba(12, 86, 180, 0.08);
          padding: 28px;
        }

        .coach-style-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 26px;
        }

        .style-pill {
          min-height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid rgba(18, 104, 255, 0.12);
          color: #101828;
          font-weight: 900;
          letter-spacing: -0.03em;
          box-shadow: 0 14px 34px rgba(12, 86, 180, 0.06);
        }

        .platform-card h3 {
          color: #080b15;
          font-size: 26px;
          line-height: 1.1;
          letter-spacing: -0.05em;
          font-weight: 900;
        }

        .platform-card p {
          margin-top: 12px;
          color: #5c6678;
          font-family: var(--mono);
          font-size: 13px;
          line-height: 1.75;
        }

        .steps-grid {
          width: min(1120px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .step-card {
          min-height: 280px;
          border-radius: 22px;
          padding: 24px;
          background: #ffffff;
          border: 1px solid var(--line);
          box-shadow: 0 28px 80px rgba(12, 86, 180, 0.08);
        }

        .step-number {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #ffffff;
          font-size: 14px;
          font-weight: 900;
          background: var(--blue);
          box-shadow: 0 14px 32px rgba(18, 104, 255, 0.28);
        }

        .step-card.purple .step-number {
          background: #7c3cff;
          box-shadow: 0 14px 32px rgba(124, 60, 255, 0.24);
        }

        .step-card.green .step-number {
          background: #12b76a;
          box-shadow: 0 14px 32px rgba(18, 183, 106, 0.22);
        }

        .step-card.orange .step-number {
          background: #ff8a1f;
          box-shadow: 0 14px 32px rgba(255, 138, 31, 0.22);
        }

        .step-card h3 {
          margin-top: 28px;
          color: #080b15;
          font-size: 22px;
          line-height: 1.1;
          letter-spacing: -0.05em;
          font-weight: 900;
          text-transform: uppercase;
        }

        .step-card p {
          margin-top: 14px;
          color: #5c6678;
          font-family: var(--mono);
          font-size: 13px;
          line-height: 1.75;
        }

        .faq {
          width: min(700px, 100%);
          margin: 0 auto;
          display: grid;
          gap: 12px;
        }

        .faq-item {
          border-radius: 15px;
          background: #f5f7fa;
          border: 1px solid rgba(9, 11, 22, 0.04);
          overflow: hidden;
        }

        .faq summary {
          list-style: none;
          cursor: pointer;
          min-height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 0 20px;
          color: #101828;
          font-size: 14px;
          font-weight: 900;
        }

        .faq summary::-webkit-details-marker {
          display: none;
        }

        .faq summary span {
          color: #64748b;
          font-size: 20px;
        }

        .faq-item p {
          padding: 0 20px 20px;
          color: #5c6678;
          font-family: var(--mono);
          font-size: 13px;
          line-height: 1.7;
        }

        .bottom-cta {
          padding: 0 20px 88px;
          background: #ffffff;
        }

        .bottom-box {
          width: min(1120px, 100%);
          min-height: 430px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          padding: 72px 28px 0;
          text-align: center;
          color: #ffffff;
          background:
            radial-gradient(circle at 50% 110%, rgba(52, 184, 255, 0.5), transparent 32%),
            linear-gradient(180deg, #0a7cff 0%, #4bc4ff 100%);
          box-shadow: 0 34px 90px rgba(18, 104, 255, 0.26);
        }

        .bottom-box::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.24;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.28) 1px, transparent 1px);
          background-size: 74px 74px;
        }

        .bottom-box > * {
          position: relative;
          z-index: 1;
        }

        .bottom-box h2 {
          width: min(720px, 100%);
          margin: 20px auto 0;
          color: #ffffff;
          font-size: clamp(42px, 5vw, 72px);
          line-height: 1;
          letter-spacing: -0.06em;
          font-weight: 900;
        }

        .bottom-preview {
          width: min(760px, 90%);
          height: 160px;
          margin: 50px auto 0;
          border-radius: 22px 22px 0 0;
          background: rgba(255, 255, 255, 0.93);
          border: 9px solid rgba(255, 255, 255, 0.75);
          box-shadow: 0 26px 80px rgba(5, 45, 120, 0.24);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 20px;
          color: #101828;
          text-align: left;
        }

        .preview-line {
          border-radius: 16px;
          background: #f3f8ff;
          border: 1px solid rgba(18, 104, 255, 0.1);
          padding: 14px;
          font-family: var(--mono);
          font-size: 12px;
          line-height: 1.4;
          color: #475467;
        }

        @media (max-width: 900px) {
          .hero {
            min-height: auto;
            padding-bottom: 120px;
          }

          .hero-cards,
          .who-grid,
          .feature-overview,
          .steps-grid {
            grid-template-columns: 1fr;
          }

          .hero-cards {
            width: min(520px, 100%);
          }

          .social-card,
          .mini-stack {
            transform: none;
          }

          .logo-strip {
            padding-top: 46px;
          }
        }

        @media (max-width: 640px) {
          .hero {
            padding: 16px 12px 100px;
          }

          .nav {
            height: 56px;
            padding: 8px 9px 8px 16px;
          }

          .brand {
            font-size: 15px;
          }

          .nav-link {
            display: none;
          }

          .nav-actions .btn-primary {
            display: none;
          }

          .hero-copy {
            margin-top: 58px;
            width: min(330px, 100%);
          }

          .hero h1 {
            font-size: 43px;
            line-height: 0.98;
          }

          .desktop-hero-title {
            display: none;
          }

          .mobile-hero-title {
            display: inline;
          }

          .hero-sub {
            font-size: 13px;
            width: min(320px, 100%);
          }

          .hero-actions .btn {
            width: min(280px, 100%);
          }

          .proof {
            width: min(300px, 100%);
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
          }

          .hero-cards {
            margin-top: 44px;
          }

          .section {
            padding: 68px 14px;
          }

          .section-head h2,
          .bottom-box h2 {
            font-size: 42px;
          }

          .who-card,
          .platform-card,
          .step-card {
            padding: 22px;
          }

          .bottom-cta {
            padding: 0 14px 68px;
          }

          .bottom-box {
            padding: 52px 18px 0;
            border-radius: 22px;
          }

          .bottom-preview {
            width: 100%;
            grid-template-columns: 1fr;
            height: auto;
          }
        }
      `}</style>

      <section className="hero">
        <div className="shell">
          <nav className="nav" aria-label="Main navigation">
            <button
              className="brand"
              type="button"
              onClick={() => router.push("/?home=1")}
            >
              <LogoMark />
              MOGGEDAI
            </button>

            <div className="nav-actions">
              {isSignedIn ? (
                <>
                  <button
                    className="nav-link"
                    type="button"
                    onClick={() => router.push("/dashboard")}
                  >
                    DASHBOARD
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => signOut({ redirectUrl: "/" })}
                  >
                    SIGN OUT
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="nav-link"
                    type="button"
                    onClick={() => router.push("/sign-in")}
                  >
                    LOG IN
                  </button>
                  <a
                    className="btn btn-primary"
                    href={telegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GET STARTED
                  </a>
                </>
              )}
            </div>
          </nav>

          <div className="hero-copy">
            <div className="badge">100% TELEGRAM ACCOUNTABILITY COACH</div>
            <h1>
              <span className="desktop-hero-title">
                WIN THE DAY.
                <br />
                <span>EVERYDAY.</span>
              </span>
              <span className="mobile-hero-title">
                WIN THE
                <br />
                DAY.
                <br />
                <span>EVERYDAY.</span>
              </span>
            </h1>
            <p className="hero-sub">
              An AI coach that checks in through Telegram, holds you accountable,
              and won&apos;t let you make excuses. Set it once. Stay on track forever.
            </p>
            <div className="hero-actions">
              <a
                className="btn btn-primary"
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TelegramIcon />
                Start on Telegram
              </a>
              <a className="btn btn-ghost" href="#how">
                See How It Works
              </a>
            </div>
            <p className="proof">🔥🔥🔥🔥🔥 Join people hitting their goals daily</p>
          </div>

          <div className="hero-cards" aria-label="MoggedAI product preview">
            <article className="social-card">
              <div className="social-top">
                <span>@lockedin</span>
                <span>TELEGRAM</span>
              </div>
              <div className="avatar" />
              <p>Goal: study Python every day until it feels automatic.</p>
              <div className="stat-row">
                <span>6 day streak</span>
                <span>3 check-ins</span>
              </div>
            </article>

            <article className="coach-card">
              <div className="coach-top">
                <span className="stars">★★★★★</span>
                <span>COACH MODE</span>
              </div>
              <h3>Accountability that actually follows up.</h3>
              <p>
                MoggedAI remembers the goal, reads the excuse, and pushes the next
                action instead of giving generic motivation.
              </p>
              <div className="message-strip">
                <div className="message">
                  You said Python before bed. Open the lesson for 20 minutes.
                </div>
                <div className="message user">DONE. Finished the functions section.</div>
                <div className="message">Good. Same time tomorrow. Keep the streak alive.</div>
              </div>
              <div className="coach-footer">
                <span>Direct style</span>
                <span>Next ping 8:00 PM</span>
              </div>
            </article>

            <div className="mini-stack">
              <article className="mini-card">
                <h4>Goal types</h4>
                <div className="mini-grid">
                  <div className="mini-tile" />
                  <div className="mini-tile" />
                  <div className="mini-tile" />
                  <div className="mini-tile" />
                </div>
              </article>
              <article className="mini-card">
                <h4>Coach styles</h4>
                <p>Brutal, direct, or motivating. Messages adapt to the goal and your replies.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="logo-strip" aria-label="Social proof">
        <p>3,500+ check-ins sent to people staying locked in.</p>
        <div className="logos">
          <span>Students</span>
          <span>Builders</span>
          <span>Athletes</span>
          <span>Founders</span>
          <span>Creators</span>
        </div>
      </section>

      <section className="section" id="who">
        <div className="section-head">
          <div className="badge section-badge">Built For Locking In</div>
          <h2>
            Accountability for <span>real life</span>.
          </h2>
          <p>
            MoggedAI is for people who know what they need to do, but need a coach
            in their pocket keeping pressure on throughout the day.
          </p>
        </div>

        <div className="who-grid">
          {whoCards.map((card, index) => (
            <article className="who-card" key={card.title}>
              <div className="card-icon">{index + 1}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <div className="quote">&quot;{card.quote}&quot;</div>
              <div className="tag-row">
                {card.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-soft" id="how">
        <div className="section-head">
          <div className="badge section-badge">Platform Overview</div>
          <h2>Set it once. Works all day.</h2>
          <p>
            The loop is simple: set the goal, choose the pressure, reply when you
            move. MoggedAI handles the rest.
          </p>
        </div>

        <div className="feature-overview">
          <article className="platform-card">
            <div className="coach-style-grid">
              <div className="style-pill">BRUTAL</div>
              <div className="style-pill">DIRECT</div>
              <div className="style-pill">MOTIVATING</div>
              <div className="style-pill">CUSTOM</div>
            </div>
            <h3>Every check-in has a job.</h3>
            <p>
              No empty reminders. Each message is written around the goal, the
              time of day, and what you said last.
            </p>
          </article>

          <article className="platform-card">
            <div className="message-strip">
              <div className="message">5:45 AM. You said gym. Shoes on.</div>
              <div className="message user">I&apos;m tired.</div>
              <div className="message">
                Tired is fine. Skipping is not. Walk there and send DONE.
              </div>
            </div>
            <h3>Telegram first. Friction low.</h3>
            <p>
              Friends can start from the link, set their own goal, and talk to
              the coach like a normal conversation.
            </p>
          </article>
        </div>

        <div className="steps-grid" style={{ marginTop: 18 }}>
          {steps.map((step) => (
            <article className={`step-card ${step.tone}`} key={step.number}>
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="faq">
        <div className="section-head">
          <div className="badge section-badge">Common Questions</div>
          <h2>Questions? We got you.</h2>
        </div>

        <div className="faq">
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>
                {faq.question}
                <span>›</span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bottom-cta">
        <div className="bottom-box">
          <div className="badge">Your Day. Always Accountable.</div>
          <h2>Start winning today.</h2>
          <div className="hero-actions">
            <a
              className="btn btn-light"
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TelegramIcon />
              Start on Telegram
            </a>
          </div>
          <div className="bottom-preview">
            <div className="preview-line">SET GOAL<br />Study Python daily</div>
            <div className="preview-line">COACH STYLE<br />Direct</div>
            <div className="preview-line">NEXT CHECK-IN<br />8:00 PM</div>
          </div>
        </div>
      </section>
    </main>
  );
}
