import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { creditWallet } from "@/lib/users";
import {
  addSubmission,
  getSubmissionsByUser,
  publishArticleFromSubmission,
} from "@/lib/submissions";
import { screenSubmission } from "@/lib/verify-submission";
import { isRateLimited } from "@/lib/rate-limit";
import type { NewsSubmission } from "@/lib/types";

const MIN_BODY_LENGTH = 80;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to submit news." }, { status: 401 });
  }
  if (!user.subscribed) {
    return NextResponse.json(
      { error: "You need an active verification package to submit news. Visit your account to learn more." },
      { status: 402 }
    );
  }
  if (isRateLimited(`submit:${user.id}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "You've hit the submission limit for this hour — please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const storyBody = typeof body.body === "string" ? body.body.trim() : "";
  const evidenceNote = typeof body.evidenceNote === "string" ? body.evidenceNote.trim() : "";

  if (!title || storyBody.length < MIN_BODY_LENGTH) {
    return NextResponse.json(
      { error: `Please provide a title and at least ${MIN_BODY_LENGTH} characters of story detail.` },
      { status: 400 }
    );
  }

  let screening;
  try {
    screening = await screenSubmission(title, storyBody, evidenceNote);
  } catch (err) {
    console.error("[submissions] Screening failed:", err);
    return NextResponse.json(
      { error: "The AI screener is temporarily unavailable — please try again shortly." },
      { status: 502 }
    );
  }

  if (screening.skipped) {
    return NextResponse.json({ error: screening.reason }, { status: 503 });
  }

  const payoutNaira = Number(process.env.SUBMISSION_PAYOUT_NAIRA ?? 1500);
  const verified = screening.verdict === "verify";

  const submission: NewsSubmission = {
    id: crypto.randomUUID(),
    userId: user.id,
    authorName: user.name,
    title,
    body: storyBody,
    evidenceNote,
    status: verified ? "verified" : "rejected",
    aiReason: screening.reason,
    payoutNaira: verified ? payoutNaira : 0,
    submittedAt: new Date().toISOString(),
  };

  if (verified) {
    submission.articleSlug = await publishArticleFromSubmission(submission);
    await creditWallet(user.id, payoutNaira);
  }

  await addSubmission(submission);

  return NextResponse.json({
    ok: true,
    status: submission.status,
    reason: submission.aiReason,
    payoutNaira: submission.payoutNaira,
    articleSlug: submission.articleSlug,
  });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ submissions: await getSubmissionsByUser(user.id) });
}
