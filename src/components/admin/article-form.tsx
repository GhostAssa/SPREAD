"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { parseBody, blocksToRaw } from "@/lib/parse-body";
import { slugify } from "@/lib/slugify";
import type { Article, ChipColor } from "@/lib/types";

const CHIP_COLORS: ChipColor[] = ["teal", "clay", "plum", "moss", "indigo", "pink"];
const PLACEHOLDER_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzmAz77kxRht8bTxxgu70Wi5sgCi8teW3X0gmk4DA136H-2pk6rV4qkeqkU5mEJq8R2gWybgSZxPyOUoy0JaH6z78S-gFFeUhoXLd37VYBM2ZxqFCQMmYq5CcwPq5g8tPWEbOXqQ7Iv-0NvrAYJjBaEJz-d9y9UWuT8V70Mb9pc8HpU0jL1Uygv5zu_13tZlpNMxK4BiGk1BH8SoSIhPZcz7BEBpsaK5bIl9LLNNGPXyUXDde2UW4";

type ArticleFormProps = {
  initialArticle?: Article;
  otherArticles: Array<{ slug: string; title: string }>;
};

export function ArticleForm({ initialArticle, otherArticles }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialArticle);
  const [title, setTitle] = useState(initialArticle?.title ?? "");
  const [slug, setSlug] = useState(initialArticle?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const data = new FormData(e.currentTarget);
    const bodyRaw = String(data.get("body") ?? "");
    const breakdownRaw = String(data.get("breakdown") ?? "");
    const relatedSlug = String(data.get("relatedSlug") ?? "");

    const article: Article = {
      slug,
      title,
      size: data.get("size") as Article["size"],
      theme: data.get("theme") as Article["theme"],
      category: String(data.get("category") ?? ""),
      chipColor: data.get("chipColor") as ChipColor,
      verified: data.get("verified") === "on",
      excerpt: String(data.get("excerpt") ?? ""),
      authorName: String(data.get("authorName") ?? ""),
      authorAvatarUrl: String(data.get("authorAvatarUrl") ?? "") || PLACEHOLDER_AVATAR,
      publishedAtLabel: String(data.get("publishedAtLabel") ?? ""),
      timeAgoLabel: String(data.get("timeAgoLabel") ?? ""),
      heroImageUrl: String(data.get("heroImageUrl") ?? "") || undefined,
      heroImageAlt: String(data.get("heroImageAlt") ?? ""),
      body: parseBody(bodyRaw),
      breakdown: breakdownRaw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      relatedSlug: relatedSlug || undefined,
    };

    if (!article.slug || !article.title) {
      setError("Title and slug are required.");
      setSaving(false);
      return;
    }

    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
    });

    if (!res.ok) {
      setError("Failed to save article.");
      setSaving(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {error && <p className="font-label-sm text-label-sm text-error uppercase">{error}</p>}

      <Field label="Title">
        <input
          className={inputClass}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          required
          type="text"
          value={title}
        />
      </Field>

      <Field label="Slug (URL: /news/…)">
        <input
          className={inputClass}
          disabled={isEditing}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          required
          type="text"
          value={slug}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Field label="Category">
          <input className={inputClass} defaultValue={initialArticle?.category} name="category" required type="text" />
        </Field>
        <Field label="Chip Color">
          <select className={inputClass} defaultValue={initialArticle?.chipColor ?? "clay"} name="chipColor">
            {CHIP_COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Homepage Slot">
          <select className={inputClass} defaultValue={initialArticle?.size ?? "compact"} name="size">
            <option value="feature">Feature (large card)</option>
            <option value="compact">Compact (small card)</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Field label="Card Theme">
          <select className={inputClass} defaultValue={initialArticle?.theme ?? "light"} name="theme">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </Field>
        <Field label="Human Verified?">
          <div className="flex items-center h-full pt-2">
            <input
              className="w-5 h-5"
              defaultChecked={initialArticle?.verified ?? true}
              id="verified"
              name="verified"
              type="checkbox"
            />
            <label className="ml-2 font-body-md text-body-md" htmlFor="verified">
              Show verified badge
            </label>
          </div>
        </Field>
        <Field label="Related Article">
          <select className={inputClass} defaultValue={initialArticle?.relatedSlug ?? ""} name="relatedSlug">
            <option value="">None</option>
            {otherArticles.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Excerpt (used in cards)">
        <textarea className={inputClass} defaultValue={initialArticle?.excerpt} name="excerpt" required rows={2} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Author Name">
          <input className={inputClass} defaultValue={initialArticle?.authorName} name="authorName" required type="text" />
        </Field>
        <Field label="Author Avatar URL (optional)">
          <input className={inputClass} defaultValue={initialArticle?.authorAvatarUrl} name="authorAvatarUrl" type="text" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label='Published Label (e.g. "Oct 24, 2024")'>
          <input className={inputClass} defaultValue={initialArticle?.publishedAtLabel} name="publishedAtLabel" required type="text" />
        </Field>
        <Field label='Time Ago Label (e.g. "2 Hours Ago")'>
          <input className={inputClass} defaultValue={initialArticle?.timeAgoLabel} name="timeAgoLabel" required type="text" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Hero Image URL (optional — leave blank for a text-only card)">
          <input className={inputClass} defaultValue={initialArticle?.heroImageUrl} name="heroImageUrl" type="text" />
        </Field>
        <Field label="Hero Image Alt Text">
          <input className={inputClass} defaultValue={initialArticle?.heroImageAlt} name="heroImageAlt" type="text" />
        </Field>
      </div>

      <Field label={'Body — blank line = new paragraph, "## " = heading, "> quote — Attribution" = pull quote'}>
        <textarea
          className={`${inputClass} font-mono text-sm`}
          defaultValue={initialArticle ? blocksToRaw(initialArticle.body) : ""}
          name="body"
          required
          rows={14}
        />
      </Field>

      <Field label="The Breakdown — one point per line">
        <textarea
          className={inputClass}
          defaultValue={initialArticle?.breakdown.join("\n")}
          name="breakdown"
          rows={4}
        />
      </Field>

      <button
        className="w-full btn-primary font-eyebrow text-eyebrow uppercase tracking-widest px-8 py-5 rounded-xl text-ink-band text-lg disabled:opacity-60"
        disabled={saving}
        type="submit"
      >
        {saving ? "Saving..." : isEditing ? "Save Changes" : "Publish Article"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full bg-sand border-2 border-ink-band rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-amber shadow-sm";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block font-eyebrow text-eyebrow text-ink-band uppercase mb-2">{label}</label>
      {children}
    </div>
  );
}
