import { ChevronRight } from "lucide-react";
import MoggedAIPhoneMockup from "./components/MoggedAIPhoneMockup";
import Navbar from "./components/Navbar";

const telegramHref =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ||
  "https://t.me/StaypingedBot?start=website";

const steps = [
  {
    label: "01",
    title: "Set your goals",
    body: "Pick what you need to stay accountable to: gym, studying, work, diet, or your own custom target.",
  },
  {
    label: "02",
    title: "Choose the pressure",
    body: "Direct, brutal, or savage. Mogged AI adapts the check-ins to the style that actually moves you.",
  },
  {
    label: "03",
    title: "Get checked on",
    body: "Telegram reminders come to you throughout the day. Reply DONE, explain what happened, or keep the coach updated.",
  },
];

const whoCards = [
  {
    number: "01 / 03",
    title: "Students",
    body: "For the study sessions that turn into TikTok breaks. We quiz you, keep you off your phone, and get you through finals week without the all-nighter.",
    quote: "Check in on my studying every hour from 4-9pm.",
    tags: "USE CASE - EXAMS - ESSAYS - LOCK-IN",
  },
  {
    number: "02 / 03",
    title: "Builders",
    body: "For the side project collecting dust. We text you to ship one thing every day because momentum beats motivation.",
    quote: "Make sure I push code before bed.",
    tags: "USE CASE - STARTUPS - PROJECTS - SHIPPING",
  },
  {
    number: "03 / 03",
    title: "Athletes",
    body: "For the 6am workouts you keep sleeping through. We wake you up, hold your streak, and call you out when you try to skip.",
    quote: "Text me at 5:45. Don't let me snooze.",
    tags: "USE CASE - GYM - RUNS - NUTRITION",
  },
];

const faqs = [
  {
    question: "How does Mogged AI work?",
    answer:
      "You connect through Telegram, set the goals you care about, and Mogged AI checks in with you so you stay accountable.",
  },
  {
    question: "Do I need to open the website every day?",
    answer:
      "No. The dashboard is there when you want to manage goals, but the accountability happens in Telegram.",
  },
  {
    question: "Where is my dashboard?",
    answer:
      "Use the Dashboard link in the navbar or the dashboard section below. Signed-in users go straight to their goal tracker.",
  },
  {
    question: "What do I reply in Telegram?",
    answer:
      "Reply DONE when you complete a goal, or answer naturally if you missed it. The coach uses that context for future check-ins.",
  },
];

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Who it's for", href: "#who" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Get started", href: telegramHref },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Contact us", href: "mailto:wasseem800@gmail.com" },
      { label: "Telegram bot", href: telegramHref },
      { label: "Report a bug", href: "mailto:wasseem800@gmail.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Consent", href: "/consent" },
    ],
  },
];

function TelegramLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 fill-current"
    >
      <path d="M21.8 3.4 18.5 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L5.8 13.6.8 12c-1.1-.3-1.1-1.1.2-1.6L20.5 2.9c.9-.3 1.7.2 1.3.5Z" />
    </svg>
  );
}

export default function App() {
  return (
    <main
      className="min-h-screen w-full bg-[#ededed] p-3 sm:p-4"
      style={{ fontFamily: "var(--font-geist-sans), -apple-system, system-ui, sans-serif" }}
    >
      <section className="relative h-[calc(100vh-24px)] w-full overflow-hidden rounded-2xl bg-[#EEF3F8] sm:h-[calc(100vh-32px)] sm:rounded-3xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#9FC0E0_0%,#BFD8EC_42%,#EEF3F8_78%,#F4F7FA_100%)]" />
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-[640px] w-[640px] rounded-full bg-[#FFF8E7]/15 blur-3xl" />
        <div className="pointer-events-none absolute right-[2%] top-[18%] h-[560px] w-[560px] rounded-full bg-cyan-200/18 blur-3xl" />
        <div className="pointer-events-none absolute right-[6%] top-[31%] hidden h-[420px] w-[420px] rounded-full bg-sky-300/20 blur-3xl lg:block" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_43%,rgba(255,255,255,0.34),transparent_34%),radial-gradient(circle_at_58%_16%,rgba(255,255,255,0.18),transparent_44%)]" />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-[30%] top-[28%] hidden h-[280px] w-[380px] text-[#648CC8]/[0.08] lg:block"
          viewBox="0 0 380 280"
          fill="none"
        >
          <path d="M10 118h95c22 0 22-22 22-22V56c0-22 22-22 22-22h114" stroke="currentColor" />
          <path d="M74 166h104c24 0 24-24 24-24v-20c0-24 24-24 24-24h140" stroke="currentColor" />
          <path d="M172 230v-54c0-22 22-22 22-22h92c22 0 22-22 22-22V74" stroke="currentColor" />
          <path d="M106 118v74c0 20 20 20 20 20h58" stroke="currentColor" />
        </svg>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[9%] left-[-3%] hidden h-[190px] w-[260px] text-[#648CC8]/[0.08] md:block"
          viewBox="0 0 260 190"
          fill="none"
        >
          <path d="M0 70h76c20 0 20 20 20 20v34c0 20 20 20 20 20h118" stroke="currentColor" />
          <path d="M38 24h86c18 0 18 18 18 18v72" stroke="currentColor" />
          <path d="M0 132h54c18 0 18-18 18-18V88" stroke="currentColor" />
        </svg>
        <div className="pointer-events-none absolute inset-0 bg-white/14" />

        <div className="relative z-10 flex h-full flex-col">
          <Navbar />

          <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:py-10">
            <div className="grid w-full max-w-[1280px] items-center gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
              <div className="-translate-y-6 text-center lg:-translate-y-12 lg:text-left xl:-translate-y-16">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold leading-5 tracking-[-0.02em] text-neutral-900 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#ef4d23]" />
                  Mogged AI
                </div>

                <h1
                  className="mt-5 max-w-4xl text-neutral-800 sm:mt-6"
                  style={{
                    fontFamily: "var(--font-geist-sans), -apple-system, system-ui, sans-serif",
                    fontSize: "clamp(56px, 7vw, 96px)",
                    lineHeight: 1,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: "#0A0A0A",
                  }}
                >
                  Shaping{" "}
                  <span className="relative inline-block font-semibold text-[#0A0A0A]">
                    Discipline
                    <span
                      aria-hidden="true"
                      className="absolute right-0 bottom-1 left-0 h-1 rounded-full bg-[#E8806B]/80"
                    />
                  </span>
                  <br />
                  of tomorrow
                </h1>

                <p
                  className="mx-auto mt-5 max-w-xl px-2 font-medium leading-7 tracking-[-0.015em] text-neutral-700 sm:mt-6 lg:mx-0 lg:px-0"
                  style={{ fontSize: "clamp(18px, 1.55vw, 20px)", lineHeight: 1.5, fontWeight: 400, color: "#3A3A3A" }}
                >
                  The AI accountability coach that checks in through Telegram.
                </p>

                <a
                  href={telegramHref}
                  className="mt-7 inline-flex min-w-[232px] items-center justify-between gap-3 rounded-2xl bg-[#229ED9] py-3 pr-2.5 pl-5 text-[17px] font-semibold leading-6 tracking-[-0.02em] text-white shadow-[0_8px_24px_rgba(34,158,217,0.25)] sm:mt-8 sm:pl-6"
                >
                  <span className="inline-flex items-center gap-2 text-white">
                    <TelegramLogo />
                    Start on Telegram
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 sm:h-7 sm:w-7">
                    <ChevronRight className="h-4 w-4" strokeWidth={2} />
                  </span>
                </a>
              </div>

              <div className="hidden justify-center drop-shadow-[0_30px_80px_rgba(20,50,100,0.15)] lg:flex">
                <MoggedAIPhoneMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto grid w-full max-w-6xl gap-4 px-2 py-12 sm:grid-cols-3 sm:px-4 sm:py-16"
      >
        {steps.map((step) => (
          <article
            key={step.label}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <p className="text-[13px] font-semibold leading-5 tracking-[-0.02em] text-[#ef4d23]">{step.label}</p>
            <h2 className="mt-4 text-[28px] font-bold leading-[1.08] tracking-[-0.04em] text-[#0b0f1a]">
              {step.title}
            </h2>
            <p className="mt-3 text-[16px] font-medium leading-7 tracking-[-0.015em] text-neutral-600">{step.body}</p>
          </article>
        ))}
      </section>

      <section
        id="who"
        className="mx-auto w-full max-w-6xl rounded-3xl bg-[#f5f2ee] px-5 py-12 sm:px-8 sm:py-16"
      >
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#ef4d23]">
            Who it's for
          </p>
          <h2 className="mt-4 text-[44px] font-bold leading-[1.02] tracking-[-0.045em] text-[#0b0f1a] sm:text-[64px]">
            Built for anyone who{" "}
            <span
              className="text-[#ef4d23]"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              follows through.
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-[16px] font-medium leading-7 tracking-[-0.015em] text-neutral-600">
            People already using Mogged AI to stop missing the thing that
            actually matters.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {whoCards.map((card) => (
            <article
              key={card.title}
              className="relative rounded-3xl border border-neutral-200 bg-white p-6 text-[#0b0f1a] shadow-sm"
            >
              <span className="absolute top-0 left-6 h-1 w-12 rounded-b-full bg-[#ef4d23]" />
              <p className="text-[12px] font-semibold tracking-[0.18em] text-neutral-400">
                {card.number}
              </p>
              <h3 className="mt-5 text-[32px] font-bold leading-[1.08] tracking-[-0.04em]">
                {card.title}
              </h3>
              <p className="mt-5 text-[16px] font-medium leading-7 tracking-[-0.015em] text-neutral-600">{card.body}</p>
              <blockquote className="mt-6 border-l-2 border-[#ef4d23] pl-4 text-[16px] italic leading-7 tracking-[-0.015em] text-neutral-900">
                "{card.quote}"
              </blockquote>
              <div className="mt-5 border-t border-neutral-200 pt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                {card.tags}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <p className="mr-auto max-w-xl text-sm leading-6 text-neutral-500">
            One hits too close? Good. That's exactly who we built this for.
          </p>
          <a
            href={telegramHref}
            className="inline-flex items-center gap-2 rounded-full bg-[#229ED9] px-5 py-3 text-sm font-semibold text-white shadow-sm"
          >
            <TelegramLogo />
            Start on Telegram
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-[#0b0f1a] px-5 py-3 text-sm font-semibold text-white shadow-sm"
          >
            Open dashboard
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </a>
        </div>
      </section>

      <section
        id="faq"
        className="mx-auto w-full max-w-6xl px-2 py-14 sm:px-4 sm:py-20"
      >
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#ef4d23]">
              FAQ
            </p>
            <h2 className="mt-4 max-w-xl text-[44px] font-bold leading-[1.02] tracking-[-0.045em] text-[#0b0f1a] sm:text-[64px]">
              Clean answers before you commit.
            </h2>
            <p className="mt-5 max-w-md text-[16px] font-medium leading-7 tracking-[-0.015em] text-neutral-600">
              Mogged AI is built to stay quiet when you are moving and direct
              when you are slipping.
            </p>
            <a
              href={telegramHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b0f1a] px-5 py-3 text-sm font-semibold text-white shadow-sm"
            >
              <TelegramLogo />
              Start on Telegram
            </a>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white/80 shadow-sm backdrop-blur">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group border-t border-neutral-200 px-5 py-5 first:border-t-0 sm:px-7"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-[20px] font-bold leading-7 tracking-[-0.035em] text-[#0b0f1a] [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xl font-light text-neutral-500 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pt-3 text-[16px] font-medium leading-7 tracking-[-0.015em] text-neutral-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto mb-3 w-full max-w-6xl rounded-[32px] border border-neutral-200 bg-[#f5f2ee] px-5 py-10 shadow-sm sm:mb-4 sm:px-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_2fr]">
          <div>
            <a
              href="#"
              className="inline-flex items-center text-[24px] font-bold leading-none tracking-[-0.035em] text-[#0b0f1a]"
            >
              MOGGED<span className="text-[#229ED9]">AI</span>
            </a>
            <p className="mt-5 max-w-sm text-[16px] font-medium leading-7 tracking-[-0.015em] text-neutral-600">
              The AI accountability coach that keeps you honest in Telegram.
              Set the goal once and stay accountable.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={telegramHref}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#229ED9] px-4 text-sm font-semibold text-white"
              >
                <TelegramLogo />
                Telegram
              </a>
              <a
                href="mailto:wasseem800@gmail.com"
                className="inline-flex h-11 items-center rounded-full border border-neutral-300 px-4 text-sm font-semibold text-[#0b0f1a]"
              >
                Email
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
                  {column.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm font-medium text-neutral-600 transition-colors hover:text-[#0b0f1a]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-300/70 pt-6 sm:mt-12">
          <div className="flex flex-col gap-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 MoggedAI. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a href="https://www.instagram.com/" className="hover:text-[#0b0f1a]">
                IG
              </a>
              <a href="https://www.tiktok.com/" className="hover:text-[#0b0f1a]">
                TT
              </a>
              <a href={telegramHref} className="hover:text-[#0b0f1a]">
                Telegram bot
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
