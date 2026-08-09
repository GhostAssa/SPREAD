import Groq from "groq-sdk";
import { getArticles } from "@/lib/articles";
import { getSubmissions } from "@/lib/submissions";

export type ScreeningResult =
  | { skipped: true; reason: string }
  | { skipped: false; verdict: "verify" | "reject"; reason: string };

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "did", "does", "do",
  "it", "this", "that", "of", "in", "on", "at", "to", "for", "and",
  "or", "about", "will", "has", "have", "had", "be", "been",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  let hits = 0;
  for (const w of a) if (b.has(w)) hits += 1;
  return hits;
}

/** Cheap, deterministic pre-check — catches obvious copy-paste before spending an AI call. */
async function findLikelyDuplicate(title: string, body: string): Promise<string | null> {
  const submissionWords = tokenize(`${title} ${body}`);
  if (submissionWords.size === 0) return null;

  const [articles, submissions] = await Promise.all([getArticles(), getSubmissions()]);

  const existing = [
    ...articles.map((a) => ({ title: a.title, text: `${a.title} ${a.excerpt}` })),
    ...submissions
      .filter((s) => s.status === "verified")
      .map((s) => ({ title: s.title, text: `${s.title} ${s.body}` })),
  ];

  for (const item of existing) {
    const score = overlapScore(submissionWords, tokenize(item.text));
    // High overlap relative to submission length suggests a near-duplicate/copy.
    if (score >= Math.min(8, submissionWords.size * 0.6)) {
      return item.title;
    }
  }
  return null;
}

const SYSTEM_PROMPT = `You are Spread's submission screener, for a citizen-journalism program at the
University of Ibadan. Students submit news tips and are paid a real cash reward if their
submission passes screening — so a wrong "verify" costs real money.

You do NOT have internet access and cannot confirm real-world facts. You ARE screening for:
1. Coherence and specificity — real reporting has concrete, checkable-sounding details (names,
   places, dates, numbers). Vague, generic, or evasive writing should be rejected.
2. Credible-sounding evidence or sourcing — a named source, a document, an official statement,
   or clear first-hand observation described by the submitter. No sourcing at all is a red flag.
3. Not spam, gibberish, advertising, hate speech, or content that reads as obviously fabricated
   or satirical presented as real news.
4. Not a near-duplicate of an existing story (you will be told if one was detected).

Default to REJECT when uncertain — a missed real story can be resubmitted with more detail; a
wrongly-paid fake story cannot be undone.

Respond in EXACTLY this format, nothing else:
VERDICT: VERIFY
REASON: <one or two sentences, written directly to the student who submitted it>

or

VERDICT: REJECT
REASON: <one or two sentences, written directly to the student who submitted it>`;

export async function screenSubmission(
  title: string,
  body: string,
  evidenceNote: string
): Promise<ScreeningResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { skipped: true, reason: "GROQ_API_KEY is not set in .env.local" };
  }

  const duplicateOf = await findLikelyDuplicate(title, body);

  const groq = new Groq({ apiKey });
  const userContent = [
    `TITLE: ${title}`,
    `BODY: ${body}`,
    `SUBMITTER'S EVIDENCE/SOURCING NOTE: ${evidenceNote || "(none provided)"}`,
    duplicateOf ? `\nNOTE: This closely overlaps with an existing story: "${duplicateOf}". Treat as a likely duplicate unless it clearly adds new, distinct information.` : "",
  ].join("\n");

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    temperature: 0.2,
    max_tokens: 200,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "";
  const verdictMatch = raw.match(/VERDICT:\s*(VERIFY|REJECT)/i);
  const reasonMatch = raw.match(/REASON:\s*([\s\S]+)/i);

  if (!verdictMatch) {
    // Fail closed — an unparsable AI response should never result in a payout.
    return { skipped: false, verdict: "reject", reason: "Automated screening was inconclusive. Please try resubmitting with more detail and sourcing." };
  }

  return {
    skipped: false,
    verdict: verdictMatch[1].toLowerCase() as "verify" | "reject",
    reason: reasonMatch?.[1]?.trim() ?? raw,
  };
}
