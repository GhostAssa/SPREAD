import Link from "next/link";
import { getArticles } from "@/lib/articles";
import { ArticleRowActions } from "@/components/admin/article-row-actions";
import { LogoutButton } from "@/components/admin/logout-button";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminDashboard() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-cream py-[66px] px-[26px]">
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-start mb-2 flex-wrap gap-4">
          <div>
            <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-2 inline-block">
              Newsroom Admin
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile text-ink-band uppercase">
              Articles
            </h1>
          </div>
          <div className="flex gap-3 items-start">
            <Link
              className="btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full text-ink-band"
              href="/admin/articles/new"
            >
              + New Article
            </Link>
            <LogoutButton />
          </div>
        </div>

        <AdminNav />

        <div className="bg-sand border-2 border-ink-band rounded-xl shadow-ink-md overflow-hidden divide-y-2 divide-dashed divide-ink-band/30">
          {articles.length === 0 && (
            <p className="p-6 font-body-md text-body-md text-body-ink">No articles yet.</p>
          )}
          {articles.map((article) => (
            <div className="p-5 flex items-center justify-between gap-4 flex-wrap" key={article.slug}>
              <div>
                <p className="font-note text-note text-ink-band text-lg">{article.title}</p>
                <p className="font-label-sm text-label-sm text-ink-band opacity-60 uppercase">
                  {article.category} &middot; {article.size} &middot; /news/{article.slug}
                </p>
              </div>
              <ArticleRowActions slug={article.slug} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
