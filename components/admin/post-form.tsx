"use client";

import { useActionState } from "react";
import Link from "next/link";
import { savePostAction, type AdminFormState } from "@/app/actions/admin";

export type PostData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: "PENDING" | "PUBLISHED" | "REJECTED";
  tags: string[];
  authorName: string;
  authorEmail: string | null;
};

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500";

export default function PostForm({ post }: { post?: PostData }) {
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(savePostAction, null);

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="space-y-5">
        <div className="rounded-2xl border border-ink-100 bg-white p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className={labelCls}>Title *</label>
              <input id="title" name="title" required defaultValue={post?.title} placeholder="Post title" className={inputCls} />
            </div>
            <div>
              <label htmlFor="slug" className={labelCls}>Slug</label>
              <input id="slug" name="slug" defaultValue={post?.slug} placeholder="auto-generated" className={inputCls} />
            </div>
            <div>
              <label htmlFor="excerpt" className={labelCls}>Excerpt</label>
              <textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} placeholder="Short summary (auto-generated if empty)" className={inputCls} />
            </div>
            <div>
              <label htmlFor="content" className={labelCls}>
                Content * <span className="font-normal normal-case text-ink-400">(Markdown)</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={20}
                defaultValue={post?.content}
                placeholder="Write the post in Markdown…"
                className={`${inputCls} font-mono text-[13px] leading-relaxed`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-ink-100 bg-white p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-900">Publish</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="status" className={labelCls}>Status</label>
              <select id="status" name="status" defaultValue={post?.status ?? "PUBLISHED"} className={inputCls}>
                <option value="PUBLISHED">Published</option>
                <option value="PENDING">Pending review</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label htmlFor="authorName" className={labelCls}>Author name</label>
              <input id="authorName" name="authorName" defaultValue={post?.authorName} placeholder="Weltherm Team" className={inputCls} />
            </div>
            {post?.authorEmail && (
              <p className="text-xs text-ink-400">Submitter email: {post.authorEmail}</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-900">Meta</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="coverImage" className={labelCls}>Cover image URL</label>
              <input id="coverImage" name="coverImage" type="url" defaultValue={post?.coverImage ?? ""} placeholder="https://…" className={inputCls} />
            </div>
            <div>
              <label htmlFor="tags" className={labelCls}>Tags</label>
              <input id="tags" name="tags" defaultValue={post?.tags.join(", ")} placeholder="Heating, Winter" className={inputCls} />
              <p className="mt-1 text-xs text-ink-400">Comma separated</p>
            </div>
          </div>
        </div>

        {state && !state.ok && (
          <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{state.message}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save post"}
          </button>
          <Link
            href="/admin/posts"
            className="rounded-xl border border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 hover:border-ink-300"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
