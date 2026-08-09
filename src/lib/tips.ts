import { prisma } from "@/lib/prisma";

export type Tip = {
  id: string;
  category: string;
  urgency: string;
  message: string;
  evidenceUrl?: string;
  receivedAt: string;
  userId?: string;
};

export async function getTips(): Promise<Tip[]> {
  const rows = await prisma.tip.findMany({ orderBy: { receivedAt: "desc" } });
  return rows.map((r) => ({
    ...r,
    evidenceUrl: r.evidenceUrl ?? undefined,
    userId: r.userId ?? undefined,
  }));
}

export async function addTip(tip: Tip): Promise<void> {
  await prisma.tip.create({
    data: { ...tip, evidenceUrl: tip.evidenceUrl ?? null, userId: tip.userId ?? null },
  });
}

export async function deleteTip(id: string): Promise<void> {
  await prisma.tip.deleteMany({ where: { id } });
}

export async function countTipsByUser(userId: string): Promise<number> {
  return prisma.tip.count({ where: { userId } });
}
