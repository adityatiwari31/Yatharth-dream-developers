// Jaipur buyers talk in gaj (square yards); drawings use feet and metres.

export const SQFT_PER_GAJ = 9;
export const SQM_PER_SQFT = 0.09290304;
export const SQM_PER_GAJ = 0.83612736;

export function fmt(n: number, max = 2) {
  if (!isFinite(n)) return "–";
  return n.toLocaleString("en-IN", { maximumFractionDigits: Math.abs(n) < 1 ? 4 : max });
}

/** Plot facts from feet, written the Jaipur way: front (width) × depth (length). `gajOverride` wins when set. */
export function plotFacts(lengthFt: number, widthFt: number, gajOverride?: number) {
  const sqft = lengthFt > 0 && widthFt > 0 ? lengthFt * widthFt : gajOverride ? gajOverride * SQFT_PER_GAJ : 0;
  const gaj = gajOverride && gajOverride > 0 ? gajOverride : sqft / SQFT_PER_GAJ;
  const sqm = sqft * SQM_PER_SQFT;
  return {
    sqft,
    gaj,
    sqm,
    sizeText: lengthFt > 0 && widthFt > 0 ? `${fmt(widthFt)} ft × ${fmt(lengthFt)} ft` : "",
    gajText: gaj > 0 ? `${Number.isInteger(gaj) ? gaj : "about " + fmt(gaj, 1)} gaj` : "",
    sqftText: sqft > 0 ? `${fmt(sqft, 0)} sq ft` : "",
    sqmText: sqm > 0 ? `${fmt(sqm, 1)} sq m` : "",
  };
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
