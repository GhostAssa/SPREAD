"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TipRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this tip? This can't be undone.")) return;
    setDeleting(true);
    await fetch(`/api/admin/tips/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      className="font-label-sm text-label-sm text-error uppercase tracking-widest hover:underline disabled:opacity-50"
      disabled={deleting}
      onClick={handleDelete}
    >
      {deleting ? "Deleting..." : "Dismiss"}
    </button>
  );
}
