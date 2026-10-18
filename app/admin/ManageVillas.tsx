"use client";

import { useEffect, useState } from "react";
import ImageUploader, { FileUploader, type AdminImage } from "./ImageUploader";
import { STATUS_LABEL, VILLA_STATUSES, type VillaJSON, type VillaStatus } from "@/lib/villaTypes";
import { slugify } from "@/lib/units";

type Room = { label: string; size: string };
type Form = {
  name: string; slug: string; status: VillaStatus; featured: boolean; order: number;
  tagline: string; description: string; facing: string; plotLength: string; plotWidth: string; plotGaj: string;
  floors: string; bedrooms: string; highlights: string; rooms: Room[]; location: string; mapUrl: string;
  videoUrl: string; pdfUrl: string; images: AdminImage[];
};

const EMPTY: Form = {
  name: "", slug: "", status: "design", featured: false, order: 0, tagline: "", description: "", facing: "",
  plotLength: "", plotWidth: "", plotGaj: "", floors: "", bedrooms: "", highlights: "", rooms: [], location: "", mapUrl: "",
  videoUrl: "", pdfUrl: "", images: [],
};

function toForm(v: VillaJSON): Form {
  return {
    name: v.name, slug: v.slug, status: v.status, featured: v.featured, order: v.order ?? 0, tagline: v.tagline, description: v.description,
    facing: v.facing, plotLength: v.plotLength ? String(v.plotLength) : "", plotWidth: v.plotWidth ? String(v.plotWidth) : "",
    plotGaj: v.plotGaj ? String(v.plotGaj) : "", floors: v.floors, bedrooms: v.bedrooms ? String(v.bedrooms) : "",
    highlights: v.highlights.join("\n"), rooms: v.rooms.map((r) => ({ label: r.label, size: r.size })), location: v.location, mapUrl: v.mapUrl,
    videoUrl: v.videoUrl, pdfUrl: v.pdfUrl, images: v.images.map((i) => ({ url: i.url, publicId: i.publicId, alt: i.alt })),
  };
}

export default function ManageVillas({ adminKey }: { adminKey: string }) {
  const [villas, setVillas] = useState<VillaJSON[]>([]);
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<{ id: string | null; form: Form } | null>(null);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const headers = { "Content-Type": "application/json", "x-admin-secret": adminKey };

  async function load() {
    const res = await fetch("/api/villas", { cache: "no-store" });
    if (res.ok) setVillas((await res.json()).villas ?? []);
    else setStatus(`Could not load villas (server replied ${res.status}).`);
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing({ id: null, form: { ...EMPTY, order: villas.length + 1 } });
    setSlugTouched(false);
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function startEdit(v: VillaJSON) {
    setEditing({ id: v._id, form: toForm(v) });
    setSlugTouched(true);
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setEditing((e) => {
      if (!e) return e;
      const form = { ...e.form, [key]: value };
      if (key === "name" && !slugTouched) form.slug = slugify(String(value));
      return { ...e, form };
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const f = editing.form;
    if (!f.name.trim()) return setStatus("Please give the villa a name.");
    setSaving(true);
    setStatus("Saving…");
    const body = {
      ...f,
      plotLength: Number(f.plotLength) || 0,
      plotWidth: Number(f.plotWidth) || 0,
      plotGaj: Number(f.plotGaj) || 0,
      bedrooms: Number(f.bedrooms) || 0,
      highlights: f.highlights.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
      rooms: f.rooms.filter((r) => r.label.trim() && r.size.trim()),
    };
    try {
      const res = await fetch(editing.id ? `/api/villas/${editing.id}` : "/api/villas", {
        method: editing.id ? "PUT" : "POST",
        headers,
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(json.error || `Could not save (server replied ${res.status}).`);
      } else {
        setStatus(editing.id ? "Saved. The live site updates straight away." : "Villa added. It is live now.");
        setEditing(null);
        await load();
      }
    } catch {
      setStatus("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(v: VillaJSON) {
    if (!window.confirm(`Delete “${v.name}” and its photos? This cannot be undone.`)) return;
    const res = await fetch(`/api/villas/${v._id}`, { method: "DELETE", headers });
    setStatus(res.ok ? "Deleted." : `Could not delete (server replied ${res.status}).`);
    if (res.ok) load();
  }

 

  return (
    <section aria-label="Manage villas">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={startNew} className="btn btn-primary !min-h-10 !px-4 !py-2 text-sm">
          Add a villa
        </button>
     
        <span className="text-[0.88rem] text-muted" aria-live="polite">
          {status}
        </span>
      </div>

      {editing && (
        <form onSubmit={save} className="card mt-5 grid gap-5 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="!text-[1.3rem]">{editing.id ? "Edit villa" : "New villa"}</h2>
            <button type="button" onClick={() => setEditing(null)} className="text-sm font-medium text-muted">
              Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" hint="e.g. 20 ft × 40 ft, East facing, Semi duplex">
              <input className="input" value={editing.form.name} onChange={(e) => set("name", e.target.value)} required />
            </Field>
            <Field label="Web address (slug)" hint="Letters, numbers and dashes. Made from the name automatically.">
              <input
                className="input"
                value={editing.form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
              />
            </Field>
            <Field label="Status">
              <select className="input" value={editing.form.status} onChange={(e) => set("status", e.target.value as VillaStatus)}>
                {VILLA_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Order" hint="Lower numbers show first">
                <input className="input" type="number" value={editing.form.order} onChange={(e) => set("order", Number(e.target.value) || 0)} />
              </Field>
              <label className="flex items-end gap-2 pb-3 text-[0.92rem] font-medium">
                <input type="checkbox" className="h-4 w-4 accent-[#96691f]" checked={editing.form.featured} onChange={(e) => set("featured", e.target.checked)} />
                Featured on home
              </label>
            </div>
          </div>

          <Field label="Photos" hint="Elevations first, then floor plans. Add a caption to each.">
            <ImageUploader images={editing.form.images} onChange={(imgs) => set("images", imgs)} adminKey={adminKey} />
          </Field>

          <Field label="One-line tagline">
            <input className="input" value={editing.form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Description" hint="Leave an empty line between paragraphs.">
            <textarea className="input resize-y" rows={5} value={editing.form.description} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Plot depth / length (ft)" hint="The longer side, e.g. 40">
              <input className="input" type="number" step="any" value={editing.form.plotLength} onChange={(e) => set("plotLength", e.target.value)} />
            </Field>
            <Field label="Plot front / width (ft)" hint="The road-facing side, e.g. 20">
              <input className="input" type="number" step="any" value={editing.form.plotWidth} onChange={(e) => set("plotWidth", e.target.value)} />
            </Field>
            <Field label="Plot area in gaj (optional)" hint="Only if the plot is not a rectangle">
              <input className="input" type="number" step="any" value={editing.form.plotGaj} onChange={(e) => set("plotGaj", e.target.value)} />
            </Field>
            <Field label="Facing">
              <select className="input" value={editing.form.facing} onChange={(e) => set("facing", e.target.value)}>
                {["", "East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"].map((f) => (
                  <option key={f} value={f}>
                    {f || "Not specified"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Floors" hint="e.g. Ground + first floor">
              <input className="input" value={editing.form.floors} onChange={(e) => set("floors", e.target.value)} />
            </Field>
            <Field label="Bedrooms">
              <input className="input" type="number" min={0} value={editing.form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
            </Field>
          </div>

          <Field label="Highlights" hint="One per line">
            <textarea className="input resize-y" rows={4} value={editing.form.highlights} onChange={(e) => set("highlights", e.target.value)} />
          </Field>

          <Field label="Room sizes">
            <div className="grid gap-2">
              {editing.form.rooms.map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input className="input !py-2 text-sm" placeholder="Room, e.g. Bedroom" value={r.label} onChange={(e) => set("rooms", editing.form.rooms.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} />
                  <input className="input !py-2 text-sm" placeholder="Size, e.g. 10 ft × 12 ft" value={r.size} onChange={(e) => set("rooms", editing.form.rooms.map((x, k) => (k === i ? { ...x, size: e.target.value } : x)))} />
                  <button type="button" className="text-sm font-medium text-danger" onClick={() => set("rooms", editing.form.rooms.filter((_, k) => k !== i))}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="justify-self-start text-sm font-medium text-brass" onClick={() => set("rooms", [...editing.form.rooms, { label: "", size: "" }])}>
                + Add a room
              </button>
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Location" hint="e.g. Khedi Gokulpura, near Ring Road, Vatika, Jaipur">
              <input className="input" value={editing.form.location} onChange={(e) => set("location", e.target.value)} />
            </Field>
            <Field label="Google Maps link" hint="Open Google Maps, find the plot, Share → Copy link">
              <input className="input" type="url" placeholder="https://maps.app.goo.gl/…" value={editing.form.mapUrl} onChange={(e) => set("mapUrl", e.target.value)} />
            </Field>
            <Field label="Walkthrough video" hint="A YouTube link, or upload an MP4">
              <div className="flex gap-2">
                <input className="input" type="url" placeholder="https://youtu.be/… or Cloudinary URL" value={editing.form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} />
                <FileUploader label="Upload MP4" accept="video/*" adminKey={adminKey} onDone={(url) => set("videoUrl", url)} />
              </div>
            </Field>
            <Field label="Working drawing (PDF)">
              <div className="flex gap-2">
                <input className="input" type="url" placeholder="https://…pdf" value={editing.form.pdfUrl} onChange={(e) => set("pdfUrl", e.target.value)} />
                <FileUploader label="Upload PDF" accept="application/pdf" adminKey={adminKey} onDone={(url) => set("pdfUrl", url)} />
              </div>
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editing.id ? "Save changes" : "Add villa"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 grid gap-3">
        {villas.map((v) => (
          <li key={v._id} className="card flex flex-wrap items-center gap-4 p-3">
            {v.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={v.images[0].url.replace("/upload/", "/upload/c_fill,w_160,h_120,q_auto,f_auto/")} alt="" className="h-16 w-20 rounded-lg object-cover" />
            ) : (
              <div className="grid h-16 w-20 place-items-center rounded-lg bg-cream text-[0.75rem] text-muted">No photo</div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-semibold">
                {v.name} {v.featured && <span className="text-brass" title="Featured on the home page">★</span>}
              </div>
              <div className="text-[0.85rem] text-muted">
                {STATUS_LABEL[v.status]} · order {v.order} · {v.images.length} photo{v.images.length === 1 ? "" : "s"} · /villas/{v.slug}
              </div>
            </div>
            <div className="flex gap-3 text-sm font-medium">
              <a href={`/villas/${v.slug}`} target="_blank" rel="noopener" className="text-ink">
                View
              </a>
              <button type="button" onClick={() => startEdit(v)} className="text-brass">
                Edit
              </button>
              <button type="button" onClick={() => remove(v)} className="text-danger">
                Delete
              </button>
            </div>
          </li>
        ))}
{villas.length === 0 && <li className="text-muted">No villas yet. Click "Add a villa" to create your first listing.</li>}      </ul>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
      {hint && <p className="mt-1 text-[0.8rem] text-muted">{hint}</p>}
    </div>
  );
}
