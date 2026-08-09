import { prisma } from "@/lib/prisma";
import type { ChipColor, Fact, FactStatus } from "@/lib/types";

export async function getFacts(): Promise<Fact[]> {
  const rows = await prisma.fact.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    status: r.status as FactStatus,
    category: r.category,
    chipColor: r.chipColor as ChipColor,
    title: r.title,
    body: r.body,
    sources: r.sources,
  }));
}
