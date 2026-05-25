import { ChevronRight } from "lucide-react";
import DashboardPreview from "./components/DashboardPreview";
import Navbar from "./components/Navbar";

const videoProps = {
  disableRemotePlayback: true,
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
};

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
              Convix Software
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
                Agencies
              </span>
              <br />
              of tomorrow
            </h1>

            <p
              className="mt-4 px-2 text-neutral-700 sm:mt-6"
              style={{ fontSize: "clamp(13px, 3.5vw, 16px)" }}
            >
              The All-In-One Software Powering the Future of PR Agencies
            </p>

            <button className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#0b0f1a] py-2 pr-2 pl-6 text-[14px] font-medium text-white shadow-sm sm:mt-8 sm:py-2.5 sm:pl-7">
              Get Started
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 sm:h-7 sm:w-7">
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </button>

            <div className="mt-8 w-full px-3 sm:mt-10 sm:px-4">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
