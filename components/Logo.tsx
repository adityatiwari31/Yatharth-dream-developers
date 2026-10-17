import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/config";

/** Brand lockup. `tone="light"` is for the deep-green footer. */
export default function Logo({ tone = "dark", withText = true }: { tone?: "dark" | "light"; withText?: boolean }) {
  const src = tone === "light" ? "/logo-mark-light.png" : "/logo-mark.png";
  return (
    <Link href="/" className="flex items-center gap-3 no-underline" aria-label={`${BRAND_NAME} home`}>
      <Image src={src} alt="" width={420} height={205} priority className="h-9 w-auto sm:h-10" unoptimized />
      {withText && (
        <span className="leading-tight sm:whitespace-nowrap">
          <span className={`block font-display text-[0.9rem] leading-[1.1] font-semibold tracking-tight sm:text-[1.05rem] ${tone === "light" ? "text-on-pine" : "text-ink"}`}>
            {BRAND_NAME}
          </span>
          <span className={`hidden text-[0.72rem] sm:block ${tone === "light" ? "text-brass-light" : "text-brass"}`}>Villas at Jaipur Vatika</span>
        </span>
      )}
    </Link>
  );
}
