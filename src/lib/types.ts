export type ChipColor = "teal" | "clay" | "plum" | "moss" | "indigo" | "pink";

export type ArticleBlock =
  | { type: "lead"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; attribution?: string };

export type Article = {
  slug: string;
  size: "feature" | "compact";
  theme: "light" | "dark";
  category: string;
  chipColor: ChipColor;
  verified: boolean;
  title: string;
  excerpt: string;
  authorName: string;
  authorAvatarUrl: string;
  /** freeform label, e.g. "Oct 24, 2024" — shown on the article detail page */
  publishedAtLabel: string;
  /** freeform label, e.g. "2 Hours Ago" — shown on homepage/listing cards */
  timeAgoLabel: string;
  heroImageUrl?: string;
  heroImageAlt: string;
  body: ArticleBlock[];
  breakdown: string[];
  relatedSlug?: string;
};

export type FactStatus = "verified" | "debunked";

export type Fact = {
  id: string;
  status: FactStatus;
  category: string;
  chipColor: ChipColor;
  title: string;
  body: string;
  sources: string[];
};

export type CampusEvent = {
  slug: string;
  title: string;
  date: string; // ISO date
  location: string;
  category: string;
  chipColor: ChipColor;
  description: string;
};
