import { prisma } from "@/lib/prisma";
import type { CampusEvent, ChipColor } from "@/lib/types";

export async function getEvents(): Promise<CampusEvent[]> {
  const rows = await prisma.campusEvent.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    date: r.date,
    location: r.location,
    category: r.category,
    chipColor: r.chipColor as ChipColor,
    description: r.description,
  }));
}
