import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us — Spread",
  description: "Get in touch with the Spread newsroom.",
};

export default function ContactUsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-ink-band py-[66px] md:py-[94px] px-[26px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="90%" cy="10%" fill="#106969" r="300" style={{ filter: "blur(80px)" }} />
            <circle cx="10%" cy="90%" fill="#7C3055" r="200" style={{ filter: "blur(60px)" }} />
          </svg>
        </div>

        <Reveal
          as="div"
          className="max-w-[800px] mx-auto relative z-10 bg-cream border-[3px] border-ink-band rounded-2xl shadow-ink-lg p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-4 inline-block bg-sand border-2 border-ink-band px-3 py-1 rounded-full shadow-ink-sm">
              We Read Everything
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile md:font-headline-h2 md:text-headline-h2 text-ink-band uppercase leading-none mb-4">
              Contact Us
            </h1>
            <p className="font-body-lg text-body-lg text-body-ink">
              Corrections, story ideas, or partnership requests — this is the line for anything
              that isn&apos;t an anonymous tip.
            </p>
          </div>
          <ContactForm />
        </Reveal>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
