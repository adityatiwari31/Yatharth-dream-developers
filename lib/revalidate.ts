import { revalidatePath } from "next/cache";

// Public pages are cached (ISR). Call this after any change in /admin so
// visitors see the new villa, review, notice or founder straight away.
export function revalidateSite() {
  for (const p of ["/", "/villas", "/location", "/reviews", "/about", "/sitemap.xml"]) revalidatePath(p);
  revalidatePath("/villas/[slug]", "page");
}
