import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  IconBox,
  IconTag,
  IconNewspaper,
  IconInbox,
  IconUsers,
  IconArrowRight,
  IconPlus,
} from "@/components/icons";

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-400">Loading dashboard…</div>}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const [products, categories, published, pending, unread, totalMessages, subscribers, recentMessages, pendingPosts] =
    await Promise.all([
      db.product.count(),
      db.category.count(),
      db.post.count({ where: { status: "PUBLISHED" } }),
      db.post.count({ where: { status: "PENDING" } }),
      db.message.count({ where: { isRead: false } }),
      db.message.count(),
      db.subscriber.count(),
      db.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      db.post.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const cards = [
    { label: "Products", value: products, icon: IconBox, href: "/admin/products" },
    { label: "Categories", value: categories, icon: IconTag, href: "/admin/categories" },
    { label: "Published posts", value: published, icon: IconNewspaper, href: "/admin/posts" },
    { label: "Pending posts", value: pending, icon: IconNewspaper, href: "/admin/posts" },
    { label: "Unread messages", value: unread, icon: IconInbox, href: "/admin/messages" },
    { label: "Subscribers", value: subscribers, icon: IconUsers, href: "/admin/subscribers" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">
            {totalMessages} messages received · {products} products live
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          <IconPlus /> Add product
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="rounded-2xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon />
              </span>
              <p className="mt-3 text-2xl font-extrabold text-ink-900">{c.value}</p>
              <p className="text-xs font-semibold text-ink-400">{c.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending posts */}
        <section className="rounded-2xl border border-ink-100 bg-white">
          <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-900">
              Posts awaiting review
              {pendingPosts.length > 0 && (
                <span className="ml-2 rounded-full bg-heat-500 px-2 py-0.5 text-[11px] text-ink-950">
                  {pendingPosts.length}
                </span>
              )}
            </h2>
            <Link href="/admin/posts" className="text-xs font-bold text-brand-600 hover:underline">
              View all
            </Link>
          </header>
          {pendingPosts.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-ink-400">No pending submissions. 🎉</p>
          ) : (
            <ul className="divide-y divide-ink-50">
              {pendingPosts.map((post) => (
                <li key={post.id} className="flex items-center justify-between gap-3 px-6 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink-900">{post.title}</p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      {post.authorName} · {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="shrink-0 text-xs font-bold text-brand-600 hover:underline"
                  >
                    Review →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent messages */}
        <section className="rounded-2xl border border-ink-100 bg-white">
          <header className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-900">Recent messages</h2>
            <Link href="/admin/messages" className="text-xs font-bold text-brand-600 hover:underline">
              Inbox <IconArrowRight className="inline text-[10px]" />
            </Link>
          </header>
          {recentMessages.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-ink-400">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-ink-50">
              {recentMessages.map((m) => (
                <li key={m.id} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-ink-900">
                      {m.isRead ? "" : "🔴 "}
                      {m.name}
                    </p>
                    <span className="shrink-0 text-xs text-ink-400">{formatDate(m.createdAt)}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-ink-500">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
