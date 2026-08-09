"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  userId: string;
  subscribed: boolean;
};

export function UserRowActions({ userId, subscribed }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function toggleSubscribed() {
    setSaving(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscribed: !subscribed }),
    });
    router.refresh();
    setSaving(false);
  }

  async function adjustWallet() {
    const input = prompt("Adjust wallet by how much? (use a negative number to deduct)");
    if (!input) return;
    const amount = Number(input);
    if (Number.isNaN(amount) || amount === 0) return;
    setSaving(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adjustWalletNaira: amount }),
    });
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="flex gap-2">
      <button
        className={
          subscribed
            ? "font-label-sm text-label-sm text-error uppercase tracking-widest hover:underline disabled:opacity-50"
            : "font-label-sm text-label-sm text-moss uppercase tracking-widest hover:underline disabled:opacity-50"
        }
        disabled={saving}
        onClick={toggleSubscribed}
      >
        {subscribed ? "Deactivate" : "Activate"}
      </button>
      <button
        className="font-label-sm text-label-sm text-clay uppercase tracking-widest hover:underline disabled:opacity-50"
        disabled={saving}
        onClick={adjustWallet}
      >
        Adjust Wallet
      </button>
    </div>
  );
}
