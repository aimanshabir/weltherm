import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminShell from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-400">Loading admin…</div>}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}

async function Gate({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const [pendingPosts, unreadMessages] = await Promise.all([
    db.post.count({ where: { status: "PENDING" } }),
    db.message.count({ where: { isRead: false } }),
  ]);

  return (
    <AdminShell user={user} pendingPosts={pendingPosts} unreadMessages={unreadMessages}>
      {children}
    </AdminShell>
  );
}
