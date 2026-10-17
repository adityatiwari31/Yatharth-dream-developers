
import { isAuthorized, unauthorized } from "@/lib/auth";
import { hasCloudinary, uploadBuffer } from "@/lib/cloudinary";
import { str } from "@/lib/validate";

export const dynamic = "force-dynamic";

const MAX_BYTES = 40 * 1024 * 1024; // pictures, short videos and PDFs

/**
 * Admin: upload one file to Cloudinary. Multipart field `file`; optional `folder`.
 * Returns { url, publicId, width, height, resourceType }.
 */
export async function POST(req: Request) {
  if (!isAuthorized(req)) return unauthorized();

  if (!hasCloudinary) {
    return Response.json(
      {
        error:
          "Cloudinary keys are missing. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
      },
      { status: 500 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return Response.json(
        { error: "No file received" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return Response.json(
        { error: "File is larger than 40 MB" },
        { status: 400 }
      );
    }

    const ok =
      file.type.startsWith("image/") ||
      file.type.startsWith("video/") ||
      file.type === "application/pdf";

    if (!ok) {
      return Response.json(
        { error: "Only pictures, videos and PDF files can be uploaded" },
        { status: 400 }
      );
    }

    const folder =
      "ydd/" +
      (str(form.get("folder"), 40).replace(/[^a-z0-9-]/gi, "") ||
        "villas");

    const buf = Buffer.from(await file.arrayBuffer());

    const result = await uploadBuffer(buf, {
      folder,
      resourceType: "auto",
    });

    return Response.json(result, { status: 201 });
  } catch (err: unknown) {
    console.error("Upload failed:", err);

    const message =
      err instanceof Error ? err.message : "Upload failed";

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
