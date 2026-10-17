import { revalidatePath } from "next/cache";

// Public pages are cached (ISR). Call this after any change in /admin so
// visitors see the new villa or review straight away instead of after a minute.
export function revalidateSite() {
  for (const p of ["/", "/villas", "/location", "/reviews", "/sitemap.xml"]) revalidatePath(p);
  revalidatePath("/villas/[slug]", "page");
}
