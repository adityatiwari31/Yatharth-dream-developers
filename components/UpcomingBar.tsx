"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, CloseIcon } from "./Icons";
import type { NoticeJSON } from "@/lib/villaTypes";

const DISMISSED_KEY = "ydd:upcoming-dismissed";

/**
 * Floating "Upcoming" strip at the bottom of the home page.
 * Items come from /admin → Upcoming bar. The visitor can close it (remembered for
 * the rest of their visit). With more than one item it rotates every few seconds.
 */
export default function UpcomingBar({ items }: { items: NoticeJSON[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Show after the page has settled, unless the visitor closed it earlier in this visit.
  useEffect(() => {
    if (!items.length) return;
    try {
      if (window.sessionStorage.getItem(DISMISSED_KEY) === "1") return;
    } catch {
      /* private mode: just show it */
    }
    const t = window.setTimeout(() => setOpen(true), 800);
    return () => window.clearTimeout(t);
  }, [items.length]);

  // Tell the rest of the page how tall the bar is (WhatsApp button and footer make room).
  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!open || !el) {
      root.style.setProperty("--notice-h", "0px");
      return;
    }
    const set = () => root.style.setProperty("--notice-h", `${el.offsetHeight + 12}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--notice-h", "0px");
    };
  }, [open]);

  // Rotate through several items (not when hovered, and not for people who prefer reduced motion).
  useEffect(() => {
    if (!open || items.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIndex((n) => (n + 1) % items.length), 6000);
    return () => window.clearInterval(t);
  }, [open, items.length, paused]);

  if (!open || !items.length) return null;

  const n = items[index % items.length];
  const internal = n.link.startsWith("/");
  const close = () => {
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const body = (
    <>
      <span className="flex-none rounded-full bg-brass-light px-2.5 py-1 text-[0.72rem] font-bold text-ink">Upcoming</span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 block text-[0.95rem] font-semibold leading-snug sm:line-clamp-none sm:truncate">{n.title}</span>
        {n.text && <span className="block truncate text-[0.82rem] text-on-pine/80">{n.text}</span>}
      </span>
      {n.link && <ChevronRight className="hidden h-5 w-5 flex-none text-brass-light sm:block" />}
    </>
  );

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Upcoming projects"
      className="rise fixed inset-x-3 z-30 sm:inset-x-auto sm:left-1/2 sm:w-[min(760px,calc(100vw-2rem))] sm:-translate-x-1/2"
      style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-brass-light/40 bg-pine py-2 pl-3 pr-2 text-on-pine shadow-warm sm:gap-3 sm:pl-4">
        {n.link ? (
          internal ? (
            <Link href={n.link} className="flex min-w-0 flex-1 items-center gap-3 no-underline hover:text-brass-light" aria-live="polite">
              {body}
            </Link>
          ) : (
            <a href={n.link} target="_blank" rel="noopener" className="flex min-w-0 flex-1 items-center gap-3 no-underline hover:text-brass-light" aria-live="polite">
              {body}
            </a>
          )
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3" aria-live="polite">
            {body}
          </div>
        )}
        {items.length > 1 && (
          <span className="hidden flex-none text-[0.75rem] tabular-nums text-on-pine/70 sm:inline" aria-label={`Item ${index + 1} of ${items.length}`}>
            {index + 1}/{items.length}
          </span>
        )}
        <button
          type="button"
          onClick={close}
          aria-label="Close upcoming projects"
          className="grid h-9 w-9 flex-none place-items-center rounded-full border border-on-pine/35 text-on-pine transition hover:bg-on-pine/10"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
