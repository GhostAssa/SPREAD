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
  /** "editorial" (admin-authored, default) vs "community" (from a paid, AI-screened student submission) */
  source?: "editorial" | "community";
  submissionId?: string;
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

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  walletBalanceNaira: number;
  /** Manually toggled by admin for now — will become Paystack-webhook-driven later. */
  subscribed: boolean;
  /** Bumped on logout-everywhere/password change to invalidate old session cookies. */
  sessionVersion: number;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordHash">;

export type SubmissionStatus = "verified" | "rejected";

export type NewsSubmission = {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  body: string;
  evidenceNote: string;
  status: SubmissionStatus;
  aiReason: string;
  payoutNaira: number;
  submittedAt: string;
  articleSlug?: string;
  /** Set when an admin reverses the automatic AI verdict. */
  overriddenByAdmin?: boolean;
};

export type Comment = {
  id: string;
  articleSlug: string;
  userId: string;
  authorName: string;
  body: string;
  createdAt: string;
};
