import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import type { EnquiryJSON } from "@/lib/villaTypes";
export type { EnquiryJSON } from "@/lib/villaTypes";

// A message from the contact form or a villa page. Also opens WhatsApp for the
// visitor, so this is the written record for the owner to follow up.

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    interest: { type: String, default: "" }, // plot size, villa name, etc.
    message: { type: String, default: "" },
    villaSlug: { type: String, default: "" },
    page: { type: String, default: "" },
    handled: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export type EnquiryDoc = InferSchemaType<typeof EnquirySchema> & { _id: mongoose.Types.ObjectId };

export function toEnquiryJSON(doc: any): EnquiryJSON {
  return {
    _id: String(doc._id),
    name: doc.name,
    phone: doc.phone,
    interest: doc.interest ?? "",
    message: doc.message ?? "",
    villaSlug: doc.villaSlug ?? "",
    page: doc.page ?? "",
    handled: Boolean(doc.handled),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
  };
}

export const Enquiry: Model<EnquiryDoc> =
  (mongoose.models.Enquiry as Model<EnquiryDoc>) || mongoose.model<EnquiryDoc>("Enquiry", EnquirySchema);
