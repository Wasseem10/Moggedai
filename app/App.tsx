import { ChevronRight } from "lucide-react";
import MoggedAIPhoneMockup from "./components/MoggedAIPhoneMockup";
import Navbar from "./components/Navbar";

const telegramHref =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ||
  "https://t.me/StaypingedBot?start=website";

const assistantRows = [
  {
    label: "1",
    title: "Capture reminders, tasks, and loose thoughts",
    color: "#77F0BE",
  },
  {
    label: "2",
    title: "Keep context attached to every follow-up",
    color: "#D8FFA3",
  },
  {
    label: "3",
    title: "Get pinged before details slip",
    color: "#E8DCFF",
  },
  {
    label: "4",
    title: "Manage everything from Telegram",
    color: "#DDE8FF",
  },
];

const whoCards = [
  {
    number: "01 / 03",
    title: "Students",
    body: "Remember exams, essays, office hours, forms, and the small admin tasks that always slip until the last minute.",
    quote: "Remind me tomorrow to email my professor and start the econ outline.",
    tags: "USE CASE - CLASSES - DEADLINES - ADMIN",
  },
  {
    number: "02 / 03",
    title: "Builders",
    body: "Keep product ideas, bug follow-ups, launch tasks, and customer promises from getting buried in your notes.",
    quote: "Ping me Friday to follow up with the beta users and ship the pricing fix.",
    tags: "USE CASE - STARTUPS - FOLLOW-UPS - LAUNCHES",
  },
  {
    number: "03 / 03",
    title: "Busy people",
    body: "Handle errands, appointments, renewals, people to reply to, and the life logistics your calendar never fully catches.",
    quote: "Remind me after lunch to book the appointment and text Sam back.",
    tags: "USE CASE - ERRANDS - PEOPLE - LIFE ADMIN",
  },
];

const faqs = [
  {
    question: "How does StayPinged work?",
    answer:
      "You send it what you need remembered, and it turns that into useful Telegram follow-ups with the context still attached.",
  },
  {
    question: "Do I need to open the website every day?",
    answer:
      "No. The website is for setup and managing things. The actual assistant brain lives where you already check messages.",
  },
  {
    question: "Where is my dashboard?",
    answer:
      "Use the Dashboard link in the navbar to review, edit, and manage the things StayPinged is remembering for you.",
  },
  {
    question: "What do I reply in Telegram?",
    answer:
      "Reply naturally. Add more context, reschedule, mark something done, or ask it to remember a new detail.",
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
      className="min-h-screen w-full bg-[#ededed] p-2 sm:p-4"
      style={{ fontFamily: "'Host Grotesk', 'Inter', sans-serif" }}
    >
      <section className="relative h-[calc(100svh-16px)] min-h-[620px] w-full overflow-hidden rounded-2xl bg-[#d9d9d9] sm:h-[calc(100vh-32px)] sm:min-h-0 sm:rounded-3xl">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(168, 219, 255, 0.5) 0%, rgba(203, 238, 255, 0.48) 46%, rgba(232, 248, 255, 0.42) 72%, rgba(255, 253, 246, 0.34) 100%), url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=2400&q=96&sat=22')",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_76%,rgba(255,255,255,0.78),transparent_20%),radial-gradient(circle_at_78%_76%,rgba(255,250,232,0.28),transparent_34%),radial-gradient(circle_at_34%_16%,rgba(186,230,253,0.42),transparent_48%)] blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200/22 via-cyan-50/22 to-white/48" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_28%,rgba(255,255,255,0.2),transparent_45%),radial-gradient(circle_at_76%_76%,rgba(255,255,255,0.58),transparent_24%)]" />
        <div className="absolute inset-0 bg-[#f3fbff]/18" />

        <div className="relative z-10 flex h-full flex-col">
          <Navbar />

          <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-8 sm:py-8 lg:py-10">
            <div className="grid w-full max-w-6xl items-center gap-7 sm:gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
              <div className="-translate-y-8 text-center sm:-translate-y-12 lg:-translate-y-24 lg:text-left xl:-translate-y-28">
                <h1
                  className="max-w-4xl text-[#050505]"
                  style={{
                    fontFamily: "'Host Grotesk', 'Inter', sans-serif",
                    fontSize: "clamp(42px, 12vw, 92px)",
                    lineHeight: 1.02,
                    fontWeight: 700,
                    letterSpacing: "-0.045em",
                  }}
                >
                  The AI That Keeps{" "}
                  <span className="relative inline-block font-semibold text-[#050505]">
                    You On Track.
                  </span>
                </h1>

                <p
                  className="mx-auto mt-5 max-w-xl px-2 font-medium leading-7 tracking-[-0.015em] text-neutral-700 sm:mt-6 lg:mx-0 lg:px-0"
                  style={{ fontSize: "clamp(16px, 1.5vw, 18px)" }}
                >
                  A personal AI memory that remembers what matters and pings
                  you before it slips.
                </p>

                <a
                  href={telegramHref}
                  className="mt-7 inline-flex min-h-12 w-full max-w-[260px] items-center justify-between gap-3 rounded-full bg-[#229ED9] py-2.5 pr-2 pl-5 text-[16px] font-semibold leading-6 tracking-[-0.02em] text-white shadow-sm shadow-sky-900/15 sm:mt-8 sm:w-auto sm:min-w-[232px] sm:pl-6"
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

              <div className="hidden justify-center lg:flex">
                <MoggedAIPhoneMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto w-full max-w-6xl px-2 py-12 sm:px-4 sm:py-24"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[0.86fr_1.34fr] lg:gap-16">
          <div className="lg:pr-4">
            <h2 className="max-w-xl text-[42px] font-bold leading-[0.98] tracking-[-0.055em] text-[#050505] sm:text-[70px] sm:leading-[0.94] sm:tracking-[-0.065em] lg:text-[76px]">
              Remember more. Follow up faster. Stay in the loop.
            </h2>
            <p className="mt-6 max-w-md text-[17px] font-medium leading-7 tracking-[-0.02em] text-neutral-600">
              StayPinged turns scattered thoughts into useful Telegram
              follow-ups, so your assistant brain keeps the important things
              moving.
            </p>
            <a
              href={telegramHref}
              className="mt-8 inline-flex items-center gap-2 rounded-[18px] bg-[#3F6DF6] px-5 py-3 text-[16px] font-semibold leading-6 tracking-[-0.025em] text-white shadow-[0_12px_32px_rgba(63,109,246,0.22)]"
            >
              <TelegramLogo />
              Start on Telegram
            </a>
          </div>

          <div className="space-y-4">
            {assistantRows.map((row) => (
              <article
                key={row.label}
                className="flex min-h-[84px] items-center gap-4 rounded-[24px] px-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.03] sm:min-h-[108px] sm:gap-8 sm:rounded-[28px] sm:px-10"
                style={{ backgroundColor: row.color }}
              >
                <span
                  className="w-12 shrink-0 text-center text-[50px] font-semibold leading-none tracking-[-0.09em] text-black sm:w-20 sm:text-[74px]"
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                  }}
                >
                  {row.label}
                </span>
                <h3 className="text-[18px] font-bold leading-6 tracking-[-0.04em] text-black sm:text-[24px] sm:leading-7 sm:tracking-[-0.045em]">
                  {row.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="who"
        className="mx-auto w-full max-w-6xl rounded-[28px] bg-[#f5f2ee] px-5 py-12 sm:rounded-3xl sm:px-8 sm:py-16"
      >
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#3F6DF6]">
            Who it's for
          </p>
          <h2 className="mt-4 text-[40px] font-bold leading-[1.02] tracking-[-0.045em] text-[#0b0f1a] sm:text-[64px]">
            Built for people with{" "}
            <span
              className="text-[#0b0f1a]"
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              too many tabs open.
            </span>
          </h2>
          <p className="mt-5 max-w-2xl text-[16px] font-medium leading-7 tracking-[-0.015em] text-neutral-600">
            StayPinged acts like an external brain for the details, follow-ups,
            and tiny commitments that are easy to lose.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {whoCards.map((card) => (
            <article
              key={card.title}
              className="relative rounded-3xl border border-neutral-200 bg-white p-6 text-[#0b0f1a] shadow-sm"
            >
              <span className="absolute top-0 left-6 h-1 w-12 rounded-b-full bg-[#3F6DF6]" />
              <p className="text-[12px] font-semibold tracking-[0.18em] text-neutral-400">
                {card.number}
              </p>
              <h3 className="mt-5 text-[32px] font-bold leading-[1.08] tracking-[-0.04em]">
                {card.title}
              </h3>
              <p className="mt-5 text-[16px] font-medium leading-7 tracking-[-0.015em] text-neutral-600">{card.body}</p>
              <blockquote className="mt-6 border-l-2 border-[#3F6DF6] pl-4 text-[16px] italic leading-7 tracking-[-0.015em] text-neutral-900">
                "{card.quote}"
              </blockquote>
              <div className="mt-5 border-t border-neutral-200 pt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                {card.tags}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <p className="mr-auto max-w-xl text-sm leading-6 text-neutral-500">
            If it is important enough to remember, it is important enough to
            get pinged back at the right time.
          </p>
          <a
            href={telegramHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#229ED9] px-5 py-3 text-sm font-semibold text-white shadow-sm"
          >
            <TelegramLogo />
            Start on Telegram
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b0f1a] px-5 py-3 text-sm font-semibold text-white shadow-sm"
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
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#3F6DF6]">
              FAQ
            </p>
            <h2 className="mt-4 max-w-xl text-[40px] font-bold leading-[1.02] tracking-[-0.045em] text-[#0b0f1a] sm:text-[64px]">
              Clean answers before you hand it your memory.
            </h2>
            <p className="mt-5 max-w-md text-[16px] font-medium leading-7 tracking-[-0.015em] text-neutral-600">
              StayPinged is built to feel like a lightweight personal assistant
              in Telegram, not another dashboard you have to babysit.
            </p>
            <a
              href={telegramHref}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0b0f1a] px-5 py-3 text-sm font-semibold text-white shadow-sm sm:w-auto"
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
              Stay<span className="text-[#229ED9]">Pinged</span>
            </a>
            <p className="mt-5 max-w-sm text-[16px] font-medium leading-7 tracking-[-0.015em] text-neutral-600">
              A personal assistant brain in Telegram for reminders, follow-ups,
              and the details you do not want to carry alone.
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
            <p>&copy; 2026 StayPinged. All rights reserved.</p>
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
