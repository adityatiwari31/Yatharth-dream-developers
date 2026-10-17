import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Review, toReviewJSON } from "@/lib/models/Review";
import { isAuthorized, unauthorized } from "@/lib/auth";
import { revalidateSite } from "@/lib/revalidate";
import { destroyAsset } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Admin: approve / unapprove. Body: { approved: boolean } */
export async function PATCH(req: Request, { params }: Ctx) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return Response.json({ error: "Bad id" }, { status: 400 });
  try {
    const body = await req.json();
    await connectDB();
    const doc = await Review.findByIdAndUpdate(id, { approved: Boolean(body.approved) }, { new: true }).lean();
    if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
    revalidateSite();
    return Response.json({ review: toReviewJSON(doc) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not update the review" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return Response.json({ error: "Bad id" }, { status: 400 });
  try {
    await connectDB();
    const doc = await Review.findByIdAndDelete(id).lean();
    if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
    if (doc.photo?.publicId) await destroyAsset(doc.photo.publicId);
    revalidateSite();
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not delete the review" }, { status: 500 });
  }
}
