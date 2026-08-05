import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Unsubscribed — Spread",
};

export default function UnsubscribedPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-cream py-[66px] md:py-[94px] px-[26px] min-h-[60vh] flex items-center justify-center">
        <div className="max-w-[480px] mx-auto text-center bg-sand border-2 border-ink-band rounded-2xl shadow-ink-md p-8 md:p-12">
          <Icon name="mail" className="text-ink-band text-[40px] mb-4" />
          <h1 className="font-headline-h2-mobile text-headline-h2-mobile text-ink-band uppercase mb-4">
            You&apos;re unsubscribed
          </h1>
          <p className="font-body-md text-body-md text-body-ink mb-8">
            You won&apos;t get any more newsletter emails from Spread. You can always rejoin later.
          </p>
          <Link
            className="btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full text-ink-band inline-block"
            href="/newsletter"
          >
            Resubscribe
          </Link>
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
