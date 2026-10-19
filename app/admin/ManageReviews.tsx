"use client";

import { useEffect, useState } from "react";
import Stars from "@/components/Stars";
import { compressImage } from "@/lib/compressImage";
import type { ReviewJSON } from "@/lib/villaTypes";

export default function ManageReviews({ adminKey }: { adminKey: string }) {
  const [reviews, setReviews] = useState<ReviewJSON[]>([]);
  const [status, setStatus] = useState("");
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const headers = { "x-admin-secret": adminKey };

  async function load() {
    const res = await fetch("/api/reviews", { headers, cache: "no-store" });
    if (res.ok) setReviews((await res.json()).reviews ?? []);
    else setStatus(res.status === 401 ? "Admin key not accepted. Lock and unlock again." : `Could not load reviews (server replied ${res.status}).`);
  }
  useEffect(() => {
    load();
  }, []);

  async function setApproved(r: ReviewJSON, approved: boolean) {
    const res = await fetch(`/api/reviews/${r._id}`, { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ approved }) });
    setStatus(res.ok ? (approved ? "Published." : "Hidden.") : `Failed (server replied ${res.status}).`);
    if (res.ok) load();
  }
  async function remove(r: ReviewJSON) {
    if (!window.confirm(`Delete the review by ${r.name}?`)) return;
    const res = await fetch(`/api/reviews/${r._id}`, { method: "DELETE", headers });
    setStatus(res.ok ? "Deleted." : `Failed (server replied ${res.status}).`);
    if (res.ok) load();
  }
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSaving(true);
    const fd = new FormData(form);
    fd.set("approved", "true");
    const photo = fd.get("photo");
    if (photo instanceof File && photo.size > 0) fd.set("photo", await compressImage(photo));
    const res = await fetch("/api/reviews", { method: "POST", headers, body: fd });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return setStatus(json.error || `Could not add (server replied ${res.status}).`);
    setStatus("Review added and published.");
    form.reset();
    setAdding(false);
    load();
  }

  const pending = reviews.filter((r) => !r.approved);
  const live = reviews.filter((r) => r.approved);

  return (
    <section aria-label="Manage reviews">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setAdding((v) => !v)} className="btn btn-primary !min-h-10 !px-4 !py-2 text-sm">
          {adding ? "Close" : "Add a review"}
        </button>
        <span className="text-[0.88rem] text-muted" aria-live="polite">
          {status}
        </span>
      </div>

      {adding && (
        <form onSubmit={add} className="card mt-5 grid gap-4 p-5" encType="multipart/form-data">
          <p className="text-[0.9rem] text-muted">For feedback a customer sent you on WhatsApp. Add it with their permission; it is published immediately.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="label">Name</span>
              <input name="name" className="input" required />
            </label>
            <label className="block">
              <span className="label">Rating</span>
              <select name="rating" className="input" defaultValue="5">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label">What they bought (optional)</span>
              <input name="bought" className="input" placeholder="e.g. 20 × 40 villa" />
            </label>
          </div>
          <label className="block">
            <span className="label">Their words (5 to 80 words)</span>
            <textarea name="text" rows={3} className="input resize-y" required />
          </label>
          <label className="block">
            <span className="label">Photo (optional)</span>
            <input name="photo" type="file" accept="image/*" className="block text-sm" />
          </label>
          <button type="submit" className="btn btn-primary justify-self-start" disabled={saving}>
            {saving ? "Saving…" : "Add and publish"}
          </button>
        </form>
      )}

      <h2 className="mt-8 !text-[1.2rem]">Waiting for approval ({pending.length})</h2>
      <List items={pending} empty="Nothing waiting." onApprove={(r) => setApproved(r, true)} onHide={(r) => setApproved(r, false)} onDelete={remove} />
      <h2 className="mt-8 !text-[1.2rem]">Published ({live.length})</h2>
      <List items={live} empty="No published reviews yet." onApprove={(r) => setApproved(r, true)} onHide={(r) => setApproved(r, false)} onDelete={remove} />
    </section>
  );
}

function List({ items, empty, onApprove, onHide, onDelete }: { items: ReviewJSON[]; empty: string; onApprove: (r: ReviewJSON) => void; onHide: (r: ReviewJSON) => void; onDelete: (r: ReviewJSON) => void }) {
  if (!items.length) return <p className="mt-2 text-muted">{empty}</p>;
  return (
    <ul className="mt-3 grid gap-3">
      {items.map((r) => (
        <li key={r._id} className="card flex flex-wrap gap-4 p-4">
          {r.photo?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.photo.url.replace("/upload/", "/upload/c_fill,w_200,h_200,q_auto,f_auto/")} alt="" className="h-24 w-24 flex-none rounded-lg object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Stars value={r.rating} />
              <span className="font-semibold">{r.name}</span>
              {r.bought && <span className="text-[0.85rem] text-muted">· {r.bought}</span>}
              <span className="text-[0.8rem] text-muted">· {new Date(r.createdAt).toLocaleDateString("en-IN")} · {r.source}</span>
            </div>
            <p className="mt-1.5 text-[0.95rem]">{r.text}</p>
            <div className="mt-2 flex gap-3 text-sm font-medium">
              {r.approved ? (
                <button type="button" onClick={() => onHide(r)} className="text-ink">
                  Hide
                </button>
              ) : (
                <button type="button" onClick={() => onApprove(r)} className="text-ok">
                  Approve and publish
                </button>
              )}
              <button type="button" onClick={() => onDelete(r)} className="text-danger">
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
