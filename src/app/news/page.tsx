import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ArticleListCard } from "@/components/article-list-card";
import { Reveal } from "@/components/reveal";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "News — Spread",
  description: "Every human-verified broadcast from University of Ibadan campus, checked first.",
};

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

// Strips punctuation so a search for "wifi" still matches a title like "Wi-Fi".
function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export default async function NewsPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = normalize(q?.trim() ?? "");

  const allArticles = await getArticles();
  const articles = query
    ? allArticles.filter(
        (a) =>
          normalize(a.title).includes(query) ||
          normalize(a.excerpt).includes(query) ||
          normalize(a.category).includes(query)
      )
    : allArticles;

  const delays: Array<"delay-100" | "delay-200" | undefined> = [undefined, "delay-100", "delay-200"];

  return (
    <>
      <SiteHeader />
      <main className="bg-cream py-[66px] md:py-[94px] px-[26px]">
        <div className="max-w-[1180px] mx-auto">
          <Reveal as="div" className="mb-12">
            <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-4 inline-block bg-sand border-2 border-ink-band px-3 py-1 rounded-full shadow-ink-sm">
              The Archives
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile md:font-headline-h2 md:text-headline-h2 text-ink-band uppercase leading-none">
              News
            </h1>
            {query && (
              <p className="font-body-md text-body-md text-body-ink mt-4">
                {articles.length} result{articles.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo; —{" "}
                <Link className="text-clay underline" href="/news">
                  clear search
                </Link>
              </p>
            )}
          </Reveal>

          {articles.length === 0 ? (
            <p className="font-body-md text-body-md text-body-ink">
              No stories match that search yet. Try a different term, or{" "}
              <Link className="text-clay underline" href="/share-a-news">
                send us a tip
              </Link>
              .
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
              {articles.map((article, i) => (
                <ArticleListCard article={article} delay={delays[i % delays.length]} key={article.slug} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
