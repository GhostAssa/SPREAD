import { prisma } from "@/lib/prisma";
import type { Comment } from "@/lib/types";

export async function getCommentsForArticle(articleSlug: string): Promise<Comment[]> {
  return prisma.comment.findMany({
    where: { articleSlug },
    orderBy: { createdAt: "desc" },
  });
}

export async function addComment(comment: Comment): Promise<void> {
  await prisma.comment.create({ data: comment });
}

export async function deleteComment(id: string): Promise<void> {
  await prisma.comment.deleteMany({ where: { id } });
}

export async function countCommentsByUser(userId: string): Promise<number> {
  return prisma.comment.count({ where: { userId } });
}
