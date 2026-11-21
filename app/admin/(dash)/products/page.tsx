import { Suspense } from "react";
import Link from "next/link";
import SmartImage from "@/components/smart-image";
import { db } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import { deleteProductAction } from "@/app/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import { IconPlus, IconSearch } from "@/components/icons";

export default async function AdminProductsPage(props: PageProps<"/admin/products">) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-400">Loading products…</div>}>
      <ProductsTable searchParams={props.searchParams} />
    </Suspense>
  );
}

async function ProductsTable({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.toLowerCase() : "";

  const products = await db.product.findMany({
    where: q
      ? {
          OR: [{ name: { contains: q } }, { sku: { contains: q } }],
        }
      : undefined,
    include: { category: true },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">Products</h1>
          <p className="mt-1 text-sm text-ink-500">{products.length} products</p>
        </div>
        <div className="flex gap-2">
          <form action="/admin/products" className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search name or SKU…"
              className="rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none"
            />
          </form>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            <IconPlus /> Add
          </Link>
        </div>
      </div>

      {params.saved && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Product saved.</p>
      )}
      {params.deleted && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Product deleted.</p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-3 font-bold">Product</th>
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {products.map((p) => {
              const cover = parseJsonArray(p.images)[0];
              return (
                <tr key={p.id} className="hover:bg-ink-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-ink-100 bg-ink-50">
                        {cover && <SmartImage src={cover} alt="" fill sizes="44px" className="object-contain p-0.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-ink-900">{p.name}</p>
                        <p className="truncate text-xs text-ink-400">{p.sku || p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-ink-600">{p.category.name.toLowerCase()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {p.featured && (
                        <span className="rounded-full bg-heat-500/15 px-2 py-0.5 text-[11px] font-bold text-heat-600">
                          Featured
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-ink-100 text-ink-500"
                        }`}
                      >
                        {p.isActive ? "Live" : "Hidden"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-600 hover:border-ink-300"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-700 hover:border-brand-500 hover:text-brand-600"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteProductAction}
                        id={p.id}
                        message={`Delete "${p.name}"? Its images will also be removed.`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && <p className="px-4 py-12 text-center text-sm text-ink-400">No products found.</p>}
      </div>
    </div>
  );
}
