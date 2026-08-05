"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email") }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Something went wrong");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-6">
        <Icon name="check_circle" className="text-moss text-[40px] mb-3" />
        <h3 className="font-note text-note text-ink-band mb-2">You&apos;re on the list.</h3>
        <p className="font-body-md text-body-md text-body-ink">
          We&apos;ll email you the moment something&apos;s confirmed and broadcast.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="flex-1 bg-sand border-2 border-ink-band rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
        <button
          className="btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-6 py-3 rounded-lg text-ink-band whitespace-nowrap disabled:opacity-60"
          disabled={status === "submitting"}
          type="submit"
        >
          {status === "submitting" ? "Joining..." : "Join Newsletter"}
        </button>
      </div>
      {status === "error" && (
        <p className="font-label-sm text-label-sm text-error uppercase">{errorMessage}</p>
      )}
    </form>
  );
}
