import { Icon } from "@/components/icon";

type TopTickerProps = {
  items: string[];
};

/** The clay-colored scrolling alert bar under the header. */
export function TopTicker({ items }: TopTickerProps) {
  return (
    <div className="ticker-wrap py-2 z-40 relative">
      <div className="ticker font-eyebrow text-eyebrow uppercase tracking-widest text-cream">
        {items.map((item, i) => (
          <span key={i}>
            <Icon name="campaign" className="mx-4 text-ink-band align-middle" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
