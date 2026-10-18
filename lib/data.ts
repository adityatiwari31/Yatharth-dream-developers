import { connectDB, hasDatabase } from "@/lib/mongodb";
import { Villa, toVillaJSON, type VillaJSON, type VillaStatus } from "@/lib/models/Villa";
import { Review, toReviewJSON, type ReviewJSON } from "@/lib/models/Review";
import { Notice, toNoticeJSON } from "@/lib/models/Notice";
import { Settings, toFounderJSON } from "@/lib/models/Settings";
import { FOUNDERS } from "@/lib/config";
import type { FounderJSON, NoticeJSON } from "@/lib/villaTypes";

// Read helpers for pages. They never throw: when the database is not configured
// or unreachable, pages render their empty states instead of crashing.

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasDatabase) return fallback;
  try {
    await connectDB();
    return await fn();
  } catch (err) {
    console.error("[data]", err);
    return fallback;
  }
}

export const villaSort = { featured: -1, order: 1, createdAt: -1 } as const;

export function getVillas(opts: { status?: VillaStatus; limit?: number } = {}) {
  return safe(async () => {
    const q = opts.status ? { status: opts.status } : {};
    const docs = await Villa.find(q).sort(villaSort).limit(opts.limit ?? 0).lean();
    return docs.map(toVillaJSON);
  }, [] as VillaJSON[]);
}

export function getHomeVillas(limit: number) {
  return safe(async () => {
    const docs = await Villa.find().sort(villaSort).limit(limit).lean();
    return docs.map(toVillaJSON);
  }, [] as VillaJSON[]);
}

export function getVillaBySlug(slug: string) {
  return safe(async () => {
    const doc = await Villa.findOne({ slug }).lean();
    return doc ? toVillaJSON(doc) : null;
  }, null as VillaJSON | null);
}

export function getApprovedReviews(limit = 0) {
  return safe(async () => {
    const docs = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(limit).lean();
    return docs.map(toReviewJSON);
  }, [] as ReviewJSON[]);
}

export function getReviewStats() {
  return safe(
    async () => {
      const ratings = await Review.find({ approved: true }).select("rating").lean();
      if (!ratings.length) return { count: 0, avg: 0 };
      const avg = ratings.reduce((a, r) => a + (r.rating ?? 0), 0) / ratings.length;
      return { count: ratings.length, avg: Math.round(avg * 10) / 10 };
    },
    { count: 0, avg: 0 },
  );
}

/** Lines for the floating "Upcoming" bar on the home page (active ones only). */
export function getActiveNotices() {
  return safe(async () => {
    const docs = await Notice.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean();
    return docs.map(toNoticeJSON);
  }, [] as NoticeJSON[]);
}

/** The founders from lib/config.ts, in the shape the About page uses. Shown until the owner saves founders in /admin. */
export const DEFAULT_FOUNDERS: FounderJSON[] = FOUNDERS.map((f) => ({
  name: f.name,
  role: f.role,
  bio: f.bio,
  photo: { url: f.photo, publicId: "" },
}));

export function getFounders() {
  return safe(async () => {
    const doc = await Settings.findOne({ key: "site" }).lean();
    const list = (doc?.founders ?? []).map(toFounderJSON).filter((f) => f.name);
    return list.length ? list : DEFAULT_FOUNDERS;
  }, DEFAULT_FOUNDERS);
}
