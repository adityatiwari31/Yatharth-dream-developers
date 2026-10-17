"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import VillaCard from "@/components/VillaCard";
import { STATUS_LABEL, VILLA_STATUSES, type VillaJSON, type VillaStatus } from "@/lib/villaTypes";
import { WA_GENERAL } from "@/lib/config";

/** All villas are already on the page; filtering by status happens instantly in the browser. */
export default function VillaGrid({ villas }: { villas: VillaJSON[] }) {
  const [active, setActive] = useState<VillaStatus | "all">("all");
  const counts = useMemo(() => {
    const c: Partial<Record<VillaStatus, number>> = {};
    for (const v of villas) c[v.status] = (c[v.status] ?? 0) + 1;
    return c;
  }, [villas]);
  const shown = active === "all" ? villas : villas.filter((v) => v.status === active);

  return (
    <>
      <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        <Chip label={`All (${villas.length})`} active={active === "all"} onClick={() => setActive("all")} />
        {VILLA_STATUSES.map((s) =>
          counts[s] ? <Chip key={s} label={`${STATUS_LABEL[s]} (${counts[s]})`} active={active === s} onClick={() => setActive(s)} /> : null,
        )}
      </div>

      {shown.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {shown.map((v, i) => (
            <VillaCard key={v._id} villa={v} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="card mt-8 p-8 text-center">
          <p className="text-muted">{villas.length ? "No villas in this group yet." : "No villas have been added yet."}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {villas.length > 0 && (
              <button type="button" className="btn btn-outline" onClick={() => setActive("all")}>
                Show all villas
              </button>
            )}
            <a href={WA_GENERAL} target="_blank" rel="noopener" className="btn btn-wa">
              Ask on WhatsApp
            </a>
          </div>
        </div>
      )}

      <p className="mt-10 text-[0.9rem] text-muted">
        Designs are adjusted to fit the land. To work out your plot size, use the{" "}
        <Link href="/size-guide" className="font-medium text-brass">
          size guide
        </Link>
        .
      </p>
    </>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-[0.9rem] font-medium transition ${
        active ? "border-ink bg-ink text-cream" : "border-line bg-card text-ink hover:border-brass"
      }`}
    >
      {label}
    </button>
  );
}
