"use client";

import { useState } from "react";
import { PAYMENT_PLAN } from "@/lib/config";

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

/** Splits a villa price into down payment and bank loan, with an indicative EMI. */
export default function PaymentEstimator() {
  const [price, setPrice] = useState(4000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const down = (price * PAYMENT_PLAN.downPaymentPercent) / 100;
  const loan = price - down;
  const r = rate / 100 / 12;
  const n = years * 12;
  const emi = r > 0 ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loan / n;

  return (
    <div className="card p-6 text-ink">
      <h3>Work out your numbers</h3>
      <p className="mt-1 text-[0.9rem] text-muted">Type a villa price to see the down payment and the loan amount.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Villa price (₹)" value={price} onChange={setPrice} step={100000} min={0} />
        <Field label="Interest rate (% per year)" value={rate} onChange={setRate} step={0.1} min={0} />
        <Field label="Loan period (years)" value={years} onChange={setYears} step={1} min={1} />
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <Out label={`${PAYMENT_PLAN.downPaymentPercent}% down payment`} value={inr(down)} main />
        <Out label={`${PAYMENT_PLAN.loanPercent}% bank loan`} value={inr(loan)} />
        <Out label="Indicative monthly EMI" value={inr(emi)} />
      </dl>
      <p className="mt-3 text-[0.82rem] text-muted">
        The EMI is an estimate for comparison only. {PAYMENT_PLAN.note} Registration charges and stamp duty are extra.
      </p>
    </div>
  );
}

function Field({ label, value, onChange, step, min }: { label: string; value: number; onChange: (n: number) => void; step: number; min: number }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        type="number"
        className="input"
        value={value}
        step={step}
        min={min}
        inputMode="decimal"
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
      />
    </label>
  );
}

function Out({ label, value, main = false }: { label: string; value: string; main?: boolean }) {
  return (
    <div className={`rounded-xl px-4 py-3 ${main ? "bg-brass-pale" : "bg-cream"}`}>
      <dt className="text-[0.8rem] text-muted">{label}</dt>
      <dd className="font-display text-[1.45rem] leading-tight">{value}</dd>
    </div>
  );
}
