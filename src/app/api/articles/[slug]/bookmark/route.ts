import { NextResponse } from "next/server";
import { toggleBookmark } from "@/lib/bookmarks";
import { getArticleBySlug } from "@/lib/articles";
import { getCurrentUser } from "@/lib/session";

type Params = { params: Promise<{ slug: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { slug } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to save articles." }, { status: 401 });
  }

  const article = await getArticleBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  const bookmarked = await toggleBookmark(user.id, slug);
  return NextResponse.json({ ok: true, bookmarked });
}
