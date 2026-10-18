import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import StatusBadge from "@/components/StatusBadge";
import SaveButton from "@/components/SaveButton";
import PaymentPlan from "@/components/PaymentPlan";
import VillaCard, { villaSubline } from "@/components/VillaCard";
import EnquiryForm from "@/app/contact/EnquiryForm";
import { CheckIcon, CompassIcon, ExternalIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";
import { getVillaBySlug, getVillas } from "@/lib/data";
import { BRAND_NAME, SITE_URL, waLink } from "@/lib/config";
import { plotFacts } from "@/lib/units";

export const revalidate = 60; // cached, refreshed within a minute (and instantly after admin changes)

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const villa = await getVillaBySlug(slug);
  if (!villa) return { title: "Villa not found" };
  const cover = villa.images[0]?.url;
  return {
    title: villa.name,
    description: villa.tagline || villa.description.slice(0, 160),
    openGraph: cover ? { images: [{ url: cover }] } : undefined,
  };
}

export default async function VillaPage({ params }: Props) {
  const { slug } = await params;
  const villa = await getVillaBySlug(slug);
  if (!villa) notFound();

  const facts = plotFacts(villa.plotLength, villa.plotWidth, villa.plotGaj);
  const sub = villaSubline(villa);
  const url = `${SITE_URL}/villas/${villa.slug}`;
  const wa = waLink(`Hello, I am interested in “${villa.name}” by ${BRAND_NAME}. Please share the details.\n${url}`);
  const more = (await getVillas({ limit: 4 })).filter((v) => v._id !== villa._id).slice(0, 3);
  const paragraphs = villa.description.split(/\n{2,}/).filter(Boolean);

  return (
    <article className="wrap section-pad !pt-6 sm:!pt-10">
      <p className="text-[0.9rem]">
        <Link href="/villas" className="font-medium text-brass">
          ← All villas
        </Link>
      </p>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        {/* Pictures */}
        <div>
          <Gallery images={villa.images.map((i) => ({ url: i.url, alt: i.alt }))} name={villa.name} videoUrl={villa.videoUrl} />
          {villa.pdfUrl && (
            <a href={villa.pdfUrl} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-brass">
              Open the working drawing (PDF) <ExternalIcon />
            </a>
          )}
        </div>

        {/* Facts and actions */}
        <div>
          <StatusBadge status={villa.status} />
          <h1 className="mt-3 !text-[1.9rem] sm:!text-[2.3rem]">{villa.name}</h1>
          {villa.tagline && <p className="mt-2 font-display text-[1.15rem] text-brass">{villa.tagline}</p>}
          <Link
            href="/about#vastu"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass-pale/60 px-3 py-1 text-[0.82rem] font-medium text-brass no-underline transition hover:border-brass"
          >
            <CompassIcon className="h-3.5 w-3.5" /> Vastu friendly, adjusted to your family
          </Link>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            {facts.sizeText && <Fact label="Plot size" value={facts.sizeText} />}
            {facts.gaj > 0 && <Fact label="Plot area" value={facts.gajText} sub={`${facts.sqftText}, ${facts.sqmText}`} />}
            {villa.facing && <Fact label="Facing" value={villa.facing} />}
            {villa.floors && <Fact label="Floors" value={villa.floors} />}
            {villa.bedrooms > 0 && <Fact label="Bedrooms" value={String(villa.bedrooms)} />}
            {villa.location && (
              <Fact
                label="Location"
                value={villa.location}
                sub={
                  villa.mapUrl ? (
                    <a href={villa.mapUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-medium text-brass">
                      <PinIcon className="h-4 w-4" /> Open in Google Maps
                    </a>
                  ) : undefined
                }
                wide
              />
            )}
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={wa} target="_blank" rel="noopener" className="btn btn-wa">
              <WhatsAppIcon className="h-4 w-4" /> Ask about this villa
            </a>
            <SaveButton variant="button" item={{ id: villa._id, slug: villa.slug, name: villa.name, image: villa.images[0]?.url ?? "", sub }} />
          </div>

          <div className="mt-6">
            <PaymentPlan compact />
          </div>
        </div>
      </div>

      {/* Description, highlights, rooms */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <div>
          {paragraphs.length > 0 && (
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="!text-[1.5rem]">About this villa</h2>
              <div className="prose-ydd mt-3 text-[1rem]">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          )}
          {villa.highlights.length > 0 && (
            <section className="mt-8" aria-labelledby="hl-heading">
              <h2 id="hl-heading" className="!text-[1.5rem]">Highlights</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {villa.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-ink/90">
                    <CheckIcon className="mt-1 h-4 w-4 flex-none text-brass" /> {h}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div>
          {villa.rooms.length > 0 && (
            <section className="card p-5" aria-labelledby="rooms-heading">
              <h2 id="rooms-heading" className="!text-[1.3rem]">Room sizes</h2>
              <dl className="mt-3 divide-y divide-line">
                {villa.rooms.map((r, i) => (
                  <div key={i} className="flex justify-between gap-4 py-2 text-[0.95rem]">
                    <dt className="text-muted">{r.label}</dt>
                    <dd className="text-right font-medium">{r.size}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[0.82rem] text-muted">Plans are drawings. Sizes and details can change when the villa is built.</p>
            </section>
          )}
        </div>
      </div>

      {/* Enquiry about this villa */}
      <section className="mt-14 grid gap-8 rounded-3xl border border-line bg-cream p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr]" aria-labelledby="enq-heading">
        <div>
          <h2 id="enq-heading" className="!text-[1.6rem]">Interested in this villa?</h2>
          <p className="mt-2 text-muted">Leave your name and number. We call you back and explain the plot, the plan and the payment schedule.</p>
        </div>
        <EnquiryForm villaSlug={villa.slug} villaName={villa.name} compact />
      </section>

      {more.length > 0 && (
        <section className="mt-14" aria-labelledby="more-heading">
          <div className="mb-6 flex items-end justify-between">
            <h2 id="more-heading" className="!text-[1.6rem]">More villas</h2>
            <Link href="/villas" className="font-medium text-brass">
              See all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((v) => (
              <VillaCard key={v._id} villa={v} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Fact({ label, value, sub, wide = false }: { label: string; value: string; sub?: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`fact ${wide ? "col-span-2" : ""}`}>
      <dt className="text-[0.8rem] text-muted">{label}</dt>
      <dd className="mt-0.5 font-medium leading-snug">{value}</dd>
      {sub && <dd className="mt-0.5 text-[0.85rem] text-muted">{sub}</dd>}
    </div>
  );
}
