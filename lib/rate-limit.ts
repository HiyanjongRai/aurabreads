import "server-only";

const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter.
 * @param key   - Unique key (e.g. "ip:email" or "ip:register")
 * @param limit - Max attempts per window
 * @param windowMs - Window duration in milliseconds
 */
export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, resetAt: now + windowMs, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { success: false, resetAt: bucket.resetAt, remaining: 0 };
  }

  bucket.count += 1;
  return { success: true, resetAt: bucket.resetAt, remaining: limit - bucket.count };
}

/**
 * Login rate limit: 5 attempts per minute per IP+email.
 */
export function loginRateLimit(ip: string, email: string) {
  return rateLimit(`login:${ip}:${email}`, 5, 60_000);
}

/**
 * Register rate limit: 10 registrations per hour per IP.
 */
export function registerRateLimit(ip: string) {
  return rateLimit(`register:${ip}`, 10, 60 * 60_000);
}

/**
 * Refresh token rate limit: 20 refreshes per minute per IP.
 */
export function refreshRateLimit(ip: string) {
  return rateLimit(`refresh:${ip}`, 20, 60_000);
}
