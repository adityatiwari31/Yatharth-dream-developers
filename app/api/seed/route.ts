
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

export async function POST(req: Request) {
  if (!isAuthorized(req)) return unauthorized();

  if (!hasCloudinary) {
    return Response.json(
      {
        error:
          "Cloudinary keys are missing, so the pictures cannot be uploaded.",
      },
      { status: 500 }
    );
  }

  const dir = path.join(process.cwd(), "public", "seed");

  const created: string[] = [];
  const updated: string[] = [];
  const skipped: string[] = [];
  const problems: { seed: string; error: string }[] = [];

  try {
    await connectDB();

    for (const seed of SEED_VILLAS) {
      try {
        const images: {
          url: string;
          publicId: string;
          alt: string;
        }[] = [];

        for (const img of seed.images) {
          const buf = await fs.readFile(path.join(dir, img.file));

          const up = await uploadBuffer(buf, {
            folder: "ydd/seed",
            publicId: img.file.replace(/\.[a-z0-9]+$/i, ""),
            resourceType: "image",
          });

          images.push({
            url: up.url,
            publicId: up.publicId,
            alt: img.alt,
          });
        }

        let videoUrl = "";

        if (seed.video) {
          const buf = await fs.readFile(path.join(dir, seed.video));

          videoUrl = (
            await uploadBuffer(buf, {
              folder: "ydd/seed",
              publicId: seed.video.replace(/\.mp4$/i, ""),
              resourceType: "video",
            })
          ).url;
        }

        let pdfUrl = "";

        if (seed.pdf) {
          const buf = await fs.readFile(path.join(dir, seed.pdf));

          pdfUrl = (
            await uploadBuffer(buf, {
              folder: "ydd/seed",
              publicId: seed.pdf.replace(/\.pdf$/i, ""),
              resourceType: "raw",
            })
          ).url;
        }

        const existing = await Villa.findOne({ slug: seed.slug });

        if (existing) {
          // Preserve existing villa details and existing image order.
          // Append only images that are not already present.
          const existingImages = Array.isArray(existing.images)
            ? existing.images
            : [];

          const mergedImages = [
            ...existingImages,
            ...images.filter(
              (img) =>
                !existingImages.some(
                  (current: { publicId?: string; url?: string }) =>
                    current.publicId === img.publicId ||
                    current.url === img.url
                )
            ),
          ];

          existing.images = mergedImages as typeof existing.images;

          if (!existing.videoUrl && videoUrl) {
            existing.videoUrl = videoUrl;
          }

          if (!existing.pdfUrl && pdfUrl) {
            existing.pdfUrl = pdfUrl;
          }

          await existing.save();
          updated.push(seed.name);
        } else {
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
      } catch (err: unknown) {
        console.error(`Seed import failed for ${seed.name}:`, err);

        const message =
          err instanceof Error ? err.message : "Import failed";

        problems.push({
          seed: seed.name,
          error: message,
        });
      }
    }

    revalidateSite();

    return Response.json({
      created,
      updated,
      skipped,
      problems,
    });
  } catch (err: unknown) {
    console.error("Seed import failed:", err);

    const message =
      err instanceof Error ? err.message : "Import failed";

    return Response.json(
      {
        error: message,
        created,
        updated,
        skipped,
        problems,
      },
      { status: 500 }
    );
  }
}
