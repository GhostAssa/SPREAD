import { NextResponse } from "next/server";
import { saveSiteSettings } from "@/lib/site-settings";

function linesToList(value: unknown): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const body = await request.json();
  const tickerItems = linesToList(body.tickerItems);
  const breakingHeadlines = linesToList(body.breakingHeadlines);

  if (tickerItems.length === 0 || breakingHeadlines.length === 0) {
    return NextResponse.json(
      { error: "Both the ticker and breaking-news bands need at least one line." },
      { status: 400 }
    );
  }

  saveSiteSettings({ tickerItems, breakingHeadlines });
  return NextResponse.json({ ok: true });
}
