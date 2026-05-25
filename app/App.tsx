import { ChevronRight } from "lucide-react";
import DashboardPreview from "./components/DashboardPreview";
import Navbar from "./components/Navbar";

const telegramHref =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ||
  "https://t.me/StaypingedBot?start=website";

const videoProps = {
  disableRemotePlayback: true,
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
};

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

export default function App() {
  return (
    <main
      className="min-h-screen w-full bg-[#ededed] p-3 sm:p-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <section className="relative h-[calc(100vh-24px)] w-full overflow-hidden rounded-2xl bg-[#d9d9d9] sm:h-[calc(100vh-32px)] sm:rounded-3xl">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4"
          poster="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          {...videoProps}
        />
        <div className="absolute inset-0 bg-white/10" />

        <div className="relative z-10 flex h-full flex-col">
          <Navbar />

          <div className="flex flex-1 flex-col items-center px-4 pt-10 pb-8 text-center sm:pt-16 sm:pb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-neutral-900 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#ef4d23]" />
              Mogged AI
            </div>

            <h1
              className="mt-5 max-w-4xl text-neutral-950 sm:mt-6"
              style={{
                fontSize: "clamp(36px, 8vw, 72px)",
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              Shaping{" "}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Discipline
              </span>
              <br />
              of tomorrow
            </h1>

            <p
              className="mt-4 px-2 text-neutral-700 sm:mt-6"
              style={{ fontSize: "clamp(13px, 3.5vw, 16px)" }}
            >
              The AI accountability coach that checks in through Telegram.
            </p>

            <a
              href={telegramHref}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#0b0f1a] py-2 pr-2 pl-6 text-[14px] font-medium text-white shadow-sm sm:mt-8 sm:py-2.5 sm:pl-7"
            >
              Start on Telegram
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 sm:h-7 sm:w-7">
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </a>

            <div className="mt-8 w-full px-3 sm:mt-10 sm:px-4">
              <DashboardPreview />
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
            <p className="text-[13px] font-semibold text-[#ef4d23]">{step.label}</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#0b0f1a]">
              {step.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">{step.body}</p>
          </article>
        ))}
      </section>

      <section
        id="dashboard"
        className="mx-auto grid w-full max-w-6xl items-center gap-8 rounded-3xl bg-[#0b0f1a] px-6 py-10 text-white sm:px-8 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#ef4d23]">
            Dashboard
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Manage goals, streaks, and check-ins.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
            Your dashboard is still here. Use it to add goals, tune your coach
            style, review recent messages, and track completion history.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0b0f1a]"
            >
              Open dashboard
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </a>
            <a
              href={telegramHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white"
            >
              Open Telegram
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>

        <div className="rounded-3xl bg-[#f5f2ee] p-3 text-[#0b0f1a] sm:p-5">
          <DashboardPreview />
        </div>
      </section>

      <section
        id="faq"
        className="mx-auto w-full max-w-5xl px-2 py-12 sm:px-4 sm:py-16"
      >
        <div className="text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#ef4d23]">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#0b0f1a] sm:text-5xl">
            Questions before you lock in.
          </h2>
        </div>

        <div className="mt-8 grid gap-3">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-[#0b0f1a]">{faq.question}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
