import { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import ProductForm from "@/components/admin/product-form";

export default function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-400">Loading product…</div>}>
      <Content productId={props.params} />
    </Suspense>
  );
}

async function Content({ productId }: { productId: Promise<{ id: string }> }) {
  const { id } = await productId;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: [{ group: "asc" }, { name: "asc" }] }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">Edit product</h1>
        <p className="mt-1 text-sm text-ink-500">{product.name}</p>
      </div>
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          categoryId: product.categoryId,
          shortDescription: product.shortDescription,
          description: product.description,
          warranty: product.warranty,
          amazonUrl: product.amazonUrl,
          flipkartUrl: product.flipkartUrl,
          featured: product.featured,
          isActive: product.isActive,
          images: parseJsonArray(product.images),
        }}
      />
    </div>
  );
}
