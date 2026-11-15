/**
 * Weltherm seeder — pulls real product data from weltherm.com (WooCommerce Store API),
 * downloads images locally, and seeds the SQLite database.
 *
 * Usage: node scripts/seed.cjs
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const prisma = new PrismaClient();
const API = "https://weltherm.com/wp-json/wc/store/v1";
const UPLOADS_DIR = path.join(__dirname, "..", "public", "uploads");
const PRODUCTS_DIR = path.join(UPLOADS_DIR, "products");
const BRAND_DIR = path.join(UPLOADS_DIR, "brand");

const GROUP_BY_SLUG = {
  "rice-cooker": "kitchen",
  "infrared-cooker": "kitchen",
  "electric-cattle": "kitchen",
  "gas-stove": "kitchen",
  "meat-grinder": "kitchen",
  mixer: "kitchen",
  "electric-blanket": "heating",
  "ptc-heater": "heating",
  "tower-heater": "heating",
  "oil-heater": "heating",
  "wall-heater-2": "heating",
  "gas-heater": "heating",
  "quartz-heater": "heating",
  "fan-convector-heater": "heating",
  geyser: "heating",
  "floor-heating-system": "floor-heating",
  "vacuum-cleaner": "others",
  "oxygen-concentrator": "others",
};

const FEATURED_SLUGS = [
  "electric-hamaam",
  "double-multizone-electric-blanket-under-blanket-ub-ffd",
  "over-blanket-ob-tsf",
  "ci-1045d",
  "10l-oxygen-concentrator",
  "ct-360",
  "5l-oxygen-concentrator",
  "ci-2032d",
];

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function htmlToMarkdown(html) {
  if (!html || !html.trim()) return "";
  let s = html;
  s = s.replace(/<\s*li[^>]*>/gi, "\n- ");
  s = s.replace(/<\s*\/\s*li\s*>/gi, "");
  s = s.replace(/<\s*br\s*\/?\s*>/gi, "\n");
  s = s.replace(/<\s*\/\s*p\s*>/gi, "\n\n");
  s = s.replace(/<\s*(ul|ol)[^>]*>/gi, "\n");
  s = s.replace(/<\s*\/\s*(ul|ol)\s*>/gi, "\n");
  s = s.replace(/<strong[^>]*>|<b>/gi, "**");
  s = s.replace(/<\/strong>|<\/b>/gi, "**");
  s = s.replace(/<[^>]+>/g, "");
  s = decodeEntities(s);
  s = s.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "weltherm-seed/1.0" } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json();
}

function extOf(url, fallback = "jpg") {
  const m = /\.([a-zA-Z0-9]{3,5})(?:[?#]|$)/.exec(url);
  const e = m ? m[1].toLowerCase() : fallback;
  return e === "jpeg" ? "jpg" : e;
}

async function downloadImage(url, filePath) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "weltherm-seed/1.0" } });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1024) return false;
    fs.writeFileSync(filePath, buf);
    return true;
  } catch {
    return false;
  }
}

/** Try -600x600 intermediate size first (WP convention), then the full URL. */
async function downloadProductImage(srcUrl, outPath) {
  const m = /^(.*\/[^/]+?)(\.[a-zA-Z0-9]{3,5})$/.exec(srcUrl);
  if (m) {
    const sized = `${m[1]}-600x600${m[2]}`;
    if (await downloadImage(sized, outPath)) return true;
  }
  return downloadImage(srcUrl, outPath);
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function main() {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  fs.mkdirSync(BRAND_DIR, { recursive: true });

  console.log("→ Fetching categories…");
  const wpCategories = await fetchJson(`${API}/products/categories?per_page=100&page=1`);
  console.log(`   ${wpCategories.length} categories`);

  console.log("→ Fetching products…");
  const wpProducts = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await fetchJson(`${API}/products?per_page=100&page=${page}`);
    wpProducts.push(...batch);
    if (batch.length < 100) break;
  }
  console.log(`   ${wpProducts.length} products`);

  // Brand assets
  console.log("→ Downloading brand assets…");
  const brandAssets = [
    ["https://weltherm.com/wp-content/uploads/2024/09/Logo-1.png", "logo.png"],
    ["https://weltherm.com/wp-content/uploads/2024/08/Weltherm-Post-11-June.png", "hero-hamaam.png"],
    ["https://weltherm.com/wp-content/uploads/2024/08/banner.png", "hero-gas-heater.png"],
    ["https://weltherm.com/wp-content/uploads/2024/08/WelTherm-Home-Appliances-2.png", "hero-blanket.png"],
  ];
  for (const [url, name] of brandAssets) {
    const ok = await downloadImage(url, path.join(BRAND_DIR, name));
    console.log(`   ${ok ? "✓" : "✗"} ${name}`);
  }

  // Seed categories
  console.log("→ Seeding categories…");
  const order = {};
  wpCategories.forEach((c, i) => (order[c.slug] = i));
  const catMap = new Map(); // wp category id -> our category id
  for (const c of wpCategories) {
    const parent = c.parent ? catMap.get(c.parent) : null;
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: decodeEntities(c.name),
        description: c.description ? decodeEntities(c.description).replace(/<[^>]+>/g, "").trim() : null,
        group: GROUP_BY_SLUG[c.slug] || "others",
        sortOrder: order[c.slug] ?? 99,
      },
      create: {
        name: decodeEntities(c.name),
        slug: c.slug,
        description: c.description ? decodeEntities(c.description).replace(/<[^>]+>/g, "").trim() : null,
        group: GROUP_BY_SLUG[c.slug] || "others",
        sortOrder: order[c.slug] ?? 99,
      },
    });
    catMap.set(c.id, category.id);
    void parent;
  }
  console.log(`   ${catMap.size} categories seeded`);

  // Download product images
  console.log("→ Downloading product images…");
  const imageJobs = [];
  for (const p of wpProducts) {
    (p.images || []).forEach((img, i) => {
      imageJobs.push({ product: p, img, i });
    });
  }
  let done = 0;
  const localImages = new Map(); // product slug -> [local paths]
  await mapLimit(imageJobs, 6, async ({ product, img, i }) => {
    const ext = extOf(img.src);
    const fileName = `${product.slug}-${i}.${ext}`;
    const ok = await downloadProductImage(img.src, path.join(PRODUCTS_DIR, fileName));
    if (ok) {
      const list = localImages.get(product.slug) || [];
      list.push(`/uploads/products/${fileName}`);
      localImages.set(product.slug, list);
    }
    done++;
    if (done % 40 === 0) console.log(`   ${done}/${imageJobs.length} images…`);
  });
  console.log(`   ${done - [...localImages.values()].flat().length === 0 ? done : [...localImages.values()].flat().length} images downloaded`);

  // Seed products
  console.log("→ Seeding products…");
  let count = 0;
  for (const p of wpProducts) {
    const wpCat = (p.categories || [])[0];
    if (!wpCat || !catMap.get(wpCat.id)) continue;
    const description = htmlToMarkdown(p.description);
    const shortDescription = htmlToMarkdown(p.short_description);
    const warranty = /hamaam|floor/i.test(p.name) ? "10 Year Manufacturer Warranty" : "1 Year Manufacturer Warranty";

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        sku: p.sku || null,
        shortDescription: shortDescription || null,
        description: description || null,
        images: JSON.stringify(localImages.get(p.slug) || []),
        featured: FEATURED_SLUGS.includes(p.slug),
        warranty,
        categoryId: catMap.get(wpCat.id),
      },
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku || null,
        shortDescription: shortDescription || null,
        description: description || null,
        images: JSON.stringify(localImages.get(p.slug) || []),
        featured: FEATURED_SLUGS.includes(p.slug),
        warranty,
        categoryId: catMap.get(wpCat.id),
      },
    });
    count++;
  }
  console.log(`   ${count} products seeded`);

  // Admin user
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@weltherm.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, name: "Weltherm Admin", passwordHash, role: "ADMIN" },
  });

  // Blog posts (from the old site's news section)
  const posts = [
    {
      title: "Home Appliances that Make Everyday Living Easier",
      slug: "home-appliances",
      excerpt:
        "The Weltherm home appliances store is designed to allow you to run your home efficiently and smoothly.",
      content: `Running a home efficiently is easier when the right appliances do the heavy lifting. At Weltherm, we design every product with one goal — making everyday living simpler, safer and more comfortable for Indian families.

## Why the right appliance matters

A good appliance saves you time, reduces energy bills and lasts for years. That's why we focus on quality from the raw stage itself — from the heating element inside a blanket to the thermostat inside a rice cooker.

## What we offer

- **Kitchen appliances** — rice cookers, infrared cookers, electric kettles, mixers and meat grinders
- **Heating appliances** — electric blankets, PTC/tower/oil/gas heaters and geysers
- **Floor heating systems** — even, energy-efficient warmth under your feet
- **Wellness products** — oxygen concentrators and vacuum cleaners

Every Weltherm product comes with a one-year warranty and pan-India support at 1800-572-6223.`,
      coverImage: "/uploads/brand/hero-hamaam.png",
      tags: JSON.stringify(["Home Appliances", "Weltherm"]),
    },
    {
      title: "A Kitchen is Complete Only with the Right Appliances",
      slug: "kitchen-appliances",
      excerpt:
        "A kitchen is complete only when you have the basic utensils and kitchen appliances. Here's how to choose them.",
      content: `A kitchen is complete only when you have the basic utensils and kitchen appliances. You can use your kitchen in the most effective manner with the right set of tools.

## Start with the essentials

1. **A reliable rice cooker** — perfectly cooked rice, kept warm for hours
2. **An infrared cooker** — fast, flameless cooking that's easy to clean
3. **An electric kettle** — boiling water in minutes for tea, coffee and cooking
4. **A sturdy mixer** — from chutneys to batters in seconds

## Built for Indian cooking

Weltherm kitchen appliances are designed for the way India cooks — heavy daily use, varied cuisines and family-sized quantities. Look for safety features like overheat protection, and always insist on a warranty.`,
      coverImage: "/uploads/brand/hero-blanket.png",
      tags: JSON.stringify(["Kitchen", "Appliances"]),
    },
    {
      title: "Electric Heaters: Warmth that's Safe and Efficient",
      slug: "electric-heater",
      excerpt:
        "Electric heaters are electric heating devices designed to take electrical energy as input and produce heat.",
      content: `Electric heaters are electric heating devices that take electrical energy as input and convert it into heat. They are a clean, convenient and controllable way to warm your home through the winter.

## Types of electric heaters

- **PTC heaters** — ceramic elements that self-regulate for safe, efficient warmth
- **Oil heaters** — silent, long-lasting heat that retains warmth even after switching off
- **Tower & fan heaters** — quick warmth for small to medium rooms
- **Quartz & infrared heaters** — instant radiant heat you can feel immediately
- **Electric blankets** — cosy warmth in bed at a fraction of the energy

## Safety first

Every Weltherm heater includes overheat protection. Remember to never cover a heater, keep flammable items away, and always buy from a brand that honours its warranty.`,
      coverImage: "/uploads/brand/hero-gas-heater.png",
      tags: JSON.stringify(["Heating", "Winter"]),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        status: "PUBLISHED",
        authorName: "Weltherm Team",
        authorId: admin.id,
        publishedAt: new Date("2025-06-21T10:00:00Z"),
      },
    });
  }
  console.log(`   3 blog posts seeded`);

  console.log("\n✅ Seed complete!");
  console.log(`   Admin login: ${adminEmail} / ${adminPassword}`);
  console.log("   (Override with ADMIN_EMAIL / ADMIN_PASSWORD env vars)\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
