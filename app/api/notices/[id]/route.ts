import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Notice, toNoticeJSON } from "@/lib/models/Notice";
import { isAuthorized, unauthorized } from "@/lib/auth";
import { revalidateSite } from "@/lib/revalidate";
import { noticeFromBody } from "@/lib/noticeBody";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Admin: update a line (any subset of fields). */
export async function PUT(req: Request, { params }: Ctx) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return Response.json({ error: "Bad id" }, { status: 400 });
  try {
    const body = await req.json();
    await connectDB();
    const before = await Notice.findById(id).lean();
    if (!before) return Response.json({ error: "Not found" }, { status: 404 });
    const data = noticeFromBody({ ...before, ...body });
    if (!data.title) return Response.json({ error: "Please add a title" }, { status: 400 });
    const doc = await Notice.findByIdAndUpdate(id, data, { new: true }).lean();
    revalidateSite();
    return Response.json({ notice: toNoticeJSON(doc) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return Response.json({ error: "Bad id" }, { status: 400 });
  try {
    await connectDB();
    const doc = await Notice.findByIdAndDelete(id).lean();
    if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
    revalidateSite();
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not delete" }, { status: 500 });
  }
}
