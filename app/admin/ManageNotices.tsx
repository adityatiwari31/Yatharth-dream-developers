"use client";

import { useEffect, useState } from "react";
import type { NoticeJSON } from "@/lib/villaTypes";
import type { VillaJSON } from "@/lib/villaTypes";

type Form = { title: string; text: string; link: string; active: boolean; order: number };
const EMPTY: Form = { title: "", text: "", link: "", active: true, order: 0 };

/** The floating "Upcoming" bar on the home page: add, edit, switch on/off, remove lines. */
export default function ManageNotices({ adminKey }: { adminKey: string }) {
  const [items, setItems] = useState<NoticeJSON[]>([]);
  const [villas, setVillas] = useState<VillaJSON[]>([]);
  const [status, setStatus] = useState("Loading…");
  const [editing, setEditing] = useState<{ id: string | null; form: Form } | null>(null);
  const [saving, setSaving] = useState(false);
  const headers = { "Content-Type": "application/json", "x-admin-secret": adminKey };

  async function load() {
    try {
      const [a, b] = await Promise.all([fetch("/api/notices", { headers, cache: "no-store" }), fetch("/api/villas", { cache: "no-store" })]);
      if (a.status === 401) return setStatus("Admin key not accepted. Lock and unlock again.");
      if (!a.ok) return setStatus(`Could not load (server replied ${a.status}).`);
      setItems((await a.json()).notices ?? []);
      if (b.ok) setVillas((await b.json()).villas ?? []);
      setStatus("");
    } catch {
      setStatus("Network error while loading.");
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startNew() {
    setEditing({ id: null, form: { ...EMPTY, order: items.length + 1 } });
    setStatus("");
  }
  function startEdit(n: NoticeJSON) {
    setEditing({ id: n._id, form: { title: n.title, text: n.text, link: n.link, active: n.active, order: n.order } });
    setStatus("");
  }
  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setEditing((e) => (e ? { ...e, form: { ...e.form, [key]: value } } : e));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!editing.form.title.trim()) return setStatus("Please add a title.");
    setSaving(true);
    try {
      const res = await fetch(editing.id ? `/api/notices/${editing.id}` : "/api/notices", {
        method: editing.id ? "PUT" : "POST",
        headers,
        body: JSON.stringify(editing.form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setStatus(json.error || `Could not save (server replied ${res.status}).`);
      else {
        setStatus("Saved. The home page shows it straight away.");
        setEditing(null);
        await load();
      }
    } catch {
      setStatus("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(n: NoticeJSON) {
    const res = await fetch(`/api/notices/${n._id}`, { method: "PUT", headers, body: JSON.stringify({ active: !n.active }) });
    setStatus(res.ok ? (n.active ? "Switched off." : "Switched on.") : `Failed (server replied ${res.status}).`);
    if (res.ok) load();
  }
  async function remove(n: NoticeJSON) {
    if (!window.confirm(`Remove “${n.title}” from the upcoming bar?`)) return;
    const res = await fetch(`/api/notices/${n._id}`, { method: "DELETE", headers });
    setStatus(res.ok ? "Removed." : `Failed (server replied ${res.status}).`);
    if (res.ok) load();
  }

  const active = items.filter((n) => n.active).length;

  return (
    <section aria-label="Manage the upcoming bar">
      <p className="max-w-2xl text-[0.92rem] text-muted">
        These lines float at the bottom of the home page in a green strip. Visitors can close it; it comes back on their next visit. With more than one
        line switched on, the strip rotates through them.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={startNew} className="btn btn-primary !min-h-10 !px-4 !py-2 text-sm">
          Add a line
        </button>
        <span className="text-[0.88rem] text-muted" aria-live="polite">
          {status || `${active} of ${items.length} switched on.`}
        </span>
      </div>

      {editing && (
        <form onSubmit={save} className="card mt-5 grid gap-4 p-5 sm:p-6">
          <h2 className="!text-[1.3rem]">{editing.id ? "Edit line" : "New line"}</h2>
          <label className="block">
            <span className="label">Title</span>
            <input className="input" value={editing.form.title} onChange={(e) => set("title", e.target.value)} required placeholder="e.g. Jaipur Vatika: 15 villas near the Ring Road" />
          </label>
          <label className="block">
            <span className="label">Second line (optional)</span>
            <input className="input" value={editing.form.text} onChange={(e) => set("text", e.target.value)} placeholder="e.g. Bookings open. Plot sizes from 85 gaj." />
          </label>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
            <label className="block">
              <span className="label">Where it should take people (optional)</span>
              <input className="input" list="notice-links" value={editing.form.link} onChange={(e) => set("link", e.target.value)} placeholder="/villas/… or https://…" />
              <datalist id="notice-links">
                {villas.map((v) => (
                  <option key={v._id} value={`/villas/${v.slug}`}>
                    {v.name}
                  </option>
                ))}
                <option value="/villas">All villas</option>
                <option value="/contact">Contact page</option>
                <option value="/location">Location page</option>
              </datalist>
            </label>
            <label className="block">
              <span className="label">Order</span>
              <input className="input w-24" type="number" value={editing.form.order} onChange={(e) => set("order", Number(e.target.value) || 0)} />
            </label>
            <label className="flex items-end gap-2 pb-3 text-[0.92rem] font-medium">
              <input type="checkbox" className="h-4 w-4 accent-[#96691f]" checked={editing.form.active} onChange={(e) => set("active", e.target.checked)} />
              Switched on
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editing.id ? "Save changes" : "Add line"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 grid gap-3">
        {items.map((n) => (
          <li key={n._id} className={`card flex flex-wrap items-center gap-4 p-4 ${n.active ? "" : "opacity-60"}`}>
            <span className={`rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${n.active ? "bg-[#e3efe6] text-ok" : "bg-cream text-muted"}`}>
              {n.active ? "On" : "Off"}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{n.title}</div>
              <div className="text-[0.85rem] text-muted">
                {n.text && <span>{n.text} · </span>}
                {n.link ? `→ ${n.link}` : "no link"} · order {n.order}
              </div>
            </div>
            <div className="flex gap-3 text-sm font-medium">
              <button type="button" onClick={() => toggle(n)} className="text-ink">
                {n.active ? "Switch off" : "Switch on"}
              </button>
              <button type="button" onClick={() => startEdit(n)} className="text-brass">
                Edit
              </button>
              <button type="button" onClick={() => remove(n)} className="text-danger">
                Remove
              </button>
            </div>
          </li>
        ))}
        {!status && items.length === 0 && <li className="text-muted">Nothing yet. Add a line and it appears at the bottom of the home page.</li>}
      </ul>
    </section>
  );
}
