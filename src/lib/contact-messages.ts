import { prisma } from "@/lib/prisma";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
};

export async function addContactMessage(message: ContactMessage): Promise<void> {
  await prisma.contactMessage.create({ data: message });
}
