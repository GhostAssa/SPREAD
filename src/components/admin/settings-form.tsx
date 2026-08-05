"use client";

import { useState, type FormEvent } from "react";
import type { SiteSettings } from "@/lib/site-settings";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [tickerItems, setTickerItems] = useState(initial.tickerItems.join("\n"));
  const [breakingHeadlines, setBreakingHeadlines] = useState(initial.breakingHeadlines.join("\n"));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickerItems, breakingHeadlines }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save");
      }
      setStatus("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setStatus("error");
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="bg-sand border-2 border-ink-band rounded-xl shadow-ink-md p-6">
        <h2 className="font-note text-note text-ink-band mb-1">Top Alert Ticker</h2>
        <p className="font-label-sm text-label-sm text-ink-band opacity-60 mb-4 uppercase">
          The clay-colored scrolling bar under the header. One alert per line.
        </p>
        <textarea
          className="w-full bg-cream border-2 border-ink-band rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm"
          onChange={(e) => setTickerItems(e.target.value)}
          rows={5}
          value={tickerItems}
        />
      </div>

      <div className="bg-sand border-2 border-ink-band rounded-xl shadow-ink-md p-6">
        <h2 className="font-note text-note text-ink-band mb-1">Breaking News Band</h2>
        <p className="font-label-sm text-label-sm text-ink-band opacity-60 mb-4 uppercase">
          The dark full-width marquee between Hero and The Latest. One headline per line — &quot;BREAKING NEWS:&quot; is added automatically.
        </p>
        <textarea
          className="w-full bg-cream border-2 border-ink-band rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm"
          onChange={(e) => setBreakingHeadlines(e.target.value)}
          rows={4}
          value={breakingHeadlines}
        />
      </div>

      {status === "error" && (
        <p className="font-label-sm text-label-sm text-error uppercase">{error}</p>
      )}
      {status === "saved" && (
        <p className="font-label-sm text-label-sm text-moss uppercase">
          Saved — refresh the homepage to see it live.
        </p>
      )}

      <button
        className="btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-8 py-4 rounded-full text-ink-band disabled:opacity-60"
        disabled={status === "saving"}
        type="submit"
      >
        {status === "saving" ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
