// Starter content: the eight listings from the previous website.
// Used by the "Import starter villas" button in /admin. Image file names refer
// to files in public/seed, which are uploaded to Cloudinary during the import.

export type SeedVilla = {
  slug: string;
  name: string;
  status: "design" | "upcoming" | "ongoing" | "completed";
  tagline: string;
  description: string;
  facing: string;
  plotLength: number;
  plotWidth: number;
  plotGaj?: number;
  floors: string;
  bedrooms: number;
  highlights: string[];
  rooms: { label: string; size: string }[];
  location: string;
  mapUrl: string;
  images: { file: string; alt: string }[];
  video?: string;
  pdf?: string;
  featured: boolean;
  order: number;
};

const VATIKA_MAP = "https://www.google.com/maps/search/?api=1&query=Vatika%2C+Sanganer%2C+Jaipur%2C+Rajasthan";
const KHEDI_MAP = "https://www.google.com/maps/search/?api=1&query=Khedi+Gokulpura%2C+Jaipur%2C+Rajasthan";

export const SEED_VILLAS: SeedVilla[] = [
  {
    slug: "jaipur-vatika-15-villas",
    name: "Jaipur Vatika: 15 villas in one planned society",
    status: "upcoming",
    tagline: "15 villas. One planned society. Your new address.",
    description:
      "Our upcoming project is a planned society of 15 villas at Village Vatika, Tehsil Sanganer, Jaipur, on the Tonk Road side of the city and close to the Ring Road.\n\nThe layout plan shows the plots, the 9 metre roads inside the society and the 30 metre ZDP road next to it. Plot sizes are marked in square yards (gaj) on the map. Plot sizes depend on the land, so each villa will be planned to suit its plot.",
    facing: "",
    plotLength: 0,
    plotWidth: 0,
    floors: "",
    bedrooms: 0,
    highlights: [
      "15 villas upcoming in this society",
      "30 m wide ZDP road next to the society",
      "9 m wide roads inside the society",
      "Plot sizes shown in gaj on the layout plan",
      "Near the Jaipur Ring Road and Tonk Road",
    ],
    rooms: [],
    location: "Village Vatika, Tehsil Sanganer, Jaipur",
    mapUrl: VATIKA_MAP,
    images: [{ file: "jaipur-vatika-layout-plan.jpg", alt: "Proposed layout plan of Ridhi Sidhi Green Vatika at Village Vatika, Tehsil Sanganer, Jaipur" }],
    featured: true,
    order: 1,
  },
  {
    slug: "villa-khedi-gokulpura-18x35",
    name: "Villa at Khedi Gokulpura, 18 ft × 35 ft",
    status: "ongoing",
    tagline: "Watch it rise, plan by plan.",
    description:
      "A villa we are building now at Khedi Gokulpura, near the Ring Road, Vatika. West facing, ground plus first floor with an open terrace, and three bedrooms: two on the ground floor and one on the first floor.\n\nBuild details: 11 ft floor height, 2 ft plinth, 3 ft staircase, 9 inch outer walls and 5 inch inner walls. Plans are drawings; sizes and details can change when the villa is built.",
    facing: "West",
    plotLength: 35,
    plotWidth: 18,
    floors: "Ground + first floor, with open terrace",
    bedrooms: 3,
    highlights: [
      "3 bedrooms: 2 on the ground floor, 1 on the first floor",
      "Living room and kitchen on the ground floor",
      "Balcony on the first floor",
      "Wardrobe space beside every bedroom",
      "Open terrace above the ground floor",
    ],
    rooms: [
      { label: "Bedroom (ground)", size: "10 ft × 11 ft 4 in" },
      { label: "Bedroom (ground)", size: "10 ft × 12 ft" },
      { label: "Living room", size: "12 ft 9 in × 10 ft" },
      { label: "Kitchen", size: "6 ft 9 in × 7 ft 7 in" },
      { label: "Toilet (each)", size: "4 ft × 7 ft" },
      { label: "Lobby with staircase", size: "3 ft 9 in × 8 ft 10 in" },
      { label: "Bedroom (first)", size: "10 ft × 12 ft" },
      { label: "Balcony", size: "10 ft 5 in × 3 ft 2 in" },
    ],
    location: "Khedi Gokulpura, near Ring Road, Vatika, Jaipur",
    mapUrl: KHEDI_MAP,
    images: [
      { file: "villa-18x35-elevation.jpg", alt: "3D elevation of the villa at Khedi Gokulpura" },
      { file: "villa-18x35-ground-floor.jpg", alt: "Ground floor plan of the 18 by 35 foot villa" },
      { file: "villa-18x35-first-floor.jpg", alt: "First floor plan of the 18 by 35 foot villa" },
      { file: "villa-18x35-floor-plans.jpg", alt: "Ground and first floor plans side by side" },
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "villa-20x40-east-semi-duplex",
    name: "20 ft × 40 ft, East facing, Semi duplex",
    status: "design",
    tagline: "The single floor plan, with a first floor added above.",
    description:
      "An east facing semi duplex on an 800 sq ft plot (about 88.9 gaj). The ground floor follows the same plan as our single floor design, and a first floor is added above as a semi duplex.",
    facing: "East",
    plotLength: 40,
    plotWidth: 20,
    floors: "Ground + first floor (semi duplex)",
    bedrooms: 2,
    highlights: ["Ground floor: same plan as the single floor design", "First floor added above, as a semi duplex", "Glass railing balcony", "Covered porch at the entrance"],
    rooms: [],
    location: "Built on your plot in and around Vatika, Jaipur",
    mapUrl: "",
    images: [
      { file: "villa-20x40-duplex-elevation.jpg", alt: "20 x 40 ft east facing semi duplex: 3D elevation" },
      { file: "villa-20x40-duplex-ground-floor.jpg", alt: "20 x 40 ft east facing semi duplex: ground floor plan" },
      { file: "villa-20x40-duplex-first-floor.jpg", alt: "20 x 40 ft east facing semi duplex: first floor plan" },
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "villa-20x40-east-single-floor",
    name: "20 ft × 40 ft, East facing, Single floor",
    status: "design",
    tagline: "Everything on one level, with a porch and wash area.",
    description:
      "An east facing single floor villa on an 800 sq ft plot (about 88.9 gaj). Two bedrooms, a living room, a kitchen with a separate wash area, two toilets and a covered porch. A walkthrough video is included.",
    facing: "East",
    plotLength: 40,
    plotWidth: 20,
    floors: "Single floor",
    bedrooms: 2,
    highlights: ["Two bedrooms with wardrobe space", "Kitchen with a separate wash area", "Two toilets", "Covered porch at the entrance"],
    rooms: [
      { label: "Bedroom", size: "10 ft 7 in × 12 ft 7 in" },
      { label: "Bedroom", size: "10 ft 7 in × 12 ft 8 in" },
      { label: "Living room", size: "12 ft 6 in × 12 ft 5 in" },
      { label: "Kitchen", size: "7 ft 6 in × 8 ft 7 in" },
      { label: "Toilets (2)", size: "5 ft 7 in × 6 ft each" },
      { label: "Wash area", size: "7 ft 6 in × 3 ft 7 in" },
      { label: "Porch", size: "4 ft 6 in × 9 ft 8 in" },
    ],
    location: "Built on your plot in and around Vatika, Jaipur",
    mapUrl: "",
    images: [
      { file: "villa-20x40-single-elevation.jpg", alt: "20 x 40 ft east facing single floor: elevation" },
      { file: "villa-20x40-single-side.jpg", alt: "20 x 40 ft east facing single floor: side elevation" },
      { file: "villa-20x40-single-corner.jpg", alt: "20 x 40 ft east facing single floor: corner elevation" },
      { file: "villa-20x40-ground-floor.jpg", alt: "20 x 40 ft east facing: ground floor plan" },
    ],
    video: "villa-20x40-walkthrough.mp4",
    featured: true,
    order: 4,
  },
  {
    slug: "villa-17x45-west",
    name: "17 ft × 45 ft, West facing",
    status: "design",
    tagline: "A long plot used to the full, with an open terrace.",
    description:
      "A west facing villa on a 765 sq ft plot (85 gaj). Ground and first floor with an open terrace. Bedrooms with wardrobes, living room, kitchen, wash area, toilets and a porch.",
    facing: "West",
    plotLength: 45,
    plotWidth: 17,
    floors: "Ground + first floor, with open terrace",
    bedrooms: 2,
    highlights: ["Bedrooms with wardrobes", "Living room and kitchen", "Wash area", "Toilets on both floors", "Porch"],
    rooms: [],
    location: "Built on your plot in and around Vatika, Jaipur",
    mapUrl: "",
    images: [
      { file: "villa-17x45-elevation.jpg", alt: "17 x 45 ft west facing: elevation" },
      { file: "villa-17x45-floor-plans.jpg", alt: "17 x 45 ft west facing: ground and first floor plans" },
    ],
    featured: false,
    order: 5,
  },
  {
    slug: "villa-15x35-east",
    name: "15 ft × 35 ft, East facing",
    status: "design",
    tagline: "A compact plot, planned for a family.",
    description:
      "An east facing villa on a 525 sq ft plot (about 58.3 gaj). Master bedroom, kids bedroom, living area, kitchen, toilet and porch. The elevation shows two villas side by side.",
    facing: "East",
    plotLength: 35,
    plotWidth: 15,
    floors: "Single floor",
    bedrooms: 2,
    highlights: ["Master bedroom and kids bedroom", "Living area and kitchen", "Toilet", "Porch"],
    rooms: [],
    location: "Built on your plot in and around Vatika, Jaipur",
    mapUrl: "",
    images: [
      { file: "villa-15x35-elevation.jpg", alt: "15 x 35 ft east facing: elevation of two villas side by side" },
      { file: "villa-15x35-ground-floor.jpg", alt: "15 x 35 ft east facing: ground floor plan" },
    ],
    featured: false,
    order: 6,
  },
  {
    slug: "three-villa-design-35x40",
    name: "3 villa design on a 35 ft × 40 ft plot",
    status: "design",
    tagline: "Three villas, one clever plot.",
    description:
      "Three villas planned together on one plot of 35 ft × 40 ft, which is 1,400 sq ft or about 155.6 gaj: two villas at the back, each about 17 ft 6 in × 25 ft (about 48.6 gaj), and one villa at the front, 35 ft × 15 ft (about 58.3 gaj).\n\nEach villa has two bedrooms, a living area, a kitchen, a toilet, an open-to-sky area and its own staircase. The set includes three elevation views, the working drawing and a walkthrough video.",
    facing: "",
    plotLength: 40,
    plotWidth: 35,
    floors: "Ground + first floor",
    bedrooms: 2,
    highlights: ["2 villas at the back, 1 at the front", "Two bedrooms in every villa", "Open-to-sky area and a staircase in each", "Three elevation views, working drawing and walkthrough video"],
    rooms: [
      { label: "Back villas: bedroom", size: "10 ft × 9 ft" },
      { label: "Back villas: bedroom", size: "10 ft × 8 ft 7½ in" },
      { label: "Back villas: living area", size: "11 ft 10½ in × 5 ft 10½ in" },
      { label: "Back villas: kitchen", size: "6 ft 4½ in × 6 ft 1½ in" },
      { label: "Back villas: toilet", size: "4 ft 6 in × 5 ft 10½ in" },
      { label: "Front villa: bedroom", size: "10 ft × 7 ft 10½ in" },
      { label: "Front villa: bedroom", size: "12 ft 3 in × 8 ft 10½ in" },
      { label: "Front villa: living area", size: "8 ft 3 in wide" },
      { label: "Front villa: kitchen", size: "7 ft 10½ in × 5 ft" },
      { label: "Front villa: toilet", size: "8 ft 3 in × 4 ft 6 in" },
    ],
    location: "Built on your plot in and around Vatika, Jaipur",
    mapUrl: "",
    images: [
      { file: "three-villa-front.jpg", alt: "Front elevation of the 3 villa design" },
      { file: "three-villa-corner.jpg", alt: "Corner view of the 3 villa design" },
      { file: "three-villa-side.jpg", alt: "Side view of the 3 villa design" },
      { file: "three-villa-working-drawing.jpg", alt: "Working drawing of the 3 villa design" },
    ],
    video: "three-villa-walkthrough.mp4",
    pdf: "three-villa-working-drawing.pdf",
    featured: true,
    order: 7,
  },
];
