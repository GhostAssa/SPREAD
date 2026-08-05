"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

const BOOKMARKS_KEY = "spread:bookmarks";

function readBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

type ArticleActionsProps = {
  slug: string;
  title: string;
  excerpt: string;
};

export function ArticleActions({ slug, title, excerpt }: ArticleActionsProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [justShared, setJustShared] = useState(false);

  useEffect(() => {
    setBookmarked(readBookmarks().includes(slug));
  }, [slug]);

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

  function handleBookmark() {
    const current = readBookmarks();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    setBookmarked(next.includes(slug));
  }

  return (
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
        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-ink-sm border-2 border-ink-band transition-colors ${
          bookmarked ? "bg-amber" : "bg-sand hover:bg-primary-fixed"
        }`}
        onClick={handleBookmark}
        title={bookmarked ? "Saved" : "Save for later"}
        type="button"
      >
        <Icon name="bookmark" filled={bookmarked} />
      </button>
    </div>
  );
}
