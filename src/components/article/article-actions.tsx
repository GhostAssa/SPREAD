"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icon";

type ArticleActionsProps = {
  slug: string;
  title: string;
  excerpt: string;
  loggedIn: boolean;
  initiallyBookmarked: boolean;
};

export function ArticleActions({
  slug,
  title,
  excerpt,
  loggedIn,
  initiallyBookmarked,
}: ArticleActionsProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [pending, setPending] = useState(false);
  const [justShared, setJustShared] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: excerpt, url });
      } catch {
        // user cancelled the native share sheet — not an error
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setJustShared(true);
      setTimeout(() => setJustShared(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do without a permissions prompt
    }
  }

  async function handleBookmark() {
    if (!loggedIn) {
      setShowAuthPrompt(true);
      return;
    }
    if (pending) return;

    setPending(true);
    const previous = bookmarked;
    setBookmarked(!previous); // optimistic
    try {
      const res = await fetch(`/api/articles/${slug}/bookmark`, { method: "POST" });
      if (!res.ok) {
        setBookmarked(previous);
        return;
      }
      const data = await res.json();
      setBookmarked(data.bookmarked);
      router.refresh();
    } catch {
      setBookmarked(previous);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          aria-label={justShared ? "Link copied" : "Share this article"}
          className="w-10 h-10 rounded-full bg-sand flex items-center justify-center shadow-ink-sm border-2 border-ink-band hover:bg-primary-fixed transition-colors"
          onClick={handleShare}
          title={justShared ? "Link copied!" : "Share"}
          type="button"
        >
          <Icon name={justShared ? "check" : "share"} className={justShared ? "text-moss" : ""} />
        </button>
        <button
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark this article"}
          aria-pressed={bookmarked}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-ink-sm border-2 border-ink-band transition-colors disabled:opacity-60 ${
            bookmarked ? "bg-amber" : "bg-sand hover:bg-primary-fixed"
          }`}
          disabled={pending}
          onClick={handleBookmark}
          title={bookmarked ? "Saved" : "Save for later"}
          type="button"
        >
          <Icon name="bookmark" filled={bookmarked} />
        </button>
      </div>

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
              You need a free Spread account to save articles. It only takes a moment.
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
    </>
  );
}
