import { connectDB } from "@/lib/mongodb";
import { Enquiry, toEnquiryJSON } from "@/lib/models/Enquiry";
import { isAuthorized, unauthorized } from "@/lib/auth";
import { clientIp, rateLimited, str } from "@/lib/validate";

export const dynamic = "force-dynamic";

/** Admin: all enquiries, newest first. */
export async function GET(req: Request) {
  if (!isAuthorized(req)) return unauthorized();
  try {
    await connectDB();
    const docs = await Enquiry.find().sort({ createdAt: -1 }).lean();
    return Response.json({ enquiries: docs.map(toEnquiryJSON) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not load enquiries" }, { status: 500 });
  }
}

/** Public: save an enquiry from the contact form or a villa page. */
export async function POST(req: Request) {
  if (rateLimited(`enq:${clientIp(req)}`, 8, 10 * 60_000)) {
    return Response.json({ error: "Too many messages from this connection. Please try again later." }, { status: 429 });
  }
  try {
    const body = await req.json();
    const name = str(body.name, 80);
    const phone = str(body.phone, 30);
    if (!name || !phone) return Response.json({ error: "Name and phone are required" }, { status: 400 });
    if (!/^[+\d][\d\s\-()]{6,}$/.test(phone)) return Response.json({ error: "Please enter a valid phone number" }, { status: 400 });
    await connectDB();
    const doc = await Enquiry.create({
      name,
      phone,
      interest: str(body.interest, 200),
      message: str(body.message, 1500),
      villaSlug: str(body.villaSlug, 120),
      page: str(body.page, 200),
    });
    return Response.json({ enquiry: toEnquiryJSON(doc.toObject()) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Could not save the enquiry" }, { status: 500 });
  }
}
