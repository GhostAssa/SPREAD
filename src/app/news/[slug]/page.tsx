import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ArticleHero } from "@/components/article/article-hero";
import { ArticleBody } from "@/components/article/article-body";
import { ArticleSidebar } from "@/components/article/article-sidebar";
import { CommentSection } from "@/components/article/comment-section";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import { getCommentsForArticle } from "@/lib/comments";
import { isBookmarked } from "@/lib/bookmarks";
import { getCurrentUser } from "@/lib/session";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Spread`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = article.relatedSlug ? await getArticleBySlug(article.relatedSlug) : undefined;
  const [comments, user] = await Promise.all([getCommentsForArticle(slug), getCurrentUser()]);
  const bookmarked = user ? await isBookmarked(user.id, slug) : false;

  return (
    <>
      <SiteHeader />
      <main className="w-full relative pb-[94px] bg-sand">
        <ArticleHero imageUrl={article.heroImageUrl} imageAlt={article.heroImageAlt} />
        <section className="max-w-[1180px] mx-auto px-[26px] md:-mt-24 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[40px]">
            <ArticleBody
              article={article}
              initiallyBookmarked={bookmarked}
              loggedIn={Boolean(user)}
            />
            <ArticleSidebar breakdown={article.breakdown} related={related} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[40px] mt-[40px]">
            <CommentSection comments={comments} loggedIn={Boolean(user)} slug={slug} />
          </div>
        </section>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
