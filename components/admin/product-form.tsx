"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { saveProductAction, type AdminFormState } from "@/app/actions/admin";
import { CATEGORY_GROUPS } from "@/lib/site";

type Category = { id: string; name: string; group: string };

type ProductData = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  categoryId: string;
  shortDescription: string | null;
  description: string | null;
  warranty: string | null;
  amazonUrl: string | null;
  flipkartUrl: string | null;
  featured: boolean;
  isActive: boolean;
  images: string[];
};

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500";

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductData;
}) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(saveProductAction, null);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [urlInput, setUrlInput] = useState("");

  const addUrl = () => {
    const u = urlInput.trim();
    if (u && /^https?:\/\/|^\//.test(u)) {
      setImages((imgs) => [...imgs, u]);
      setUrlInput("");
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="existingImages" value={JSON.stringify(images)} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-900">Basic info</h2>
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelCls}>Name *</label>
                  <input id="name" name="name" required defaultValue={product?.name} placeholder="Product name" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="sku" className={labelCls}>SKU</label>
                  <input id="sku" name="sku" defaultValue={product?.sku ?? ""} placeholder="Optional" className={inputCls} />
                </div>
              </div>
              <div>
                <label htmlFor="slug" className={labelCls}>Slug</label>
                <input id="slug" name="slug" defaultValue={product?.slug} placeholder="auto-generated from name" className={inputCls} />
              </div>
              <div>
                <label htmlFor="shortDescription" className={labelCls}>Short description</label>
                <input
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={product?.shortDescription ?? ""}
                  placeholder="One-line summary shown on cards"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="description" className={labelCls}>
                  Description <span className="font-normal normal-case text-ink-400">(Markdown)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={10}
                  defaultValue={product?.description ?? ""}
                  placeholder={"- Feature one\n- Feature two"}
                  className={`${inputCls} font-mono text-[13px]`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-900">Images</h2>
            <p className="mt-1 text-xs text-ink-400">Upload files or paste an image URL. First image is the cover.</p>

            {images.length > 0 && (
              <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {images.map((img, i) => (
                  <li key={`${img}-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
                    <Image src={img} alt="" fill sizes="20vw" className="object-contain p-1" unoptimized={img.startsWith("http")} />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        COVER
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))}
                      className="absolute inset-x-0 bottom-0 bg-ink-950/70 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="imageFiles" className={labelCls}>Upload images</label>
                <input
                  id="imageFiles"
                  name="imageFiles"
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-brand-700"
                />
              </div>
              <div>
                <label htmlFor="imageUrl" className={labelCls}>Add by URL</label>
                <div className="flex gap-2">
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://…"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={addUrl}
                    className="shrink-0 rounded-xl border border-ink-200 px-4 text-sm font-bold text-ink-700 hover:border-brand-500 hover:text-brand-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-900">Organize</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="categoryId" className={labelCls}>Category *</label>
                <select id="categoryId" name="categoryId" required defaultValue={product?.categoryId ?? ""} className={inputCls}>
                  <option value="" disabled>
                    Select a category
                  </option>
                  {CATEGORY_GROUPS.map((g) => {
                    const cats = categories.filter((c) => c.group === g.key);
                    if (cats.length === 0) return null;
                    return (
                      <optgroup key={g.key} label={g.label}>
                        {cats.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                  <optgroup label="Other groups">
                    {categories
                      .filter((c) => !CATEGORY_GROUPS.some((g) => g.key === c.group))
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
              <div>
                <label htmlFor="warranty" className={labelCls}>Warranty</label>
                <input id="warranty" name="warranty" defaultValue={product?.warranty ?? "1 Year Manufacturer Warranty"} className={inputCls} />
              </div>
              <div className="flex flex-col gap-2.5 rounded-xl bg-ink-50 p-4">
                <label className="flex items-center gap-2.5 text-sm font-semibold text-ink-700">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={product?.featured ?? false}
                    className="h-4 w-4 accent-brand-600"
                  />
                  Featured on homepage
                </label>
                <label className="flex items-center gap-2.5 text-sm font-semibold text-ink-700">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={product?.isActive ?? true}
                    className="h-4 w-4 accent-brand-600"
                  />
                  Visible on site
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-ink-100 bg-white p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-900">Buy links</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="amazonUrl" className={labelCls}>Amazon URL</label>
                <input id="amazonUrl" name="amazonUrl" type="url" defaultValue={product?.amazonUrl ?? ""} placeholder="https://amazon.in/…" className={inputCls} />
              </div>
              <div>
                <label htmlFor="flipkartUrl" className={labelCls}>Flipkart URL</label>
                <input id="flipkartUrl" name="flipkartUrl" type="url" defaultValue={product?.flipkartUrl ?? ""} placeholder="https://flipkart.com/…" className={inputCls} />
              </div>
            </div>
          </section>

          {state && !state.ok && (
            <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{state.message}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-60"
            >
              {pending ? "Saving…" : product ? "Save changes" : "Create product"}
            </button>
            <Link
              href="/admin/products"
              className="rounded-xl border border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 hover:border-ink-300"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
