# Yatharth Dream Devlopers – website

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · MongoDB Atlas (Mongoose) · Cloudinary · Render

The same structure as the Crown Collection site: pages in `app/`, shared pieces in `components/`,
settings and database code in `lib/`, and an owner's panel at `/admin`.

## What is where

| Page | What it does |
|---|---|
| `/` | Short home page: hero, trust strip, villas, 80/20 payment band, 4 steps, reviews, location, CTA |
| `/villas` | Every villa, with instant filter chips (Upcoming / Under construction / Ready design / Completed) |
| `/villas/[slug]` | One villa: photo gallery with zoom, video, plot facts in gaj and sq ft, room sizes, Google Maps link, payment box, enquiry form |
| `/how-to-buy` | The four steps, the 20% down / 80% bank loan plan with a calculator, and FAQ |
| `/size-guide` | Gaj / square feet / metre calculators |
| `/location` | Distance map, our sites on Google Maps, amenities, nearby developments |
| `/about` | The two founders, company registration, certificate, Vastu |
| `/reviews` | Published reviews with photos, and the form customers use to send one |
| `/contact` | Contact details and the enquiry form (saves to the database and opens WhatsApp) |
| `/saved` | The visitor's bookmarked villas (kept in their browser) |
| `/admin` | Owner's panel: villas, reviews, enquiries. Needs the admin key. |

Everything an owner is likely to change (phone number, Instagram, founders, distances, payment note)
is in **`lib/config.ts`**.

## 1. Accounts you need (all free to start)

1. **MongoDB Atlas** – create a free M0 cluster, a database user, and under *Network Access* allow
   `0.0.0.0/0` (Render's addresses change). Copy the connection string and put the database name
   `yatharth` before the `?`.
2. **Cloudinary** – copy *Cloud name*, *API key* and *API secret* from the dashboard.
   In *Settings → Security*, turn on **PDF and ZIP files delivery** so working-drawing PDFs open.
3. **GitHub** – push this folder to a new repository (upload the zip contents through the GitHub website if you prefer).
4. **Render** – sign up with GitHub.

## 2. Deploy on Render

1. Render dashboard → **New → Blueprint** → choose the repository. Render reads `render.yaml`.
2. When asked for the environment variables, paste:
   - `MONGODB_URI` – your Atlas connection string
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` – the same cloud name again
   - `NEXT_PUBLIC_SITE_URL` – the address Render gives you, for example `https://yatharth-dream-devlopers.onrender.com` (no slash at the end). Update it when you add your own domain.
   - `ADMIN_SECRET` – Render generates a random one; copy it from *Environment* afterwards. This is your `/admin` password.
3. Click **Apply**. The first build takes 3–5 minutes. Every push to `main` deploys again automatically.

**Plan:** the blueprint uses *Starter* so the site is always on. On the *Free* plan the server sleeps
after 15 minutes without visitors and the next visitor waits about 30–50 seconds; fine for testing,
not for buyers.

The code also runs unchanged on Vercel if you ever want to move.

## 3. First time in /admin

1. Open `https://your-site/admin`, enter the `ADMIN_SECRET`.
2. Click **Import starter villas from the old site**. This uploads the 7 listings from the previous
   website (pictures, two walkthrough videos, the working-drawing PDF) to Cloudinary and creates them
   in the database. Run it once; it skips villas that already exist.
3. Edit any villa: add photos (first photo = cover), captions, Google Maps link, status, room sizes.
4. **Reviews** tab: approve reviews sent from the website, or add one a customer sent on WhatsApp.
5. **Enquiries** tab: every contact-form message, with a one-tap WhatsApp link to the customer.

Changes show on the live site immediately.

## 4. Speed

- Public pages are rendered once and cached on the server (ISR, 60 s) and refreshed instantly when
  you save in `/admin`. MongoDB is not queried on every visit.
- Pictures are resized by Cloudinary (`lib/cloudinaryLoader.ts`), not by the Render instance.
- Fonts are self-hosted in `app/fonts`, so nothing depends on Google at build time.
- The villa filter runs in the browser; switching groups is instant.

## 5. Local development (optional)

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production check
```

## 6. Editing content

- **Founders' text and photos:** `FOUNDERS` in `lib/config.ts` (add a Cloudinary URL to `photo`).
- **Hero picture:** `HERO_IMAGE` in `lib/config.ts` – paste a Cloudinary URL once you have uploaded one.
- **Payment plan wording:** `PAYMENT_PLAN` in `lib/config.ts`.
- **Distances, amenities, nearby projects:** `DISTANCES`, `AMENITIES`, `NEARBY_PROJECTS` in `lib/config.ts`.
- **Starter villa text:** `lib/seedData.ts` (only used by the import button).

## Folder map

```
app/            pages, API routes (app/api/*), admin panel (app/admin/*), fonts
components/     Header, Footer, VillaCard, Gallery, SaveButton, PaymentPlan, …
lib/            config.ts, mongodb.ts, models/, cloudinary.ts, cloudinaryLoader.ts, auth.ts, data.ts
public/seed/    pictures and videos from the old site, used by the import button
render.yaml     Render deployment blueprint
```
