"use client";

import { useEffect, useState } from "react";
import { PhotoUploader } from "./ImageUploader";
import type { FounderJSON } from "@/lib/villaTypes";

const EMPTY: FounderJSON = { name: "", role: "Co-founder", bio: "", photo: { url: "", publicId: "" } };

/** The founders on the About page: names, roles, introductions and photos. */
export default function ManageFounders({ adminKey }: { adminKey: string }) {
  const [founders, setFounders] = useState<FounderJSON[] | null>(null);
  const [status, setStatus] = useState("Loading…");
  const [saving, setSaving] = useState(false);
  const headers = { "Content-Type": "application/json", "x-admin-secret": adminKey };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings/founders", { headers, cache: "no-store" });
        if (res.status === 401) return setStatus("Admin key not accepted. Lock and unlock again.");
        if (!res.ok) return setStatus(`Could not load (server replied ${res.status}).`);
        const json = await res.json();
        setFounders(json.founders ?? []);
        setStatus(json.saved ? "" : "These are the starting values. Edit them and click Save.");
      } catch {
        setStatus("Network error while loading.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(i: number, patch: Partial<FounderJSON>) {
    setFounders((list) => (list ? list.map((f, k) => (k === i ? { ...f, ...patch } : f)) : list));
  }
  function move(i: number, to: number) {
    setFounders((list) => {
      if (!list || to < 0 || to >= list.length) return list;
      const next = [...list];
      const [item] = next.splice(i, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!founders) return;
    if (founders.some((f) => !f.name.trim())) return setStatus("Every founder needs a name.");
    setSaving(true);
    try {
      const res = await fetch("/api/settings/founders", { method: "PUT", headers, body: JSON.stringify({ founders }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setStatus(json.error || `Could not save (server replied ${res.status}).`);
      else {
        setFounders(json.founders ?? founders);
        setStatus("Saved. The About page is updated.");
      }
    } catch {
      setStatus("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  if (!founders) return <p className="text-muted">{status}</p>;

  return (
    <form onSubmit={save} aria-label="Manage founders" className="grid gap-5">
      <p className="max-w-2xl text-[0.92rem] text-muted">Shown on the About page under “The founders”. Upload a photo for each person; until then their initials are shown.</p>
      {founders.map((f, i) => (
        <section key={i} className="card grid gap-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="!text-[1.2rem]">{f.name || `Founder ${i + 1}`}</h2>
            <div className="flex gap-3 text-sm font-medium">
              <button type="button" className="text-ink disabled:opacity-40" disabled={i === 0} onClick={() => move(i, i - 1)}>
                ↑ Up
              </button>
              <button type="button" className="text-ink disabled:opacity-40" disabled={i === founders.length - 1} onClick={() => move(i, i + 1)}>
                ↓ Down
              </button>
              <button
                type="button"
                className="text-danger disabled:opacity-40"
                disabled={founders.length === 1}
                onClick={() => window.confirm(`Remove ${f.name || "this founder"} from the About page?`) && setFounders(founders.filter((_, k) => k !== i))}
              >
                Remove
              </button>
            </div>
          </div>
          <PhotoUploader value={f.photo} onChange={(photo) => update(i, { photo })} adminKey={adminKey} folder="founders" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label">Name</span>
              <input className="input" value={f.name} onChange={(e) => update(i, { name: e.target.value })} required />
            </label>
            <label className="block">
              <span className="label">Role</span>
              <input className="input" value={f.role} onChange={(e) => update(i, { role: e.target.value })} placeholder="e.g. Co-founder and Director" />
            </label>
          </div>
          <label className="block">
            <span className="label">Introduction (two or three sentences)</span>
            <textarea className="input resize-y" rows={3} value={f.bio} onChange={(e) => update(i, { bio: e.target.value })} />
          </label>
        </section>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save founders"}
        </button>
        {founders.length < 4 && (
          <button type="button" className="btn btn-outline" onClick={() => setFounders([...founders, { ...EMPTY }])}>
            Add another founder
          </button>
        )}
        <span className="text-[0.88rem] text-muted" aria-live="polite">
          {status}
        </span>
      </div>
    </form>
  );
}
