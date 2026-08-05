"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Login failed");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink-band flex items-center justify-center px-[26px]">
      <form
        className="w-full max-w-sm bg-cream border-[3px] border-ink-band rounded-2xl shadow-ink-lg p-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="text-center">
          <span className="font-shout-lg-mobile text-[40px] text-ink-band">Spread</span>
          <p className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mt-2">
            Admin
          </p>
        </div>
        <div>
          <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="password">
            Password
          </label>
          <input
            autoFocus
            className="w-full bg-sand border-2 border-ink-band rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
          />
        </div>
        {error && (
          <p className="font-label-sm text-label-sm text-error uppercase">{error}</p>
        )}
        <button
          className="w-full btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-8 py-4 rounded-xl text-ink-band disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </main>
  );
}
