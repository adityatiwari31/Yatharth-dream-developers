import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Enquiry, toEnquiryJSON } from "@/lib/models/Enquiry";
import { isAuthorized, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Admin: mark handled / not handled. Body: { handled: boolean } */
export async function PATCH(req: Request, { params }: Ctx) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return Response.json({ error: "Bad id" }, { status: 400 });
  try {
    const body = await req.json();
    await connectDB();
    const doc = await Enquiry.findByIdAndUpdate(id, { handled: Boolean(body.handled) }, { new: true }).lean();
    if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ enquiry: toEnquiryJSON(doc) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not update the enquiry" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return Response.json({ error: "Bad id" }, { status: 400 });
  try {
    await connectDB();
    const doc = await Enquiry.findByIdAndDelete(id).lean();
    if (!doc) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not delete the enquiry" }, { status: 500 });
  }
}
