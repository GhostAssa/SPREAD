import { getArticles } from "@/lib/articles";
import { ArticleForm } from "@/components/admin/article-form";

export default async function NewArticlePage() {
  const otherArticles = (await getArticles()).map((a) => ({ slug: a.slug, title: a.title }));

  return (
    <main className="min-h-screen bg-cream py-[66px] px-[26px]">
      <div className="max-w-[700px] mx-auto">
        <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-2 inline-block">
          Newsroom Admin
        </span>
        <h1 className="font-headline-h2-mobile text-headline-h2-mobile text-ink-band uppercase mb-8">
          New Article
        </h1>
        <ArticleForm otherArticles={otherArticles} />
      </div>
    </main>
  );
}
