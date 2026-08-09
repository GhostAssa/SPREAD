import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  tickerItems: string[];
  breakingHeadlines: string[];
};

const DEFAULTS: SiteSettings = {
  tickerItems: ["LIVE: HUMAN-VERIFIED BROADCAST"],
  breakingHeadlines: ["CHECK BACK FOR THE LATEST"],
};

const SINGLETON_ID = "singleton";

export async function getSiteSettings(): Promise<SiteSettings> {
  const row = await prisma.siteSettings.findUnique({ where: { id: SINGLETON_ID } });
  if (!row) return DEFAULTS;
  return {
    tickerItems: row.tickerItems.length ? row.tickerItems : DEFAULTS.tickerItems,
    breakingHeadlines: row.breakingHeadlines.length
      ? row.breakingHeadlines
      : DEFAULTS.breakingHeadlines,
  };
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...settings },
    update: settings,
  });
}
