import Link from "next/link";
import { CheckIcon, WhatsAppIcon } from "./Icons";
import { WA_VASTU } from "@/lib/config";

const POINTS = [
  "East facing and west facing designs",
  "Entrance, kitchen, bedrooms and pooja space placed as you prefer",
  "Open-to-sky areas and terraces for light and air",
  "Changes to the plan to suit your family, before work starts",
];

/**
 * The Vastu promise. Shown on the home page and on the About page (id="vastu"
 * so links can jump straight to it). One component, so the wording stays the same.
 */
export default function VastuSection({ id = "vastu" }: { id?: string }) {
  return (
    <section id={id} className="border-y border-line bg-cream" aria-labelledby={`${id}-heading`}>
      <div className="wrap section-pad grid items-center gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-14">
        <Compass />
        <div>
          <h2 id={`${id}-heading`}>Every villa is planned the Vastu way</h2>
          <p className="mt-3 text-muted">
            Vastu is not an add-on here. Every plan starts with the direction the plot faces, and the entrance, kitchen, bedrooms and pooja space are
            placed the way families generally look for. Tell us what matters to you, and we draw the layout around it.
          </p>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {POINTS.map((t) => (
              <li key={t} className="flex items-start gap-2 text-[0.95rem] text-ink/90">
                <CheckIcon className="mt-1 h-4 w-4 flex-none text-brass" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
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
  );
}

export function Compass() {
  return (
    <div
      className="mx-auto grid w-full max-w-[320px] place-items-center rounded-3xl bg-pine p-8 shadow-warm ring-4 ring-brass-light/25 lg:max-w-[360px]"
      role="img"
      aria-label="Compass showing east and west facing homes"
    >
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
