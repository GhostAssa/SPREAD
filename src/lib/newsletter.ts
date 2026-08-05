import fs from "node:fs";
import path from "node:path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "newsletter-subscribers.json");

export type Subscriber = { email: string; subscribedAt: string };

export function getSubscribers(): Subscriber[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function writeSubscribers(subscribers: Subscriber[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(subscribers, null, 2) + "\n", "utf-8");
}

export function addSubscriber(email: string): { added: boolean } {
  const subscribers = getSubscribers();
  if (subscribers.some((s) => s.email === email)) return { added: false };
  subscribers.unshift({ email, subscribedAt: new Date().toISOString() });
  writeSubscribers(subscribers);
  return { added: true };
}

export function removeSubscriber(email: string): void {
  writeSubscribers(getSubscribers().filter((s) => s.email !== email));
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
