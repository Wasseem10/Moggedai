import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const feedSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoggedAI - AI Accountability in Telegram",
  description: "An AI coach that checks in through Telegram, holds you accountable, and keeps you on track.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${feedSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          {/* Set theme before first paint to avoid flash */}
          <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('mogged-theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();` }} />
        </head>
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
