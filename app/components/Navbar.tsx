"use client";

import {
  ChevronRight,
  Menu,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

const navItems = ["Home", "Features", "About", "Pages"];

function FlowerLogo() {
  const petals = Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2;
    const cx = 16 + Math.cos(angle) * 10;
    const cy = 16 + Math.sin(angle) * 10;

    return <circle key={index} cx={cx} cy={cy} r="3.5" />;
  });

  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7 shrink-0 text-[#ef4d23] sm:h-8 sm:w-8"
      viewBox="0 0 32 32"
      fill="currentColor"
    >
      {petals}
      <circle cx="16" cy="16" r="3.5" />
    </svg>
  );
}

function NavLink({ item, mobile = false }: { item: string; mobile?: boolean }) {
  const isHome = item === "Home";
  const href =
    item === "Home"
      ? "#"
      : item === "Features"
        ? "#how-it-works"
        : item === "About"
          ? "#who"
          : "#faq";

  return (
    <a
      href={href}
      className={[
        "inline-flex items-center gap-1.5 font-medium",
        mobile ? "justify-between rounded-xl px-3 py-2 text-[15px]" : "text-[15px]",
        item === "Pages" ? "text-[#ef4d23]" : "text-neutral-950",
      ].join(" ")}
    >
      <span className="inline-flex items-center gap-2">
        {isHome && <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />}
        {item === "Features"
          ? "How it works"
          : item === "About"
            ? "Who it's for"
            : item === "Pages"
              ? "FAQ"
              : item}
      </span>
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex justify-center px-3 pt-8 sm:px-4 sm:pt-10">
      <nav className="relative flex w-full max-w-[820px] items-center gap-4 rounded-[24px] border border-white/80 bg-white py-2.5 pr-2.5 pl-2.5 shadow-[0_4px_24px_rgba(20,50,100,0.08)]">
        <FlowerLogo />

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink key={item} item={item} />
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            aria-label="Shopping cart"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100 md:flex"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={2} />
          </button>

          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-[14px] bg-[#FF5A1F] py-2 pr-1.5 pl-5 text-[15px] font-semibold leading-6 tracking-[-0.02em] text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.12),0_6px_18px_rgba(255,90,31,0.18)] md:pl-5"
          >
            <span className="hidden md:inline">Open dashboard</span>
            <span className="md:hidden">Dashboard</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </span>
          </a>

          <button
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-950 transition-colors hover:bg-neutral-100 md:hidden"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {open && (
          <div className="absolute top-full right-2 left-2 z-20 mt-2 rounded-2xl border border-neutral-200 bg-white p-3 shadow-lg md:hidden">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <NavLink key={item} item={item} mobile />
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
