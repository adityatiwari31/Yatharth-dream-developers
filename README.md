# Yatharth Dream Devlopers – website

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · MongoDB Atlas (Mongoose) · Cloudinary · Vercel

Same structure as the Crown Collection site: pages in `app/`, shared pieces in `components/`,
settings and database code in `lib/`, and an owner's panel at `/admin`.
Step-by-step setup is in **IMPLEMENTATION-GUIDE.md**.

## What is where

| Page | What it does |
|---|---|
| `/` | Short home page: hero, trust strip, villas, 80/20 payment band, Vastu, 4 steps, reviews, location, CTA, floating "Upcoming" bar |
| `/villas` | Every villa, with instant filter chips (Upcoming / Under construction / Ready design / Completed) |
| `/villas/[slug]` | One villa: photo gallery with zoom, video, plot facts in gaj and sq ft, room sizes, Google Maps link, payment box, enquiry form |
| `/how-to-buy` | The four steps, the 20% down / 80% bank loan plan with a calculator, and FAQ |
| `/size-guide` | Gaj / square feet / metre calculators |
| `/location` | Distance map, our sites on Google Maps, amenities, nearby developments |
| `/about` | The founders (from `/admin`), the Vastu promise, company registration, certificate |
| `/reviews` | Published reviews with photos, and the form customers use to send one |
| `/contact` | Contact details and the enquiry form (saves to the database and opens WhatsApp) |
| `/saved` | The visitor's bookmarked villas (kept in their browser) |
| `/admin` | Owner's panel: Villas · Upcoming bar · Reviews · Enquiries · Founders. Needs the admin key. |

Everything else an owner might change (phone number, Instagram, distances, payment note, hero picture)
is in **`lib/config.ts`**.

## Environment variables (Vercel → Settings → Environment Variables)

| Key | Value |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string, database name `yatharth` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | From the Cloudinary dashboard |
| `ADMIN_SECRET` | The `/admin` password: a long random string |
| `NEXT_PUBLIC_SITE_URL` | The live address, no trailing slash (e.g. `https://yatharth-dream-devlopers.vercel.app` or your own domain) |

Copy `.env.example` to `.env.local` for local development.

## Speed

- Public pages are rendered once and cached (ISR, 60 s) and refreshed instantly when anything is saved in `/admin`.
  MongoDB is not queried on every visit.
- Pictures are resized by Cloudinary (`lib/cloudinaryLoader.ts`), so Vercel's image quota is never touched.
- Admin uploads (photos, videos, PDFs) go straight from the browser to Cloudinary; review photos are shrunk in the
  browser before they are sent. Nothing large passes through the server.
- Fonts are self-hosted in `app/fonts`; the villa filter runs in the browser.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production check
```

## Folder map

```
app/            pages, API routes (app/api/*), admin panel (app/admin/*), fonts
components/     Header, Footer, VillaCard, Gallery, VastuSection, UpcomingBar, PaymentPlan, …
lib/            config.ts, mongodb.ts, models/, cloudinary.ts, cloudinaryLoader.ts, directUpload.ts, auth.ts, data.ts
public/seed/    pictures from the old site (hero picture, certificate)
```
