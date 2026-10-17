import type { Metadata } from "next";
import SizeTools from "./SizeTools";

export const metadata: Metadata = {
  title: "Size guide: gaj, square feet and metres",
  description: "Free calculators to turn your plot size into gaj, square feet and square metres, plus plain answers about plot, built-up and carpet area.",
};

const FACTS = [
  ["1 gaj", "= 1 square yard = 9 square feet"],
  ["1 yard", "= 3 feet = 36 inches"],
  ["1 foot", "= 12 inches = 30.48 cm"],
  ["1 inch", "= 2.54 cm"],
  ["1 square foot", "= 144 square inches"],
  ["1 gaj", "= 0.836 square metres"],
  ["1 square metre", "= 10.764 square feet = 1.196 gaj"],
  ["1 acre", "= 4,840 gaj = 43,560 square feet"],
];

const FAQ = [
  ["What is a gaj?", "A gaj is a square yard. It is a measure of area, not length. A plot of 100 gaj has 100 square yards of land, which is 900 square feet."],
  ["How do I find the gaj of my plot?", "Multiply the length by the width, both in feet, to get square feet. Then divide by 9. For example, a plot of 20 feet by 40 feet is 800 square feet, and 800 divided by 9 is about 88.9 gaj."],
  ["How do I change inches to feet?", "Divide the inches by 12. So 6 inches is 0.5 feet, and 25 feet 6 inches is 25.5 feet. Use the decimal number in the plot tool above."],
  ["What is the difference between a foot and a square foot?", "A foot measures length, like the side of a room. A square foot measures area, which is a flat space of 1 foot by 1 foot. A room of 10 feet by 12 feet has 120 square feet."],
  ["What is plot area, built-up area and carpet area?", "Plot area is the land you own. Built-up area is the floor space of the house you build, including the thickness of walls and balconies. Carpet area is the usable floor space inside the walls, where you could lay a carpet."],
  ["Why do some documents show metres and some show gaj?", "Government and approved plans often use square metres, while buyers and sellers in Jaipur use gaj. Both are correct. Use the area converter to check that the numbers match."],
];

export default function SizeGuidePage() {
  return (
    <div className="wrap section-pad">
      <div className="max-w-2xl">
        <h1 className="!text-[2.1rem] sm:!text-[2.6rem]">Know your land before you buy it</h1>
        <p className="lead mt-3">
          New to buying land? Plots in Jaipur are usually talked about in gaj, but house plans use feet, inches and metres. These tools help you switch
          between them. At Jaipur Vatika, plot sizes are not fixed; they depend on the land.
        </p>
      </div>

      <div className="mt-10">
        <SizeTools />
      </div>

      <section className="mt-14" aria-labelledby="facts-heading">
        <h2 id="facts-heading" className="!text-[1.7rem]">Quick facts</h2>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map(([a, b]) => (
            <div key={a + b} className="fact">
              <dt className="font-semibold">{a}</dt>
              <dd className="text-[0.92rem] text-muted">{b}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14" aria-labelledby="simple-heading">
        <h2 id="simple-heading" className="!text-[1.7rem]">Simple answers</h2>
        <div className="faq mt-4 max-w-3xl">
          {FAQ.map(([q, a], i) => (
            <details key={q} open={i === 0}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-[0.85rem] text-muted">Results are rounded. The area in your registry or sale deed is the official figure.</p>
      </section>
    </div>
  );
}
