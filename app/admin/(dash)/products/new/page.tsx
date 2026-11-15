import { Suspense } from "react";
import { db } from "@/lib/db";
import ProductForm from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-400">Loading form…</div>}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const categories = await db.category.findMany({ orderBy: [{ group: "asc" }, { name: "asc" }] });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-ink-900">Add product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
