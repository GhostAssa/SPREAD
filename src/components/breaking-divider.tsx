type BreakingDividerProps = {
  headlines: string[];
};

/** The dark full-bleed marquee band that breaks up the page between sections. */
export function BreakingDivider({ headlines }: BreakingDividerProps) {
  const loop = [...headlines, ...headlines];
  return (
    <div className="w-full h-24 bg-ink-band relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-30" style={{ backgroundSize: "20px 20px" }} />
      <div className="w-full overflow-hidden">
        <div className="ticker font-headline-h2-mobile text-headline-h2-mobile md:font-headline-h2 md:text-headline-h2 text-cream uppercase tracking-tighter mix-blend-overlay py-4">
          {loop.map((headline, i) => (
            <span className="mx-8" key={i}>
              BREAKING NEWS: {headline}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
