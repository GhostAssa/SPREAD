import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/articles";
import { sendBreakingNewsEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const body = await request.json();
  const slug = typeof body.slug === "string" ? body.slug : "";

  const article = getArticleBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const result = await sendBreakingNewsEmail(article);
  return NextResponse.json(result);
}
