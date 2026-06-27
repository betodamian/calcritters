// Lightweight in-memory rate limiter to keep the public chat endpoint from being
// hammered (and to cap model spend). This is per-process, so on a multi-instance
// or serverless deployment it is a soft guard rather than a global limit; for a
// hard limit, back it with a shared store such as Upstash Redis.

interface Bucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets, when blocked. */
  retryAfter: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

// Occasionally drop expired buckets so the map does not grow without bound.
function sweep() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

if (typeof setInterval !== "undefined") {
  const timer = setInterval(sweep, WINDOW_MS);
  // Don't keep the process alive just for cleanup.
  if (typeof timer === "object" && timer && "unref" in timer) {
    (timer as { unref: () => void }).unref();
  }
}
