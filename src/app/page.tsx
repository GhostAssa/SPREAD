import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { TopTicker } from "@/components/top-ticker";
import { BreakingDivider } from "@/components/breaking-divider";
import { Hero } from "@/components/home/hero";
import { LatestBroadcasts } from "@/components/home/latest-broadcasts";
import { ConfirmedFacts } from "@/components/home/confirmed-facts";
import { BlueprintTimeline } from "@/components/home/blueprint-timeline";
import { TipFormSection } from "@/components/home/tip-form-section";
import { getHomepageFeature, getHomepageCompacts } from "@/lib/articles";
import { getFacts } from "@/lib/facts";
import { getSiteSettings } from "@/lib/site-settings";

export default function HomePage() {
  const feature = getHomepageFeature();
  const compacts = getHomepageCompacts();
  const facts = getFacts();
  const settings = getSiteSettings();

  return (
    <>
      <SiteHeader />
      <TopTicker items={settings.tickerItems} />
      <main>
        <Hero />
        <BreakingDivider headlines={settings.breakingHeadlines} />
        {feature && <LatestBroadcasts feature={feature} compacts={compacts} />}
        <ConfirmedFacts facts={facts} />
        <BlueprintTimeline />
        <TipFormSection />
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
