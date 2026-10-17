import { WA_GENERAL } from "@/lib/config";
import { WhatsAppIcon } from "./Icons";

export default function WhatsAppFloat() {
  return (
    <a
      href={WA_GENERAL}
      target="_blank"
      rel="noopener"
      aria-label="Enquire on WhatsApp"
      className="btn btn-wa fixed right-4 z-30 !px-4 shadow-warm sm:right-5"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
