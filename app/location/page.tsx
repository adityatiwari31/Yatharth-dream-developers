import type { Metadata } from "next";
import { PinIcon } from "@/components/Icons";
import StatusBadge from "@/components/StatusBadge";
import { getVillas } from "@/lib/data";
import { AMENITIES, AREA_DIRECTIONS_URL, AREA_MAPS_URL, DISTANCES, NEARBY_PROJECTS } from "@/lib/config";
import Link from "next/link";

export const revalidate = 60; // cached, refreshed within a minute (and instantly after admin changes)

export const metadata: Metadata = {
  title: "Location and amenities",
  description: "Where our villas are: Vatika and Khedi Gokulpura on the Tonk Road side of Jaipur, near the Ring Road. Distances, schools, hospitals, markets and nearby developments.",
};

export default async function LocationPage() {
  const villas = (await getVillas()).filter((v) => v.mapUrl);

  return (
    <>
      <section className="wrap section-pad" aria-labelledby="loc-heading">
        <div className="max-w-2xl">
          <h1 id="loc-heading" className="!text-[2.1rem] sm:!text-[2.6rem]">Know exactly where your villa will be</h1>
          <p className="lead mt-3">
            Our upcoming project is at Village Vatika, Tehsil Sanganer, on the Tonk Road side of Jaipur. Our villa under construction is at Khedi
            Gokulpura, near the Ring Road. The map shows how far some popular places are.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <DistanceMap />
          <div>
            <h2 className="!text-[1.5rem]">Distances from Vatika</h2>
            <dl className="mt-3 divide-y divide-line">
              {DISTANCES.map((d) => (
                <div key={d.place} className="flex justify-between gap-4 py-2.5">
                  <dt>{d.place}</dt>
                  <dd className="whitespace-nowrap font-medium">About {d.km} km</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-[0.85rem] text-muted">Distances are approximate.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={AREA_MAPS_URL} target="_blank" rel="noopener" className="btn btn-primary">
                <PinIcon className="h-4 w-4" /> Open in Google Maps
              </a>
              <a href={AREA_DIRECTIONS_URL} target="_blank" rel="noopener" className="btn btn-outline">
                Get directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {villas.length > 0 && (
        <section className="bg-cream">
          <div className="wrap section-pad" aria-labelledby="sites-heading">
            <h2 id="sites-heading" className="!text-[1.7rem]">Our sites on the map</h2>
            <p className="mt-2 text-muted">Each listing has its own Google Maps link.</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {villas.map((v) => (
                <li key={v._id} className="card flex flex-col p-5">
                  <StatusBadge status={v.status} className="self-start" />
                  <h3 className="mt-3">
                    <Link href={`/villas/${v.slug}`} className="no-underline hover:text-brass">
                      {v.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[0.92rem] text-muted">{v.location}</p>
                  <a href={v.mapUrl} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1.5 font-medium text-brass">
                    <PinIcon className="h-4 w-4" /> Open in Google Maps
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="wrap section-pad" aria-labelledby="amen-heading">
        <h2 id="amen-heading" className="!text-[1.7rem]">Amenities nearby</h2>
        <p className="mt-2 text-muted">What is around your villa, from schools and hospitals to markets and buses.</p>
        <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((a) => (
            <div key={a.title} className="border-t-2 border-brass pt-4">
              <h3>{a.title}</h3>
              <p className="mt-1.5 text-[0.95rem] text-muted">{a.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[0.85rem] text-muted">Names and distances are approximate and come from public property portals. Please confirm them when you visit.</p>
      </section>

      <section className="bg-pine text-on-pine">
        <div className="wrap section-pad" aria-labelledby="near-heading">
          <h2 id="near-heading" className="!text-[1.7rem] text-on-pine">What is growing around Vatika and the Ring Road</h2>
          <p className="mt-2 max-w-2xl text-on-pine/85">The Tonk Road and Vatika Road belt is filling up with approved colonies and plot schemes. These are some of the developments in the area.</p>
          <ul className="mt-5 flex flex-wrap gap-2 text-[0.88rem]">
            {["Tonk Road", "Vatika Road", "Jaipur Ring Road (NH 148C)", "Sanganer"].map((t) => (
              <li key={t} className="rounded-full border border-brass-light/60 px-3 py-1 text-brass-light">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NEARBY_PROJECTS.map((p) => (
              <article key={p.name} className="rounded-2xl border border-brass-light/30 bg-pine-deep/50 p-5">
                <h3 className="text-on-pine">{p.name}</h3>
                <p className="mt-0.5 text-[0.88rem] font-medium text-brass-light">{p.by}</p>
                <p className="mt-2 text-[0.93rem] text-on-pine/85">{p.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-[0.85rem] text-on-pine/70">Details are taken from public property listings and may change. These projects belong to other developers.</p>
        </div>
      </section>
    </>
  );
}

/** Radial distance map: rings at 5/10/15/20 km, each place at its angle. Drawn with CSS positions, no map tiles needed. */
function DistanceMap() {
  const R = 40; // percent radius for 20 km
  const toXY = (km: number, angle: number) => {
    const r = (Math.sqrt(km / 20) * R); // square-root scale keeps near places readable
    const rad = (angle * Math.PI) / 180;
    return { x: 50 + r * Math.sin(rad), y: 50 - r * Math.cos(rad) };
  };
  const rings = [5, 10, 15, 20];
  return (
    <figure className="m-0">
      <div className="card relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_50%_50%,rgba(217,169,92,.18),transparent_70%)]" role="img" aria-label="Distance map from Vatika to popular places">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g fill="none" stroke="#96691f" strokeOpacity=".45" strokeWidth=".35" strokeDasharray="1.4 1.4">
            {rings.map((km) => (
              <circle key={km} cx="50" cy="50" r={Math.sqrt(km / 20) * R} />
            ))}
          </g>
          <g stroke="#96691f" strokeOpacity=".4" strokeWidth=".3">
            {DISTANCES.map((d) => {
              const p = toXY(d.km, d.angle);
              return <line key={d.place} x1="50" y1="50" x2={p.x} y2={p.y} />;
            })}
          </g>
        </svg>
        {rings.map((km) => (
          <span key={km} className="absolute -translate-x-1/2 -translate-y-1/2 rounded bg-card px-1 text-[0.65rem] text-muted" style={{ left: "50%", top: `${50 + Math.sqrt(km / 20) * R}%` }}>
            {km} km
          </span>
        ))}
        {DISTANCES.map((d) => {
          const p = toXY(d.km, d.angle);
          const left = p.x < 50;
          return (
            <span key={d.place} className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <b className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[0.7rem] font-semibold leading-tight text-ink sm:text-[0.78rem] ${left ? "right-4 text-right" : "left-4"}`}>
                {d.short ?? d.place}
                <i className="block font-medium not-italic text-brass">{d.km} km</i>
              </b>
            </span>
          );
        })}
        <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass-light ring-[6px] ring-brass-light/30">
          <b className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap text-[0.75rem] font-bold text-ink">Our villas</b>
        </span>
      </div>
      <figcaption className="mt-2 text-center text-[0.85rem] text-muted">Distance map. Not to scale, and directions are not exact.</figcaption>
    </figure>
  );
}
