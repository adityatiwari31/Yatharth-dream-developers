import { isAuthorized, unauthorized } from "@/lib/auth";
import { cloudinary, hasCloudinary } from "@/lib/cloudinary";
import { str } from "@/lib/validate";

export const dynamic = "force-dynamic";

/**
 * Admin: sign a direct browser-to-Cloudinary upload.
 * The file itself never passes through this server, so big photos, videos and
 * PDFs upload quickly and Vercel's request-size limit does not apply.
 * Body: { folder?: string, publicId?: string } → { cloudName, apiKey, timestamp, signature, folder, publicId? }
 */
export async function POST(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  if (!hasCloudinary) {
    return Response.json({ error: "Cloudinary keys are missing. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET." }, { status: 500 });
  }
  const body = await req.json().catch(() => ({}));
  const folder = "ydd/" + (str(body.folder, 40).replace(/[^a-z0-9-]/gi, "") || "villas");
  const publicId = str(body.publicId, 120).replace(/[^a-zA-Z0-9_-]/g, "");
  const timestamp = Math.round(Date.now() / 1000);
  const params: Record<string, string | number> = { timestamp, folder };
  if (publicId) params.public_id = publicId;
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET as string);
  return Response.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
    publicId: publicId || undefined,
  });
}
