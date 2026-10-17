import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// A "villa" is any listing: a ready design, an upcoming society, an ongoing build
// or a completed home. Multiple photos per villa, plus an optional video and PDF.

import { VILLA_STATUSES, type VillaJSON } from "@/lib/villaTypes";
export { VILLA_STATUSES, STATUS_LABEL } from "@/lib/villaTypes";
export type { VillaStatus, VillaJSON } from "@/lib/villaTypes";

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  { _id: false },
);

const RoomSchema = new Schema(
  {
    label: { type: String, required: true },
    size: { type: String, required: true },
  },
  { _id: false },
);

const VillaSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    status: { type: String, enum: VILLA_STATUSES, default: "design", index: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    facing: { type: String, default: "" },
    plotLength: { type: Number, default: 0 }, // feet
    plotWidth: { type: Number, default: 0 }, // feet
    plotGaj: { type: Number, default: 0 }, // optional override, else computed from length × width
    floors: { type: String, default: "" },
    bedrooms: { type: Number, default: 0 },
    highlights: { type: [String], default: [] },
    rooms: { type: [RoomSchema], default: [] },
    location: { type: String, default: "" },
    mapUrl: { type: String, default: "" },
    images: { type: [ImageSchema], default: [] },
    videoUrl: { type: String, default: "" },
    pdfUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type VillaDoc = InferSchemaType<typeof VillaSchema> & { _id: mongoose.Types.ObjectId };

export function toVillaJSON(doc: any): VillaJSON {
  return {
    _id: String(doc._id),
    name: doc.name ?? "",
    slug: doc.slug ?? "",
    status: doc.status ?? "design",
    tagline: doc.tagline ?? "",
    description: doc.description ?? "",
    facing: doc.facing ?? "",
    plotLength: doc.plotLength ?? 0,
    plotWidth: doc.plotWidth ?? 0,
    plotGaj: doc.plotGaj ?? 0,
    floors: doc.floors ?? "",
    bedrooms: doc.bedrooms ?? 0,
    location: doc.location ?? "",
    mapUrl: doc.mapUrl ?? "",
    videoUrl: doc.videoUrl ?? "",
    pdfUrl: doc.pdfUrl ?? "",
    featured: Boolean(doc.featured),
    order: doc.order ?? 0,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : "",
    images: (doc.images ?? []).map((i: any) => ({ url: i.url, publicId: i.publicId ?? "", alt: i.alt ?? "" })),
    rooms: (doc.rooms ?? []).map((r: any) => ({ label: r.label, size: r.size })),
    highlights: doc.highlights ?? [],
  };
}

export const Villa: Model<VillaDoc> =
  (mongoose.models.Villa as Model<VillaDoc>) || mongoose.model<VillaDoc>("Villa", VillaSchema);
