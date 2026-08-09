"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SubmissionStatus } from "@/lib/types";

type Props = {
  submissionId: string;
  status: SubmissionStatus;
};

export function SubmissionRowActions({ submissionId, status }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function override(action: "approve" | "reject") {
    const verb = action === "approve" ? "approve this (credit the user's wallet and publish it)" : "reject this (deduct the payout and unpublish it)";
    if (!confirm(`Are you sure you want to ${verb}?`)) return;
    setSaving(true);
    await fetch(`/api/admin/submissions/${submissionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="flex gap-2">
      {status !== "verified" && (
        <button
          className="font-label-sm text-label-sm text-moss uppercase tracking-widest hover:underline disabled:opacity-50"
          disabled={saving}
          onClick={() => override("approve")}
        >
          Approve
        </button>
      )}
      {status !== "rejected" && (
        <button
          className="font-label-sm text-label-sm text-error uppercase tracking-widest hover:underline disabled:opacity-50"
          disabled={saving}
          onClick={() => override("reject")}
        >
          Reject
        </button>
      )}
    </div>
  );
}
