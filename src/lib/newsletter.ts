import { prisma } from "@/lib/prisma";

export type Subscriber = { email: string; subscribedAt: string };

export async function getSubscribers(): Promise<Subscriber[]> {
  return prisma.subscriber.findMany({ orderBy: { subscribedAt: "desc" } });
}

export async function addSubscriber(email: string): Promise<{ added: boolean }> {
  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) return { added: false };
  await prisma.subscriber.create({
    data: { email, subscribedAt: new Date().toISOString() },
  });
  return { added: true };
}

export async function removeSubscriber(email: string): Promise<void> {
  await prisma.subscriber.deleteMany({ where: { email } });
}

// Signed unsubscribe links: HMAC over the email using the Resend API key as
// secret, so a link can be verified without storing per-subscriber tokens.
async function unsubscribeSecret(): Promise<string> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return key;
}

async function hmacHex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function unsubscribeToken(email: string): Promise<string> {
  return hmacHex(await unsubscribeSecret(), email);
}

export async function verifyUnsubscribeToken(email: string, token: string): Promise<boolean> {
  try {
    const expected = await unsubscribeToken(email);
    return expected === token;
  } catch {
    return false;
  }
}
