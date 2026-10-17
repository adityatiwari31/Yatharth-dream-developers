import { VILLA_STATUSES, type VillaStatus } from "@/lib/models/Villa";
import { bool, isHttpUrl, num, str, strList } from "@/lib/validate";
import { slugify } from "@/lib/units";

/** Turn a form/JSON body into the fields we store. Shared by create and update. */
export function villaFromBody(body: any) {
  const name = str(body.name, 160);
  const status: VillaStatus = VILLA_STATUSES.includes(body.status) ? body.status : "design";
  const images: { url: string; publicId: string; alt: string }[] = Array.isArray(body.images)
    ? body.images
        .map((i: any) => ({ url: str(i?.url, 600), publicId: str(i?.publicId, 300), alt: str(i?.alt, 300) }))
        .filter((i: any) => isHttpUrl(i.url) || i.url.startsWith("/"))
        .slice(0, 30)
    : [];
  const rooms: { label: string; size: string }[] = Array.isArray(body.rooms)
    ? body.rooms.map((r: any) => ({ label: str(r?.label, 120), size: str(r?.size, 120) })).filter((r: any) => r.label && r.size).slice(0, 40)
    : [];
  return {
    name,
    slug: slugify(str(body.slug, 120) || name),
    status,
    tagline: str(body.tagline, 200),
    description: str(body.description, 6000),
    facing: str(body.facing, 40),
    plotLength: num(body.plotLength),
    plotWidth: num(body.plotWidth),
    plotGaj: num(body.plotGaj),
    floors: str(body.floors, 120),
    bedrooms: Math.max(0, Math.round(num(body.bedrooms))),
    highlights: strList(body.highlights),
    rooms,
    location: str(body.location, 200),
    mapUrl: isHttpUrl(str(body.mapUrl, 600)) ? str(body.mapUrl, 600) : "",
    images,
    videoUrl: isHttpUrl(str(body.videoUrl, 600)) ? str(body.videoUrl, 600) : "",
    pdfUrl: isHttpUrl(str(body.pdfUrl, 600)) ? str(body.pdfUrl, 600) : "",
    featured: bool(body.featured),
    order: num(body.order),
  };
}

