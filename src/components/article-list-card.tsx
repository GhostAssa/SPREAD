import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/reveal";
import { CHIP_BG } from "@/lib/chip-color";
import { categoryIcon } from "@/lib/category-icon";
import type { Article } from "@/lib/types";

type ArticleListCardProps = {
  article: Article;
  delay?: "delay-100" | "delay-200" | "delay-300";
};

export function ArticleListCard({ article, delay }: ArticleListCardProps) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className="bg-cream border-2 border-ink-band shadow-ink-md rounded-xl overflow-hidden group"
    >
      <Link href={`/news/${article.slug}`}>
        {article.heroImageUrl ? (
          <div className="h-52 border-b-2 border-ink-band overflow-hidden relative">
            <Image
              alt={article.heroImageAlt}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              src={article.heroImageUrl}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span
                className={`${CHIP_BG[article.chipColor]} font-label-sm text-label-sm px-3 py-1 rounded-full border border-ink-band shadow-ink-sm uppercase`}
              >
                {article.category}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start p-5 pb-0">
            <span
              className={`${CHIP_BG[article.chipColor]} font-label-sm text-label-sm px-3 py-1 rounded-full border border-ink-band uppercase`}
            >
              {article.category}
            </span>
            <Icon name={categoryIcon(article.category)} className="text-clay" />
          </div>
        )}
        <div className="p-5">
          <h3 className="font-note text-note text-ink-band mb-2">{article.title}</h3>
          <p className="font-body-md text-body-md text-body-ink mb-4">{article.excerpt}</p>
          <div className="flex items-center gap-2 font-label-sm text-label-sm text-ink-band uppercase">
            <Icon name="schedule" className="text-[16px]" />
            <span>{article.timeAgoLabel}</span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
