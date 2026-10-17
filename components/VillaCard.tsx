import Image from "next/image";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import SaveButton from "./SaveButton";
import type { VillaJSON } from "@/lib/villaTypes";
import { plotFacts } from "@/lib/units";

export function villaSubline(v: VillaJSON) {
  const f = plotFacts(v.plotLength, v.plotWidth, v.plotGaj);
  const bits = [f.sizeText, f.gajText, v.facing ? `${v.facing} facing` : ""].filter(Boolean);
  return bits.join(", ");
}

export default function VillaCard({ villa, priority = false }: { villa: VillaJSON; priority?: boolean }) {
  const cover = villa.images[0];
  const sub = villaSubline(villa);
  return (
    <article className="card group relative flex flex-col overflow-hidden">
      <Link href={`/villas/${villa.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-cream no-underline">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt || villa.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted">No photo yet</div>
        )}
        <StatusBadge status={villa.status} className="absolute left-3 top-3 shadow-soft" />
        {villa.images.length > 1 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.72rem] font-medium text-cream">
            {villa.images.length} photos
          </span>
        )}
      </Link>
      <div className="absolute right-3 top-3">
        <SaveButton item={{ id: villa._id, slug: villa.slug, name: villa.name, image: cover?.url ?? "", sub }} />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="leading-snug">
          <Link href={`/villas/${villa.slug}`} className="no-underline hover:text-brass">
            {villa.name}
          </Link>
        </h3>
        {sub && <p className="mt-1.5 text-[0.92rem] text-muted">{sub}</p>}
        {villa.tagline && <p className="mt-2 line-clamp-2 text-[0.95rem] text-ink/85">{villa.tagline}</p>}
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-[0.88rem] text-muted">
          {villa.floors && <span>{villa.floors}</span>}
          {villa.bedrooms > 0 && <span>{villa.bedrooms} bedroom{villa.bedrooms === 1 ? "" : "s"}</span>}
        </div>
      </div>
    </article>
  );
}
