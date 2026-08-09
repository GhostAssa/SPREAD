import { NextResponse } from "next/server";
import {
  getSubmissionById,
  updateSubmission,
  publishArticleFromSubmission,
  unpublishSubmissionArticle,
} from "@/lib/submissions";
import { creditWallet } from "@/lib/users";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const submission = await getSubmissionById(id);
  if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const action = body.action as "approve" | "reject";

  if (action === "approve" && submission.status !== "verified") {
    const payoutNaira = Number(process.env.SUBMISSION_PAYOUT_NAIRA ?? 1500);
    const articleSlug = await publishArticleFromSubmission({ ...submission, payoutNaira });
    await creditWallet(submission.userId, payoutNaira);
    await updateSubmission(id, {
      status: "verified",
      articleSlug,
      payoutNaira,
      overriddenByAdmin: true,
      aiReason: `${submission.aiReason} (Overridden by admin — approved.)`,
    });
  } else if (action === "reject" && submission.status !== "rejected") {
    if (submission.articleSlug) await unpublishSubmissionArticle(submission.articleSlug);
    if (submission.payoutNaira > 0) await creditWallet(submission.userId, -submission.payoutNaira);
    await updateSubmission(id, {
      status: "rejected",
      articleSlug: undefined,
      payoutNaira: 0,
      overriddenByAdmin: true,
      aiReason: `${submission.aiReason} (Overridden by admin — rejected.)`,
    });
  }

  return NextResponse.json({ ok: true, submission: await getSubmissionById(id) });
}
