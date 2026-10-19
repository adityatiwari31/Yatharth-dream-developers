import Image from "next/image";
import Link from "next/link";
import VillaCard from "@/components/VillaCard";
import ReviewCard from "@/components/ReviewCard";
import PaymentPlan from "@/components/PaymentPlan";
import SectionHeading from "@/components/SectionHeading";
import VastuSection from "@/components/VastuSection";
import UpcomingBar from "@/components/UpcomingBar";
import { WhatsAppIcon, CheckIcon, InstagramIcon } from "@/components/Icons";
import { getHomeVillas, getApprovedReviews, getReviewStats, getActiveNotices } from "@/lib/data";
import {
  BRAND_SLOGAN,
  BRAND_TAGLINE,
  BRAND_TAGLINE_HI,
  COMPANY,
  DISTANCES,
  HERO_IMAGE,
  HERO_IMAGE_ALT,
  HOME_REVIEW_COUNT,
  HOME_VILLA_COUNT,
  INSTAGRAM_URL,
  WA_GENERAL,
} from "@/lib/config";

export const revalidate = 60; // cached, refreshed within a minute (and instantly after admin changes)

const STEPS = [
  { href: "/size-guide", title: "Know your plot", text: "Turn feet and inches into gaj with the free size guide." },
  { href: "/villas", title: "Pick a design", text: "Elevations, floor plans and room sizes for every villa." },
  { href: "/how-to-buy", title: "Plan the payment", text: "20% down payment; we arrange the rest as a bank loan." },
  { href: "/contact", title: "Talk to us", text: "Message us on WhatsApp. We call back and explain the project." },
];

export default async function HomePage() {
  const [villas, reviews, stats, notices] = await Promise.all([
    getHomeVillas(HOME_VILLA_COUNT),
    getApprovedReviews(HOME_REVIEW_COUNT),
    getReviewStats(),
    getActiveNotices(),
  ]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:pb-20 lg:pt-16">
          <div>
            <p className="rise kicker">Upcoming project: Jaipur Vatika, 15 villas near the Ring Road</p>
            <h1 className="rise rise-2 mt-3">{BRAND_TAGLINE}</h1>
            <p className="rise rise-2 mt-3 font-hindi text-[1.3rem] text-brass sm:text-[1.5rem]">{BRAND_TAGLINE_HI}</p>
            <p className="rise rise-3 lead mt-5">
              We buy plots in and around Vatika, Jaipur, plan them and build villas on them. One company from the first drawing to the
              finished home, with every plan sized for its plot.
            </p>
            <div className="rise rise-4 mt-7 flex flex-wrap gap-3">
              <Link href="/villas" className="btn btn-primary">
                See the villas
              </Link>
              <a href={WA_GENERAL} target="_blank" rel="noopener" className="btn btn-wa">
                <WhatsAppIcon className="h-4 w-4" /> Message on WhatsApp
              </a>
            </div>
            <dl className="rise rise-4 mt-9 grid max-w-md grid-cols-2 gap-3">
              <div className="fact">
                <dt className="text-[0.8rem] text-muted">Upcoming project</dt>
                <dd className="font-display text-[1.35rem] leading-tight">15 villas, Jaipur Vatika</dd>
              </div>
              <div className="fact">
                <dt className="text-[0.8rem] text-muted">Under construction</dt>
                <dd className="font-display text-[1.35rem] leading-tight">Villa at Khedi Gokulpura</dd>
              </div>
            </dl>
          </div>

          <div className="rise rise-3 relative mx-auto w-full max-w-[460px] lg:max-w-none">
            <div className="arch relative aspect-[4/5] shadow-warm ring-1 ring-line">
              <Image
                src={HERO_IMAGE}
                alt={HERO_IMAGE_ALT}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
                unoptimized={!HERO_IMAGE.includes("res.cloudinary.com")}
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 w-[86%] -translate-x-1/2 rounded-2xl border border-line bg-card px-5 py-3 text-center shadow-soft">
              <span className="whitespace-nowrap font-display text-[0.9rem] sm:text-[1.05rem]">{BRAND_SLOGAN}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <section className="border-y border-line bg-cream" aria-label="Company registration">
        <div className="wrap grid gap-5 py-7 sm:grid-cols-2 lg:grid-cols-4">
          <Trust label="Registered company" value="Yatharth Dream Devlopers Private Limited" />
          <Trust label="CIN" value={COMPANY.cin} />
          <Trust label="Incorporated" value={`${COMPANY.incorporatedOn}, ${COMPANY.act}`} />
          <Trust
            label="Registered office"
            value={
              <>
                {COMPANY.officeShort}.{" "}
                <Link href="/about" className="font-medium text-brass">
                  See the certificate
                </Link>
              </>
            }
          />
        </div>
      </section>

      {/* ── Villas ───────────────────────────────────────────────────────── */}
      <section className="wrap section-pad" aria-labelledby="villas-heading">
        <SectionHeading
          id="villas-heading"
          title="Our villas and designs"
          text="Tap a villa to see every picture, the floor plans and room sizes."
          link={{ href: "/villas", label: "See all villas" }}
        />
        {villas.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {villas.map((v, i) => (
              <VillaCard key={v._id} villa={v} priority={i < 2} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-muted">
            Villas will appear here once they are added in the admin page.{" "}
            <a href={WA_GENERAL} target="_blank" rel="noopener" className="font-medium text-brass">
              Ask us on WhatsApp
            </a>{" "}
            in the meantime.
          </div>
        )}
      </section>

      {/* ── Payment plan ─────────────────────────────────────────────────── */}
      <PaymentPlan />

      {/* ── Vastu ────────────────────────────────────────────────────────── */}
      <VastuSection />

      {/* ── How to buy (compact) ─────────────────────────────────────────── */}
      <section className="wrap section-pad" aria-labelledby="steps-heading">
        <SectionHeading
          id="steps-heading"
          title="Four steps to your villa"
          text="Each step has its own page with the details."
          link={{ href: "/how-to-buy", label: "Read the full guide" }}
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.href}>
              <Link href={s.href} className="card flex h-full flex-col p-5 no-underline transition hover:border-brass">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-pine font-display text-[1.05rem] text-brass-light">{i + 1}</span>
                <h3 className="mt-4">{s.title}</h3>
                <p className="mt-1.5 text-[0.93rem] text-muted">{s.text}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      <section className="bg-cream">
        <div className="wrap section-pad" aria-labelledby="reviews-heading">
          <SectionHeading
            id="reviews-heading"
            title="What families say"
            text={
              stats.count
                ? `${stats.avg} out of 5 from ${stats.count} review${stats.count === 1 ? "" : "s"}, with photos from the families themselves.`
                : "Bought a villa from us, or visited our site? Tell the next family how we did."
            }
            link={{ href: "/reviews", label: stats.count ? "Read all reviews" : "Write a review" }}
          />
          {reviews.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <ReviewCard key={r._id} review={r} />
              ))}
            </div>
          ) : (
            <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
              <p className="text-muted">Every home is a promise. Tell us how we kept ours.</p>
              <Link href="/reviews" className="btn btn-outline">
                Share your experience
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Location teaser ──────────────────────────────────────────────── */}
      <section className="wrap section-pad" aria-labelledby="loc-heading">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 id="loc-heading">Where we build</h2>
            <p className="mt-3 text-muted">
              Vatika is on the Tonk Road side of Jaipur, next to the Ring Road that links the city&apos;s main highways. Schools, hospitals and
              markets are a short drive away.
            </p>
            <Link href="/location" className="btn btn-outline mt-6">
              See the map and amenities
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {DISTANCES.map((d) => (
              <div key={d.place} className="fact">
                <dt className="text-[0.82rem] text-muted">{d.short ?? d.place}</dt>
                <dd className="font-display text-[1.3rem] leading-tight">about {d.km} km</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="border-t border-line bg-cream">
        <div className="wrap flex flex-wrap items-center justify-between gap-6 py-12">
          <div>
            <h2>Ready to find your villa?</h2>
            <ul className="mt-3 grid gap-1.5 text-muted">
              {["Vastu friendly layouts, adjusted to your family", "See the plans before you decide", "A registered company you can verify on mca.gov.in"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckIcon className="mt-1 h-4 w-4 flex-none text-brass" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={WA_GENERAL} target="_blank" rel="noopener" className="btn btn-wa">
              <WhatsAppIcon className="h-4 w-4" /> Message us on WhatsApp
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="btn btn-outline">
              <InstagramIcon className="h-4 w-4" /> Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── Upcoming projects bar (floats at the bottom, closable; managed in /admin) ── */}
      <UpcomingBar items={notices} />
    </>
  );
}

function Trust({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-l-2 border-brass pl-4">
      <div className="text-[0.8rem] text-muted">{label}</div>
      <div className="mt-0.5 text-[0.95rem] font-medium">{value}</div>
    </div>
  );
}
