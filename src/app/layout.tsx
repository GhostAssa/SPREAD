import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (not next/font/google) — this dev environment's network is
// unreliable enough that live Google Fonts fetches were silently failing,
// falling back to a system font and adding ~30s to every page load.
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque-variable.woff2",
  weight: "200 800",
  variable: "--font-bricolage",
  display: "swap",
});

const firaSans = localFont({
  src: [
    { path: "./fonts/fira-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/fira-sans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/fira-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/fira-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-fira-sans",
  display: "swap",
});

const spaceMono = localFont({
  src: [
    { path: "./fonts/space-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/space-mono-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spread — University of Ibadan Campus News, Checked First",
  description:
    "Human-Verified campus news covering the University of Ibadan. We separate the noise from the facts. Built by Streak — not affiliated with the university.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${firaSans.variable} ${spaceMono.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-body-md">{children}</body>
    </html>
  );
}
