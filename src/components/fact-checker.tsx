"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";

type Source = { title: string; url: string; status: string };

type Turn = {
  question: string;
  answer?: string;
  grounded?: boolean;
  sources?: Source[];
  error?: string;
  authError?: boolean;
};

const STATUS_LABEL: Record<string, string> = {
  verified: "Verified True",
  debunked: "Debunked",
  reported: "Reported (Unverified)",
};

export function FactChecker({ loggedIn }: { loggedIn: boolean }) {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    if (!loggedIn) {
      setShowAuthPrompt(true);
      return;
    }

    setQuestion("");
    setLoading(true);
    const index = turns.length;
    setTurns((prev) => [...prev, { question: q }]);

    try {
      const res = await fetch("/api/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setTurns((prev) => {
        const next = [...prev];
        next[index] = res.ok
          ? { question: q, answer: data.answer, grounded: data.grounded, sources: data.sources }
          : {
              question: q,
              error: data.error ?? "Something went wrong.",
              authError: res.status === 401,
            };
        return next;
      });
    } catch {
      setTurns((prev) => {
        const next = [...prev];
        next[index] = { question: q, error: "Couldn't reach the AI. Try again." };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[720px] mx-auto">
      {turns.length === 0 && (
        <div className="text-center bg-cream border-2 border-ink-band rounded-xl shadow-ink-sm p-8 mb-8">
          <Icon name="fact_check" className="text-[40px] text-teal mb-3" />
          <p className="font-body-md text-body-md text-body-ink">
            Ask about any post or article on Spread. We&apos;ll pull from our own records first
            and explain in more detail — if we haven&apos;t covered it yet, we&apos;ll say so
            clearly before giving you general context.
          </p>
        </div>
      )}

      <div className="space-y-6 mb-8">
        {turns.map((turn, i) => (
          <div className="space-y-3" key={i}>
            <div className="flex justify-end">
              <div className="bg-ink-band text-cream px-5 py-3 rounded-xl rounded-br-sm max-w-[85%] font-body-md text-body-md">
                {turn.question}
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-[85%] w-full">
                {turn.error ? (
                  <div className="bg-error-container border-2 border-ink-band rounded-xl rounded-bl-sm p-4 font-body-md text-body-md text-on-error-container">
                    {turn.error}
                    {turn.authError && (
                      <Link className="block mt-2 font-label-sm text-label-sm uppercase tracking-widest underline" href="/login">
                        Log in again →
                      </Link>
                    )}
                  </div>
                ) : turn.answer ? (
                  <div className="bg-cream border-2 border-ink-band rounded-xl rounded-bl-sm shadow-ink-sm p-4">
                    <span
                      className={`inline-flex items-center gap-1 font-label-sm text-label-sm uppercase px-2 py-1 rounded-full border border-ink-band mb-3 ${
                        turn.grounded ? "bg-tertiary-container text-on-tertiary-container" : "bg-primary-fixed text-on-primary-fixed"
                      }`}
                    >
                      <Icon
                        name={turn.grounded ? "verified" : "auto_awesome"}
                        className="text-[14px]"
                      />
                      {turn.grounded ? "From Spread's Records" : "General AI Context"}
                    </span>
                    <p className="font-body-md text-body-md text-body-ink">{turn.answer}</p>
                    {turn.sources && turn.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-dashed border-ink-band/30 space-y-1">
                        {turn.sources.map((s, si) => (
                          <Link
                            className="block font-label-sm text-label-sm text-clay hover:underline"
                            href={s.url}
                            key={si}
                          >
                            {STATUS_LABEL[s.status] ?? s.status} — {s.title}
                          </Link>
                        ))}
                      </div>
                    )}
                    {!turn.grounded && (
                      <Link
                        className="inline-block mt-4 font-label-sm text-label-sm text-clay uppercase tracking-widest hover:underline"
                        href="/share-a-news"
                      >
                        Submit this as a tip for human verification →
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="bg-cream border-2 border-ink-band rounded-xl rounded-bl-sm shadow-ink-sm p-4 font-body-md text-body-md text-body-ink opacity-60">
                    Checking...
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form className="flex gap-3" onSubmit={handleSubmit}>
        <input
          className="flex-1 bg-sand border-2 border-ink-band rounded-full px-5 py-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm"
          disabled={loading}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about a post or article..."
          type="text"
          value={question}
        />
        <button
          className="btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full text-ink-band disabled:opacity-60 shrink-0"
          disabled={loading || !question.trim()}
          type="submit"
        >
          {loading ? "..." : "Ask"}
        </button>
      </form>

      {showAuthPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-band/70 px-[26px]"
          onClick={() => setShowAuthPrompt(false)}
          role="presentation"
        >
          <div
            className="bg-cream border-[3px] border-ink-band rounded-2xl shadow-ink-lg p-8 max-w-[420px] w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="lock" className="text-[40px] text-clay mb-3" />
            <h2 className="font-headline-h2-mobile text-[26px] font-extrabold text-ink-band uppercase mb-3">
              Create an Account
            </h2>
            <p className="font-body-md text-body-md text-body-ink mb-6">
              You need a free Spread account to ask the AI. It only takes a moment.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                className="btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full text-ink-band"
                href="/signup"
              >
                Create an Account
              </Link>
              <Link
                className="font-label-sm text-label-sm text-clay uppercase tracking-widest hover:underline"
                href="/login"
              >
                Already have an account? Log in
              </Link>
              <button
                className="font-label-sm text-label-sm text-body-ink opacity-60 uppercase tracking-widest mt-2"
                onClick={() => setShowAuthPrompt(false)}
                type="button"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
