import { connectDB } from "@/lib/mongodb";
import { Review, toReviewJSON } from "@/lib/models/Review";
import { isAuthorized, unauthorized } from "@/lib/auth";
import { revalidateSite } from "@/lib/revalidate";
import { hasCloudinary, uploadBuffer } from "@/lib/cloudinary";
import { clientIp, num, rateLimited, str } from "@/lib/validate";

export const dynamic = "force-dynamic";

const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // photos are shrunk in the browser first; Vercel accepts requests up to 4.5 MB
const MIN_WORDS = 5;
const MAX_WORDS = 80;

/** Admin: every review, newest first. (Public pages read approved reviews directly from the database.) */
export async function GET(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  try {
    await connectDB();
    const docs = await Review.find().sort({ createdAt: -1 }).lean();
    return Response.json({ reviews: docs.map(toReviewJSON) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not load reviews" }, { status: 500 });
  }
}

/**
 * Create a review. Visitors send multipart form data (name, rating, text, bought, photo).
 * Visitor reviews wait for approval; an admin request (with the secret) is published at once.
 */
export async function POST(req: Request) {
  const admin = isAuthorized(req);
  if (!admin && rateLimited(`review:${clientIp(req)}`, 4, 10 * 60_000)) {
    return Response.json({ error: "Too many reviews from this connection. Please try again later." }, { status: 429 });
  }
  try {
    const form = await req.formData();
    const name = str(form.get("name"), 80);
    const text = str(form.get("text"), 1200);
    const bought = str(form.get("bought"), 120);
    const rating = Math.round(num(form.get("rating")));
    if (!name) return Response.json({ error: "Please add your name." }, { status: 400 });
    if (rating < 1 || rating > 5) return Response.json({ error: "Please choose a rating from 1 to 5." }, { status: 400 });
    const words = text ? text.split(/\s+/).length : 0;
    if (words < MIN_WORDS || words > MAX_WORDS) {
      return Response.json({ error: `Your feedback should be between ${MIN_WORDS} and ${MAX_WORDS} words.` }, { status: 400 });
    }

    let photo = { url: "", publicId: "" };
    const file = form.get("photo");
    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith("image/")) return Response.json({ error: "The attachment must be a photo." }, { status: 400 });
      if (file.size > MAX_PHOTO_BYTES) return Response.json({ error: "The photo must be smaller than 4 MB." }, { status: 400 });
      if (!hasCloudinary) return Response.json({ error: "Photo uploads are not set up yet. Please send the review without a photo." }, { status: 500 });
      const buf = Buffer.from(await file.arrayBuffer());
      const up = await uploadBuffer(buf, { folder: "ydd/reviews", resourceType: "image" });
      photo = { url: up.url, publicId: up.publicId };
    } else if (admin) {
      // Admin may paste an existing Cloudinary URL instead of uploading
      const url = str(form.get("photoUrl"), 600);
      if (/^https?:\/\//.test(url)) photo = { url, publicId: str(form.get("photoPublicId"), 300) };
    }

    await connectDB();
    const doc = await Review.create({
      name,
      rating,
      text,
      bought,
      photo,
      approved: admin ? form.get("approved") !== "false" : false,
      source: admin ? "admin" : "website",
    });
    if (doc.approved) revalidateSite();
    return Response.json({ review: toReviewJSON(doc.toObject()) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not save the review. Please try again." }, { status: 500 });
  }
}
