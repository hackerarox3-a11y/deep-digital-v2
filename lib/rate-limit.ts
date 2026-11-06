type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();
const MAX_BUCKETS = 10_000;

export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
) {
  let bucket = buckets.get(key);

  if (bucket && bucket.resetAt <= now) {
    buckets.delete(key);
    bucket = undefined;
  }

  if (!bucket) {
    if (buckets.size >= MAX_BUCKETS) {
      for (const [bucketKey, value] of buckets) {
        if (value.resetAt <= now) buckets.delete(bucketKey);
      }
      if (buckets.size >= MAX_BUCKETS) {
        const earliestReset = Math.min(...Array.from(buckets.values(), (value) => value.resetAt));
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((earliestReset - now) / 1000)),
        };
      }
    }

    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
