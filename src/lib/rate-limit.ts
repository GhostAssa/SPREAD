// Best-effort in-memory rate limiter. Resets on server restart and doesn't
// share state across serverless instances — fine for a single small deployment,
// not a substitute for a real rate limiter (e.g. Upstash) at scale.
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > max;
}
