"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HeartIcon, WhatsAppIcon } from "@/components/Icons";
import { BRAND_NAME, SITE_URL, waLink } from "@/lib/config";
import { clearSaved, getSaved, removeSaved, SAVED_EVENT, type SavedVilla } from "@/lib/saved";

export default function SavedPage() {
  const [list, setList] = useState<SavedVilla[] | null>(null);

  useEffect(() => {
    const update = () => setList(getSaved());
    update();
    window.addEventListener(SAVED_EVENT, update);
    return () => window.removeEventListener(SAVED_EVENT, update);
  }, []);

  const wa = list?.length
    ? waLink(
        `Hello, I am interested in these villas by ${BRAND_NAME}:\n` + list.map((v) => `• ${v.name}\n  ${SITE_URL}/villas/${v.slug}`).join("\n"),
      )
    : "";

  return (
    <div className="wrap section-pad">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="!text-[2.1rem] sm:!text-[2.6rem]">Saved villas</h1>
          <p className="mt-2 text-muted">Saved on this device only. Nothing is sent to us until you message.</p>
        </div>
        {list && list.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <a href={wa} target="_blank" rel="noopener" className="btn btn-wa">
              <WhatsAppIcon className="h-4 w-4" /> Ask about all {list.length}
            </a>
            <button type="button" className="btn btn-outline" onClick={() => clearSaved()}>
              Clear list
            </button>
          </div>
        )}
      </div>

      {list === null ? (
        <p className="mt-10 text-muted">Loading…</p>
      ) : list.length === 0 ? (
        <div className="card mt-10 p-10 text-center">
          <HeartIcon className="mx-auto h-8 w-8 text-brass" />
          <p className="mt-3 text-muted">No villas saved yet. Tap the heart on any villa to keep it here.</p>
          <Link href="/villas" className="btn btn-primary mt-5">
            Browse the villas
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => (
            <li key={v.id} className="card flex overflow-hidden">
              <Link href={`/villas/${v.slug}`} className="relative block w-32 flex-none bg-cream sm:w-40">
                {v.image && <Image src={v.image} alt="" fill sizes="160px" className="object-cover" />}
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="!text-[1.05rem]">
                  <Link href={`/villas/${v.slug}`} className="no-underline hover:text-brass">
                    {v.name}
                  </Link>
                </h3>
                {v.sub && <p className="mt-1 text-[0.88rem] text-muted">{v.sub}</p>}
                <button type="button" onClick={() => removeSaved(v.id)} className="mt-auto self-start pt-3 text-[0.85rem] font-medium text-danger">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
