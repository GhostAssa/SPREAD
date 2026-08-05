import fs from "node:fs";
import path from "node:path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "tips.json");

export type Tip = {
  id: string;
  category: string;
  urgency: string;
  message: string;
  evidenceUrl?: string;
  receivedAt: string;
};

export function getTips(): Tip[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

export function addTip(tip: Tip): void {
  const tips = getTips();
  tips.unshift(tip);
  fs.writeFileSync(DATA_PATH, JSON.stringify(tips, null, 2) + "\n", "utf-8");
}

export function deleteTip(id: string): void {
  fs.writeFileSync(
    DATA_PATH,
    JSON.stringify(
      getTips().filter((t) => t.id !== id),
      null,
      2
    ) + "\n",
    "utf-8"
  );
}
