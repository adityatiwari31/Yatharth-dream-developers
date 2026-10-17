"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CloseIcon, PlayIcon } from "./Icons";

type Img = { url: string; alt: string };

function youTubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

/** Photo gallery with thumbnails and a full-screen viewer. Optional video appears as the last tile. */
export default function Gallery({ images, name, videoUrl }: { images: Img[]; name: string; videoUrl?: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showVideo, setShowVideo] = useState(false);

  const count = images.length;
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, index, go]);

  useEffect(() => setZoom(1), [index, open]);

  if (count === 0 && !videoUrl) {
    return <div className="card grid aspect-[4/3] place-items-center text-muted">Photos coming soon</div>;
  }

  const current = images[index];
  const yt = videoUrl ? youTubeId(videoUrl) : null;

  return (
    <div>
      {/* Main picture or video */}
      <div className="card relative aspect-[4/3] overflow-hidden bg-cream">
        {showVideo && videoUrl ? (
          yt ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
              title={`${name} walkthrough video`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video className="absolute inset-0 h-full w-full bg-black object-contain" src={videoUrl} controls autoPlay playsInline />
          )
        ) : current ? (
          <button type="button" className="absolute inset-0 block h-full w-full cursor-zoom-in" onClick={() => setOpen(true)} aria-label="Open full-size picture">
            <Image src={current.url} alt={current.alt || name} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-contain" />
          </button>
        ) : null}
        {count > 1 && !showVideo && (
          <>
            <NavButton side="left" onClick={() => go(index - 1)} />
            <NavButton side="right" onClick={() => go(index + 1)} />
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.75rem] font-medium text-cream">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {(count > 1 || videoUrl) && (
        <div className="scroller mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => {
                setShowVideo(false);
                setIndex(i);
              }}
              className={`relative h-18 w-24 flex-none overflow-hidden rounded-lg border-2 bg-cream ${
                i === index && !showVideo ? "border-brass" : "border-transparent hover:border-line-strong"
              }`}
              aria-label={`Show picture ${i + 1}${img.alt ? `: ${img.alt}` : ""}`}
              aria-current={i === index && !showVideo ? "true" : undefined}
            >
              <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
          {videoUrl && (
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              className={`relative grid h-18 w-24 flex-none place-items-center overflow-hidden rounded-lg border-2 bg-ink text-cream ${
                showVideo ? "border-brass" : "border-transparent hover:border-line-strong"
              }`}
              aria-label="Play walkthrough video"
            >
              <PlayIcon className="h-7 w-7" />
              <span className="absolute bottom-1 text-[0.65rem]">Video</span>
            </button>
          )}
        </div>
      )}

      {/* Full-screen viewer */}
      {open && current && (
        <div className="fixed inset-0 z-[90] overflow-auto bg-[#0f0a08]/95" role="dialog" aria-modal="true" aria-label="Enlarged picture">
          <div className="fixed right-3 top-3 z-[91] flex gap-2">
            <button type="button" onClick={() => setZoom((z) => Math.max(0.5, z / 1.3))} className="btn btn-primary !min-h-11 !px-4" aria-label="Zoom out">
              −
            </button>
            <button type="button" onClick={() => setZoom((z) => Math.min(5, z * 1.3))} className="btn btn-primary !min-h-11 !px-4" aria-label="Zoom in">
              +
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-primary !min-h-11 !px-4" aria-label="Close">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          {count > 1 && (
            <>
              <NavButton side="left" onClick={() => go(index - 1)} fixed />
              <NavButton side="right" onClick={() => go(index + 1)} fixed />
            </>
          )}
          <div className="flex min-h-full items-start justify-center px-3 pb-16 pt-20">
            {/* Plain img here so the zoom can grow past the viewport and scroll */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.alt || name}
              style={{ width: `min(${Math.round(100 * zoom)}vw, ${Math.round(1200 * zoom)}px)`, maxWidth: "none" }}
              className="rounded-md bg-white"
            />
          </div>
          <p className="fixed bottom-3 left-0 right-0 px-4 text-center text-[0.9rem] text-cream/90" style={{ textShadow: "0 1px 3px #000" }}>
            {current.alt || name}
            {count > 1 ? ` (${index + 1} of ${count})` : ""}
          </p>
        </div>
      )}
    </div>
  );
}

function NavButton({ side, onClick, fixed = false }: { side: "left" | "right"; onClick: () => void; fixed?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous picture" : "Next picture"}
      className={`${fixed ? "fixed z-[91]" : "absolute"} top-1/2 -translate-y-1/2 ${
        side === "left" ? "left-3" : "right-3"
      } grid h-11 w-11 place-items-center rounded-full bg-brass-light text-ink shadow-warm hover:brightness-105`}
    >
      {side === "left" ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}
