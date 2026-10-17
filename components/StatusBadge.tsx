import { STATUS_LABEL, type VillaStatus } from "@/lib/villaTypes";

const TONE: Record<VillaStatus, string> = {
  design: "bg-brass-pale text-brass",
  upcoming: "bg-pine text-on-pine",
  ongoing: "bg-[#fde7d2] text-[#8a4b12]",
  completed: "bg-[#e3efe6] text-ok",
};

export default function StatusBadge({ status, className = "" }: { status: VillaStatus; className?: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${TONE[status] ?? TONE.design} ${className}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
