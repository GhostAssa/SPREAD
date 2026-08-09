"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import type { Comment } from "@/lib/types";

type CommentSectionProps = {
  slug: string;
  comments: Comment[];
  loggedIn: boolean;
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function CommentSection({ slug, comments, loggedIn }: CommentSectionProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text || loading) return;

    if (!loggedIn) {
      setShowAuthPrompt(true);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/articles/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setBody("");
      router.refresh();
    } catch {
      setError("Couldn't post your comment. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="md:col-span-8 bg-cream p-8 md:p-12 shadow-ink-md border-2 border-ink-band rounded-xl">
      <h3 className="text-note font-note text-ink-band mb-6 flex items-center gap-2">
        <Icon name="forum" className="text-teal" />
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      <form className="mb-8 space-y-3" onSubmit={handleSubmit}>
        <textarea
          className="w-full bg-sand border-2 border-ink-band rounded-lg p-4 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm placeholder:text-ink-band/50"
          disabled={loading}
          onChange={(e) => setBody(e.target.value)}
          placeholder={loggedIn ? "Add a comment..." : "Log in to leave a comment..."}
          rows={3}
          value={body}
        />
        {error && <p className="font-label-sm text-label-sm text-error uppercase">{error}</p>}
        <button
          className="btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-6 py-3 rounded-full text-ink-band disabled:opacity-60"
          disabled={loading || !body.trim()}
          type="submit"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="font-body-md text-body-md text-body-ink opacity-60">
          No comments yet — be the first to say something.
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              className="bg-sand border-2 border-ink-band rounded-lg p-4 shadow-ink-sm"
              key={c.id}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-note text-note text-ink-band text-base">{c.authorName}</span>
                <span className="font-label-sm text-label-sm text-ink-band opacity-60 uppercase">
                  {timeAgo(c.createdAt)}
                </span>
              </div>
              <p className="font-body-md text-body-md text-body-ink whitespace-pre-wrap">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      )}

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
              You need a free Spread account to comment. It only takes a moment.
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
