import { timingSafeEqual } from "crypto";

// Admin requests carry the password in an `x-admin-secret` header.
// The comparison is constant-time so the length of a wrong guess leaks nothing.

export function isAuthorized(req: Request): boolean {
  const expected = process.env.ADMIN_SECRET;
  const given = req.headers.get("x-admin-secret")?.trim() ?? "";
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function unauthorized() {
  return Response.json({ error: "Admin key not accepted" }, { status: 401 });
}
