import fs from "node:fs";
import path from "node:path";
import type { Fact } from "@/lib/types";

const DATA_PATH = path.join(process.cwd(), "src", "data", "facts.json");

export function getFacts(): Fact[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Fact[];
}
