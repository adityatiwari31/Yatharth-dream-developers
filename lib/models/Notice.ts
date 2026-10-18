import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import type { NoticeJSON } from "@/lib/villaTypes";
export type { NoticeJSON } from "@/lib/villaTypes";

// One line in the floating "Upcoming" bar on the home page.

const NoticeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    text: { type: String, default: "" },
    link: { type: String, default: "" },
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type NoticeDoc = InferSchemaType<typeof NoticeSchema> & { _id: mongoose.Types.ObjectId };

export function toNoticeJSON(doc: any): NoticeJSON {
  return {
    _id: String(doc._id),
    title: doc.title ?? "",
    text: doc.text ?? "",
    link: doc.link ?? "",
    active: Boolean(doc.active),
    order: doc.order ?? 0,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
  };
}

export const Notice: Model<NoticeDoc> =
  (mongoose.models.Notice as Model<NoticeDoc>) || mongoose.model<NoticeDoc>("Notice", NoticeSchema);
