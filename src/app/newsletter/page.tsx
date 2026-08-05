import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Reveal } from "@/components/reveal";
import { NewsletterForm } from "@/components/newsletter-form";

export const metadata: Metadata = {
  title: "Join Newsletter — Spread",
  description: "Get breaking, human-verified University of Ibadan news the moment it's confirmed.",
};

export default function NewsletterPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-ink-band py-[66px] md:py-[94px] px-[26px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="90%" cy="10%" fill="#C0522E" r="300" style={{ filter: "blur(80px)" }} />
            <circle cx="10%" cy="90%" fill="#2A3D8F" r="200" style={{ filter: "blur(60px)" }} />
          </svg>
        </div>

        <Reveal
          as="div"
          className="max-w-[640px] mx-auto relative z-10 bg-cream border-[3px] border-ink-band rounded-2xl shadow-ink-lg p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-4 inline-block bg-sand border-2 border-ink-band px-3 py-1 rounded-full shadow-ink-sm">
              Straight To Your Inbox
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile md:font-headline-h2 md:text-headline-h2 text-ink-band uppercase leading-none mb-4">
              Join The
              <br />
              Newsletter
            </h1>
            <p className="font-body-lg text-body-lg text-body-ink">
              No spam, no noise — just human-verified University of Ibadan news the moment we
              confirm it, and a roundup of everything Spread broadcasts.
            </p>
          </div>
          <NewsletterForm />
        </Reveal>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
