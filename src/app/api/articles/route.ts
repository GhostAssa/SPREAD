import { NextResponse } from "next/server";
import { getArticles } from "@/lib/articles";

export async function GET() {
  return NextResponse.json({ articles: getArticles() });
}
