"use client";

import { useActionState, useState } from "react";
import { saveCategoryAction, deleteCategoryAction, type AdminFormState } from "@/app/actions/admin";
import { CATEGORY_GROUPS } from "@/lib/site";
import { DeleteButton } from "@/components/admin/delete-button";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  group: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
};

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";
const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wide text-ink-500";

export default function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const [editing, setEditing] = useState<string | null>(null); // category id or "new"

  return (
    <div className="space-y-6">
      {/* Create */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-900">Add category</h2>
          <button
            type="button"
            onClick={() => setEditing(editing === "new" ? null : "new")}
            className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
          >
            {editing === "new" ? "Cancel" : "+ New category"}
          </button>
        </div>
        {editing === "new" && (
          <div className="mt-5 border-t border-ink-100 pt-5">
            <CategoryFields key="new" onDone={() => setEditing(null)} />
          </div>
        )}
      </div>

      {/* List */}
      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 font-bold">Group</th>
              <th className="px-4 py-3 font-bold">Products</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {categories.map((c) =>
              editing === c.id ? (
                <tr key={c.id}>
                  <td colSpan={5} className="bg-ink-50/50 px-4 py-4">
                    <CategoryFields key={c.id} category={c} onDone={() => setEditing(null)} />
                  </td>
                </tr>
              ) : (
                <tr key={c.id} className="hover:bg-ink-50/50">
                  <td className="px-4 py-3">
                    <p className="font-bold capitalize text-ink-900">{c.name.toLowerCase()}</p>
                    <p className="text-xs text-ink-400">/{c.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-ink-50 px-2.5 py-1 text-xs font-semibold capitalize text-ink-600">
                      {CATEGORY_GROUPS.find((g) => g.key === c.group)?.label ?? c.group}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink-600">{c.productCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        c.isActive ? "bg-emerald-50 text-emerald-700" : "bg-ink-100 text-ink-500"
                      }`}
                    >
                      {c.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(c.id)}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-700 hover:border-brand-500 hover:text-brand-600"
                      >
                        Edit
                      </button>
                      <DeleteButton
                        action={deleteCategoryAction}
                        id={c.id}
                        message={
                          c.productCount > 0
                            ? "This category still has products. Remove them first."
                            : `Delete "${c.name}"?`
                        }
                      />
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryFields({ category, onDone }: { category?: CategoryRow; onDone: () => void }) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(saveCategoryAction, null);

  return (
    <form action={formAction} className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_6rem_auto]">
      {category && <input type="hidden" name="id" value={category.id} />}
      <div>
        <label className={labelCls}>Name *</label>
        <input name="name" required defaultValue={category?.name} placeholder="Category name" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Group</label>
        <select name="group" defaultValue={category?.group ?? "kitchen"} className={inputCls}>
          {CATEGORY_GROUPS.map((g) => (
            <option key={g.key} value={g.key}>
              {g.label}
            </option>
          ))}
          <option value="others">Other</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Order</label>
        <input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} className={inputCls} />
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-ink-600">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={category?.isActive ?? true}
            className="h-4 w-4 accent-brand-600"
          />
          Active
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {state && !state.ok && (
        <p className="sm:col-span-4 rounded-xl bg-brand-50 px-4 py-2 text-sm text-brand-700">{state.message}</p>
      )}
      {category && (
        <input type="hidden" name="slug" value={category.slug} />
      )}
      <button type="button" onClick={onDone} className="hidden" aria-hidden />
    </form>
  );
}
