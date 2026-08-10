import 'server-only';

/**
 * Simple in-memory rate limiter (fixed window).
 *
 * Purpose: protect the order, upload and seed endpoints from brute force and
 * abuse.
 *
 * KNOWN LIMITS — trade-offs accepted on purpose:
 *  - The counter lives in process memory. Multiple server instances (every
 *    region/lambda on Vercel) keep their own counter, so the effective limit
 *    is multiplied by the instance count.
 *  - Restarting the server resets the counter.
 *
 * That is enough for a single-instance deployment at moderate traffic. For a
 * distributed, exact limit, swap the body of `check()` for a shared counter
 * such as Upstash Redis; the call sites stay the same.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Sweep expired entries occasionally so memory does not grow without bound. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  /** Seconds to wait before retrying once the limit is hit */
  retryAfter: number;
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return { ok: true, remaining: limit - bucket.count, retryAfter: 0 };
}

/**
 * Client identity. Behind Vercel or Cloudflare the real IP is the first value
 * of the `x-forwarded-for` header. That header can be spoofed, so rate
 * limiting is an extra obstacle rather than a security layer on its own.
 */
export function clientKey(request: Request, scope: string) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'bilinmeyen';
  return `${scope}:${ip}`;
}

/** 429 response with the standard `Retry-After` header. */
export function tooManyRequests(retryAfter: number) {
  return Response.json(
    {
      ok: false,
      error: `Çok fazla istek gönderildi. Lütfen ${retryAfter} saniye sonra tekrar deneyin.`,
    },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  );
}
