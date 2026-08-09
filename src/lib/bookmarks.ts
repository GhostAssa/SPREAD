import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

export async function isBookmarked(userId: string, articleSlug: string): Promise<boolean> {
  const row = await prisma.bookmark.findUnique({
    where: { userId_articleSlug: { userId, articleSlug } },
  });
  return Boolean(row);
}

export async function getBookmarkedSlugs(userId: string): Promise<string[]> {
  const rows = await prisma.bookmark.findMany({ where: { userId }, select: { articleSlug: true } });
  return rows.map((r) => r.articleSlug);
}

export async function countBookmarks(userId: string): Promise<number> {
  return prisma.bookmark.count({ where: { userId } });
}

/** Toggles a bookmark and returns the new state. */
export async function toggleBookmark(userId: string, articleSlug: string): Promise<boolean> {
  const existing = await prisma.bookmark.findUnique({
    where: { userId_articleSlug: { userId, articleSlug } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return false;
  }

  await prisma.bookmark.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      articleSlug,
      createdAt: new Date().toISOString(),
    },
  });
  return true;
}
