"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";

type Result = { status: "verified" | "rejected"; reason: string; payoutNaira: number; articleSlug?: string };

const inputClass =
  "w-full bg-sand border-2 border-ink-band rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm";

export function SubmitNewsForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.get("title"),
          body: data.get("body"),
          evidenceNote: data.get("evidenceNote"),
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Something went wrong.");
        setStatus("idle");
        return;
      }
      setResult(body);
      setStatus("idle");
      form.reset();
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setStatus("idle");
    }
  }

  if (result) {
    const verified = result.status === "verified";
    return (
      <div className="bg-cream border-2 border-ink-band rounded-xl shadow-ink-md p-8 text-center">
        <Icon
          name={verified ? "check_circle" : "cancel"}
          className={verified ? "text-moss text-[48px] mb-4" : "text-error text-[48px] mb-4"}
        />
        <h3 className="font-note text-note text-ink-band mb-2">
          {verified ? `Verified — ₦${result.payoutNaira.toLocaleString()} added to your wallet` : "Not verified"}
        </h3>
        <p className="font-body-md text-body-md text-body-ink mb-6">{result.reason}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {result.articleSlug && (
            <Link
              className="btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full text-ink-band"
              href={`/news/${result.articleSlug}`}
            >
              View Published Story
            </Link>
          )}
          <button
            className="bg-sand border-2 border-ink-band font-eyebrow text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full text-ink-band shadow-ink-sm"
            onClick={() => setResult(null)}
            type="button"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="title">
          Headline
        </label>
        <input className={inputClass} id="title" maxLength={140} name="title" required type="text" />
      </div>
      <div>
        <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="body">
          The Story
        </label>
        <textarea
          className={inputClass}
          id="body"
          minLength={80}
          name="body"
          placeholder="Be specific — who, what, where, when. Vague submissions get rejected."
          required
          rows={8}
        />
      </div>
      <div>
        <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2" htmlFor="evidenceNote">
          Evidence / Sourcing
        </label>
        <textarea
          className={inputClass}
          id="evidenceNote"
          name="evidenceNote"
          placeholder="Who or what backs this up? A named source, a document, something you witnessed directly..."
          rows={3}
        />
      </div>

      {error && <p className="font-label-sm text-label-sm text-error uppercase">{error}</p>}

      <button
        className="w-full btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-8 py-5 rounded-xl text-ink-band text-lg disabled:opacity-60"
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? "Screening..." : "Submit for Screening"}
      </button>
    </form>
  );
}
