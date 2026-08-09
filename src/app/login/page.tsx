"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

const inputClass =
  "w-full bg-sand border-2 border-ink-band rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-ink-band py-[66px] md:py-[94px] px-[26px] min-h-[70vh] flex items-center">
        <form
          className="w-full max-w-md mx-auto bg-cream border-[3px] border-ink-band rounded-2xl shadow-ink-lg p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="text-center">
            <span className="font-eyebrow text-eyebrow text-clay uppercase tracking-widest mb-2 inline-block bg-sand border-2 border-ink-band px-3 py-1 rounded-full shadow-ink-sm">
              Spread &amp; Earn
            </span>
            <h1 className="font-headline-h2-mobile text-headline-h2-mobile text-ink-band uppercase">
              Log In
            </h1>
          </div>

          <div>
            <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="email">
              Email
            </label>
            <input className={inputClass} id="email" name="email" required type="email" />
          </div>
          <div>
            <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="password">
              Password
            </label>
            <input className={inputClass} id="password" name="password" required type="password" />
          </div>

          {error && <p className="font-label-sm text-label-sm text-error uppercase">{error}</p>}

          <button
            className="w-full btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-8 py-4 rounded-xl text-ink-band disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="text-center font-label-sm text-label-sm text-ink-band opacity-70">
            New here?{" "}
            <Link className="text-clay underline" href="/signup">
              Create an account
            </Link>
          </p>
        </form>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </>
  );
}
