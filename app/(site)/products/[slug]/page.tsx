import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getProduct, getRelatedProducts } from "@/lib/queries";
import { parseJsonArray } from "@/lib/utils";
import { SITE } from "@/lib/site";
import ProductCard from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { Markdown } from "@/components/markdown";
import { IconPhone, IconMail, IconShield, IconCheck } from "@/components/icons";

export async function generateStaticParams() {
  const products = await db.product.findMany({ where: { isActive: true }, select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription ?? product.description?.slice(0, 150) ?? `${product.name} by Weltherm`,
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product || !product.isActive) notFound();

  const related = await getRelatedProducts(product.categoryId, product.slug);
  const images = parseJsonArray(product.images);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-ink-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/products" className="hover:text-brand-600">Products</Link>
          <span aria-hidden>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="capitalize hover:text-brand-600">
            {product.category.name.toLowerCase()}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink-700">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={images.length ? images : ["/uploads/brand/logo.png"]} name={product.name} />

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              {product.category.name.toLowerCase()}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{product.name}</h1>

            {product.shortDescription && (
              <p className="mt-4 leading-relaxed text-ink-600">{product.shortDescription}</p>
            )}

            {product.warranty && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
                <IconShield /> {product.warranty}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`tel:${SITE.phone.replace(/-/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
              >
                <IconPhone /> Enquire: {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Enquiry: ${product.name}`)}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-6 py-3.5 text-sm font-bold text-ink-800 transition hover:border-brand-500 hover:text-brand-700"
              >
                <IconMail /> Email us
              </a>
              {product.amazonUrl && (
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-ink-800"
                >
                  Buy on Amazon
                </a>
              )}
            </div>

            <ul className="mt-8 space-y-2.5 border-t border-ink-100 pt-6 text-sm text-ink-600">
              {[
                "Free & efficient customer support",
                "7-day easy return or replacement",
                "Warranty card included with every purchase",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-xs text-brand-700">
                    <IconCheck />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {product.description && (
          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-extrabold text-ink-900">Features & details</h2>
            <div className="mt-4">
              <Markdown content={product.description} />
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-extrabold text-ink-900">More in {product.category.name.toLowerCase()}</h2>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm font-bold text-brand-600 hover:text-brand-700"
              >
                View all →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
