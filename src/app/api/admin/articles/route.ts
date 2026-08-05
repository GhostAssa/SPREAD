import { NextResponse } from "next/server";
import { saveArticle } from "@/lib/articles";
import type { Article } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as Article;

  if (!body.slug || !body.title) {
    return NextResponse.json({ error: "slug and title are required" }, { status: 400 });
  }

  saveArticle(body);
  return NextResponse.json({ ok: true, slug: body.slug });
}
