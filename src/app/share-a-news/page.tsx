import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { TipFormSection } from "@/components/home/tip-form-section";

export const metadata: Metadata = {
  title: "Share a News — Spread",
  description: "Send us a tip, anonymously and securely. We protect our sources.",
};

export default function ShareANewsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <TipFormSection />
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
