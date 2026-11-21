# Weltherm — Appliances of Wellness

A modern web application for **Weltherm** (https://weltherm.com/) — home appliance brand — with a
public product catalog, company pages, community blog, and a full admin panel.

## Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack, Cache Components / PPR) |
| Styling    | Tailwind CSS v4                                   |
| Database   | SQLite via Prisma ORM (`prisma/dev.db`)           |
| Auth       | Session cookies + bcrypt (custom, zero-dependency) |
| Blog       | Built-in Markdown blog (react-markdown + remark-gfm) |
| Images     | `next/image`, stored locally in `public/uploads`  |

## Features

### Public site
- **Home** — hero, stats, category grid, featured products, about strip, support band, latest blog posts, marketplace links
- **Products** — full catalog (91 real products imported from weltherm.com) with category filter, live search, and product detail pages (gallery, features, related items, enquiry CTAs)
- **About / Services** — company story, mission & vision, values, terms, six service cards
- **Blog** — Markdown articles; **anyone can submit a post** at `/blog/submit` (moderated)
- **Contact** — form (saves to admin inbox), 4 global offices, phones, emails
- **Newsletter** signup in the footer

### Admin panel (`/admin`)
- Cookie session login (bcrypt-hashed passwords, DB-backed sessions)
- **Dashboard** — counts, pending submissions, recent messages
- **Products** — create / edit / delete, multi-image (file upload + URL), categories, featured & visibility flags, Amazon/Flipkart buy links
- **Categories** — create / edit / delete with grouping (kitchen / heating / cooling / floor heating / others)
- **Blog posts** — write, edit, and moderate: publish / reject community submissions
- **Messages** — contact-form inbox with read/unread
- **Subscribers** — newsletter list

## Getting started

```bash
npm install
npx prisma db push        # create/sync the SQLite schema
node scripts/seed.cjs     # import real products from weltherm.com + admin user
npm run dev               # http://localhost:3000
```

### Admin credentials (after seeding)

```
URL:      http://localhost:3000/admin
Email:    admin@weltherm.com
Password: Admin@123
```

> Override before seeding with `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars.
> Change the password after first login in production.

### Production

```bash
npm run build
npm start
```

## Project structure

```
app/
  (site)/            Public site (shared header/footer layout)
    page.tsx         Home
    products/        Catalog + [slug] detail
    blog/            List, [slug] detail, submit
    about|services|contact/
  admin/
    login/           Login page
    (dash)/          Gated admin (layout checks session)
      products|categories|posts|messages|subscribers/
  actions/           Server actions (public.ts, admin.ts, auth.ts)
components/          UI components (site + admin)
lib/                 db client, auth, cached queries, site config, utils
prisma/              schema.prisma + dev.db
scripts/             seed.cjs (WP import), fix-entities, cleanup-test
public/uploads/      Product & brand images (downloaded from weltherm.com)
```

## Data notes

- Product data was imported from the public WooCommerce Store API of weltherm.com
  (`/wp-json/wc/store/v1/products`) — 91 products, 17 categories, 158 images downloaded locally.
- Re-run `node scripts/seed.cjs` anytime to re-sync from the live WordPress site (it upserts).
- Cache invalidation: public catalog/blog queries are cached with tags (`products`, `categories`,
  `posts`); admin mutations call `updateTag()` so changes appear immediately.

## Environment

`.env`:

```
DATABASE_URL="file:./dev.db"
```

## Deploying elsewhere

- The app is fully self-hosted: SQLite file + local image uploads.
- For a serverless platform, swap SQLite for Postgres in `prisma/schema.prisma` and move
  `public/uploads` writes to object storage.

## Image uploads on deployed hosts (Cloudinary)

Hosting platforms (Vercel, Render free tier, etc.) have **temporary storage** — images uploaded
through the admin panel would be lost or fail to save. The app therefore supports
[Cloudinary](https://cloudinary.com) (free tier) for permanent image storage:

1. Create a free Cloudinary account → Dashboard → **Account details**
2. Copy **Cloud name**, **API Key**, **API Secret**
3. Set them as environment variables everywhere the app runs:
   - Locally: uncomment the `CLOUDINARY_*` lines in `.env`
   - Hosted: add the same three variables in your host's dashboard (Vercel → Project →
     Settings → Environment Variables) and redeploy

With the variables set, product & blog cover uploads go to Cloudinary automatically and work
forever. Without them, uploads still work locally (self-hosted), and pasting image **URLs**
works everywhere. The 158 seeded product images live in the repo and always work.
