// Small helpers for request validation. No library needed for a site this size.

export function str(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function num(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : fallback;
}

export function bool(v: unknown): boolean {
  return v === true || v === "true" || v === "on" || v === "1";
}

export function strList(v: unknown, max = 40): string[] {
  if (Array.isArray(v)) return v.map((x) => str(x, 300)).filter(Boolean).slice(0, max);
  if (typeof v === "string") return v.split(/\r?\n/).map((x) => x.trim()).filter(Boolean).slice(0, max);
  return [];
}

export function isHttpUrl(v: string) {
  return /^https?:\/\//i.test(v);
}

// Very small in-memory rate limit (per process). Enough to stop a form being
// hammered; resets when the server restarts.
const hits = new Map<string, { n: number; t: number }>();
export function rateLimited(key: string, max = 6, windowMs = 60_000) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.t > windowMs) {
    hits.set(key, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > max;
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}
