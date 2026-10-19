import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import type { FounderJSON } from "@/lib/villaTypes";

// One document (key "site") holding settings the owner edits in /admin.
// Today that is the founders shown on the About page.

const FounderSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    bio: { type: String, default: "" },
    photo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
  },
  { _id: false },
);

const SettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "site" },
    founders: { type: [FounderSchema], default: [] },
  },
  { timestamps: true },
);

export type SettingsDoc = InferSchemaType<typeof SettingsSchema> & { _id: mongoose.Types.ObjectId };

export function toFounderJSON(f: any): FounderJSON {
  return {
    name: f?.name ?? "",
    role: f?.role ?? "",
    bio: f?.bio ?? "",
    photo: { url: f?.photo?.url ?? "", publicId: f?.photo?.publicId ?? "" },
  };
}

export const Settings: Model<SettingsDoc> =
  (mongoose.models.Settings as Model<SettingsDoc>) || mongoose.model<SettingsDoc>("Settings", SettingsSchema);
