"use client";

import { useRouter } from "next/navigation";

export function LogoutLink() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      className="bg-cream border-2 border-ink-band font-eyebrow text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full text-ink-band shadow-ink-sm hover:-translate-y-0.5 transition-transform"
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
}
