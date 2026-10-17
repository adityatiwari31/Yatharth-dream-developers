import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getVillas } from "@/lib/data";

export const revalidate = 60; // cached, refreshed within a minute (and instantly after admin changes)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = ["", "/villas", "/how-to-buy", "/size-guide", "/location", "/about", "/reviews", "/contact"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const villas = (await getVillas()).map((v) => ({
    url: `${SITE_URL}/villas/${v.slug}`,
    lastModified: v.updatedAt ? new Date(v.updatedAt) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...fixed, ...villas];
}
