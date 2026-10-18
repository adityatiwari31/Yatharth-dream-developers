import { connectDB } from "@/lib/mongodb";
import { Settings, toFounderJSON } from "@/lib/models/Settings";
import { DEFAULT_FOUNDERS } from "@/lib/data";
import { isAuthorized, unauthorized } from "@/lib/auth";
import { destroyAsset } from "@/lib/cloudinary";
import { revalidateSite } from "@/lib/revalidate";
import { isHttpUrl, str } from "@/lib/validate";

export const dynamic = "force-dynamic";

/** Admin: the founders as they will appear on the About page (defaults until saved once). */
export async function GET(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  try {
    await connectDB();
    const doc = await Settings.findOne({ key: "site" }).lean();
    const list = (doc?.founders ?? []).map(toFounderJSON).filter((f) => f.name);
    return Response.json({ founders: list.length ? list : DEFAULT_FOUNDERS, saved: list.length > 0 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not load the founders" }, { status: 500 });
  }
}

/** Admin: replace the list of founders. Body: { founders: [{ name, role, bio, photo: { url, publicId } }] } */
export async function PUT(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  try {
    const body = await req.json();
    const founders = (Array.isArray(body.founders) ? body.founders : [])
      .map((f: any) => {
        const url = str(f?.photo?.url, 600);
        return {
          name: str(f?.name, 80),
          role: str(f?.role, 80),
          bio: str(f?.bio, 700),
          photo: { url: isHttpUrl(url) ? url : "", publicId: str(f?.photo?.publicId, 300) },
        };
      })
      .filter((f: any) => f.name)
      .slice(0, 4);
    if (!founders.length) return Response.json({ error: "Add at least one founder with a name" }, { status: 400 });

    await connectDB();
    const before = await Settings.findOne({ key: "site" }).lean();
    const doc = await Settings.findOneAndUpdate({ key: "site" }, { $set: { founders } }, { new: true, upsert: true }).lean();

    // Photos that are no longer used can go (best effort).
    const kept = new Set(founders.map((f: any) => f.photo.publicId).filter(Boolean));
    for (const f of before?.founders ?? []) {
      if (f.photo?.publicId && !kept.has(f.photo.publicId)) await destroyAsset(f.photo.publicId);
    }
    revalidateSite();
    return Response.json({ founders: (doc?.founders ?? []).map(toFounderJSON) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not save the founders" }, { status: 500 });
  }
}
