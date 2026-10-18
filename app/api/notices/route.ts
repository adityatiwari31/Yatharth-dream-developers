import { connectDB } from "@/lib/mongodb";
import { Notice, toNoticeJSON } from "@/lib/models/Notice";
import { isAuthorized, unauthorized } from "@/lib/auth";
import { revalidateSite } from "@/lib/revalidate";
import { noticeFromBody } from "@/lib/noticeBody";

export const dynamic = "force-dynamic";

/** Admin: every line, active or not. (The home page reads active ones directly from the database.) */
export async function GET(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  try {
    await connectDB();
    const docs = await Notice.find().sort({ order: 1, createdAt: -1 }).lean();
    return Response.json({ notices: docs.map(toNoticeJSON) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not load the upcoming bar" }, { status: 500 });
  }
}

/** Admin: add a line. */
export async function POST(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  try {
    const data = noticeFromBody(await req.json());
    if (!data.title) return Response.json({ error: "Please add a title" }, { status: 400 });
    await connectDB();
    const doc = await Notice.create(data);
    revalidateSite();
    return Response.json({ notice: toNoticeJSON(doc.toObject()) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not save" }, { status: 500 });
  }
}
