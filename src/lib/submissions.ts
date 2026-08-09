import { prisma } from "@/lib/prisma";
import type { Article, NewsSubmission } from "@/lib/types";
import { getArticles, saveArticle, deleteArticle } from "@/lib/articles";
import { slugify } from "@/lib/slugify";

function toSubmission(row: {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  body: string;
  evidenceNote: string;
  status: string;
  aiReason: string;
  payoutNaira: number;
  submittedAt: string;
  articleSlug: string | null;
  overriddenByAdmin: boolean;
}): NewsSubmission {
  return {
    ...row,
    status: row.status as NewsSubmission["status"],
    articleSlug: row.articleSlug ?? undefined,
  };
}

export async function getSubmissions(): Promise<NewsSubmission[]> {
  const rows = await prisma.newsSubmission.findMany({ orderBy: { submittedAt: "desc" } });
  return rows.map(toSubmission);
}

export async function getSubmissionsByUser(userId: string): Promise<NewsSubmission[]> {
  const rows = await prisma.newsSubmission.findMany({
    where: { userId },
    orderBy: { submittedAt: "desc" },
  });
  return rows.map(toSubmission);
}

export async function getSubmissionById(id: string): Promise<NewsSubmission | undefined> {
  const row = await prisma.newsSubmission.findUnique({ where: { id } });
  return row ? toSubmission(row) : undefined;
}

export async function addSubmission(submission: NewsSubmission): Promise<void> {
  await prisma.newsSubmission.create({
    data: { ...submission, articleSlug: submission.articleSlug ?? null },
  });
}

export async function updateSubmission(
  id: string,
  patch: Partial<NewsSubmission>
): Promise<NewsSubmission | undefined> {
  try {
    // Prisma treats an `undefined` field as "leave unchanged," not "clear it" —
    // so a caller explicitly clearing articleSlug (e.g. on reject) must become
    // an explicit `null`, while callers who omit the key entirely still no-op.
    const data: Record<string, unknown> = { ...patch };
    if ("articleSlug" in patch) {
      data.articleSlug = patch.articleSlug ?? null;
    }
    const row = await prisma.newsSubmission.update({ where: { id }, data });
    return toSubmission(row);
  } catch {
    return undefined;
  }
}

async function uniqueSlugFor(title: string): Promise<string> {
  const base = slugify(title) || "submission";
  const existingSlugs = new Set((await getArticles()).map((a) => a.slug));
  if (!existingSlugs.has(base)) return base;
  let i = 2;
  while (existingSlugs.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

/** Publishes a verified submission as a Community article. Returns the slug it was saved under. */
export async function publishArticleFromSubmission(submission: NewsSubmission): Promise<string> {
  const slug = await uniqueSlugFor(submission.title);
  const article: Article = {
    slug,
    size: "compact",
    theme: "light",
    category: "Community",
    chipColor: "moss",
    verified: true,
    title: submission.title,
    excerpt: submission.body.length > 180 ? `${submission.body.slice(0, 177)}...` : submission.body,
    authorName: submission.authorName,
    authorAvatarUrl: "",
    publishedAtLabel: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    timeAgoLabel: "Just now",
    heroImageAlt: "",
    body: [{ type: "lead", text: submission.body }],
    breakdown: [],
    source: "community",
    submissionId: submission.id,
  };
  await saveArticle(article);
  return slug;
}

export async function unpublishSubmissionArticle(articleSlug: string): Promise<void> {
  await deleteArticle(articleSlug);
}
