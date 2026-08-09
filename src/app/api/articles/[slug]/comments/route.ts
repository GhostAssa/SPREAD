import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { addComment, getCommentsForArticle } from "@/lib/comments";
import { getArticleBySlug } from "@/lib/articles";
import { getCurrentUser } from "@/lib/session";
import { isRateLimited } from "@/lib/rate-limit";

const MAX_COMMENT_LENGTH = 1000;

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const comments = await getCommentsForArticle(slug);
  return NextResponse.json({ comments });
}

export async function POST(request: Request, { params }: Params) {
  const { slug } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to comment." }, { status: 401 });
  }

  if (isRateLimited(`comment:${user.id}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many comments — please slow down and try again shortly." },
      { status: 429 }
    );
  }

  const article = await getArticleBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const text = typeof body.body === "string" ? body.body.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "Comment can't be empty." }, { status: 400 });
  }
  if (text.length > MAX_COMMENT_LENGTH) {
    return NextResponse.json(
      { error: `Please keep comments under ${MAX_COMMENT_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const comment = {
    id: crypto.randomUUID(),
    articleSlug: slug,
    userId: user.id,
    authorName: user.name,
    body: text,
    createdAt: new Date().toISOString(),
  };
  await addComment(comment);

  return NextResponse.json({ ok: true, comment });
}
