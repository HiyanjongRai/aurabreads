import "server-only";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, resetAt: now + windowMs };
  }

  if (bucket.count >= limit) {
    return { success: false, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { success: true, resetAt: bucket.resetAt };
}
