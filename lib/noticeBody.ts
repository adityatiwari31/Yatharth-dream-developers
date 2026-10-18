import { bool, isHttpUrl, num, str } from "@/lib/validate";

/** Shared by create and update. A link may be a page on this site ("/villas/…") or a full https:// address. */
export function noticeFromBody(body: any) {
  const link = str(body.link, 400);
  return {
    title: str(body.title, 120),
    text: str(body.text, 240),
    link: isHttpUrl(link) || link.startsWith("/") ? link : "",
    active: body.active === undefined ? true : bool(body.active),
    order: num(body.order),
  };
}
