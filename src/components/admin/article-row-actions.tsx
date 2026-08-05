"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ArticleRowActions({ slug }: { slug: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");

  async function handleDelete() {
    if (!confirm("Delete this article? This can't be undone.")) return;
    setDeleting(true);
    await fetch(`/api/admin/articles/${slug}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleNotify() {
    if (!confirm("Email every newsletter subscriber about this article now?")) return;
    setNotifying(true);
    setNotifyMessage("");
    try {
      const res = await fetch("/api/admin/newsletter/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const result = await res.json();
      if (result.skipped) {
        setNotifyMessage(result.reason);
      } else {
        const failedNote = result.failed
          ? `, ${result.failed} failed (${result.errors?.[0] ?? "see server logs"})`
          : "";
        setNotifyMessage(
          `Sent to ${result.sent} subscriber${result.sent === 1 ? "" : "s"}${failedNote}.`
        );
      }
    } catch {
      setNotifyMessage("Failed to send — check the server logs.");
    } finally {
      setNotifying(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <a
          className="font-label-sm text-label-sm text-clay uppercase tracking-widest hover:underline"
          href={`/admin/articles/${slug}`}
        >
          Edit
        </a>
        <button
          className="font-label-sm text-label-sm text-teal uppercase tracking-widest hover:underline disabled:opacity-50"
          disabled={notifying}
          onClick={handleNotify}
        >
          {notifying ? "Sending..." : "Notify Subscribers"}
        </button>
        <button
          className="font-label-sm text-label-sm text-error uppercase tracking-widest hover:underline disabled:opacity-50"
          disabled={deleting}
          onClick={handleDelete}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
      {notifyMessage && (
        <p className="font-label-sm text-label-sm text-ink-band opacity-70">{notifyMessage}</p>
      )}
    </div>
  );
}
