"use client";

import { useRef, useState } from "react";

export type AdminImage = { url: string; publicId: string; alt: string };

/**
 * Multi-photo uploader for a villa. Files go to /api/upload (Cloudinary) one by one;
 * the first picture is the cover. Pictures can be reordered, captioned and removed.
 */
export default function ImageUploader({ images, onChange, adminKey }: { images: AdminImage[]; onChange: (imgs: AdminImage[]) => void; adminKey: string }) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const next = [...images];
    let i = 0;
    for (const file of Array.from(files)) {
      i += 1;
      setBusy(`Uploading ${i} of ${files.length}: ${file.name}`);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "villas");
      try {
        const res = await fetch("/api/upload", { method: "POST", headers: { "x-admin-secret": adminKey }, body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `Upload failed (${res.status})`);
        next.push({ url: json.url, publicId: json.publicId, alt: "" });
        onChange([...next]);
      } catch (e: any) {
        setError(`${file.name}: ${e?.message ?? "upload failed"}`);
      }
    }
    setBusy("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="btn btn-primary !min-h-10 cursor-pointer !px-4 !py-2 text-sm">
          {busy ? "Uploading…" : "Add photos"}
          <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" disabled={!!busy} onChange={(e) => uploadFiles(e.target.files)} />
        </label>
        <span className="text-[0.85rem] text-muted">{busy || `${images.length} photo${images.length === 1 ? "" : "s"}. The first one is the cover.`}</span>
      </div>
      {error && (
        <p className="mt-2 rounded-xl bg-[#fbe6e2] px-3 py-2 text-[0.85rem] text-danger" role="alert">
          {error}
        </p>
      )}
      {images.length > 0 && (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {images.map((img, i) => (
            <li key={img.url} className="flex gap-3 rounded-xl border border-line bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url.replace("/upload/", "/upload/c_fill,w_200,h_150,q_auto,f_auto/")} alt="" className="h-20 w-28 flex-none rounded-lg object-cover" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <input
                  className="input !py-1.5 text-sm"
                  placeholder={i === 0 ? "Caption (cover photo)" : "Caption, e.g. Ground floor plan"}
                  value={img.alt}
                  onChange={(e) => onChange(images.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))}
                />
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.8rem]">
                  <button type="button" className="font-medium text-brass disabled:opacity-40" disabled={i === 0} onClick={() => move(i, 0)}>
                    Make cover
                  </button>
                  <button type="button" className="font-medium text-ink disabled:opacity-40" disabled={i === 0} onClick={() => move(i, i - 1)}>
                    ↑ Up
                  </button>
                  <button type="button" className="font-medium text-ink disabled:opacity-40" disabled={i === images.length - 1} onClick={() => move(i, i + 1)}>
                    ↓ Down
                  </button>
                  <button type="button" className="font-medium text-danger" onClick={() => onChange(images.filter((_, k) => k !== i))}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** One-file uploader for a video or PDF. Returns the Cloudinary URL. */
export function FileUploader({ label, accept, onDone, adminKey }: { label: string; accept: string; onDone: (url: string) => void; adminKey: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "files");
    try {
      const res = await fetch("/api/upload", { method: "POST", headers: { "x-admin-secret": adminKey }, body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Upload failed (${res.status})`);
      onDone(json.url);
    } catch (e: any) {
      setError(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <label className="btn btn-outline !min-h-9 cursor-pointer !px-3 !py-1.5 text-[0.82rem]">
        {busy ? "Uploading…" : label}
        <input type="file" accept={accept} className="sr-only" disabled={busy} onChange={(e) => upload(e.target.files?.[0])} />
      </label>
      {error && <span className="text-[0.8rem] text-danger">{error}</span>}
    </span>
  );
}
