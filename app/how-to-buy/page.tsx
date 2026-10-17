import type { Metadata } from "next";
import Link from "next/link";
import PaymentEstimator from "./PaymentEstimator";
import { WhatsAppIcon } from "@/components/Icons";
import { PAYMENT_PLAN, WA_GENERAL, WHATSAPP_DISPLAY, INSTAGRAM_HANDLE, COMPANY } from "@/lib/config";

export const metadata: Metadata = {
  title: "How to buy: steps, payment plan and FAQ",
  description: "Four steps from plot to villa, the 20% down payment and 80% bank loan plan, and answers to the questions buyers ask.",
};

const STEPS = [
  {
    title: "Know your plot",
    text: "Plots in Jaipur are talked about in gaj, but house plans use feet. Our free size guide turns one into the other, so you know exactly what you are buying.",
    link: { href: "/size-guide", label: "Open the size guide" },
  },
  {
    title: "Pick a design",
    text: "Browse the villas: 3D elevations, floor plans, room sizes and, for some designs, a walkthrough video. Save the ones you like and compare them later.",
    link: { href: "/villas", label: "See the villas" },
  },
  {
    title: "Plan the payment",
    text: `You pay ${PAYMENT_PLAN.downPaymentPercent}% as a down payment. The remaining ${PAYMENT_PLAN.loanPercent}% comes as a home loan from a bank, which we help you arrange.`,
    link: { href: "#payment", label: "See the payment plan" },
  },
  {
    title: "Talk to us",
    text: "Message us on WhatsApp or Instagram. We call back, explain the project, show you the site and share the drawings for your plot.",
    link: { href: "/contact", label: "Contact us" },
  },
];

const FAQ = [
  {
    q: "How does the 80 / 20 payment plan work?",
    a: `You pay ${PAYMENT_PLAN.downPaymentPercent}% of the villa price as a down payment. For the remaining ${PAYMENT_PLAN.loanPercent}% we introduce you to a bank and help with the paperwork for a home loan. ${PAYMENT_PLAN.note}`,
  },
  { q: "Where are your projects?", a: "Our upcoming project is a planned society of 15 villas at Village Vatika, Tehsil Sanganer, Jaipur. Our villa under construction is at Khedi Gokulpura, near the Ring Road, Vatika." },
  { q: "Is Yatharth Dream Devlopers a registered company?", a: `Yes. We are incorporated as Yatharth Dream Devlopers Private Limited under the Companies Act, 2013, with CIN ${COMPANY.cin}. You can check this on mca.gov.in, and the certificate is on our About page.` },
  { q: "What does gaj mean?", a: "A gaj is a square yard, which is 9 square feet. The size guide turns your plot size into gaj, square feet and square metres." },
  { q: "Are your villas Vastu friendly?", a: "Yes. We customise our villas according to the Vastu that families generally look for. Share your preferences and we plan the layout around them." },
  { q: "Are all plots the same size?", a: "No. Plot sizes depend on the land, so each villa is planned to suit its plot." },
  { q: "Can I see the plans before I decide?", a: "Yes. Every villa page has the elevations and floor plans, and some designs also have a walkthrough video." },
  { q: "How do I contact you?", a: `Message us on WhatsApp at ${WHATSAPP_DISPLAY} or on Instagram at ${INSTAGRAM_HANDLE}. All details are on the Contact page.` },
];

export default function HowToBuyPage() {
  return (
    <>
      <section className="wrap section-pad !pb-10">
        <div className="max-w-2xl">
          <h1 className="!text-[2.1rem] sm:!text-[2.6rem]">How buying a villa works</h1>
          <p className="lead mt-3">Four steps, one payment plan, and plain answers to the questions families ask us most.</p>
        </div>
      </section>

      <section className="wrap pb-14" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="sr-only">The four steps</h2>
        <ol className="grid gap-5 md:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card flex gap-5 p-6">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-pine font-display text-[1.15rem] text-brass-light">{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p className="mt-1.5 text-[0.95rem] text-muted">{s.text}</p>
                <Link href={s.link.href} className="mt-3 inline-block font-medium text-brass">
                  {s.link.label}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="payment" className="bg-pine text-on-pine" aria-labelledby="pay-heading">
        <div className="wrap section-pad grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 id="pay-heading" className="text-on-pine">
              {PAYMENT_PLAN.downPaymentPercent}% down. {PAYMENT_PLAN.loanPercent}% bank loan, arranged by us.
            </h2>
            <p className="mt-4 text-on-pine/85">
              You bring the down payment. We introduce you to the bank, help with the documents and the loan covers the rest of the price. Your EMI
              then runs with the bank, like any home loan.
            </p>
            <p className="mt-3 text-[0.9rem] text-on-pine/70">{PAYMENT_PLAN.note}</p>
            <a href={WA_GENERAL} target="_blank" rel="noopener" className="btn btn-primary mt-6">
              <WhatsAppIcon className="h-4 w-4" /> Ask about the loan
            </a>
          </div>
          <PaymentEstimator />
        </div>
      </section>

      <section className="wrap section-pad" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="!text-[1.7rem]">Questions buyers ask</h2>
        <div className="faq mt-4 max-w-3xl">
          {FAQ.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
