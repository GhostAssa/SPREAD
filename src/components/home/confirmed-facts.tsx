"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { CHIP_BG } from "@/lib/chip-color";
import type { Fact } from "@/lib/types";

type ConfirmedFactsProps = {
  facts: Fact[];
};

const PAGE_SIZE = 3;

export function ConfirmedFacts({ facts }: ConfirmedFactsProps) {
  const categories = useMemo(
    () => Array.from(new Set(facts.map((f) => f.category))),
    [facts]
  );
  const [filter, setFilter] = useState<string>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleEvidence(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filtered = filter === "All" ? facts : facts.filter((f) => f.category === filter);
  const shown = filtered.slice(0, visible);

  return (
    <section className="bg-sand py-[66px] md:py-[94px] px-[26px] relative overflow-hidden">
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="text-clay"
          d="M0,400 C320,200 420,600 720,400 C1020,200 1120,600 1440,400 L1440,800 L0,800 Z"
          fill="currentColor"
        />
      </svg>

      <div className="max-w-[1180px] mx-auto relative z-10">
        <Reveal
          as="div"
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
        >
          <div>
            <span className="font-eyebrow text-eyebrow text-moss uppercase tracking-widest mb-4 inline-block bg-cream border-2 border-ink-band px-3 py-1 rounded-full shadow-ink-sm">
              Verified
            </span>
            <h2 className="font-headline-h2-mobile text-headline-h2-mobile md:font-headline-h2 md:text-headline-h2 text-ink-band leading-none uppercase">
              Confirmed
              <br />
              Facts
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 font-label-sm text-label-sm uppercase tracking-widest">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setVisible(PAGE_SIZE);
                }}
                className={
                  filter === cat
                    ? "bg-ink-band text-cream px-4 py-2 rounded-full border-2 border-ink-band shadow-ink-sm"
                    : "bg-cream text-ink-band px-4 py-2 rounded-full border-2 border-ink-band hover:bg-sand transition-colors"
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
          {shown.map((fact, i) => {
            const debunked = fact.status === "debunked";
            return (
              <Reveal
                as="article"
                key={fact.id}
                delay={i === 1 ? "delay-100" : i === 2 ? "delay-200" : undefined}
                className={
                  debunked
                    ? "fact-card bg-surface-container-highest border-2 border-ink-band rounded-[16px] shadow-ink-md overflow-hidden"
                    : "fact-card bg-cream border-2 border-ink-band rounded-[16px] shadow-ink-md overflow-hidden"
                }
              >
                <div
                  className={
                    debunked
                      ? "p-4 border-b-2 border-ink-band bg-error-container flex justify-between items-center"
                      : "p-4 border-b-2 border-ink-band bg-sand flex justify-between items-center"
                  }
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      name={debunked ? "cancel" : "check_circle"}
                      className={debunked ? "text-error text-[20px]" : "text-moss text-[20px]"}
                    />
                    <span
                      className={
                        debunked
                          ? "font-label-sm text-label-sm text-on-error-container uppercase tracking-widest"
                          : "font-label-sm text-label-sm text-ink-band uppercase tracking-widest"
                      }
                    >
                      {debunked ? "Debunked" : "Verified True"}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-ink-band opacity-60">
                    ID: {fact.id}
                  </span>
                </div>
                <div className="p-6">
                  <span
                    className={`inline-block ${CHIP_BG[fact.chipColor]} font-label-sm text-label-sm px-2 py-1 rounded border border-ink-band mb-4 uppercase`}
                  >
                    {fact.category}
                  </span>
                  <h3 className="font-note text-note text-ink-band mb-3">{fact.title}</h3>
                  <p className="font-body-md text-body-md text-body-ink mb-6">{fact.body}</p>
                  <div className="flex items-center justify-between border-t border-ink-band/20 pt-4">
                    <div className="flex -space-x-2">
                      {fact.sources.map((src, si) => (
                        <div
                          key={si}
                          className={`w-8 h-8 rounded-full border-2 border-ink-band flex items-center justify-center font-label-sm text-[10px] ${
                            si % 2 === 0 ? "bg-sand" : "bg-sand-deep"
                          }`}
                        >
                          {src}
                        </div>
                      ))}
                    </div>
                    <button
                      aria-expanded={expanded.has(fact.id)}
                      className="font-label-sm text-label-sm text-clay uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                      onClick={() => toggleEvidence(fact.id)}
                      type="button"
                    >
                      {expanded.has(fact.id) ? "Hide Evidence" : "View Evidence"}
                    </button>
                  </div>
                  {expanded.has(fact.id) && (
                    <div className="mt-4 pt-4 border-t border-dashed border-ink-band/30 font-label-sm text-label-sm text-ink-band uppercase space-y-1">
                      <p>Case ID: {fact.id}</p>
                      <p>Status: {debunked ? "Debunked" : "Verified True"}</p>
                      <p>Cross-checked with: {fact.sources.join(", ")}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {visible < filtered.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="bg-cream border-2 border-ink-band font-eyebrow text-eyebrow uppercase tracking-widest px-8 py-4 rounded-full text-ink-band shadow-ink-sm hover:-translate-y-0.5 transition-transform"
            >
              Load More Facts
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
