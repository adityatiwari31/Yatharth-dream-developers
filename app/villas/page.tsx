import type { Metadata } from "next";
import VillaGrid from "./VillaGrid";
import { getVillas } from "@/lib/data";

export const revalidate = 60; // cached, refreshed within a minute (and instantly after admin changes)

export const metadata: Metadata = {
  title: "Villas and designs",
  description: "Every villa we build or plan: upcoming society, villa under construction and ready designs with elevations, floor plans and room sizes.",
};

export default async function VillasPage() {
  const villas = await getVillas();
  return (
    <div className="wrap section-pad">
      <div className="max-w-2xl">
        <h1 className="!text-[2.1rem] sm:!text-[2.6rem]">Villas and designs</h1>
        <p className="lead mt-3">
          Designs that fit your plot and your family. Plot area is shown in gaj and square feet, and room sizes come from our drawings. Every villa is
          Vastu friendly and adjusted to the land it stands on.
        </p>
      </div>
      <VillaGrid villas={villas} />
    </div>
  );
}
