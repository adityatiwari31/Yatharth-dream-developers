"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { HeartIcon, MenuIcon, CloseIcon, WhatsAppIcon } from "./Icons";
import { WA_GENERAL } from "@/lib/config";
import { getSaved, SAVED_EVENT } from "@/lib/saved";

const NAV = [
  { href: "/villas", label: "Villas" },
  { href: "/how-to-buy", label: "How to buy" },
  { href: "/location", label: "Location" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(0);

  useEffect(() => {
    const update = () => setSaved(getSaved().length);
    update();
    window.addEventListener(SAVED_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(SAVED_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="wrap flex h-16 items-center justify-between gap-3 sm:h-[72px]">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[0.92rem] font-medium no-underline transition hover:bg-cream ${
                isActive(n.href) ? "text-brass" : "text-ink"
              }`}
              aria-current={isActive(n.href) ? "page" : undefined}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/saved"
            className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card no-underline transition hover:border-brass ${
              isActive("/saved") ? "text-brass" : "text-ink"
            }`}
            aria-label={`Saved villas${saved ? `, ${saved} saved` : ""}`}
          >
            <HeartIcon className="h-5 w-5" filled={saved > 0} />
            {saved > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-brass px-1 text-center text-[0.68rem] font-bold leading-5 text-white">
                {saved}
              </span>
            )}
          </Link>
          <a href={WA_GENERAL} target="_blank" rel="noopener" className="btn btn-wa hidden !min-h-10 !px-4 !py-2 sm:inline-flex">
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`lg:hidden ${open ? "block" : "hidden"} absolute inset-x-0 top-full border-b border-line bg-paper shadow-warm`}
      >
        <nav className="wrap flex flex-col py-2" aria-label="Main">
          {[{ href: "/", label: "Home" }, ...NAV, { href: "/size-guide", label: "Size guide" }, { href: "/saved", label: "Saved villas" }].map(
            (n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`border-b border-line/70 py-3.5 text-[1.02rem] font-medium no-underline last:border-0 ${
                  (n.href === "/" ? pathname === "/" : isActive(n.href)) ? "text-brass" : "text-ink"
                }`}
              >
                {n.label}
              </Link>
            ),
          )}
          <a href={WA_GENERAL} target="_blank" rel="noopener" className="btn btn-wa my-3">
            <WhatsAppIcon className="h-4 w-4" /> Message us on WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
