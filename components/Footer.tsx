import Link from "next/link";
import Logo from "./Logo";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "./Icons";
import { BRAND_LEGAL_NAME, COMPANY, INSTAGRAM_HANDLE, INSTAGRAM_URL, LINKEDIN_URL, WA_GENERAL, WHATSAPP_DISPLAY } from "@/lib/config";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/villas", label: "Villas" },
  { href: "/how-to-buy", label: "How to buy" },
  { href: "/size-guide", label: "Size guide" },
  { href: "/location", label: "Location" },
  { href: "/about", label: "About" },
  { href: "/about#vastu", label: "Vastu" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/saved", label: "Saved villas" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-pine-deep text-on-pine/85">
      <div className="jaali" aria-hidden="true" />
      <div className="wrap grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_1.1fr_1.1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-[0.95rem]">Villas made for your plot, in Jaipur. Registered. Planned. Built.</p>
          <p className="mt-2 font-hindi text-[1.05rem] text-brass-light">अपना प्लॉट, अपना विला, अपना सपना</p>
          <div className="mt-5 flex gap-3">
            <SocialLink href={WA_GENERAL} label="WhatsApp">
              <WhatsAppIcon />
            </SocialLink>
            <SocialLink href={INSTAGRAM_URL} label="Instagram">
              <InstagramIcon />
            </SocialLink>
            <SocialLink href={LINKEDIN_URL} label="LinkedIn">
              <LinkedInIcon />
            </SocialLink>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-sans text-sm font-semibold text-brass-light">Explore</h4>
          <ul className="grid gap-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="no-underline hover:text-brass-light hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-sans text-sm font-semibold text-brass-light">Contact</h4>
          <p className="mb-2">
            WhatsApp:{" "}
            <a href={WA_GENERAL} target="_blank" rel="noopener" className="hover:text-brass-light">
              {WHATSAPP_DISPLAY}
            </a>
          </p>
          <p className="mb-2">
            Instagram:{" "}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="hover:text-brass-light">
              {INSTAGRAM_HANDLE}
            </a>
          </p>
          <p className="text-[0.92rem]">Registered office: {COMPANY.office}</p>
        </div>

        <div>
          <h4 className="mb-3 font-sans text-sm font-semibold text-brass-light">Company</h4>
          <p className="mb-2">{BRAND_LEGAL_NAME}</p>
          <p className="mb-2">CIN: {COMPANY.cin}</p>
          <p className="text-[0.92rem]">
            Incorporated {COMPANY.incorporatedOn} under the {COMPANY.act}.
          </p>
        </div>
      </div>
      <div className="wrap border-t border-on-pine/15 py-5 text-[0.84rem] text-on-pine/70">
        © {new Date().getFullYear()} {BRAND_LEGAL_NAME}. All rights reserved. Drawings show the design; sizes and details can change when a villa is built.
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brass-light/60 text-brass-light transition hover:bg-brass-light/15"
    >
      {children}
    </a>
  );
}
