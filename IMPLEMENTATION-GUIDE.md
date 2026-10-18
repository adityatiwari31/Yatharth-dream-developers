# Yatharth Dream Devlopers website — implementation guide (Vercel)

From the zip file to a live website on Vercel, in order. Budget about an hour the first time.
Nothing needs to be installed on your laptop; everything is done in the browser.

Vercel is the same host as the Crown Collection site: the server never sleeps, pages are served from a
cache close to the visitor, and a new deploy happens on every push to GitHub.

**What you need before starting:** the file `yatharth-dream-devlopers.zip`, a GitHub account, and — if you
already ran the site on Render — the values you used there (MongoDB, Cloudinary, admin key). They work unchanged.

---

## Part 1 — Accounts and the six keys

| Key | What it is | Where it comes from |
|---|---|---|
| `MONGODB_URI` | Address of the database (villas, reviews, enquiries, upcoming bar, founders) | MongoDB Atlas, step 1.1 |
| `CLOUDINARY_CLOUD_NAME` | Photo storage account name | Cloudinary, step 1.2 |
| `CLOUDINARY_API_KEY` | Photo storage key | Cloudinary, step 1.2 |
| `CLOUDINARY_API_SECRET` | Photo storage secret | Cloudinary, step 1.2 |
| `ADMIN_SECRET` | The password for `/admin` | You choose it, step 3 |
| `NEXT_PUBLIC_SITE_URL` | The live address of the site | Vercel gives it to you, step 3 |

Already have MongoDB and Cloudinary from the Render setup? Skip to 1.3. The data stays where it is; Vercel simply points at the same database and the same photos.

### 1.1 MongoDB Atlas (database) — free

1. **mongodb.com/atlas** → sign up → create an organisation and a project (any names).
2. **Create a cluster** → **M0 Free**. Provider AWS, region **Mumbai (ap-south-1)** if offered for the free tier; otherwise Singapore. Name it `Cluster0`.
3. In the security quickstart: database user `ydd` with a password of **letters and numbers only** (no `@`, `#`, `%`). Write it down.
4. **Security → Network Access → Add IP Address → Allow access from anywhere** (`0.0.0.0/0`). Vercel's servers have no fixed IP, so this is required; the password still protects the database.
5. **Database → Connect → Drivers** (Node.js) → copy the connection string, replace `<password>` with the real password, and type `yatharth` between `.net/` and `?`:

   ```
   mongodb+srv://ydd:YOURPASSWORD@cluster0.ab12cd.mongodb.net/yatharth?retryWrites=true&w=majority&appName=Cluster0
   ```

### 1.2 Cloudinary (photos and videos) — free

1. **cloudinary.com** → sign up → on the **Dashboard**, copy **Cloud name**, **API Key** and **API Secret** (eye icon to reveal).
2. **Settings (gear) → Security → "PDF and ZIP files delivery"** → turn **on** and save. Without this the working-drawing PDFs will not open for visitors.

### 1.3 GitHub

The code must be in a GitHub repository that the new Vercel account can see. Two clean ways:

- **Simplest:** create the new Vercel account by signing in with the GitHub account that owns the repository.
- **Fully separate:** make a new GitHub account for the company, then move the repository to it: repository → **Settings → General → Danger Zone → Transfer**. Then sign up for Vercel with that GitHub account.

### 1.4 Vercel

**vercel.com → Sign Up → Continue with GitHub**, with the GitHub account from 1.3. Allow Vercel to see the repository when asked.

About the plan: the free **Hobby** plan is what Vercel offers for personal, non-commercial projects; a company's live website falls under their **Pro** plan (about US$20 a month). Start on Hobby to set everything up and test; move to Pro before you advertise the site.

---

## Part 2 — Put the new code on GitHub

### If this is the first upload

1. GitHub → **+** → **New repository** → name `yatharth-dream-devlopers`, **Private**, tick **Add a README file** → Create.
2. **Code → Codespaces → Create codespace on main**. Drag the zip into the left file panel. In the terminal:

   ```bash
   unzip -o yatharth-dream-devlopers.zip -d . && rm yatharth-dream-devlopers.zip
   git add -A && git commit -m "Website" && git push
   ```

### If the repository already exists (you are updating from the Render version)

Open a Codespace on the repository, drag the new zip in, and run:

```bash
unzip -o yatharth-dream-devlopers.zip -d . && rm yatharth-dream-devlopers.zip
rm -rf render.yaml app/api/upload/route.ts app/api/seed lib/seedData.ts
git add -A && git commit -m "Move to Vercel; home link, Vastu, lighter green, upcoming bar, founders in admin" && git push
```

The second line removes files that are no longer part of the site. Stop the Codespace afterwards (Codespaces → ⋯ → Stop).

*Without Codespaces:* GitHub's drag-and-drop uploader stops at 100 files, so upload folder by folder: `app`, `components`, `lib`, then `public` and the loose files (`package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `README.md`, `IMPLEMENTATION-GUIDE.md`, `.gitignore`, `.env.example`). Delete `render.yaml`, `app/api/upload/route.ts`, `app/api/seed` and `lib/seedData.ts` through the GitHub website (open the file → ⋯ → Delete file).

---

## Part 3 — Deploy on Vercel

1. Vercel dashboard → **Add New… → Project** → find `yatharth-dream-devlopers` → **Import**.
2. Vercel detects Next.js by itself. Leave *Framework Preset*, *Root Directory* and the build settings as they are.
3. Open **Environment Variables** and add, one by one:

   | Name | Value |
   |---|---|
   | `MONGODB_URI` | the address from 1.1 |
   | `CLOUDINARY_CLOUD_NAME` | from 1.2 |
   | `CLOUDINARY_API_KEY` | from 1.2 |
   | `CLOUDINARY_API_SECRET` | from 1.2 |
   | `ADMIN_SECRET` | a long random string (24+ characters; a password manager can generate one). This is your `/admin` password. If you used Render before, the same value is fine. |
   | `NEXT_PUBLIC_SITE_URL` | leave empty for now, or type `https://yatharth-dream-devlopers.vercel.app`; you will correct it in step 6 |

4. Click **Deploy**. The first build takes 2–3 minutes and ends with a confetti screen and the live address, for example `https://yatharth-dream-devlopers.vercel.app` (Vercel adds a suffix if the name is taken).
5. Open the address. If MongoDB already has villas from before, they are there. Otherwise add them through `/admin` (Part 4).
6. **Settings → Environment Variables** → set `NEXT_PUBLIC_SITE_URL` to the exact live address, no slash at the end. Then **Deployments → ⋯ on the latest deployment → Redeploy** (changing a variable does not redeploy by itself). This value goes into the WhatsApp messages that link to villa pages, so it must be right. Update it again when you add your own domain (Part 7).
7. **Settings → Functions → Function Region** → choose **Mumbai, India (bom1)** if the option is offered on your plan, so the server sits next to the Mumbai database. Otherwise leave the default.

Every later push to `main` deploys automatically in about two minutes. Each deployment also gets its own preview address; the main address always shows the latest successful one.

### Switch off Render

Once Vercel is live, go to the Render dashboard → the service → **Settings → Delete Web Service** (or **Suspend**), so there are not two copies of the site. Nothing else needs to change: MongoDB and Cloudinary are untouched.

---

## Part 4 — The admin page (10 minutes)

Open `https://<your address>/admin` and enter the `ADMIN_SECRET`. The key stays only in that browser tab. Five tabs:

1. **Villas** — add a villa, upload photos (they go straight from your browser to Cloudinary with a progress bar; the first photo is the cover), captions, Google Maps link, status, room sizes, video, PDF. Edit or delete existing ones.
2. **Upcoming bar** — the green strip that floats at the bottom of the home page. **Add a line** with a title, an optional second line and where it should take people (pick a villa from the list, or type any address). Switch lines on and off, or remove them. With more than one line on, the strip rotates through them every few seconds. Visitors can close it with the ×; it comes back on their next visit.
3. **Reviews** — approve reviews sent from the website, add one a customer sent on WhatsApp (with their permission), hide or delete.
4. **Enquiries** — every contact-form message with a one-tap WhatsApp link back to the customer. Mark handled.
5. **Founders** — the people shown on the About page. Edit the name, role and introduction, **Upload photo** (shown inside the arch instead of initials), reorder, add or remove. Click **Save founders**.

Everything saved in admin shows on the live site straight away.

---

## Part 5 — Text in `lib/config.ts`

Edit on GitHub: open the file → pencil icon → change → **Commit changes**. Vercel redeploys in about two minutes. (Admin changes are instant; `config.ts` changes need the redeploy.)

| What | Where in `lib/config.ts` |
|---|---|
| WhatsApp number | `WHATSAPP_NUMBER` (`916378131410`, country code + number, no plus or spaces) and `WHATSAPP_DISPLAY` |
| Instagram and LinkedIn | `INSTAGRAM_URL`, `LINKEDIN_URL` |
| Hero picture on the home page | `HERO_IMAGE`, `HERO_IMAGE_ALT` — paste a Cloudinary URL of your best render |
| 80% / 20% wording and the bank disclaimer | `PAYMENT_PLAN` |
| Distances, amenities, nearby developments | `DISTANCES`, `AMENITIES`, `NEARBY_PROJECTS` |
| How many villas / reviews on the home page | `HOME_VILLA_COUNT`, `HOME_REVIEW_COUNT` |
| Company registration facts | `COMPANY` |
| Founders' starting values | `FOUNDERS` — only used until founders are saved once in `/admin` |

To change the certificate picture on the About page, replace `public/seed/certificate-of-incorporation.jpg` with your own file of the same name.

---

## Part 6 — Your own domain (optional)

1. Buy the domain from any registrar.
2. Vercel → project → **Settings → Domains → Add**. Vercel shows exactly which DNS records to add at the registrar (an A record for the bare domain, a CNAME for `www`). HTTPS is set up automatically within minutes of the records going live.
3. Set `NEXT_PUBLIC_SITE_URL` to `https://www.yourdomain.com` and redeploy (Part 3, step 6).

---

## Part 7 — Test checklist (once on a phone, once on a laptop)

- Home page loads fast on 4G; the **Home** link in the header works, and the logo does too.
- The green **Upcoming** strip appears at the bottom after a moment; the × closes it; the WhatsApp button sits above it.
- Home page and About page both show the **Vastu** section; the villa page shows the small "Vastu friendly" tag.
- `/villas`: filter chips switch instantly; each card opens its villa.
- A villa page: swipe through photos, zoom, video, "Open in Google Maps", "Ask about this villa" opens WhatsApp with the villa link.
- `/about`: founders with photos (after uploading them in admin), certificate opens.
- `/reviews`: send a test review with a phone photo; approve it in admin; it shows on the page.
- `/contact`: send a test enquiry; it appears in admin and WhatsApp opened.
- `/admin` is not reachable without the key.

---

## Part 8 — When something goes wrong

| Symptom | Cause and fix |
|---|---|
| Deployment fails (red) | Vercel → Deployments → click it → **Build Logs**. A line naming a `.ts` file means the code was edited by hand; compare with the zip or share the log line. |
| Site works but shows no villas | `MONGODB_URI` is wrong or Atlas does not allow Vercel in. Check Network Access allows `0.0.0.0/0` and the password has no special characters. Open `/admin` → Villas: is the list empty? |
| "Admin key not accepted" | Copy `ADMIN_SECRET` from Vercel → Settings → Environment Variables (eye icon). Watch for a space at the end. Lock and unlock. |
| Photo upload in admin fails | One of the three `CLOUDINARY_*` values is wrong; re-copy from Cloudinary, save, redeploy. Uploads go browser → Cloudinary, so the Vercel logs will not show them; the error text appears next to the upload button. |
| Review photo fails with a size error | Photos are shrunk in the browser before sending; very old browsers skip this. Ask the customer to try another browser or send the photo on WhatsApp and add the review from admin. |
| Working-drawing PDF opens as "401" or blank | Cloudinary → Settings → Security → turn on **PDF and ZIP files delivery**. |
| Changed `lib/config.ts` but nothing changed | Check Vercel → Deployments: a new deployment should have started from your commit. |
| Changed an environment variable but nothing changed | Variables apply on the next deployment: Deployments → ⋯ → **Redeploy**. |
| WhatsApp message links to the wrong site address | `NEXT_PUBLIC_SITE_URL` is wrong; fix and redeploy. |
| `git push` rejected in Codespaces | Run `git pull --rebase origin main && git push`. |
| A villa page says "That page is not here" | The slug changed or the villa was deleted. Check its web address in admin. |

---

## Part 9 — Keep it safe

- Never paste `MONGODB_URI`, the Cloudinary secret or `ADMIN_SECRET` into a chat, an Instagram message or the code. They live only in Vercel → Settings → Environment Variables.
- If the admin key is ever shared by mistake, change `ADMIN_SECRET` in Vercel and redeploy. Old sessions stop working immediately after the deploy.
- Monthly cost: MongoDB Atlas free, Cloudinary free, Vercel Hobby free while testing (Pro about US$20 a month for a business site), domain about ₹1,000 a year.

---

## Appendix — Running it on a laptop (only if you want to)

```bash
npm install
cp .env.example .env.local      # fill in the six values
npm run dev                     # http://localhost:3000
npm run build && npm start      # production check
```

Node.js 20 or newer is required (`node --version`).
