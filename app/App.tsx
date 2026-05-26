import { ChevronRight } from "lucide-react";
import MoggedAIPhoneMockup from "./components/MoggedAIPhoneMockup";
import Navbar from "./components/Navbar";

const telegramHref =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ||
  "https://t.me/StaypingedBot?start=website";

const steps = [
  {
    label: "01",
    title: "Tell it what matters",
    body: "Drop in reminders, tasks, follow-ups, deadlines, ideas, and small details you do not want to keep in your head.",
  },
  {
    label: "02",
    title: "It remembers the context",
    body: "StayPinged keeps the thread of what you said, when it matters, and what needs to happen next.",
  },
  {
    label: "03",
    title: "It pings you back",
    body: "Telegram check-ins show up when they are useful, so your assistant brain follows up without you reopening an app.",
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
      className="min-h-screen w-full bg-[#ededed] p-3 sm:p-4"
      style={{ fontFamily: "'Host Grotesk', 'Inter', sans-serif" }}
    >
      <section className="relative h-[calc(100vh-24px)] w-full overflow-hidden rounded-2xl bg-[#d9d9d9] sm:h-[calc(100vh-32px)] sm:rounded-3xl">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(72, 159, 224, 0.62) 0%, rgba(111, 190, 230, 0.46) 42%, rgba(198, 234, 232, 0.38) 72%, rgba(255, 248, 226, 0.24) 100%), url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=2400&q=94&sat=34')",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_78%,rgba(255,255,255,0.7),transparent_18%),radial-gradient(circle_at_78%_78%,rgba(255,248,226,0.42),transparent_34%),radial-gradient(circle_at_36%_18%,rgba(112,184,235,0.32),transparent_46%)] blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/18 via-sky-200/16 to-[#fff8e7]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_28%,rgba(255,255,255,0.13),transparent_45%),radial-gradient(circle_at_76%_76%,rgba(255,255,255,0.52),transparent_22%)]" />
        <div className="absolute inset-0 bg-[#eaf8ff]/10" />

        <div className="relative z-10 flex h-full flex-col">
          <Navbar />

          <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:py-10">
            <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
              <div className="-translate-y-14 text-center lg:-translate-y-24 lg:text-left xl:-translate-y-28">
                <h1
                  className="max-w-4xl text-slate-600"
                  style={{
                    fontFamily: "'Host Grotesk', 'Inter', sans-serif",
                    fontSize: "clamp(52px, 6.4vw, 92px)",
                    lineHeight: 1.02,
                    fontWeight: 700,
                    letterSpacing: "-0.045em",
                  }}
                >
                  The AI That Keeps{" "}
                  <span className="relative inline-block font-semibold text-slate-600">
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
                  className="mt-7 inline-flex min-w-[232px] items-center justify-between gap-3 rounded-full bg-[#229ED9] py-2.5 pr-2 pl-5 text-[16px] font-semibold leading-6 tracking-[-0.02em] text-white shadow-sm shadow-sky-900/15 sm:mt-8 sm:pl-6"
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
            Built for people with{" "}
            <span
              className="text-[#ef4d23]"
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
            If it is important enough to remember, it is important enough to
            get pinged back at the right time.
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
              Clean answers before you hand it your memory.
            </h2>
            <p className="mt-5 max-w-md text-[16px] font-medium leading-7 tracking-[-0.015em] text-neutral-600">
              StayPinged is built to feel like a lightweight personal assistant
              in Telegram, not another dashboard you have to babysit.
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
