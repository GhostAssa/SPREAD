import fs from "node:fs";
import path from "node:path";
import type { CampusEvent } from "@/lib/types";

const DATA_PATH = path.join(process.cwd(), "src", "data", "events.json");

export function getEvents(): CampusEvent[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as CampusEvent[];
}
