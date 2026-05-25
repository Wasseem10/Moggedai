"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const telegramHref =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ||
  "https://t.me/StaypingedBot?start=website";

const steps = [
  {
    title: "Start in Telegram",
    text: "No new account flow. Open the bot, say the goal, and Staypinged remembers the context.",
  },
  {
    title: "Set the standard",
    text: "Tell it what counts as a real win: study time, gym sessions, shipping work, or anything else.",
  },
  {
    title: "Get kept honest",
    text: "When you drift, it brings the conversation back to the next concrete action.",
  },
];

const commitments = [
  { label: "Python study", value: "Daily", tone: "blue" },
  { label: "Gym", value: "4x/week", tone: "black" },
  { label: "Ship project", value: "One commit", tone: "green" },
];

function AppIcon() {
  return (
    <div className="app-icon" aria-hidden="true">
      <div className="app-icon-mark">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function PhonePreview() {
  return (
    <div className="phone-wrap" aria-label="Staypinged iPhone preview">
      <div className="phone">
        <div className="phone-bezel">
          <div className="phone-island" />
          <div className="phone-screen">
            <div className="phone-status">
              <span>9:41</span>
              <div className="status-icons">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="phone-header">
              <div>
                <p>Staypinged</p>
                <h3>Daily check-in</h3>
              </div>
              <div className="header-dot" />
            </div>

            <div className="goal-card">
              <span>Active goal</span>
              <strong>Study Python every day until it feels automatic.</strong>
              <div className="goal-row">
                <p>Next check-in</p>
                <b>Tonight</b>
              </div>
            </div>

            <div className="commitment-list">
              {commitments.map((item) => (
                <div className={`commitment ${item.tone}`} key={item.label}>
                  <div className="commitment-dot" />
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="phone-note">
              <span />
              <p>Keep the promise small enough to do today.</p>
            </div>

            <div className="phone-input">
              <span>Send an update...</span>
              <button type="button" aria-label="Send preview message">
                <svg viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M9 2.4 15.3 15 9 12.7 2.7 15 9 2.4Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPanel() {
  return (
    <div className="product-panel" aria-label="Staypinged product preview">
      <div className="browser-shell">
        <div className="browser-top">
          <div className="browser-dots">
            <span />
            <span />
            <span />
          </div>
          <p>Private beta</p>
          <button type="button">Live</button>
        </div>
        <div className="browser-body">
          <div className="dashboard-side">
            <div className="side-brand">
              <AppIcon />
              <strong>Staypinged</strong>
            </div>
            <div className="side-item active">Goals</div>
            <div className="side-item">Check-ins</div>
            <div className="side-item">Friends</div>
          </div>
          <div className="dashboard-main">
            <div className="dashboard-title">
              <div>
                <p>Accountability</p>
                <h3>Keep the next step visible.</h3>
              </div>
              <span>Telegram ready</span>
            </div>
            <div className="metrics">
              <div>
                <span>Active goals</span>
                <strong>3</strong>
              </div>
              <div>
                <span>Streak</span>
                <strong>6</strong>
              </div>
              <div>
                <span>Next ping</span>
                <strong>8 PM</strong>
              </div>
            </div>
            <div className="progress-card">
              <div>
                <p>Python study</p>
                <strong>20 minutes is enough to keep the streak alive.</strong>
              </div>
              <div className="progress-line">
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>
      <PhonePreview />
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111318]">
      <style>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        main {
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
          background:
            linear-gradient(180deg, rgba(176, 215, 255, 0.92) 0%, rgba(229, 242, 255, 0.92) 48%, #f7f8fa 100%);
        }

        .nav-wrap {
          position: relative;
          z-index: 5;
          padding: 28px 20px 0;
        }

        .nav {
          width: min(730px, 100%);
          height: 60px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 8px 9px 8px 20px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(17, 19, 24, 0.08);
          box-shadow: 0 24px 70px rgba(42, 86, 130, 0.14);
          backdrop-filter: blur(18px);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 0;
          background: transparent;
          color: #111318;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .mini-mark {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #111318;
          display: grid;
          place-items: center;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
        }

        .mini-mark span {
          width: 13px;
          height: 13px;
          border-radius: 4px;
          background: #78bfff;
          box-shadow: 6px 0 0 #ffffff;
          transform: rotate(-8deg);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 14px;
          font-weight: 650;
          color: rgba(17, 19, 24, 0.58);
          white-space: nowrap;
        }

        .nav-link {
          transition: color 160ms ease;
        }

        .nav-link:hover {
          color: #111318;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .button {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 18px;
          border: 1px solid rgba(17, 19, 24, 0.1);
          background: rgba(255, 255, 255, 0.72);
          color: #111318;
          font-weight: 750;
          text-decoration: none;
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
          font-family: inherit;
        }

        .button:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 40px rgba(17, 19, 24, 0.1);
        }

        .button.primary {
          border-color: #111318;
          background: #111318;
          color: #ffffff;
          box-shadow: 0 18px 46px rgba(17, 19, 24, 0.24);
        }

        .button.blue {
          border-color: rgba(25, 112, 225, 0.22);
          background: #1970e1;
          color: #ffffff;
          box-shadow: 0 18px 46px rgba(25, 112, 225, 0.28);
        }

        .hero {
          width: min(1180px, calc(100vw - 40px));
          margin: 0 auto;
          padding: 54px 0 0;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .app-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto;
          border-radius: 18px;
          background: linear-gradient(145deg, #111318, #1a2d55);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 24px 60px rgba(17, 19, 24, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.18);
          display: grid;
          place-items: center;
        }

        .app-icon-mark {
          width: 34px;
          height: 29px;
          position: relative;
        }

        .app-icon-mark span {
          position: absolute;
          width: 16px;
          height: 22px;
          border-radius: 5px;
          background: #72b9ff;
        }

        .app-icon-mark span:nth-child(1) {
          left: 0;
          bottom: 0;
          background: #ffffff;
          transform: rotate(-8deg);
        }

        .app-icon-mark span:nth-child(2) {
          left: 10px;
          top: 0;
          background: #72b9ff;
          transform: rotate(8deg);
        }

        .app-icon-mark span:nth-child(3) {
          right: 0;
          bottom: 2px;
          width: 12px;
          height: 15px;
          background: #0b5bd3;
          transform: rotate(-6deg);
        }

        .eyebrow {
          margin: 18px auto 18px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 13px;
          border-radius: 999px;
          border: 1px solid rgba(17, 19, 24, 0.08);
          background: rgba(255, 255, 255, 0.62);
          color: rgba(17, 19, 24, 0.62);
          font-size: 14px;
          font-weight: 750;
        }

        .eyebrow span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0fa36b;
        }

        .hero h1 {
          max-width: 780px;
          margin: 0 auto;
          color: #111318;
          font-size: clamp(50px, 6.1vw, 86px);
          line-height: 0.96;
          font-weight: 850;
          letter-spacing: 0;
        }

        .mobile-title {
          display: none;
        }

        .hero p.lead {
          max-width: 650px;
          margin: 18px auto 0;
          color: rgba(17, 19, 24, 0.62);
          font-size: clamp(17px, 1.6vw, 21px);
          line-height: 1.55;
          font-weight: 520;
        }

        .hero-actions {
          margin-top: 24px;
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .proof-row {
          width: min(760px, 100%);
          margin: 40px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          color: rgba(17, 19, 24, 0.52);
          font-size: 13px;
          font-weight: 750;
          text-transform: uppercase;
        }

        .proof-row span {
          border-top: 1px solid rgba(17, 19, 24, 0.12);
          padding-top: 13px;
        }

        .product-panel {
          width: min(1180px, calc(100vw - 40px));
          min-height: 560px;
          margin: 38px auto 0;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          padding: 38px 40px 0;
          border-radius: 8px 8px 0 0;
          background:
            radial-gradient(circle at 24% 12%, rgba(255, 255, 255, 0.92), transparent 32%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0.92));
          border: 1px solid rgba(17, 19, 24, 0.08);
          border-bottom: 0;
          box-shadow: 0 45px 120px rgba(42, 86, 130, 0.15);
        }

        .browser-shell {
          width: min(820px, 70vw);
          height: 420px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid rgba(17, 19, 24, 0.1);
          box-shadow: 0 34px 90px rgba(17, 19, 24, 0.12);
          overflow: hidden;
          transform: translateX(58px);
        }

        .browser-top {
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          border-bottom: 1px solid rgba(17, 19, 24, 0.08);
          color: rgba(17, 19, 24, 0.45);
          font-size: 13px;
          font-weight: 750;
        }

        .browser-dots {
          display: flex;
          gap: 7px;
        }

        .browser-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(17, 19, 24, 0.16);
        }

        .browser-top button {
          height: 28px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(15, 163, 107, 0.2);
          background: rgba(15, 163, 107, 0.08);
          color: #0f7b53;
          font-weight: 800;
        }

        .browser-body {
          height: calc(100% - 46px);
          display: grid;
          grid-template-columns: 210px 1fr;
        }

        .dashboard-side {
          border-right: 1px solid rgba(17, 19, 24, 0.08);
          background: #f8f9fb;
          padding: 20px;
        }

        .side-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 26px;
        }

        .side-brand .app-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          margin: 0;
        }

        .side-brand .app-icon-mark {
          width: 18px;
          height: 16px;
        }

        .side-brand .app-icon-mark span {
          width: 9px;
          height: 13px;
          border-radius: 3px;
        }

        .side-brand .app-icon-mark span:nth-child(2) {
          left: 6px;
        }

        .side-brand .app-icon-mark span:nth-child(3) {
          width: 7px;
          height: 9px;
        }

        .side-item {
          height: 38px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          border-radius: 8px;
          color: rgba(17, 19, 24, 0.56);
          font-size: 14px;
          font-weight: 700;
        }

        .side-item.active {
          background: #111318;
          color: #ffffff;
        }

        .dashboard-main {
          padding: 28px;
        }

        .dashboard-title {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .dashboard-title p {
          margin: 0 0 7px;
          color: rgba(17, 19, 24, 0.45);
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .dashboard-title h3 {
          margin: 0;
          max-width: 360px;
          color: #111318;
          font-size: 34px;
          line-height: 1.06;
          font-weight: 850;
        }

        .dashboard-title span {
          padding: 8px 11px;
          border-radius: 999px;
          background: rgba(25, 112, 225, 0.09);
          color: #175fc2;
          font-size: 12px;
          font-weight: 850;
          white-space: nowrap;
        }

        .metrics {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .metrics div {
          min-height: 96px;
          border-radius: 8px;
          border: 1px solid rgba(17, 19, 24, 0.08);
          background: #f8f9fb;
          padding: 16px;
        }

        .metrics span {
          display: block;
          color: rgba(17, 19, 24, 0.45);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .metrics strong {
          display: block;
          margin-top: 11px;
          color: #111318;
          font-size: 34px;
          line-height: 1;
        }

        .progress-card {
          margin-top: 14px;
          border-radius: 8px;
          background: #111318;
          color: #ffffff;
          padding: 22px;
        }

        .progress-card p {
          margin: 0 0 7px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .progress-card strong {
          display: block;
          max-width: 420px;
          font-size: 22px;
          line-height: 1.25;
        }

        .progress-line {
          height: 8px;
          margin-top: 18px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          overflow: hidden;
        }

        .progress-line span {
          display: block;
          width: 64%;
          height: 100%;
          border-radius: inherit;
          background: #72b9ff;
        }

        .phone-wrap {
          position: absolute;
          left: 68px;
          bottom: -18px;
          width: 286px;
          filter: drop-shadow(0 38px 70px rgba(17, 19, 24, 0.28));
        }

        .phone {
          width: 286px;
          height: 580px;
          border-radius: 44px;
          padding: 10px;
          background: #0c0d10;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
        }

        .phone-bezel {
          height: 100%;
          border-radius: 36px;
          padding: 12px;
          background: #111318;
          position: relative;
        }

        .phone-island {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          width: 86px;
          height: 26px;
          border-radius: 999px;
          background: #050608;
          z-index: 4;
        }

        .phone-screen {
          height: 100%;
          border-radius: 28px;
          background:
            linear-gradient(180deg, #f9fbff 0%, #eef5ff 48%, #ffffff 100%);
          overflow: hidden;
          padding: 16px 16px 14px;
          display: flex;
          flex-direction: column;
          color: #111318;
        }

        .phone-status {
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6px;
          font-size: 13px;
          font-weight: 800;
        }

        .status-icons {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .status-icons span {
          display: block;
          width: 13px;
          height: 7px;
          border-radius: 2px;
          background: rgba(17, 19, 24, 0.65);
        }

        .status-icons span:nth-child(2) {
          width: 9px;
        }

        .status-icons span:nth-child(3) {
          width: 16px;
          height: 8px;
          border-radius: 3px;
        }

        .phone-header {
          margin-top: 28px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .phone-header p {
          margin: 0 0 4px;
          color: rgba(17, 19, 24, 0.48);
          font-size: 12px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .phone-header h3 {
          margin: 0;
          font-size: 27px;
          line-height: 1.04;
          font-weight: 850;
        }

        .header-dot {
          width: 34px;
          height: 34px;
          border-radius: 11px;
          background: #111318;
          position: relative;
        }

        .header-dot:after {
          content: "";
          position: absolute;
          inset: 10px;
          border-radius: 5px;
          background: #72b9ff;
        }

        .goal-card {
          margin-top: 20px;
          border-radius: 8px;
          background: #111318;
          color: #ffffff;
          padding: 18px;
          box-shadow: 0 16px 36px rgba(17, 19, 24, 0.18);
        }

        .goal-card span {
          display: block;
          color: rgba(255, 255, 255, 0.52);
          font-size: 12px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .goal-card strong {
          display: block;
          margin-top: 10px;
          font-size: 18px;
          line-height: 1.24;
        }

        .goal-row {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .goal-row p {
          margin: 0;
          color: rgba(255, 255, 255, 0.55);
          font-size: 12px;
          font-weight: 750;
        }

        .goal-row b {
          font-size: 13px;
        }

        .commitment-list {
          margin-top: 14px;
          display: grid;
          gap: 10px;
        }

        .commitment {
          min-height: 58px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid rgba(17, 19, 24, 0.08);
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px;
        }

        .commitment-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #1970e1;
        }

        .commitment.black .commitment-dot {
          background: #111318;
        }

        .commitment.green .commitment-dot {
          background: #0fa36b;
        }

        .commitment strong,
        .commitment span {
          display: block;
        }

        .commitment strong {
          font-size: 14px;
          line-height: 1.1;
        }

        .commitment span {
          margin-top: 3px;
          color: rgba(17, 19, 24, 0.48);
          font-size: 12px;
          font-weight: 700;
        }

        .phone-note {
          margin-top: 14px;
          border-radius: 8px;
          background: rgba(25, 112, 225, 0.08);
          border: 1px solid rgba(25, 112, 225, 0.12);
          padding: 12px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .phone-note span {
          width: 8px;
          height: 8px;
          margin-top: 5px;
          border-radius: 50%;
          background: #1970e1;
          flex: none;
        }

        .phone-note p {
          margin: 0;
          color: rgba(17, 19, 24, 0.62);
          font-size: 12px;
          line-height: 1.35;
          font-weight: 730;
        }

        .phone-input {
          margin-top: auto;
          height: 44px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid rgba(17, 19, 24, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 5px 4px 15px;
          color: rgba(17, 19, 24, 0.36);
          font-size: 13px;
          font-weight: 700;
        }

        .phone-input button {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 0;
          background: #1970e1;
          display: grid;
          place-items: center;
        }

        .phone-input svg {
          width: 17px;
          height: 17px;
          fill: #ffffff;
        }

        .section {
          background: #f7f8fa;
          padding: 96px 20px;
        }

        .section-inner {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .section-eyebrow {
          margin: 0 0 16px;
          color: rgba(17, 19, 24, 0.46);
          font-size: 13px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .section-title {
          margin: 0;
          max-width: 760px;
          color: #111318;
          font-size: clamp(42px, 5vw, 74px);
          line-height: 1;
          font-weight: 850;
          letter-spacing: 0;
        }

        .steps {
          margin-top: 38px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .step {
          min-height: 210px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid rgba(17, 19, 24, 0.08);
          padding: 24px;
          box-shadow: 0 20px 70px rgba(17, 19, 24, 0.06);
        }

        .step-number {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #111318;
          color: #ffffff;
          font-size: 13px;
          font-weight: 850;
        }

        .step h3 {
          margin: 24px 0 10px;
          color: #111318;
          font-size: 22px;
          line-height: 1.1;
          font-weight: 820;
        }

        .step p {
          margin: 0;
          color: rgba(17, 19, 24, 0.58);
          font-size: 15px;
          line-height: 1.58;
          font-weight: 520;
        }

        .cta-band {
          padding: 0 20px 36px;
          background: #f7f8fa;
        }

        .cta-inner {
          width: min(1120px, 100%);
          margin: 0 auto;
          border-radius: 8px;
          background:
            radial-gradient(circle at 82% 18%, rgba(114, 185, 255, 0.34), transparent 36%),
            linear-gradient(135deg, #111318, #17233a);
          color: #ffffff;
          padding: 58px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 28px;
          align-items: center;
        }

        .cta-inner h2 {
          margin: 0;
          max-width: 620px;
          font-size: clamp(36px, 4.5vw, 66px);
          line-height: 1;
          font-weight: 850;
          letter-spacing: 0;
        }

        .cta-inner p {
          margin: 16px 0 0;
          max-width: 560px;
          color: rgba(255, 255, 255, 0.64);
          font-size: 17px;
          line-height: 1.55;
        }

        .cta-inner .button {
          background: #ffffff;
          color: #111318;
          border-color: #ffffff;
          white-space: nowrap;
        }

        @media (max-width: 980px) {
          .hero {
            padding-top: 50px;
          }

          .product-panel {
            min-height: 720px;
            align-items: flex-start;
            padding: 28px 24px 0;
          }

          .browser-shell {
            width: 100%;
            transform: none;
          }

          .phone-wrap {
            left: 50%;
            bottom: -28px;
            transform: translateX(-50%);
          }

          .steps {
            grid-template-columns: 1fr;
          }

          .cta-inner {
            grid-template-columns: 1fr;
            padding: 38px 24px;
          }
        }

        @media (max-width: 720px) {
          .nav-wrap {
            padding: 28px 14px 0;
          }

          .nav {
            height: auto;
            min-height: 58px;
            width: 100%;
            padding-left: 14px;
          }

          .nav-links {
            display: none;
          }

          .nav-actions .button:not(.primary) {
            display: none;
          }

          .nav-actions {
            display: none;
          }

          .hero {
            width: min(100%, 260px);
            padding-top: 62px;
          }

          .hero h1 {
            font-size: 40px;
            line-height: 1;
            max-width: 100%;
          }

          .desktop-title {
            display: none;
          }

          .mobile-title {
            display: inline;
          }

          .hero p.lead {
            max-width: 260px;
            font-size: 16px;
            line-height: 1.5;
          }

          .hero-actions {
            width: min(250px, 100%);
            margin-left: auto;
            margin-right: auto;
          }

          .hero-actions .button {
            width: 100%;
          }

          .product-panel {
            width: calc(100vw - 24px);
            min-height: 690px;
            margin-top: 34px;
            padding: 16px 14px 0;
          }

          .browser-shell {
            height: 330px;
          }

          .browser-body {
            grid-template-columns: 1fr;
          }

          .dashboard-side {
            display: none;
          }

          .dashboard-main {
            padding: 20px;
          }

          .dashboard-title h3 {
            font-size: 28px;
          }

          .dashboard-title span {
            display: none;
          }

          .metrics {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .metrics div {
            min-height: 66px;
            padding: 12px;
          }

          .metrics strong {
            font-size: 26px;
          }

          .progress-card {
            display: none;
          }

          .phone-wrap {
            width: 252px;
          }

          .phone {
            width: 252px;
            height: 512px;
            border-radius: 38px;
          }

          .phone-bezel {
            border-radius: 31px;
          }

          .phone-screen {
            border-radius: 24px;
            padding: 14px;
          }

          .phone-header h3 {
            font-size: 23px;
          }

          .goal-card strong {
            font-size: 16px;
          }

          .commitment {
            min-height: 52px;
          }

          .section {
            padding: 72px 14px;
          }

          .step {
            min-height: auto;
          }
        }
      `}</style>

      <div className="page">
        <div className="nav-wrap">
          <nav className="nav" aria-label="Main navigation">
            <button
              type="button"
              className="brand"
              onClick={() => router.push("/?home=1")}
            >
              <span className="mini-mark">
                <span />
              </span>
              Staypinged
            </button>
            <div className="nav-links">
              <a className="nav-link" href="#how">How it works</a>
              <a className="nav-link" href="#beta">Beta</a>
              <a className="nav-link" href="mailto:wasseem800@gmail.com">Support</a>
            </div>
            <div className="nav-actions">
              {isSignedIn ? (
                <>
                  <button
                    type="button"
                    className="button"
                    onClick={() => router.push("/dashboard")}
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => signOut({ redirectUrl: "/" })}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <a
                  className="button primary"
                  href={telegramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start
                </a>
              )}
            </div>
          </nav>
        </div>

        <section className="hero">
          <AppIcon />
          <div className="eyebrow">
            <span />
            Telegram beta is live
          </div>
          <h1>
            <span className="desktop-title">Accountability that checks in.</span>
            <span className="mobile-title">AI coach that checks in.</span>
          </h1>
          <p className="lead">
            Staypinged is an AI coach for the goals you keep putting off. Start in Telegram, say what you are trying to stick to, and keep the next step in front of you.
          </p>
          <div className="hero-actions">
            <a
              className="button primary"
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start in Telegram
            </a>
            <a className="button" href="#how">
              See how it works
            </a>
          </div>
        </section>

        <ProductPanel />
      </div>

      <section className="section" id="how">
        <div className="section-inner">
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-title">A simple loop for staying consistent.</h2>
          <div className="steps">
            {steps.map((step, index) => (
              <article className="step" key={step.title}>
                <div className="step-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band" id="beta">
        <div className="cta-inner">
          <div>
            <h2>Send it to a friend when you are ready.</h2>
            <p>
              Anyone with the Telegram link can start their own conversation with the bot. Keep it small, test with real people, and improve the coach from actual use.
            </p>
          </div>
          <a
            className="button"
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Telegram
          </a>
        </div>
      </section>
    </main>
  );
}
