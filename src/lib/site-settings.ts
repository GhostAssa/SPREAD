import fs from "node:fs";
import path from "node:path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "site-settings.json");

export type SiteSettings = {
  tickerItems: string[];
  breakingHeadlines: string[];
};

const DEFAULTS: SiteSettings = {
  tickerItems: ["LIVE: HUMAN-VERIFIED BROADCAST"],
  breakingHeadlines: ["CHECK BACK FOR THE LATEST"],
};

export function getSiteSettings(): SiteSettings {
  if (!fs.existsSync(DATA_PATH)) return DEFAULTS;
  const parsed = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  return {
    tickerItems: parsed.tickerItems?.length ? parsed.tickerItems : DEFAULTS.tickerItems,
    breakingHeadlines: parsed.breakingHeadlines?.length
      ? parsed.breakingHeadlines
      : DEFAULTS.breakingHeadlines,
  };
}

export function saveSiteSettings(settings: SiteSettings): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(settings, null, 2) + "\n", "utf-8");
}
