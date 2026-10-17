// Custom image loader for next/image.
// Every <Image> asks Cloudinary for a version resized to the width the visitor's
// screen needs (c_limit never enlarges; f_auto/q_auto pick the best format and quality).
// Wired up in next.config.ts: images: { loader: "custom", loaderFile: "./lib/cloudinaryLoader.ts" }

const UPLOAD_MARKER = "/upload/";

export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const markerAt = src.indexOf(UPLOAD_MARKER);
  if (!src.includes("res.cloudinary.com") || markerAt === -1) return src;

  const head = src.slice(0, markerAt + UPLOAD_MARKER.length);
  const tail = src.slice(markerAt + UPLOAD_MARKER.length);
  const resize = `c_limit,w_${width},q_${quality || "auto"},f_auto`;

  // Insert our step just before the "v123…" version segment so it runs after any
  // transformation already present in the URL (for example a crop on the hero image).
  const segments = tail.split("/");
  const versionAt = segments.findIndex((s) => /^v\d+$/.test(s));
  if (versionAt === -1) return `${head}${resize}/${tail}`;
  segments.splice(versionAt, 0, resize);
  return `${head}${segments.join("/")}`;
}
