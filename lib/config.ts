// ─────────────────────────────────────────────────────────────────────────────
// Site settings. Everything an owner is likely to change lives in this file.
// Text in the pages reads from here, so edit once and it updates everywhere.
// ─────────────────────────────────────────────────────────────────────────────

export const BRAND_NAME = "Yatharth Dream Devlopers";
export const BRAND_LEGAL_NAME = "Yatharth Dream Devlopers Private Limited";
export const BRAND_TAGLINE = "Villas made for your plot";
export const BRAND_TAGLINE_HI = "अपना प्लॉट, अपना विला, अपना सपना";
export const BRAND_SLOGAN = "Your Plot. Your Villa. Your Dream.";

// WhatsApp number: country code + number, no plus sign, no spaces.
export const WHATSAPP_NUMBER = "916378131410";
export const WHATSAPP_DISPLAY = "+91 63781 31410";

export const INSTAGRAM_HANDLE = "@yd_developers";
export const INSTAGRAM_URL = "https://www.instagram.com/yd_developers";
export const LINKEDIN_URL = "https://www.linkedin.com/in/yash-gupta-69674324b/";

// Live address, no trailing slash. Set NEXT_PUBLIC_SITE_URL on Render to override.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://yatharthdreamdevlopers.onrender.com";

// Company registration (shown on About, Contact and the trust strip)
export const COMPANY = {
  cin: "U68200RJ2025PTC102088",
  incorporatedOn: "22 April 2025",
  act: "Companies Act, 2013",
  type: "Private company limited by shares",
  registrar: "Registrar of Companies, Central Registration Centre, Ministry of Corporate Affairs",
  office: "P. No. 2, Rajoriya Vihar, Sanganer Thana, Mansarovar, Jaipur 302020, Rajasthan",
  officeShort: "Mansarovar, Jaipur, Rajasthan",
  mcaUrl: "https://www.mca.gov.in",
  aoa: "e-AOA, Form INC-34, filed 22 April 2025 and approved 23 April 2025",
};

// The two founders (the directors on the MCA record).
// EDIT the `bio` lines with a sentence or two about each person in your own words,
// and add a Cloudinary photo URL to `photo`. Until a photo is added, the page
// shows the person's initials inside an arch.
export const FOUNDERS = [
  {
    name: "Sushil Kumar Gupta",
    role: "Co-founder and Director",
    photo: "",
    bio: "Director of Yatharth Dream Devlopers Private Limited since its incorporation in April 2025. Together the founders buy plots in and around Vatika, plan them, and build villas on them: one team from the first drawing to the finished home.",
  },
  {
    name: "Tanay Gupta",
    role: "Co-founder and Director",
    photo: "",
    bio: "Director of Yatharth Dream Devlopers Private Limited since its incorporation in April 2025. Every villa is planned for the size and shape of its plot, with the Vastu adjustments families generally ask for.",
  },
];

// Payment plan shown on the home page, every villa page and How to buy.
export const PAYMENT_PLAN = {
  downPaymentPercent: 20,
  loanPercent: 80,
  note: "Loan approval, interest rate and eligibility are decided by the bank. We help with the paperwork and introduce you to the bank.",
};

// Location page: approximate distances from Vatika. Angle places the point on the distance map.
export const DISTANCES = [
  { place: "Surajpura", km: 3, angle: 135 },
  { place: "Vatika Road", km: 4.5, angle: 210 },
  { place: "Sitapura", km: 10, angle: 245 },
  { place: "Narayana Multispeciality Hospital", short: "Narayana Hospital", km: 10, angle: 290 },
  { place: "Pratap Nagar", km: 12, angle: 325 },
  { place: "Jaipur International Airport", short: "Jaipur Airport", km: 18, angle: 15 },
];

export const AREA_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Vatika%2C+Jaipur%2C+Rajasthan";
export const AREA_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Vatika%2C+Jaipur%2C+Rajasthan";

export const AMENITIES = [
  {
    title: "Schools",
    text: "Vaneesh International Public School, Deep Shikha Public School and Gyan Vihar Public School are in the locality. Calorx Public School and RPS School are about 10 km away.",
  },
  {
    title: "Hospitals",
    text: "PHC Hospital and Mahatma Gandhi Hospital are close by. Narayana Multispeciality Hospital is about 10 km away, and Agarwal Hospital about 11 km.",
  },
  {
    title: "Malls and markets",
    text: "Manglam Mall, Pratap Plaza and Fagna Market are within about 12 km.",
  },
  {
    title: "Bus and roads",
    text: "Vatika Bus Stop is within walking distance. Vatika Road, Lakhna Road, SH 12 and the Jaipur Ring Road connect the area to the city.",
  },
  {
    title: "Parks and open spaces",
    text: "Landscaped parks and open green spaces in the colonies around Vatika.",
  },
  {
    title: "Work and industry",
    text: "Sitapura Industrial Area is about 10 km away. Corporate Park and G-Business Park are about 25 km away.",
  },
];

export const NEARBY_PROJECTS = [
  { name: "Bilwa Awasiya Yojana", by: "JDA residential scheme", text: "Plots at Beelwa, Sanganer, on the Ring Road near Tonk Road." },
  { name: "Shri Ram Nagar 2", by: "DHB Group", text: "Residential project near the Ring Road, Vatika Road, Kallwala Stand, Tonk Road." },
  { name: "Vatika Residency", by: "Riyasat Infra Developers", text: "Ongoing plotted project of 510 units on Vatika Road." },
  { name: "Riyasat Vatika", by: "Gokul Kripa", text: "Township in Village Vatika, Tehsil Sanganer, on Tonk Road." },
  { name: "Gulmohar Gardens", by: "Colony at Bhatawala", text: "Residential plots on Vatika Road, Tonk Road." },
  { name: "Kedia's Kingdom", by: "Kedia Homes", text: "JDA approved plots near Vatika and the Ring Road, Tonk Road." },
];

// Hero picture on the home page. Paste a Cloudinary URL here once you have uploaded one;
// until then the elevation from the old site is used.
export const HERO_IMAGE = "/seed/villa-18x35-elevation.jpg";
export const HERO_IMAGE_ALT = "3D elevation of a modern villa with an arched window, wooden slats and a terrace garden, lit at sunset";

// How many villas the home page shows (featured first, then newest).
export const HOME_VILLA_COUNT = 6;

// How many reviews the home page shows.
export const HOME_REVIEW_COUNT = 3;

// Helpers for WhatsApp links -----------------------------------------------
export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA_GENERAL = waLink(`Hello, I am interested in the villas by ${BRAND_NAME}.`);
export const WA_VASTU = waLink("Hello, I would like to discuss Vastu requirements for a villa.");
