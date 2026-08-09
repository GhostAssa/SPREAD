import nodeCrypto from "node:crypto";
import { cookies } from "next/headers";
import { getUserById } from "@/lib/users";
import type { User } from "@/lib/types";

export const SESSION_COOKIE = "spread_session";

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set. Add it to .env.local.");
  return s;
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

export async function createSessionToken(userId: string, sessionVersion: number): Promise<string> {
  const payload = `${userId}.${sessionVersion}`;
  const sig = await hmacHex(secret(), payload);
  return `${payload}.${sig}`;
}

async function verifySessionToken(token: string): Promise<{ userId: string; sessionVersion: number } | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, versionStr, sig] = parts;
  const sessionVersion = Number(versionStr);
  if (!userId || Number.isNaN(sessionVersion)) return null;

  const expected = await hmacHex(secret(), `${userId}.${sessionVersion}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !nodeCrypto.timingSafeEqual(a, b)) return null;

  return { userId, sessionVersion };
}

/** Server Component / Route Handler helper — reads the session cookie and loads the current user. */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const parsed = await verifySessionToken(token);
  if (!parsed) return null;

  const user = await getUserById(parsed.userId);
  if (!user || user.sessionVersion !== parsed.sessionVersion) return null;

  return user;
}
