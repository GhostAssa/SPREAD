import { getArticles } from "@/lib/articles";
import { getFacts } from "@/lib/facts";

export type KnowledgeMatch = {
  type: "fact" | "article";
  title: string;
  summary: string;
  status: "verified" | "debunked" | "reported";
  url: string;
  score: number;
};

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "did", "does", "do",
  "it", "this", "that", "of", "in", "on", "at", "to", "for", "and",
  "or", "true", "false", "real", "fake", "about", "will", "has",
  "have", "had", "be", "been", "i", "you", "we", "they",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function score(queryWords: string[], text: string): number {
  const targetWords = new Set(tokenize(text));
  let hits = 0;
  for (const w of queryWords) {
    if (targetWords.has(w)) hits += 1;
  }
  return hits;
}

/**
 * Naive keyword-overlap search over the site's own facts/articles.
 * Deliberately not a vector/embedding search — the dataset is tiny, and
 * plain bag-of-words overlap is enough to decide "do we have anything on
 * this claim at all" without adding an embeddings dependency or API call.
 */
export async function searchKnowledge(question: string, limit = 3): Promise<KnowledgeMatch[]> {
  const queryWords = tokenize(question);
  if (queryWords.length === 0) return [];

  const matches: KnowledgeMatch[] = [];

  for (const fact of await getFacts()) {
    const s = score(queryWords, `${fact.title} ${fact.body} ${fact.category}`);
    if (s > 0) {
      matches.push({
        type: "fact",
        title: fact.title,
        summary: fact.body,
        status: fact.status,
        url: "/#confirmed-facts",
        score: s,
      });
    }
  }

  for (const article of await getArticles()) {
    const s = score(queryWords, `${article.title} ${article.excerpt} ${article.category}`);
    if (s > 0) {
      matches.push({
        type: "article",
        title: article.title,
        summary: article.excerpt,
        status: "reported",
        url: `/news/${article.slug}`,
        score: s,
      });
    }
  }

  // Require at least 2 overlapping meaningful words so a single coincidental
  // match (e.g. both mention "campus") doesn't get treated as grounded fact.
  return matches
    .filter((m) => m.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
