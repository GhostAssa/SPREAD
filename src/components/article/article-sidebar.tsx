import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

type ArticleSidebarProps = {
  breakdown: string[];
  related?: Article;
};

export function ArticleSidebar({ breakdown, related }: ArticleSidebarProps) {
  return (
    <div className="md:col-span-4 space-y-8 md:sticky md:top-[100px] md:self-start">
      {breakdown.length > 0 && (
        <div className="bg-primary-fixed p-6 rounded-xl shadow-ink-md border-2 border-ink-band">
          <h3 className="text-note font-note text-on-primary-fixed mb-4 border-b-2 border-ink-band pb-2">
            The Breakdown
          </h3>
          <ul className="space-y-4">
            {breakdown.map((point, i) => (
              <li
                className={
                  i === 0
                    ? "flex items-start gap-3"
                    : "flex items-start gap-3 border-t-2 border-dashed border-outline-variant pt-4"
                }
                key={i}
              >
                <div className="w-6 h-6 rounded-full border-2 border-ink-band bg-cream flex items-center justify-center shrink-0 mt-1">
                  <span className="text-label-sm font-label-sm">{i + 1}</span>
                </div>
                <p className="text-body-md font-body-md text-on-primary-fixed-variant">{point}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {related && (
        <div className="bg-sand p-6 rounded-xl shadow-ink-md border-2 border-ink-band">
          <h3 className="text-note font-note text-ink-band mb-4">Related Broadcasts</h3>
          <Link className="block group" href={`/news/${related.slug}`}>
            <div className="h-24 bg-cream rounded border-2 border-ink-band overflow-hidden mb-2 relative">
              {related.heroImageUrl && (
                <Image
                  alt={related.heroImageAlt}
                  className="object-cover grayscale group-hover:grayscale-0 transition-all"
                  fill
                  src={related.heroImageUrl}
                />
              )}
            </div>
            <h4 className="text-body-md font-body-md font-bold text-ink-band group-hover:text-clay transition-colors">
              {related.title}
            </h4>
          </Link>
        </div>
      )}
    </div>
  );
}
