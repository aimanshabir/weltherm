import Link from "next/link";
import Image from "next/image";
import SmartImage from "@/components/smart-image";
import { getCategories, getFeaturedProducts, getPublishedPosts } from "@/lib/queries";
import { CATEGORY_GROUPS, SITE, STATS } from "@/lib/site";
import { parseJsonArray, formatDate } from "@/lib/utils";
import ProductCard from "@/components/product-card";
import {
  IconArrowRight,
  IconCheck,
  IconPhone,
  IconShield,
  IconTruck,
  IconReturn,
  IconSparkles,
} from "@/components/icons";

export default async function HomePage() {
  const [categories, featured, posts] = await Promise.all([getCategories(), getFeaturedProducts(), getPublishedPosts()]);

  const covers = new Map<string, string>();
  for (const c of categories) {
    const img = parseJsonArray(c.products[0]?.images ?? "")[0];
    if (img) covers.set(c.slug, img);
  }

  const groups = CATEGORY_GROUPS.map((g) => ({
    ...g,
    cats: categories.filter((c) => c.group === g.key && c._count.products > 0),
  })).filter((g) => g.cats.length > 0);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 30rem at 85% -10%, rgba(217,38,52,0.35), transparent 60%), radial-gradient(40rem 25rem at -10% 110%, rgba(217,38,52,0.2), transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 lg:grid-cols-2 lg:pb-24 lg:pt-20">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-600/40 bg-brand-600/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-400">
              <IconSparkles /> Since 2015
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Appliances of <span className="text-brand-500">Wellness</span> for every home
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-300">
              From cozy electric blankets to efficient kitchen companions — Weltherm designs
              high-quality, affordable home appliances trusted by over{" "}
              <strong className="text-white">100,000+ customers</strong> across India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-bold shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
              >
                Explore Products <IconArrowRight />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-ink-700 px-7 py-3.5 text-sm font-bold text-ink-200 transition hover:border-brand-500 hover:text-white"
              >
                Contact Us
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-4 gap-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl font-extrabold text-brand-500">{s.value}</dd>
                  <dd className="mt-0.5 text-[11px] uppercase tracking-wide text-ink-400">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none animate-fade-in">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-brand-600/20 blur-3xl" aria-hidden />
            <Image
              src="/uploads/brand/hero-hamaam.png"
              alt="Weltherm Electric Hamaam floor heating"
              width={800}
              height={800}
              priority
              className="relative w-full rounded-[2rem] border border-white/10 object-cover shadow-2xl"
            />
            <div className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-ink-900 shadow-xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <IconShield />
              </span>
              <div>
                <p className="text-sm font-extrabold">Floor Heating Mat</p>
                <p className="text-xs text-ink-500">10-year warranty · Warm in 1 hour</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────── */}
      <section className="border-b border-ink-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4">
          {[
            [<IconShield key="s" />, "1-Year Warranty", "On all Weltherm products"],
            [<IconPhone key="p" />, "Pan-India Support", "1800-572-6223 toll-free"],
            [<IconReturn key="r" />, "7-Day Returns", "Easy return & replacement"],
            [<IconTruck key="t" />, "100K+ Customers", "Served since 2015"],
          ].map(([icon, title, sub]) => (
            <div key={title as string} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg text-brand-600">
                {icon}
              </span>
              <div>
                <p className="text-sm font-bold text-ink-900">{title as string}</p>
                <p className="text-xs text-ink-500">{sub as string}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Our range</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Shop by category
            </h2>
          </div>
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700">
            View all products <IconArrowRight />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories
            .filter((c) => c._count.products > 0)
            .map((c) => {
              const cover = covers.get(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/10"
                >
                  <div className="relative aspect-[4/3] bg-ink-50 p-5">
                    {cover ? (
                      <SmartImage
                        src={cover}
                        alt={c.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-contain transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <SmartImage src="/uploads/brand/logo.png" alt={c.name} fill sizes="25vw" className="object-contain p-6" />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 p-4">
                    <p className="text-sm font-bold capitalize leading-snug text-ink-900 group-hover:text-brand-700">
                      {c.name.toLowerCase()}
                    </p>
                    <span className="shrink-0 rounded-full bg-ink-50 px-2 py-0.5 text-[11px] font-bold text-ink-500">
                      {c._count.products}
                    </span>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      {/* ── Featured products ────────────────────────────── */}
      <section className="bg-ink-50/70 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Signature products</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                Featured this season
              </h2>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── About strip ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <Image
              src="/uploads/brand/hero-blanket.png"
              alt="Weltherm electric blanket"
              width={800}
              height={600}
              className="w-full rounded-[2rem] object-cover shadow-xl"
            />
            <div className="absolute -right-4 -top-5 rounded-2xl bg-brand-600 px-6 py-4 text-white shadow-lg sm:-right-6">
              <p className="text-3xl font-extrabold">10<span className="text-lg">yrs</span></p>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">on floor heating</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Few words of Weltherm</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Extraordinary experiences, running the home appliance industry successfully since 2015
            </h2>
            <p className="mt-4 leading-relaxed text-ink-600">
              We are specialized in manufacturing the complete range of advanced, high-quality home
              appliances. Quality is our topmost priority — from raw materials to the finished
              product, and from purchase to after-sales service.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Advanced products at affordable prices",
                "Efficient before & after-sale service",
                "Customer and employee centric company",
                "Serving 100,000+ happy customers",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-ink-800">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs text-brand-700">
                    <IconCheck />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-950 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-ink-800"
            >
              Read our story <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Support band ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-700 py-14 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(50rem 20rem at 90% 0%, rgba(255,159,28,0.5), transparent 60%)" }}
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Need help choosing or servicing an appliance?</h2>
            <p className="mt-2 text-brand-100">
              Our service promise: preventative care, qualified professionals, zero paperwork.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`tel:${SITE.phone.replace(/-/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-lg transition hover:bg-brand-50"
            >
              <IconPhone /> {SITE.phone}
            </a>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Our Services <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Blog ─────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">From the blog</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                Latest news & stories
              </h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700">
              All articles <IconArrowRight />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/9] bg-ink-50">
                  {post.coverImage && (
                    <SmartImage src={post.coverImage} alt={post.title} fill sizes="33vw" className="object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold text-ink-400">
                    {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)} · {post.authorName}
                  </p>
                  <h3 className="mt-2 text-base font-bold leading-snug text-ink-900 group-hover:text-brand-700">
                    {post.title}
                  </h3>
                  {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-ink-500">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Marketplaces ─────────────────────────────────── */}
      <section className="border-t border-ink-100 bg-ink-50/70 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-ink-500">
            Weltherm products are also available on
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={SITE.amazonUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-ink-950 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-ink-800"
            >
              Amazon India
            </a>
            <a
              href={SITE.flipkartUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#2874F0] px-8 py-3.5 text-sm font-bold text-white transition hover:brightness-110"
            >
              Flipkart
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
