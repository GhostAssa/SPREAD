import { NextResponse } from "next/server";
import { deleteArticle } from "@/lib/articles";

type Params = { params: Promise<{ slug: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const { slug } = await params;
  deleteArticle(slug);
  return NextResponse.json({ ok: true });
}
