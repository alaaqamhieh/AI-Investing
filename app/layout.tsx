import type { Metadata } from "next";
import Link from "next/link";
import { getSnapshot } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Investing Dashboard",
  description: "Daily consolidated view of investments across Robinhood, Chase, and Empower.",
};

const nav = [
  { href: "/", label: "Overview" },
  { href: "/accounts", label: "Accounts" },
  { href: "/screener", label: "Screener" },
  { href: "/brief", label: "Daily Brief" },
  { href: "/strategy", label: "Strategy" },
  { href: "/macro-gate", label: "Macro Gate", experimental: true },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isSample = getSnapshot().sample;
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-[#e6e9ef] font-sans antialiased">
        {isSample && (
          <div className="bg-[#e0a23a]/15 text-[#e0a23a] text-center text-xs py-1.5 px-4 border-b border-[#e0a23a]/20">
            Demo — <strong>sample data</strong>, not live accounts. Real balances are pulled
            only after the site is private.
          </div>
        )}
        <header className="border-b border-border bg-panel/60 backdrop-blur sticky top-0 z-10">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
            <Link href="/" className="font-semibold tracking-tight text-lg">
              <span className="text-accent">◆</span> AI Investing
            </Link>
            <nav className="flex gap-1 text-sm">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-3 py-1.5 rounded-md text-muted hover:text-white hover:bg-panel2 transition-colors flex items-center gap-1.5"
                >
                  {n.label}
                  {n.experimental && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#e0a23a]/15 text-[#e0a23a] leading-none">
                      beta
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted">
          Phase 1 · Read-only snapshot dashboard · Data refreshed by a scheduled Claude routine.
        </footer>
      </body>
    </html>
  );
}
