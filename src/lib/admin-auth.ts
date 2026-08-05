export const ADMIN_COOKIE = "spread_admin";

function secret(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Add it to .env.local before using the admin panel."
    );
  }
  return password;
}

// Uses Web Crypto (globalThis.crypto.subtle) so this works identically in the
// Node.js runtime (API routes) and the Edge runtime (middleware).
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

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function checkPassword(input: string): Promise<boolean> {
  return constantTimeEqual(input, secret());
}

export async function sessionToken(): Promise<string> {
  return hmacHex(secret(), "spread-admin-session");
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const expected = await sessionToken();
    return constantTimeEqual(token, expected);
  } catch {
    return false;
  }
}
