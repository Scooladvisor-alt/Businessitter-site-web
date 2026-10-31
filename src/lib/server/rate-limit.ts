/**
 * Limitation de débit simple, en mémoire, par clé (adresse IP).
 * Suffisant comme première barrière ; sur une infrastructure serverless,
 * chaque instance possède sa propre mémoire. Pour une protection
 * mutualisée, brancher un stockage partagé (ex. Upstash Redis) — voir README.
 */

const buckets = new Map<string, number[]>();
let lastSweep = Date.now();

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 10 * 60 * 1000 }: { limit?: number; windowMs?: number } = {},
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  if (now - lastSweep > windowMs) {
    for (const [k, hits] of buckets) {
      if (hits.every((t) => now - t > windowMs)) buckets.delete(k);
    }
    lastSweep = now;
  }

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    const oldest = hits[0] ?? now;
    buckets.set(key, hits);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }
  hits.push(now);
  buckets.set(key, hits);
  return { allowed: true, retryAfterSeconds: 0 };
}
