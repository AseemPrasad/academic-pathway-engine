import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Academic Pathway Engine",
  description: "AI-powered academic pathway recommendations for professionals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} min-h-full bg-slate-950 text-slate-100 antialiased`}
      >
        <header className="border-b border-slate-800">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-amber-400 font-bold text-lg tracking-tight">
                Pathway
              </span>
              <span className="text-slate-400 text-sm hidden sm:inline">
                Academic Engine
              </span>
            </Link>
            <div className="flex items-center gap-1">
              {[
                { href: "/", label: "Assess" },
                { href: "/submissions", label: "Submissions" },
                { href: "/analytics", label: "Analytics" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {children}
        </main>
      </body>
    </html>
  );
}
