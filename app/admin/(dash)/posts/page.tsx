import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { setPostStatusAction, deletePostAction } from "@/app/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import { IconPlus } from "@/components/icons";

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  PENDING: "bg-heat-500/15 text-heat-600",
  REJECTED: "bg-brand-50 text-brand-700",
};

export default async function AdminPostsPage(props: PageProps<"/admin/posts">) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-400">Loading posts…</div>}>
      <PostsTable searchParams={props.searchParams} />
    </Suspense>
  );
}

async function PostsTable({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const filter = typeof params.status === "string" ? params.status : undefined;

  const posts = await db.post.findMany({
    where: filter ? { status: filter as "PENDING" | "PUBLISHED" | "REJECTED" } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const tabs = [
    { key: undefined, label: "All" },
    { key: "PENDING", label: "Pending" },
    { key: "PUBLISHED", label: "Published" },
    { key: "REJECTED", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">Blog posts</h1>
          <p className="mt-1 text-sm text-ink-500">
            Community submissions appear here for review before publishing.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          <IconPlus /> Write post
        </Link>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => {
          const active = filter === t.key;
          const href = t.key ? `/admin/posts?status=${t.key}` : "/admin/posts";
          return (
            <Link
              key={t.label}
              href={href}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                active ? "bg-ink-950 text-white" : "border border-ink-200 bg-white text-ink-600 hover:border-ink-300"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {params.deleted && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Post deleted.</p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-3 font-bold">Post</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-ink-50/50">
                <td className="max-w-md px-4 py-3">
                  <p className="truncate font-bold text-ink-900">{post.title}</p>
                  <p className="truncate text-xs text-ink-400">
                    by {post.authorName}
                    {post.authorEmail ? ` · ${post.authorEmail}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_BADGE[post.status]}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink-500">{formatDate(post.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {post.status !== "PUBLISHED" && (
                      <form action={setPostStatusAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="status" value="PUBLISHED" />
                        <button
                          type="submit"
                          className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                        >
                          Publish
                        </button>
                      </form>
                    )}
                    {post.status === "PENDING" && (
                      <form action={setPostStatusAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="status" value="REJECTED" />
                        <button
                          type="submit"
                          className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-500 transition hover:bg-ink-600 hover:text-white"
                        >
                          Reject
                        </button>
                      </form>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-700 hover:border-brand-500 hover:text-brand-600"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deletePostAction} id={post.id} message={`Delete "${post.title}"?`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="px-4 py-12 text-center text-sm text-ink-400">No posts found.</p>}
      </div>
    </div>
  );
}
