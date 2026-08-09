import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Reveal } from "@/components/reveal";
import { FactChecker } from "@/components/fact-checker";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Ask AI — Spread",
  description:
    "Any clarification about a post or an article? Ask the AI to clarify and give more details.",
};

export default async function FactCheckPage() {
  const user = await getCurrentUser();

  return (
    <>
      <SiteHeader />
      <main className="bg-sand py-[66px] md:py-[94px] px-[26px] relative overflow-hidden min-h-[70vh]">
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="text-teal"
            d="M0,400 C320,200 420,600 720,400 C1020,200 1120,600 1440,400 L1440,800 L0,800 Z"
            fill="currentColor"
          />
        </svg>

        <div className="relative z-10">
          <Reveal as="div" className="text-center mb-12 max-w-[720px] mx-auto">
            <span className="font-eyebrow text-eyebrow text-teal uppercase tracking-widest mb-4 inline-block bg-cream border-2 border-ink-band px-3 py-1 rounded-full shadow-ink-sm">
              Ask AI
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile md:font-headline-h2 md:text-headline-h2 text-ink-band uppercase leading-none mb-4">
              Clarify a Post
            </h1>
            <p className="font-body-lg text-body-lg text-body-ink">
              Any clarification about a post or an article? Ask the AI to clarify and give more
              details.
            </p>
          </Reveal>

          <FactChecker loggedIn={Boolean(user)} />
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
