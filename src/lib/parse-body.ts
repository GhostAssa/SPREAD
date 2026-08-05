import type { ArticleBlock } from "@/lib/types";

/**
 * Turns simple admin-authored text into article blocks.
 * Blank lines separate paragraphs. "## " starts a heading.
 * "> " starts a quote, optionally "> quote text — Attribution".
 * The very first paragraph becomes the lead.
 */
export function parseBody(raw: string): ArticleBlock[] {
  const chunks = raw
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter(Boolean);

  let sawLead = false;
  return chunks.map((chunk) => {
    if (chunk.startsWith("## ")) {
      return { type: "heading", text: chunk.slice(3).trim() };
    }
    if (chunk.startsWith("> ")) {
      const text = chunk.slice(2).trim();
      const [quote, attribution] = text.split(/\s+—\s+/);
      return { type: "quote", text: quote.trim(), attribution: attribution?.trim() };
    }
    if (!sawLead) {
      sawLead = true;
      return { type: "lead", text: chunk };
    }
    return { type: "paragraph", text: chunk };
  });
}

export function blocksToRaw(blocks: ArticleBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === "heading") return `## ${b.text}`;
      if (b.type === "quote") return `> ${b.text}${b.attribution ? ` — ${b.attribution}` : ""}`;
      return b.text;
    })
    .join("\n\n");
}
