"use client";

import { useEffect, useState } from "react";
import type { EnquiryJSON } from "@/lib/villaTypes";

export default function ManageEnquiries({ adminKey }: { adminKey: string }) {
  const [items, setItems] = useState<EnquiryJSON[]>([]);
  const [status, setStatus] = useState("Loading…");
  const [showHandled, setShowHandled] = useState(false);
  const headers = { "x-admin-secret": adminKey };

  async function load() {
    try {
      const res = await fetch("/api/enquiries", { headers, cache: "no-store" });
      if (res.status === 401) return setStatus("Admin key not accepted. Lock and unlock again.");
      if (!res.ok) return setStatus(`Could not load enquiries (server replied ${res.status}).`);
      setItems((await res.json()).enquiries ?? []);
      setStatus("");
    } catch {
      setStatus("Network error while loading enquiries.");
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function setHandled(e: EnquiryJSON, handled: boolean) {
    const res = await fetch(`/api/enquiries/${e._id}`, { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ handled }) });
    setStatus(res.ok ? (handled ? "Marked as handled." : "Reopened.") : `Failed (server replied ${res.status}).`);
    if (res.ok) load();
  }
  async function remove(e: EnquiryJSON) {
    if (!window.confirm(`Delete the enquiry from ${e.name}?`)) return;
    const res = await fetch(`/api/enquiries/${e._id}`, { method: "DELETE", headers });
    setStatus(res.ok ? "Deleted." : `Failed (server replied ${res.status}).`);
    if (res.ok) load();
  }

  const shown = items.filter((e) => e.handled === showHandled);
  const digits = (p: string) => p.replace(/\D/g, "").replace(/^0+/, "");

  return (
    <section aria-label="Manage enquiries">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setShowHandled(false)} className={`rounded-full border px-4 py-2 text-sm font-medium ${!showHandled ? "border-ink bg-ink text-cream" : "border-line bg-card"}`}>
          Open ({items.filter((e) => !e.handled).length})
        </button>
        <button type="button" onClick={() => setShowHandled(true)} className={`rounded-full border px-4 py-2 text-sm font-medium ${showHandled ? "border-ink bg-ink text-cream" : "border-line bg-card"}`}>
          Handled ({items.filter((e) => e.handled).length})
        </button>
        <span className="text-[0.88rem] text-muted" aria-live="polite">
          {status}
        </span>
      </div>

      <ul className="mt-5 grid gap-3">
        {shown.map((e) => (
          <li key={e._id} className="card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-semibold">{e.name}</div>
              <div className="text-[0.8rem] text-muted">{new Date(e.createdAt).toLocaleString("en-IN")}</div>
            </div>
            <div className="mt-1 flex flex-wrap gap-3 text-[0.92rem]">
              <a href={`tel:${e.phone}`} className="font-medium text-brass">
                {e.phone}
              </a>
              {digits(e.phone).length >= 10 && (
                <a href={`https://wa.me/${digits(e.phone).length === 10 ? "91" + digits(e.phone) : digits(e.phone)}`} target="_blank" rel="noopener" className="font-medium text-ok">
                  WhatsApp them
                </a>
              )}
            </div>
            {e.interest && <p className="mt-1.5 text-[0.92rem]">Plot / villa: {e.interest}</p>}
            {e.message && <p className="mt-1 text-[0.92rem] text-ink/90">“{e.message}”</p>}
            {e.villaSlug && (
              <a href={`/villas/${e.villaSlug}`} target="_blank" rel="noopener" className="mt-1 inline-block text-[0.85rem] text-muted underline">
                About: /villas/{e.villaSlug}
              </a>
            )}
            <div className="mt-3 flex gap-3 text-sm font-medium">
              <button type="button" onClick={() => setHandled(e, !e.handled)} className="text-ink">
                {e.handled ? "Reopen" : "Mark handled"}
              </button>
              <button type="button" onClick={() => remove(e)} className="text-danger">
                Delete
              </button>
            </div>
          </li>
        ))}
        {!status && shown.length === 0 && <li className="text-muted">{showHandled ? "Nothing handled yet." : "No open enquiries."}</li>}
      </ul>
    </section>
  );
}
