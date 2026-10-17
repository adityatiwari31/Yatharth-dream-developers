"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "./Icons";
import { isSaved, toggleSaved, SAVED_EVENT, type SavedVilla } from "@/lib/saved";

/**
 * Bookmark toggle. `variant="icon"` is the round button on cards;
 * `variant="button"` is the full pill used on a villa page.
 */
export default function SaveButton({ item, variant = "icon" }: { item: SavedVilla; variant?: "icon" | "button" }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const update = () => setSaved(isSaved(item.id));
    update();
    window.addEventListener(SAVED_EVENT, update);
    return () => window.removeEventListener(SAVED_EVENT, update);
  }, [item.id]);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(toggleSaved(item));
  };

  if (variant === "button") {
    return (
      <button type="button" onClick={onClick} className={`btn ${saved ? "bg-ink text-cream" : "btn-outline"}`} aria-pressed={saved}>
        <HeartIcon className="h-4 w-4" filled={saved} />
        {saved ? "Saved" : "Save villa"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved villas" : "Save this villa"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition ${
        saved ? "border-brass bg-brass text-white" : "border-white/70 bg-white/80 text-ink hover:bg-white"
      }`}
    >
      <HeartIcon className="h-4.5 w-4.5" filled={saved} />
    </button>
  );
}
