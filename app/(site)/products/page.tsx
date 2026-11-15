import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, searchProducts } from "@/lib/queries";
import ProductCard from "@/components/product-card";
import { IconSearch } from "@/components/icons";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the complete range of Weltherm home appliances — heaters, electric blankets, kitchen appliances, floor heating and wellness products.",
};

export default function ProductsPage(props: PageProps<"/products">) {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Home appliances</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Our Products</h1>
          <p className="mt-3 max-w-2xl text-ink-300">
            Quality you can feel, prices you can afford — explore the full Weltherm range.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[16rem_1fr]">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar searchParams={props.searchParams} />
        </Suspense>

        <div>
          <Suspense fallback={<GridSkeleton />}>
            <Results searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-xl bg-ink-100" />
      ))}
    </aside>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-ink-100" />
      ))}
    </div>
  );
}

async function Sidebar({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const active = typeof params.category === "string" ? params.category : "";
  const q = typeof params.q === "string" ? params.q : "";
  const categories = await getCategories();

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <form action="/products" className="relative mb-6">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          id="product-search"
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search products…"
          className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </form>

      <h2 className="text-xs font-bold uppercase tracking-wider text-ink-400">Categories</h2>
      <nav className="mt-3 flex flex-col gap-1">
        <Link
          href="/products"
          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
            !active ? "bg-brand-600 text-white shadow-sm" : "text-ink-700 hover:bg-brand-50 hover:text-brand-700"
          }`}
        >
          All products
        </Link>
        {categories
          .filter((c) => c._count.products > 0)
          .map((c) => (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold capitalize transition ${
                active === c.slug
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-ink-700 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {c.name.toLowerCase()}
              <span className={`text-xs ${active === c.slug ? "text-brand-100" : "text-ink-300"}`}>
                {c._count.products}
              </span>
            </Link>
          ))}
      </nav>
    </aside>
  );
}

async function Results({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : undefined;

  const [products, categories] = await Promise.all([searchProducts(q, category), getCategories()]);
  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-ink-900">
          {activeCategory ? (
            <span className="capitalize">{activeCategory.name.toLowerCase()}</span>
          ) : q ? (
            <>
              Results for <span className="text-brand-600">“{q}”</span>
            </>
          ) : (
            "All products"
          )}
        </h2>
        <p className="text-sm text-ink-500">{products.length} items</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-16 text-center">
          <p className="text-lg font-bold text-ink-900">No products found</p>
          <p className="mt-1 text-sm text-ink-500">Try a different search term or browse all categories.</p>
          <Link
            href="/products"
            className="mt-5 inline-block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
          >
            Reset filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
