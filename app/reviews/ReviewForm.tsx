"use client";

import { useRef, useState } from "react";

const MIN_WORDS = 5;
const MAX_WORDS = 80;
const MAX_PHOTO_MB = 5;

function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

/** Public review form. The review waits for approval in /admin before it is shown. */
export default function ReviewForm() {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const words = wordCount(text);
  const wordsOk = words >= MIN_WORDS && words <= MAX_WORDS;

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setError("");
    if (!f) return setPreview("");
    if (!f.type.startsWith("image/")) {
      setError("Please choose a photo (JPG, PNG or HEIC).");
      e.target.value = "";
      return setPreview("");
    }
    if (f.size > MAX_PHOTO_MB * 1024 * 1024) {
      setError(`That photo is larger than ${MAX_PHOTO_MB} MB. Please choose a smaller one.`);
      e.target.value = "";
      return setPreview("");
    }
    setPreview(URL.createObjectURL(f));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!wordsOk) return;
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/reviews", { method: "POST", body: new FormData(form) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
      form.reset();
      setText("");
      setPreview("");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-6">
        <h3>Thank you.</h3>
        <p className="mt-2 text-muted">Your review is saved and will appear here once we have read it, usually within a day.</p>
        <button type="button" className="btn btn-outline mt-4" onClick={() => setStatus("idle")}>
          Write another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6" encType="multipart/form-data">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rv-name" className="label">
            Your name
          </label>
          <input id="rv-name" name="name" required autoComplete="name" className="input" />
        </div>
        <div>
          <label htmlFor="rv-bought" className="label">
            What you bought or visited (optional)
          </label>
          <input id="rv-bought" name="bought" className="input" placeholder="e.g. 20 × 40 villa, Jaipur Vatika" />
        </div>
      </div>

      <fieldset>
        <legend className="label">Your rating</legend>
        <div className="stars" role="radiogroup">
          {[5, 4, 3, 2, 1].map((n) => (
            <span key={n} className="contents">
              <input type="radio" name="rating" id={`rv-r${n}`} value={n} required defaultChecked={n === 5} />
              <label htmlFor={`rv-r${n}`} title={`${n} star${n === 1 ? "" : "s"}`}>
                <span className="sr-only">{n} stars</span>★
              </label>
            </span>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="rv-text" className="label">
          Your feedback
        </label>
        <textarea
          id="rv-text"
          name="text"
          rows={4}
          required
          className="input resize-y"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-describedby="rv-words"
        />
        <p id="rv-words" className={`mt-1 text-[0.82rem] ${words > MAX_WORDS ? "text-danger" : "text-muted"}`}>
          {words} / {MAX_WORDS} words{words > 0 && words < MIN_WORDS ? ` (at least ${MIN_WORDS})` : ""}
        </p>
      </div>

      <div>
        <label htmlFor="rv-photo" className="label">
          Add a photo (optional)
        </label>
        <input id="rv-photo" ref={fileRef} name="photo" type="file" accept="image/*" onChange={onPhoto} className="block w-full text-[0.9rem] file:mr-3 file:rounded-full file:border-0 file:bg-brass-pale file:px-4 file:py-2 file:font-medium file:text-ink" />
        <p className="mt-1 text-[0.82rem] text-muted">A picture of your villa, the site visit or your family at the plot helps the next buyer trust the review.</p>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview of your photo" className="mt-3 h-28 w-auto rounded-lg border border-line object-cover" />
        )}
      </div>

      {error && (
        <p className="rounded-xl bg-[#fbe6e2] px-4 py-3 text-[0.9rem] text-danger" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={!wordsOk || status === "sending"}>
        {status === "sending" ? "Sending…" : "Send review"}
      </button>
      <p className="text-[0.82rem] text-muted">We read every review before it goes up.</p>
    </form>
  );
}
