"use client";

import { useRef, useState } from "react";
import { uploadDirect } from "@/lib/directUpload";

export type AdminImage = { url: string; publicId: string; alt: string };

/**
 * Multi-photo uploader for a villa. Files go straight from the browser to Cloudinary
 * (the server only signs each upload), with a progress bar per file.
 * The first picture is the cover. Pictures can be reordered, captioned and removed.
 */
export default function ImageUploader({ images, onChange, adminKey }: { images: AdminImage[]; onChange: (imgs: AdminImage[]) => void; adminKey: string }) {
  const [busy, setBusy] = useState("");
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const next = [...images];
    const list = Array.from(files);
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      setBusy(`Uploading ${i + 1} of ${list.length}: ${file.name}`);
      setPercent(0);
      try {
        const up = await uploadDirect(file, { adminKey, folder: "villas", onProgress: setPercent });
        next.push({ url: up.url, publicId: up.publicId, alt: "" });
        onChange([...next]);
      } catch (e: any) {
        setError(`${file.name}: ${e?.message ?? "upload failed"}`);
      }
    }
    setBusy("");
    setPercent(0);
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
          {busy ? `Uploading… ${percent}%` : "Add photos"}
          <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" disabled={!!busy} onChange={(e) => uploadFiles(e.target.files)} />
        </label>
        <span className="text-[0.85rem] text-muted" aria-live="polite">
          {busy || `${images.length} photo${images.length === 1 ? "" : "s"}. The first one is the cover.`}
        </span>
      </div>
      {busy && (
        <div className="mt-2 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="h-full bg-brass transition-[width]" style={{ width: `${percent}%` }} />
        </div>
      )}
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
              <img src={thumb(img.url, 200, 150)} alt="" className="h-20 w-28 flex-none rounded-lg object-cover" />
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
  const [percent, setPercent] = useState<number | null>(null);
  const [error, setError] = useState("");
  async function upload(file: File | undefined) {
    if (!file) return;
    setPercent(0);
    setError("");
    try {
      const up = await uploadDirect(file, { adminKey, folder: "files", onProgress: setPercent });
      onDone(up.url);
    } catch (e: any) {
      setError(e?.message ?? "Upload failed");
    } finally {
      setPercent(null);
    }
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <label className="btn btn-outline !min-h-9 cursor-pointer !px-3 !py-1.5 text-[0.82rem]">
        {percent === null ? label : `Uploading… ${percent}%`}
        <input type="file" accept={accept} className="sr-only" disabled={percent !== null} onChange={(e) => upload(e.target.files?.[0])} />
      </label>
      {error && <span className="text-[0.8rem] text-danger">{error}</span>}
    </span>
  );
}

/** Single-photo uploader with a preview (founder photos). */
export function PhotoUploader({
  value,
  onChange,
  adminKey,
  folder,
  shape = "arch",
}: {
  value: { url: string; publicId: string };
  onChange: (v: { url: string; publicId: string }) => void;
  adminKey: string;
  folder: string;
  shape?: "arch" | "square";
}) {
  const [percent, setPercent] = useState<number | null>(null);
  const [error, setError] = useState("");
  async function upload(file: File | undefined) {
    if (!file) return;
    setPercent(0);
    setError("");
    try {
      const up = await uploadDirect(file, { adminKey, folder, onProgress: setPercent });
      onChange({ url: up.url, publicId: up.publicId });
    } catch (e: any) {
      setError(e?.message ?? "Upload failed");
    } finally {
      setPercent(null);
    }
  }
  return (
    <div className="flex items-start gap-4">
      <div className={`relative h-28 w-24 flex-none overflow-hidden bg-pine ${shape === "arch" ? "arch" : "rounded-xl"}`}>
        {value.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb(value.url, 240, 300)} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center text-[0.72rem] text-on-pine/70">No photo</span>
        )}
      </div>
      <div className="grid gap-2">
        <label className="btn btn-outline !min-h-9 cursor-pointer justify-self-start !px-3 !py-1.5 text-[0.82rem]">
          {percent === null ? (value.url ? "Change photo" : "Upload photo") : `Uploading… ${percent}%`}
          <input type="file" accept="image/*" className="sr-only" disabled={percent !== null} onChange={(e) => upload(e.target.files?.[0])} />
        </label>
        {value.url && (
          <button type="button" className="justify-self-start text-[0.82rem] font-medium text-danger" onClick={() => onChange({ url: "", publicId: "" })}>
            Remove photo
          </button>
        )}
        <p className="text-[0.78rem] text-muted">A clear head-and-shoulders photo works best. It is shown inside an arch.</p>
        {error && <span className="text-[0.8rem] text-danger">{error}</span>}
      </div>
    </div>
  );
}

/** Small Cloudinary thumbnail for admin lists. Leaves non-Cloudinary URLs alone. */
export function thumb(url: string, w: number, h: number) {
  return url.includes("res.cloudinary.com") ? url.replace("/upload/", `/upload/c_fill,w_${w},h_${h},q_auto,f_auto/`) : url;
}
