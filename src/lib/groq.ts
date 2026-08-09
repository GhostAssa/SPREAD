import Groq from "groq-sdk";
import type { KnowledgeMatch } from "@/lib/knowledge-search";

export type FactCheckResult =
  | { skipped: true; reason: string }
  | {
      skipped: false;
      answer: string;
      grounded: boolean;
      sources: Array<{ title: string; url: string; status: string }>;
    };

const GROUNDED_SYSTEM_PROMPT = `You are Spread's clarification assistant, for the University of Ibadan campus community.
A reader wants more detail or explanation about a post or article on Spread.

You have been given CONTEXT below: the relevant post(s)/article(s) from Spread's own records.
Treat this CONTEXT as the authoritative source for anything it covers — never contradict it, and
never present outside knowledge as if Spread verified it.

For the parts of the question the CONTEXT doesn't cover, you MAY use your own general knowledge
to help explain and clarify — that's expected and useful. When you do, say so plainly (e.g. "Spread
hasn't reported on X specifically, but generally speaking...") so the reader always knows what's
from Spread's own reporting versus general background. Be honest about uncertainty in the
general-knowledge parts — don't guess at specifics like names, dates, or figures you don't
actually know.

Explain and clarify in plain language: give background, context, and detail the original post
may have left out. If the item was VERIFIED TRUE or DEBUNKED, mention that status naturally
while explaining. Reference the item by name. Keep the answer conversational and helpful
(2-6 sentences).`;

const UNGROUNDED_SYSTEM_PROMPT = `You are Spread's clarification assistant, for the University of Ibadan campus community.
A reader asked something Spread has no matching post/article on record for.

Give your best direct, complete answer using your own general knowledge and reasoning — don't
hedge or add disclaimers for things you're actually confident about (general concepts, history,
how things typically work, well-established facts). Answer like a knowledgeable person would,
not like a cautious legal document.

The only thing to be honest about is specifics you genuinely don't know or can't verify — mainly
exact current numbers, dates, or who currently holds a specific role, since those change over
time and you have no way to confirm today's answer. If (and only if) that applies, say so in
one short clause, not a paragraph, and keep answering the rest of the question normally.

Only suggest the reader submit a tip if the question is clearly about a specific recent campus
event, incident, or rumor Spread could plausibly go verify and report on — not for general
knowledge questions. Don't mention tips otherwise.

Keep the answer conversational, direct, and complete (2-5 sentences). Don't use a fixed opening
phrase — just answer naturally.`;

export async function askFactChecker(
  question: string,
  matches: KnowledgeMatch[]
): Promise<FactCheckResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { skipped: true, reason: "GROQ_API_KEY is not set in .env.local" };
  }

  const grounded = matches.length > 0;
  const groq = new Groq({ apiKey });

  const contextBlock = grounded
    ? matches
        .map(
          (m, i) =>
            `[${i + 1}] (${m.status.toUpperCase()}, ${m.type}) "${m.title}": ${m.summary}`
        )
        .join("\n")
    : "";

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: grounded ? GROUNDED_SYSTEM_PROMPT : UNGROUNDED_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: grounded
          ? `CONTEXT:\n${contextBlock}\n\nQUESTION: ${question}`
          : `QUESTION: ${question}`,
      },
    ],
  });

  const answer = completion.choices[0]?.message?.content?.trim();
  if (!answer) {
    return { skipped: true, reason: "Groq returned an empty response" };
  }

  return {
    skipped: false,
    answer,
    grounded,
    sources: matches.map((m) => ({ title: m.title, url: m.url, status: m.status })),
  };
}
