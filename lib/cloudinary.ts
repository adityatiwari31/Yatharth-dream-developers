import { v2 as cloudinary } from "cloudinary";

// Server-side Cloudinary client. Never import this file from a client component.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET,
);

export type UploadResult = { url: string; publicId: string; width: number; height: number; resourceType: string };

/** Upload a Buffer. `resourceType` "auto" lets Cloudinary detect images, videos and PDFs. */
export function uploadBuffer(
  buffer: Buffer,
  opts: { folder: string; publicId?: string; resourceType?: "image" | "video" | "raw" | "auto" } = { folder: "ydd" },
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: opts.folder,
        public_id: opts.publicId,
        resource_type: opts.resourceType ?? "auto",
        overwrite: false,
        unique_filename: !opts.publicId,
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width ?? 0,
          height: result.height ?? 0,
          resourceType: result.resource_type,
        });
      },
    );
    stream.end(buffer);
  });
}

/** Best-effort delete. Errors are swallowed: a missing picture should never block a save. */
export async function destroyAsset(publicId: string, resourceType: "image" | "video" | "raw" = "image") {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch {
    /* ignore */
  }
}

export { cloudinary };
