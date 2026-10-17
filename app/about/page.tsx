import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckIcon, ExternalIcon, WhatsAppIcon } from "@/components/Icons";
import Gallery from "@/components/Gallery";
import { BRAND_LEGAL_NAME, BRAND_NAME, COMPANY, FOUNDERS, WA_VASTU } from "@/lib/config";

export const metadata: Metadata = {
  title: "About us and the founders",
  description: `${BRAND_LEGAL_NAME} is a registered private limited company in Jaipur. Meet the two founders and check our registration on mca.gov.in.`,
};

const WHY = [
  { title: "One company, plot to villa", text: "We buy the plot, plan it and build the villa ourselves. One team, from the first drawing to the finished home." },
  { title: "Designed around your plot", text: "Every villa is planned for the size and shape of its land, so every square foot is put to use." },
  { title: "See it before you decide", text: "3D elevations, floor plans and walkthrough videos are all on this website." },
  { title: "A registered company", text: "Incorporated under the Companies Act, 2013. Check our CIN yourself on mca.gov.in." },
  { title: "Close to the Ring Road", text: "Vatika is on the Tonk Road side of Jaipur, near the Ring Road that links the city's main highways." },
  { title: "Clear, simple sizes", text: "Plot sizes in gaj and square feet, with free calculators to turn one into the other." },
];

export default function AboutPage() {
  return (
    <>
      <section className="wrap section-pad !pb-10">
        <div className="max-w-2xl">
          <h1 className="!text-[2.1rem] sm:!text-[2.6rem]">Registered on record. Built on trust.</h1>
          <p className="lead mt-3">
            {BRAND_NAME} is a registered private limited company in Jaipur, Rajasthan. We buy plots, plan them and build villas on them. Our
            registration details are below, and you can check them yourself on the Ministry of Corporate Affairs website.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="wrap pb-14" aria-labelledby="founders-heading">
        <h2 id="founders-heading" className="!text-[1.7rem]">The two founders</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {FOUNDERS.map((f) => (
            <article key={f.name} className="card flex gap-5 p-5 sm:p-6">
              <div className="arch relative h-36 w-28 flex-none bg-pine sm:h-44 sm:w-36">
                {f.photo ? (
                  <Image src={f.photo} alt={f.name} fill sizes="160px" className="object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center font-display text-[2rem] text-brass-light" aria-hidden="true">
                    {f.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                )}
              </div>
              <div>
                <h3>{f.name}</h3>
                <p className="kicker mt-0.5">{f.role}</p>
                <p className="mt-3 text-[0.95rem] text-ink/90">{f.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Registration */}
      <section className="bg-cream">
        <div className="wrap section-pad grid gap-10 lg:grid-cols-[1.1fr_.9fr]" aria-labelledby="reg-heading">
          <div>
            <h2 id="reg-heading" className="!text-[1.7rem]">Company registration</h2>
            <ul className="mt-4 flex flex-wrap gap-2 text-[0.88rem]">
              {["Registered under the Companies Act, 2013", "Ministry of Corporate Affairs, Government of India", `CIN ${COMPANY.cin}`].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-card px-3 py-1.5 text-brass">
                  <CheckIcon className="h-3.5 w-3.5" /> {t}
                </li>
              ))}
            </ul>
            <dl className="mt-6 divide-y divide-line">
              <Row label="Registered name" value={BRAND_LEGAL_NAME} />
              <Row label="Company type" value={COMPANY.type} />
              <Row label="CIN" value={COMPANY.cin} />
              <Row label="Incorporated on" value={`${COMPANY.incorporatedOn}, under the ${COMPANY.act}`} />
              <Row label="Registered with" value={COMPANY.registrar} />
              <Row label="Registered office" value={COMPANY.office} />
              <Row label="Directors" value={FOUNDERS.map((f) => f.name).join(", ")} />
              <Row label="Articles of Association" value={COMPANY.aoa} />
              <Row label="Private company" value="Its articles restrict the transfer of shares and do not allow any invitation to the public to subscribe for its securities." />
            </dl>
            <a href={COMPANY.mcaUrl} target="_blank" rel="noopener" className="btn btn-primary mt-6">
              Check on mca.gov.in <ExternalIcon />
            </a>
            <p className="mt-3 text-[0.85rem] text-muted">On the MCA website, open the company master data and enter our CIN to confirm these details.</p>
          </div>
          <div>
            <Gallery images={[{ url: "/seed/certificate-of-incorporation.jpg", alt: `Certificate of Incorporation of ${BRAND_LEGAL_NAME}, issued ${COMPANY.incorporatedOn}` }]} name="Certificate of Incorporation" />
            <p className="mt-3 text-[0.85rem] text-muted">Certificate of Incorporation, issued {COMPANY.incorporatedOn}. Tap to enlarge. PAN and TAN are hidden on this copy.</p>
          </div>
        </div>
      </section>

      {/* Why families choose us */}
      <section className="wrap section-pad" aria-labelledby="why-heading">
        <h2 id="why-heading" className="!text-[1.7rem]">A villa you can understand, and trust</h2>
        <p className="mt-2 text-muted">Buying a home is a big step. We try to make each part of it clear.</p>
        <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.title} className="border-t-2 border-brass pt-4">
              <h3>{w.title}</h3>
              <p className="mt-1.5 text-[0.95rem] text-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vastu */}
      <section className="bg-cream">
        <div className="wrap section-pad grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]" aria-labelledby="vastu-heading">
          <Compass />
          <div>
            <h2 id="vastu-heading" className="!text-[1.7rem]">Homes planned the Vastu way</h2>
            <p className="mt-3 text-muted">All our villas are customised according to the Vastu that families generally look for. Tell us your preferences, and we plan the layout around them.</p>
            <ul className="mt-4 grid gap-2">
              {["East facing and west facing designs", "Entrance, kitchen and bedrooms placed as you prefer", "Open-to-sky areas and terraces for light and air", "Changes to the plan to suit your family"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckIcon className="mt-1 h-4 w-4 flex-none text-brass" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={WA_VASTU} target="_blank" rel="noopener" className="btn btn-wa">
                <WhatsAppIcon className="h-4 w-4" /> Discuss your Vastu needs
              </a>
              <Link href="/villas" className="btn btn-outline">
                See the designs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5 py-2.5 sm:grid-cols-[190px_1fr]">
      <dt className="text-[0.85rem] text-muted">{label}</dt>
      <dd className="text-[0.95rem] font-medium">{value}</dd>
    </div>
  );
}

function Compass() {
  return (
    <div className="mx-auto grid w-full max-w-[340px] place-items-center rounded-3xl bg-pine p-8 shadow-warm" role="img" aria-label="Compass showing east facing and west facing homes">
      <svg viewBox="0 0 200 200" className="w-full" aria-hidden="true">
        <g fill="none" stroke="#E0B363" strokeWidth="1.6">
          <circle cx="100" cy="100" r="86" />
          <circle cx="100" cy="100" r="62" opacity=".55" />
          <path d="M100 8v26M100 166v26M8 100h26M166 100h26" />
          <path d="M100 38l8 62-8 62-8-62z" opacity=".9" />
          <path d="M38 100l62-8 62 8-62 8z" opacity=".9" />
        </g>
        <path d="M82 112V98l18-14 18 14v14z" fill="#F6EFE8" />
        <g fill="#E0B363" fontFamily="var(--font-manrope), sans-serif" fontWeight="700" fontSize="14" textAnchor="middle">
          <text x="100" y="24">N</text>
          <text x="180" y="105">E</text>
          <text x="100" y="188">S</text>
          <text x="20" y="105">W</text>
        </g>
      </svg>
    </div>
  );
}
