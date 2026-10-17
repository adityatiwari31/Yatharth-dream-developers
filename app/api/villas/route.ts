import { connectDB } from "@/lib/mongodb";
import { Villa, VILLA_STATUSES, toVillaJSON } from "@/lib/models/Villa";
import { isAuthorized, unauthorized } from "@/lib/auth";
import { revalidateSite } from "@/lib/revalidate";
import { villaFromBody } from "@/lib/villaBody";
import { villaSort } from "@/lib/data";

export const dynamic = "force-dynamic";

/** Public: list all villas (newest/featured first). */
export async function GET() {
  try {
    await connectDB();
    const docs = await Villa.find().sort(villaSort).lean();
    return Response.json({ villas: docs.map(toVillaJSON) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not load villas" }, { status: 500 });
  }
}

/** Admin: create a villa. */
export async function POST(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  try {
    const body = await req.json();
    const data = villaFromBody(body);
    if (!data.name) return Response.json({ error: "Name is required" }, { status: 400 });
    if (!data.slug) return Response.json({ error: "Could not make a web address from that name" }, { status: 400 });
    await connectDB();
    if (await Villa.exists({ slug: data.slug })) {
      return Response.json({ error: `The address “${data.slug}” is already used by another villa. Change the name or the slug.` }, { status: 409 });
    }
    const doc = await Villa.create(data);
    revalidateSite();
    return Response.json({ villa: toVillaJSON(doc.toObject()) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not save the villa" }, { status: 500 });
  }
}
