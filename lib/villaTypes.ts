// Plain types and labels shared by server and browser code.
// (No Mongoose import here, so client components stay small.)

export const VILLA_STATUSES = ["design", "upcoming", "ongoing", "completed"] as const;
export type VillaStatus = (typeof VILLA_STATUSES)[number];

export const STATUS_LABEL: Record<VillaStatus, string> = {
  design: "Ready design",
  upcoming: "Upcoming",
  ongoing: "Under construction",
  completed: "Completed",
};

export type VillaImage = { url: string; publicId: string; alt: string };
export type VillaRoom = { label: string; size: string };

/** A villa as sent from server components to the browser. */
export type VillaJSON = {
  _id: string;
  name: string;
  slug: string;
  status: VillaStatus;
  tagline: string;
  description: string;
  facing: string;
  plotLength: number;
  plotWidth: number;
  plotGaj: number;
  floors: string;
  bedrooms: number;
  highlights: string[];
  rooms: VillaRoom[];
  location: string;
  mapUrl: string;
  images: VillaImage[];
  videoUrl: string;
  pdfUrl: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewJSON = {
  _id: string;
  name: string;
  rating: number;
  text: string;
  bought: string;
  photo: { url: string; publicId: string };
  approved: boolean;
  source: string;
  createdAt: string;
};

export type EnquiryJSON = {
  _id: string;
  name: string;
  phone: string;
  interest: string;
  message: string;
  villaSlug: string;
  page: string;
  handled: boolean;
  createdAt: string;
};
