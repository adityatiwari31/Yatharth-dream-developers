import { promises as fs } from "fs";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import { Villa } from "@/lib/models/Villa";
import { isAuthorized, unauthorized } from "@/lib/auth";
import { revalidateSite } from "@/lib/revalidate";
import { hasCloudinary, uploadBuffer } from "@/lib/cloudinary";
import { SEED_VILLAS } from "@/lib/seedData";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Admin: import the starter villas from the old website. Pictures in public/seed are
 * uploaded to Cloudinary (folder ydd/seed) and one listing is created per villa.
 * Villas whose slug already exists are skipped, so running it twice is safe.
 */
export async function POST(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  if (!hasCloudinary) return Response.json({ error: "Cloudinary keys are missing, so the pictures cannot be uploaded." }, { status: 500 });

  const dir = path.join(process.cwd(), "public", "seed");
  const created: string[] = [];
  const skipped: string[] = [];
  const problems: string[] = [];

  try {
    await connectDB();
    for (const seed of SEED_VILLAS) {
      if (await Villa.exists({ slug: seed.slug })) {
        skipped.push(seed.name);
        continue;
      }
      const images: { url: string; publicId: string; alt: string }[] = [];
      for (const img of seed.images) {
        try {
          const buf = await fs.readFile(path.join(dir, img.file));
          const up = await uploadBuffer(buf, { folder: "ydd/seed", publicId: img.file.replace(/\.[a-z0-9]+$/i, ""), resourceType: "image" });
          images.push({ url: up.url, publicId: up.publicId, alt: img.alt });
        } catch (e: any) {
          problems.push(`${seed.name}: ${img.file} (${e?.message ?? "upload failed"})`);
        }
      }
      let videoUrl = "";
      if (seed.video) {
        try {
          const buf = await fs.readFile(path.join(dir, seed.video));
          videoUrl = (await uploadBuffer(buf, { folder: "ydd/seed", publicId: seed.video.replace(/\.mp4$/i, ""), resourceType: "video" })).url;
        } catch (e: any) {
          problems.push(`${seed.name}: ${seed.video} (${e?.message ?? "upload failed"})`);
        }
      }
      let pdfUrl = "";
      if (seed.pdf) {
        try {
          const buf = await fs.readFile(path.join(dir, seed.pdf));
          pdfUrl = (await uploadBuffer(buf, { folder: "ydd/seed", publicId: seed.pdf.replace(/\.pdf$/i, ""), resourceType: "image" })).url;
        } catch (e: any) {
          problems.push(`${seed.name}: ${seed.pdf} (${e?.message ?? "upload failed"})`);
        }
      }
      await Villa.create({
        name: seed.name,
        slug: seed.slug,
        status: seed.status,
        tagline: seed.tagline,
        description: seed.description,
        facing: seed.facing,
        plotLength: seed.plotLength,
        plotWidth: seed.plotWidth,
        plotGaj: seed.plotGaj ?? 0,
        floors: seed.floors,
        bedrooms: seed.bedrooms,
        highlights: seed.highlights,
        rooms: seed.rooms,
        location: seed.location,
        mapUrl: seed.mapUrl,
        images,
        videoUrl,
        pdfUrl,
        featured: seed.featured,
        order: seed.order,
      });
      created.push(seed.name);
    }
    revalidateSite();
    return Response.json({ created, skipped, problems });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err?.message || "Import failed", created, skipped, problems }, { status: 500 });
  }
}
