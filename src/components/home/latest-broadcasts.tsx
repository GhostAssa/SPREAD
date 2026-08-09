import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { CHIP_BG } from "@/lib/chip-color";
import { categoryIcon } from "@/lib/category-icon";
import type { Article } from "@/lib/types";

type LatestBroadcastsProps = {
  feature: Article;
  compacts: Article[];
};

export function LatestBroadcasts({ feature, compacts }: LatestBroadcastsProps) {
  return (
    <section className="bg-cream py-[66px] md:py-[94px] px-[26px]">
      <div className="max-w-[1180px] mx-auto">
        <Reveal as="div" className="flex justify-between items-end mb-12">
          <h2 className="font-headline-h2-mobile text-headline-h2-mobile md:font-headline-h2 md:text-headline-h2 text-ink-band">
            THE <br />
            LATEST
          </h2>
          <Link
            className="font-eyebrow text-eyebrow text-clay border-b-2 border-clay pb-1 hover:text-plum transition-colors uppercase"
            href="/news"
          >
            View Archives
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-[40px]">
          <Reveal
            as="article"
            className="md:col-span-8 bg-surface-container-highest border-2 border-ink-band shadow-ink-md rounded-xl overflow-hidden group"
          >
            <Link href={`/news/${feature.slug}`}>
              <div className="h-80 border-b-2 border-ink-band overflow-hidden relative">
                {feature.heroImageUrl && (
                  <Image
                    alt={feature.heroImageAlt}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    fill
                    sizes="(min-width: 768px) 65vw, 100vw"
                    src={feature.heroImageUrl}
                  />
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`${CHIP_BG[feature.chipColor]} font-label-sm text-label-sm px-3 py-1 rounded-full border border-ink-band shadow-ink-sm uppercase`}
                  >
                    {feature.category}
                  </span>
                </div>
              </div>
              <div className="p-6 bg-sand">
                <h3 className="font-note text-note text-ink-band mb-3">{feature.title}</h3>
                <p className="font-body-md text-body-md text-body-ink mb-4">{feature.excerpt}</p>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 font-label-sm text-label-sm text-ink-band uppercase">
                    <Icon name="schedule" className="text-[16px]" />
                    <span>{feature.timeAgoLabel}</span>
                  </div>
                  {feature.source === "community" && (
                    <div className="flex items-center gap-1 font-label-sm text-label-sm text-moss uppercase">
                      <Icon name="verified_user" className="text-[14px]" />
                      <span>AI-Screened by {feature.authorName}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </Reveal>

          <div className="md:col-span-4 flex flex-col gap-[40px]">
            {compacts.map((article, i) => {
              const isDark = article.theme === "dark";
              return (
                <Reveal
                  as="article"
                  delay={i === 0 ? "delay-100" : "delay-200"}
                  key={article.slug}
                  className={
                    isDark
                      ? "bg-ink-band border-2 border-ink-band shadow-ink-sm rounded-xl p-5 text-cream relative overflow-hidden"
                      : "bg-cream border-2 border-ink-band shadow-ink-sm rounded-xl p-5"
                  }
                >
                  <Link href={`/news/${article.slug}`}>
                    {isDark && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-plum rounded-full blur-3xl opacity-50 mix-blend-screen" />
                    )}
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <span
                        className={
                          isDark
                            ? "bg-sand text-ink-band font-label-sm text-label-sm px-3 py-1 rounded-full border border-ink-band uppercase"
                            : `${CHIP_BG[article.chipColor]} font-label-sm text-label-sm px-3 py-1 rounded-full border border-ink-band uppercase`
                        }
                      >
                        {article.category}
                      </span>
                      {!isDark && (
                        <Icon name={categoryIcon(article.category)} className="text-clay" />
                      )}
                    </div>
                    <h4
                      className={
                        isDark
                          ? "font-note text-note text-cream text-lg mb-2 relative z-10"
                          : "font-note text-note text-ink-band text-lg mb-2"
                      }
                    >
                      {article.title}
                    </h4>
                    <p
                      className={
                        isDark
                          ? "font-body-md text-body-md text-sand-deep text-sm relative z-10"
                          : "font-body-md text-body-md text-body-ink text-sm"
                      }
                    >
                      {article.excerpt}
                    </p>
                    {article.source === "community" && (
                      <div
                        className={
                          isDark
                            ? "flex items-center gap-1 font-label-sm text-label-sm text-tertiary-fixed-dim uppercase mt-2 relative z-10"
                            : "flex items-center gap-1 font-label-sm text-label-sm text-moss uppercase mt-2"
                        }
                      >
                        <Icon name="verified_user" className="text-[14px]" />
                        <span>AI-Screened</span>
                      </div>
                    )}
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
