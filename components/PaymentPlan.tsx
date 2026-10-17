import Link from "next/link";
import { PAYMENT_PLAN } from "@/lib/config";

/**
 * The 20% down / 80% bank loan note. `compact` is the small box on a villa page;
 * the default is the full-width band on the home page.
 */
export default function PaymentPlan({ compact = false }: { compact?: boolean }) {
  const { downPaymentPercent, loanPercent, note } = PAYMENT_PLAN;

  if (compact) {
    return (
      <aside className="rounded-2xl border border-brass/30 bg-brass-pale/60 p-5">
        <h3 className="!text-[1.05rem]">How you pay</h3>
        <div className="mt-3 flex gap-4">
          <Split big={`${downPaymentPercent}%`} small="down payment, paid by you" />
          <Split big={`${loanPercent}%`} small="home loan from a bank, arranged with our help" />
        </div>
        <p className="mt-3 text-[0.85rem] text-muted">{note}</p>
        <Link href="/how-to-buy" className="mt-2 inline-block text-[0.9rem] font-medium text-brass">
          See the full payment plan
        </Link>
      </aside>
    );
  }

  return (
    <section className="bg-pine text-on-pine" aria-labelledby="pay-heading">
      <div className="wrap grid items-center gap-8 py-12 sm:py-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 id="pay-heading" className="text-on-pine">
            Pay {downPaymentPercent}% now. We arrange the other {loanPercent}% as a bank loan.
          </h2>
          <p className="mt-4 max-w-xl text-on-pine/85">
            You bring the down payment. We introduce you to the bank, help with the paperwork and the loan covers the rest. {note}
          </p>
          <Link href="/how-to-buy" className="btn btn-primary mt-6">
            See how buying works
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-brass-light/40 bg-pine-deep/60 p-5">
            <div className="font-display text-[2.6rem] leading-none text-brass-light">{downPaymentPercent}%</div>
            <div className="mt-2 text-[0.92rem] text-on-pine/85">Down payment, paid by you</div>
          </div>
          <div className="rounded-2xl border border-brass-light/40 bg-pine-deep/60 p-5">
            <div className="font-display text-[2.6rem] leading-none text-brass-light">{loanPercent}%</div>
            <div className="mt-2 text-[0.92rem] text-on-pine/85">Home loan from a bank, arranged with our help</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Split({ big, small }: { big: string; small: string }) {
  return (
    <div className="flex-1">
      <div className="font-display text-[1.9rem] leading-none text-brass">{big}</div>
      <div className="mt-1 text-[0.85rem] text-ink/80">{small}</div>
    </div>
  );
}
