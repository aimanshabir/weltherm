import Link from "next/link";
import { parseJsonArray } from "@/lib/utils";
import SmartImage from "@/components/smart-image";

export type ProductCardData = {
  name: string;
  slug: string;
  shortDescription: string | null;
  images: string;
  category: { name: string; slug: string };
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const images = parseJsonArray(product.images);
  const cover = images[0] || "/uploads/brand/logo.png";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/10"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-50 p-6">
        <SmartImage
          src={cover}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col border-t border-ink-50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
          {product.category.name.toLowerCase()}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-ink-900 group-hover:text-brand-700">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-500">{product.shortDescription}</p>
        )}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ink-700 group-hover:text-brand-600">
          View details
          <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
