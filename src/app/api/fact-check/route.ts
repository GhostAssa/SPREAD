import { NextResponse } from "next/server";
import { searchKnowledge } from "@/lib/knowledge-search";
import { askFactChecker } from "@/lib/groq";
import { isRateLimited } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/session";

const MAX_QUESTION_LENGTH = 500;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Please log in to use the AI clarify feature." },
      { status: 401 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`fact-check:${ip}`, 15, 5 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many questions — please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const question = typeof body.question === "string" ? body.question.trim() : "";

  if (!question) {
    return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { error: `Please keep questions under ${MAX_QUESTION_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const matches = await searchKnowledge(question);

  try {
    const result = await askFactChecker(question, matches);
    if (result.skipped) {
      return NextResponse.json({ error: result.reason }, { status: 503 });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("[fact-check] Groq request failed:", err);
    return NextResponse.json(
      { error: "The AI is temporarily unavailable — please try again shortly." },
      { status: 502 }
    );
  }
}
