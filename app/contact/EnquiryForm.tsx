"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/Icons";
import { BRAND_NAME, SITE_URL, waLink } from "@/lib/config";

type Props = { villaSlug?: string; villaName?: string; compact?: boolean };

/**
 * Saves the enquiry to the database (so it shows in /admin) and opens WhatsApp
 * with the same message pre-filled. Works even if WhatsApp is blocked: the
 * message is still saved and a link is shown.
 */
export default function EnquiryForm({ villaSlug = "", villaName = "", compact = false }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [waUrl, setWaUrl] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const interest = String(data.get("interest") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !phone) return;

    const lines = [
      villaName ? `Hello, I am interested in “${villaName}” by ${BRAND_NAME}.` : `Hello, I am interested in the villas by ${BRAND_NAME}.`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      interest ? `Plot / villa: ${interest}` : "",
      message ? `Message: ${message}` : "",
      villaSlug ? `${SITE_URL}/villas/${villaSlug}` : "",
    ].filter(Boolean);
    const url = waLink(lines.join("\n"));
    setWaUrl(url);

    // Open WhatsApp right away (inside the click), then save in the background.
    window.open(url, "_blank", "noopener");
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, interest, message, villaSlug, page: window.location.pathname }),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className={`grid gap-4 ${compact ? "" : "card p-6"}`} aria-describedby="enq-note">
      <div className={`grid gap-4 ${compact ? "sm:grid-cols-2" : ""}`}>
        <div>
          <label htmlFor="enq-name" className="label">
            Your name
          </label>
          <input id="enq-name" name="name" required autoComplete="name" className="input" />
        </div>
        <div>
          <label htmlFor="enq-phone" className="label">
            Phone number
          </label>
          <input id="enq-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="input" placeholder="+91" />
        </div>
      </div>
      <div>
        <label htmlFor="enq-interest" className="label">
          {villaName ? "Plot size, if you have a plot (optional)" : "Plot size in gaj, or the villa you like (optional)"}
        </label>
        <input id="enq-interest" name="interest" className="input" inputMode="text" />
      </div>
      <div>
        <label htmlFor="enq-message" className="label">
          Anything else (optional)
        </label>
        <textarea id="enq-message" name="message" rows={compact ? 2 : 4} className="input resize-y" />
      </div>
      <button type="submit" className="btn btn-wa" disabled={status === "sending"}>
        <WhatsAppIcon className="h-4 w-4" />
        {status === "sending" ? "Sending…" : "Send on WhatsApp"}
      </button>
      <p id="enq-note" className="text-[0.85rem] text-muted" aria-live="polite">
        {status === "idle" && "Opens WhatsApp with your message ready to send. We also keep a copy so we can call you back."}
        {status === "sending" && "Saving your message…"}
        {status === "done" && (
          <>
            Saved. If WhatsApp did not open,{" "}
            <a href={waUrl} target="_blank" rel="noopener" className="font-medium text-brass">
              tap here to send the message
            </a>
            .
          </>
        )}
        {status === "error" && (
          <>
            We could not save a copy, but you can still{" "}
            <a href={waUrl} target="_blank" rel="noopener" className="font-medium text-brass">
              send the message on WhatsApp
            </a>
            .
          </>
        )}
      </p>
    </form>
  );
}
