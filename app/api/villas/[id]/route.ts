import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Villa, toVillaJSON } from "@/lib/models/Villa";
import { isAuthorized, unauthorized } from "@/lib/auth";
import { revalidateSite } from "@/lib/revalidate";
import { destroyAsset } from "@/lib/cloudinary";
import { villaFromBody } from "@/lib/villaBody";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Admin: update a villa. */
export async function PUT(req: Request, { params }: Ctx) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return Response.json({ error: "Bad id" }, { status: 400 });
  try {
    const body = await req.json();
    const data = villaFromBody(body);
    if (!data.name) return Response.json({ error: "Name is required" }, { status: 400 });
    await connectDB();
    const clash = await Villa.findOne({ slug: data.slug, _id: { $ne: id } }).lean();
    if (clash) return Response.json({ error: `The address “${data.slug}” is already used by another villa.` }, { status: 409 });

    const before = await Villa.findById(id).lean();
    if (!before) return Response.json({ error: "Not found" }, { status: 404 });

    const doc = await Villa.findByIdAndUpdate(id, data, { new: true }).lean();

    // Remove pictures that were taken off the villa (best effort)
    const kept = new Set(data.images.map((i) => i.publicId).filter(Boolean));
    for (const img of before.images ?? []) {
      if (img.publicId && !kept.has(img.publicId)) await destroyAsset(img.publicId);
    }
    revalidateSite();
    return Response.json({ villa: toVillaJSON(doc) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not update the villa" }, { status: 500 });
  }
}

/** Admin: delete a villa and its pictures. */
export async function DELETE(req: Request, { params }: Ctx) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return Response.json({ error: "Bad id" }, { status: 400 });
  try {
    await connectDB();
    const doc = await Villa.findByIdAndDelete(id).lean();
    if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
    for (const img of doc.images ?? []) if (img.publicId) await destroyAsset(img.publicId);
    revalidateSite();
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not delete the villa" }, { status: 500 });
  }
}
