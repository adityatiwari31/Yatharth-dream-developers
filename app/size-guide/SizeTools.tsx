"use client";

import { useState } from "react";
import { fmt } from "@/lib/units";

const AREA: [string, number][] = [
  ["Gaj (square yard)", 0.83612736],
  ["Square feet", 0.09290304],
  ["Square metres", 1],
  ["Square inches", 0.00064516],
  ["Acre", 4046.8564224],
  ["Hectare", 10000],
];
const LEN: [string, number][] = [
  ["Inches", 0.0254],
  ["Feet", 0.3048],
  ["Yards", 0.9144],
  ["Centimetres", 0.01],
  ["Metres", 1],
];
const PLOT_UNITS: [string, number][] = [
  ["Feet", 0.3048],
  ["Inches", 0.0254],
  ["Yards", 0.9144],
  ["Metres", 1],
];

export default function SizeTools() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <PlotTool />
      <Converter title="Area converter" hint="Gaj, square feet, square metres and more." units={AREA} defaultUnit={0} />
      <Converter title="Length converter" hint="Inches, feet, yards, centimetres and metres." units={LEN} defaultUnit={1} />
    </div>
  );
}

function PlotTool() {
  const [l, setL] = useState("40");
  const [w, setW] = useState("20");
  const [u, setU] = useState(0);
  const L = parseFloat(l),
    W = parseFloat(w);
  const ok = L > 0 && W > 0;
  const f = PLOT_UNITS[u][1];
  const m2 = ok ? L * f * (W * f) : 0;
  return (
    <div className="card p-5">
      <h3>Find the size of your plot</h3>
      <p className="mt-1 text-[0.9rem] text-muted">Type the length and width of the plot.</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <label className="block">
          <span className="label">Length</span>
          <input className="input" type="number" min={0} step="any" inputMode="decimal" value={l} onChange={(e) => setL(e.target.value)} />
        </label>
        <label className="block">
          <span className="label">Width</span>
          <input className="input" type="number" min={0} step="any" inputMode="decimal" value={w} onChange={(e) => setW(e.target.value)} />
        </label>
        <label className="block">
          <span className="label">In</span>
          <select className="input" value={u} onChange={(e) => setU(Number(e.target.value))}>
            {PLOT_UNITS.map((x, i) => (
              <option key={x[0]} value={i}>
                {x[0]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <dl className="mt-4 divide-y divide-line" aria-live="polite">
        {ok ? (
          <>
            <Row label="Gaj" value={fmt(m2 / 0.83612736)} main />
            <Row label="Square feet" value={fmt(m2 / 0.09290304)} />
            <Row label="Square metres" value={fmt(m2)} />
          </>
        ) : (
          <Row label="Enter length and width" value="–" />
        )}
      </dl>
    </div>
  );
}

function Converter({ title, hint, units, defaultUnit }: { title: string; hint: string; units: [string, number][]; defaultUnit: number }) {
  const [v, setV] = useState("1");
  const [u, setU] = useState(defaultUnit);
  const val = parseFloat(v);
  const base = val >= 0 ? val * units[u][1] : NaN;
  return (
    <div className="card p-5">
      <h3>{title}</h3>
      <p className="mt-1 text-[0.9rem] text-muted">{hint}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="label">Amount</span>
          <input className="input" type="number" min={0} step="any" inputMode="decimal" value={v} onChange={(e) => setV(e.target.value)} />
        </label>
        <label className="block">
          <span className="label">From</span>
          <select className="input" value={u} onChange={(e) => setU(Number(e.target.value))}>
            {units.map((x, i) => (
              <option key={x[0]} value={i}>
                {x[0]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <dl className="mt-4 divide-y divide-line" aria-live="polite">
        {units.map((x, i) => (i === u ? null : <Row key={x[0]} label={x[0]} value={isNaN(base) ? "–" : fmt(base / x[1])} />))}
      </dl>
    </div>
  );
}

function Row({ label, value, main = false }: { label: string; value: string; main?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 py-2 text-[0.95rem] ${main ? "font-semibold text-brass" : ""}`}>
      <dt>{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
