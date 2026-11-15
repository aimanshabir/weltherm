import { Suspense } from "react";
import { db } from "@/lib/db";
import CategoryManager from "@/components/admin/category-manager";

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-400">Loading categories…</div>}>
      <CategoriesContent />
    </Suspense>
  );
}

async function CategoriesContent() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">Categories</h1>
        <p className="mt-1 text-sm text-ink-500">{categories.length} categories</p>
      </div>
      <CategoryManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          group: c.group,
          description: c.description,
          sortOrder: c.sortOrder,
          isActive: c.isActive,
          productCount: c._count.products,
        }))}
      />
    </div>
  );
}
