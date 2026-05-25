"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const telegramHref =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ||
  "https://t.me/StaypingedBot?start=website";

const chat = [
  { from: "bot", text: "what are we working on today?" },
  { from: "user", text: "i need to study python every day until i get good" },
  { from: "bot", text: "got you. i'll keep you honest about python, not just motivated for one afternoon." },
  { from: "user", text: "i don't feel like doing it today" },
  { from: "bot", text: "that's exactly when it counts. open the lesson for 15 minutes and send me proof after." },
];

const routines = [
  { title: "Study Python", detail: "Daily session", status: "active" },
  { title: "Gym", detail: "4x this week", status: "on track" },
  { title: "Ship project", detail: "One small commit", status: "waiting" },
];

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171514]">
      <style>{`
        .hero-shell {
          min-height: 100vh;
          padding: 28px;
          background:
            radial-gradient(circle at 10% 28%, rgba(255,255,255,0.78) 0 80px, transparent 82px),
            radial-gradient(circle at 92% 22%, rgba(255,255,255,0.82) 0 76px, transparent 78px),
            linear-gradient(180deg, #bfe2fb 0%, #d9ecfb 48%, #fbfaf7 100%);
        }
        .grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .18;
          background-image:
            radial-gradient(rgba(23,21,20,.18) .7px, transparent .8px);
          background-size: 5px 5px;
          mix-blend-mode: multiply;
        }
        .nav-pill {
          width: min(720px, calc(100vw - 40px));
          margin: 0 auto;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          padding: 7px 8px 7px 20px;
          background: rgba(255,255,255,.72);
          border: 1px solid rgba(23,21,20,.08);
          border-radius: 999px;
          box-shadow: 0 18px 50px rgba(54,72,91,.14);
          backdrop-filter: blur(18px);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 13px;
          color: rgba(23,21,20,.66);
          white-space: nowrap;
        }
        .hero-copy {
          width: min(760px, calc(100vw - 40px));
          margin: 104px auto 0;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 11px;
          background: rgba(255,255,255,.56);
          border: 1px solid rgba(23,21,20,.08);
          border-radius: 999px;
          color: rgba(23,21,20,.58);
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 12px 30px rgba(54,72,91,.08);
        }
        .hero-title {
          margin: 28px 0 18px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(50px, 6.7vw, 94px);
          line-height: .92;
          letter-spacing: -0.055em;
          font-weight: 600;
        }
        .hero-subtitle {
          width: min(600px, 100%);
          margin: 0 auto;
          color: rgba(23,21,20,.58);
          font-size: clamp(16px, 1.5vw, 20px);
          line-height: 1.55;
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 28px;
          flex-wrap: wrap;
        }
        .primary-cta, .secondary-cta, .nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          cursor: pointer;
          text-decoration: none;
          font-weight: 700;
          font-family: inherit;
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .primary-cta {
          min-height: 50px;
          padding: 0 22px;
          border-radius: 999px;
          color: white;
          background: #171514;
          box-shadow: 0 18px 42px rgba(23,21,20,.22);
        }
        .secondary-cta {
          min-height: 50px;
          padding: 0 20px;
          border-radius: 999px;
          color: rgba(23,21,20,.74);
          background: rgba(255,255,255,.58);
          border: 1px solid rgba(23,21,20,.08);
        }
        .nav-cta {
          height: 40px;
          padding: 0 18px;
          border-radius: 999px;
          color: white;
          background: #171514;
        }
        .primary-cta:hover, .secondary-cta:hover, .nav-cta:hover {
          transform: translateY(-1px);
        }
        .product-scene {
          width: min(980px, calc(100vw - 44px));
          margin: 24px auto 0;
          height: 430px;
          position: relative;
          z-index: 1;
        }
        .paper {
          position: absolute;
          border: 1px solid rgba(23,21,20,.08);
          box-shadow: 0 30px 80px rgba(54,72,91,.16);
        }
        .paper.one {
          left: 0;
          bottom: 14px;
          width: 36%;
          height: 190px;
          background: #f7edb6;
          transform: rotate(-7deg);
        }
        .paper.two {
          right: 4%;
          bottom: 22px;
          width: 34%;
          height: 210px;
          background: #dfeccf;
          transform: rotate(6deg);
        }
        .paper.three {
          left: 14%;
          bottom: 92px;
          width: 23%;
          height: 120px;
          background: #bfcffa;
          transform: rotate(-13deg);
          opacity: .9;
        }
        .app-window {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: min(760px, 86vw);
          height: 360px;
          background: rgba(255,255,255,.86);
          border: 1px solid rgba(23,21,20,.09);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 38px 120px rgba(54,72,91,.24);
          backdrop-filter: blur(20px);
        }
        .window-top {
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          border-bottom: 1px solid rgba(23,21,20,.08);
          background: rgba(255,255,255,.72);
        }
        .dots {
          display: flex;
          gap: 7px;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }
        .window-body {
          display: grid;
          grid-template-columns: 230px 1fr;
          height: calc(100% - 42px);
        }
        .side {
          padding: 18px;
          border-right: 1px solid rgba(23,21,20,.08);
          background: rgba(250,250,250,.72);
        }
        .routine {
          padding: 13px;
          border: 1px solid rgba(23,21,20,.08);
          border-radius: 8px;
          background: rgba(255,255,255,.68);
          margin-top: 10px;
        }
        .chat {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background:
            linear-gradient(180deg, rgba(245,247,255,.78), rgba(255,255,255,.76));
        }
        .bubble {
          max-width: 78%;
          padding: 11px 13px;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.35;
        }
        .bubble.bot {
          align-self: flex-start;
          background: white;
          border: 1px solid rgba(23,21,20,.08);
          color: rgba(23,21,20,.82);
        }
        .bubble.user {
          align-self: flex-end;
          background: #171514;
          color: white;
        }
        .band {
          padding: 82px 28px;
          background: #fbfaf7;
        }
        .section {
          width: min(1080px, calc(100vw - 44px));
          margin: 0 auto;
        }
        .section-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(38px, 5vw, 68px);
          line-height: .98;
          letter-spacing: -0.045em;
          margin: 0;
          max-width: 720px;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 34px;
        }
        .feature {
          min-height: 190px;
          padding: 24px;
          border: 1px solid rgba(23,21,20,.08);
          border-radius: 8px;
          background: white;
          box-shadow: 0 18px 60px rgba(54,72,91,.08);
        }
        .feature strong {
          display: block;
          font-size: 18px;
          margin-bottom: 12px;
        }
        .feature p {
          margin: 0;
          color: rgba(23,21,20,.58);
          line-height: 1.6;
          font-size: 15px;
        }
        .final {
          width: min(1080px, calc(100vw - 44px));
          margin: 0 auto 28px;
          padding: 70px 28px;
          text-align: center;
          border-radius: 8px;
          background:
            radial-gradient(circle at 50% 100%, rgba(191,207,250,.58), transparent 46%),
            linear-gradient(180deg, #ffffff, #f0f4ff);
          border: 1px solid rgba(23,21,20,.08);
        }
        @media (max-width: 760px) {
          .hero-shell { padding: 18px; }
          .nav-pill { width: 100%; justify-content: center; }
          .nav-links { display: none; }
          .hero-copy { margin-top: 86px; }
          .product-scene { height: 520px; margin-top: 34px; }
          .paper.one, .paper.two, .paper.three { display: none; }
          .app-window { height: 500px; width: 100%; }
          .window-body { grid-template-columns: 1fr; }
          .side { display: none; }
          .feature-grid { grid-template-columns: 1fr; }
          .band { padding: 58px 20px; }
        }
      `}</style>
      <div className="grain" />

      <section className="hero-shell">
        <nav className="nav-pill">
          <button
            type="button"
            onClick={() => router.push("/?home=1")}
            className="font-black tracking-[-0.04em] text-[20px]"
          >
            Staypinged
          </button>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#why">Why it works</a>
            <a href="mailto:wasseem800@gmail.com">Support</a>
          </div>
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <button className="secondary-cta !min-h-10 !px-4" onClick={() => router.push("/dashboard")}>
                Dashboard
              </button>
              <button className="nav-cta" onClick={() => signOut({ redirectUrl: "/" })}>
                Sign out
              </button>
            </div>
          ) : (
            <a className="nav-cta" href={telegramHref} target="_blank" rel="noopener noreferrer">
              Start
            </a>
          )}
        </nav>

        <div className="hero-copy">
          <div className="eyebrow">
            <span className="inline-block h-2 w-2 rounded-full bg-[#8d86ff]" />
            Telegram accountability coach
          </div>
          <h1 className="hero-title">The friend who keeps you honest.</h1>
          <p className="hero-subtitle">
            Staypinged is an AI coach that checks in through Telegram, remembers your goal, and pushes back when you start negotiating with yourself.
          </p>
          <div className="hero-actions">
            <a className="primary-cta" href={telegramHref} target="_blank" rel="noopener noreferrer">
              Start in Telegram
            </a>
            <a className="secondary-cta" href="#how">
              See how it works
            </a>
          </div>
        </div>

        <div className="product-scene" aria-label="Staypinged Telegram accountability preview">
          <div className="paper one" />
          <div className="paper two" />
          <div className="paper three" />
          <div className="app-window">
            <div className="window-top">
              <div className="dots">
                <span className="dot bg-[#ff6b5f]" />
                <span className="dot bg-[#f6c85f]" />
                <span className="dot bg-[#61c77b]" />
              </div>
              <div className="text-sm font-semibold text-black/55">Staypinged</div>
              <div className="text-xs text-black/35">live</div>
            </div>
            <div className="window-body">
              <aside className="side">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-black/35">Goals</div>
                {routines.map((routine) => (
                  <div className="routine" key={routine.title}>
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm">{routine.title}</strong>
                      <span className="h-2 w-2 rounded-full bg-[#8d86ff]" />
                    </div>
                    <div className="mt-1 text-xs text-black/45">{routine.detail}</div>
                    <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-black/35">{routine.status}</div>
                  </div>
                ))}
              </aside>
              <section className="chat">
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-black/35">
                  Today
                </div>
                {chat.map((message, index) => (
                  <div className={`bubble ${message.from}`} key={`${message.from}-${index}`}>
                    {message.text}
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="band" id="how">
        <div className="section">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-black/35">How it works</p>
          <h2 className="section-title">No dashboards. No fake motivation. Just a conversation.</h2>
          <div className="feature-grid">
            <div className="feature">
              <strong>Start with one goal</strong>
              <p>Open the Telegram bot and say what you are trying to stay consistent with. It saves the goal and keeps the context.</p>
            </div>
            <div className="feature">
              <strong>Talk normally</strong>
              <p>Say you did it, skipped it, or are making excuses. The bot responds like a real coach, not a command menu.</p>
            </div>
            <div className="feature">
              <strong>Keep the pressure on</strong>
              <p>It remembers what you said mattered and pushes you back toward the next small action when you drift.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="band pt-0" id="why">
        <div className="section">
          <div className="grid gap-4 md:grid-cols-[1.2fr_.8fr]">
            <div className="feature min-h-[280px]">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-black/35">Why Telegram first</p>
              <h2 className="section-title !text-[clamp(36px,4.2vw,60px)]">
                Fast enough to use today.
              </h2>
              <p className="mt-6 max-w-[620px] text-[17px] leading-8 text-black/55">
                SMS carrier approval can wait. Telegram lets friends start instantly, reply naturally, and use the coach while the rest of the product evolves.
              </p>
            </div>
            <div className="feature min-h-[280px] bg-[#171514] text-white">
              <strong>Private beta ready</strong>
              <p className="!text-white/62">
                Share your bot link with friends, let them set their own goal, and keep improving the coach from real conversations.
              </p>
              <a className="primary-cta mt-8 !bg-white !text-[#171514]" href={telegramHref} target="_blank" rel="noopener noreferrer">
                Open the bot
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="final">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-black/35">Ready</p>
        <h2 className="hero-title !my-0 !text-[clamp(44px,6vw,84px)]">
          Say the goal out loud.
        </h2>
        <p className="hero-subtitle mt-5">
          Staypinged will meet you in Telegram and keep the next step in front of you.
        </p>
        <div className="hero-actions">
          <a className="primary-cta" href={telegramHref} target="_blank" rel="noopener noreferrer">
            Start in Telegram
          </a>
        </div>
      </section>
    </main>
  );
}
