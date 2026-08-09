import { prisma } from "@/lib/prisma";
import type { Article, ArticleBlock, ChipColor } from "@/lib/types";

function toArticle(row: {
  slug: string;
  size: string;
  theme: string;
  category: string;
  chipColor: string;
  verified: boolean;
  title: string;
  excerpt: string;
  authorName: string;
  authorAvatarUrl: string;
  publishedAtLabel: string;
  timeAgoLabel: string;
  heroImageUrl: string | null;
  heroImageAlt: string;
  body: unknown;
  breakdown: string[];
  relatedSlug: string | null;
  source: string | null;
  submissionId: string | null;
}): Article {
  return {
    slug: row.slug,
    size: row.size as Article["size"],
    theme: row.theme as Article["theme"],
    category: row.category,
    chipColor: row.chipColor as ChipColor,
    verified: row.verified,
    title: row.title,
    excerpt: row.excerpt,
    authorName: row.authorName,
    authorAvatarUrl: row.authorAvatarUrl,
    publishedAtLabel: row.publishedAtLabel,
    timeAgoLabel: row.timeAgoLabel,
    heroImageUrl: row.heroImageUrl ?? undefined,
    heroImageAlt: row.heroImageAlt,
    body: row.body as ArticleBlock[],
    breakdown: row.breakdown,
    relatedSlug: row.relatedSlug ?? undefined,
    source: (row.source as Article["source"]) ?? undefined,
    submissionId: row.submissionId ?? undefined,
  };
}

export async function getArticles(): Promise<Article[]> {
  const rows = await prisma.article.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(toArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const row = await prisma.article.findUnique({ where: { slug } });
  return row ? toArticle(row) : undefined;
}

export async function getHomepageFeature(): Promise<Article | undefined> {
  const row = await prisma.article.findFirst({
    where: { size: "feature" },
    orderBy: { sortOrder: "asc" },
  });
  return row ? toArticle(row) : undefined;
}

export async function getHomepageCompacts(): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    where: { size: "compact" },
    orderBy: { sortOrder: "asc" },
    take: 2,
  });
  return rows.map(toArticle);
}

export async function saveArticle(article: Article): Promise<void> {
  const data = {
    size: article.size,
    theme: article.theme,
    category: article.category,
    chipColor: article.chipColor,
    verified: article.verified,
    title: article.title,
    excerpt: article.excerpt,
    authorName: article.authorName,
    authorAvatarUrl: article.authorAvatarUrl,
    publishedAtLabel: article.publishedAtLabel,
    timeAgoLabel: article.timeAgoLabel,
    heroImageUrl: article.heroImageUrl ?? null,
    heroImageAlt: article.heroImageAlt,
    body: article.body as object,
    breakdown: article.breakdown,
    relatedSlug: article.relatedSlug ?? null,
    source: article.source ?? null,
    submissionId: article.submissionId ?? null,
  };

  await prisma.article.upsert({
    where: { slug: article.slug },
    create: { slug: article.slug, ...data },
    update: data,
  });
}

export async function deleteArticle(slug: string): Promise<void> {
  await prisma.article.deleteMany({ where: { slug } });
}
