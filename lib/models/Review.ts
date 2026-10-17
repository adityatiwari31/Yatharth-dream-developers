import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// Customer feedback. Reviews submitted on the website wait for approval in /admin.
// Each review can carry a photo (the family at the site, the finished villa, etc.).

const ReviewSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    bought: { type: String, default: "" }, // e.g. "20 × 40 villa, Jaipur Vatika"
    photo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    approved: { type: Boolean, default: false, index: true },
    source: { type: String, enum: ["website", "admin"], default: "website" },
  },
  { timestamps: true },
);

export type ReviewDoc = InferSchemaType<typeof ReviewSchema> & { _id: mongoose.Types.ObjectId };

import type { ReviewJSON } from "@/lib/villaTypes";
export type { ReviewJSON } from "@/lib/villaTypes";

export function toReviewJSON(doc: any): ReviewJSON {
  return {
    _id: String(doc._id),
    name: doc.name,
    rating: doc.rating,
    text: doc.text,
    bought: doc.bought ?? "",
    photo: { url: doc.photo?.url ?? "", publicId: doc.photo?.publicId ?? "" },
    approved: Boolean(doc.approved),
    source: doc.source ?? "website",
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
  };
}

export const Review: Model<ReviewDoc> =
  (mongoose.models.Review as Model<ReviewDoc>) || mongoose.model<ReviewDoc>("Review", ReviewSchema);
