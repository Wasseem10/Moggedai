"use client";

import {
  ChevronRight,
  Menu,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

const navItems = ["Home", "Features", "About", "Pages"];

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
    <header className="flex justify-center px-3 pt-4 sm:px-4 sm:pt-6">
      <nav className="relative flex w-full max-w-[820px] items-center gap-4 rounded-full border border-neutral-200 bg-white py-2.5 pr-2.5 pl-2.5 shadow-sm">
        <a
          href="#"
          className="shrink-0 text-[22px] font-bold leading-none tracking-[-0.04em] text-neutral-950"
        >
          Stay<span className="text-[#229ED9]">Pinged</span>
        </a>

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
            className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/28 py-2 pr-1.5 pl-5 text-[15px] font-semibold leading-6 tracking-[-0.02em] text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(255,255,255,0.22),0_12px_34px_rgba(20,50,100,0.12)] backdrop-blur-xl md:pl-5"
          >
            <span className="hidden md:inline">Open dashboard</span>
            <span className="md:hidden">Dashboard</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/45 bg-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
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
