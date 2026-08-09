import Image from "next/image";
import { Icon } from "@/components/icon";
import { ArticleActions } from "@/components/article/article-actions";
import { CHIP_BG } from "@/lib/chip-color";
import type { Article } from "@/lib/types";

type ArticleBodyProps = {
  article: Article;
  loggedIn: boolean;
  initiallyBookmarked: boolean;
};

export function ArticleBody({ article, loggedIn, initiallyBookmarked }: ArticleBodyProps) {
  return (
    <div className="md:col-span-8 bg-cream p-8 md:p-12 shadow-ink-md border-2 border-ink-band rounded-xl">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span
          className={`${CHIP_BG[article.chipColor]} px-3 py-1 rounded-full text-eyebrow font-eyebrow uppercase shadow-ink-sm`}
        >
          {article.category}
        </span>
        {article.source === "community" ? (
          <div className="flex items-center gap-1 text-moss">
            <Icon name="verified_user" filled className="text-[18px]" />
            <span className="text-label-sm font-label-sm uppercase">AI-Screened Community Report</span>
          </div>
        ) : (
          article.verified && (
            <div className="flex items-center gap-1 text-tertiary">
              <Icon name="verified" filled className="text-[18px]" />
              <span className="text-label-sm font-label-sm uppercase">Human Verified</span>
            </div>
          )
        )}
      </div>

      <h1 className="font-shout-lg-mobile text-[clamp(2rem,1rem+4vw,4.25rem)] font-extrabold leading-[0.98] tracking-tight text-ink-band mb-8 uppercase break-words">
        {article.title}
      </h1>

      <div className="flex items-center justify-between border-b-2 border-dashed border-ink-band pb-6 mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sand shadow-ink-sm border-2 border-ink-band overflow-hidden relative flex items-center justify-center">
            {article.authorAvatarUrl ? (
              <Image alt={article.authorName} className="object-cover" fill src={article.authorAvatarUrl} />
            ) : (
              <Icon name="person" className="text-ink-band" />
            )}
          </div>
          <div>
            <p className="text-note font-note text-ink-band">By {article.authorName}</p>
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">
              Published {article.publishedAtLabel}
            </p>
          </div>
        </div>
        <ArticleActions
          excerpt={article.excerpt}
          initiallyBookmarked={initiallyBookmarked}
          loggedIn={loggedIn}
          slug={article.slug}
          title={article.title}
        />
      </div>

      <div className="max-w-none text-body-lg font-body-lg text-body-ink space-y-6">
        {article.body.map((block, i) => {
          if (block.type === "lead") {
            return (
              <p className="text-note font-note leading-relaxed" key={i}>
                {block.text}
              </p>
            );
          }
          if (block.type === "heading") {
            return (
              <h2
                className="text-headline-h2-mobile font-headline-h2-mobile text-ink-band mt-12 mb-4"
                key={i}
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === "quote") {
            return (
              <div className="my-8 p-6 bg-sand border-l-8 border-clay shadow-ink-sm" key={i}>
                <p className="text-note font-note italic text-ink-band m-0">
                  &ldquo;{block.text}&rdquo;
                  {block.attribution && <> &mdash; {block.attribution}</>}
                </p>
              </div>
            );
          }
          return <p key={i}>{block.text}</p>;
        })}
      </div>
    </div>
  );
}
