"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import {
  IconDashboard,
  IconBox,
  IconTag,
  IconNewspaper,
  IconInbox,
  IconUsers,
  IconLogout,
  IconMenu,
  IconX,
} from "@/components/icons";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: IconDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: IconBox },
  { href: "/admin/categories", label: "Categories", icon: IconTag },
  { href: "/admin/posts", label: "Blog posts", icon: IconNewspaper },
  { href: "/admin/messages", label: "Messages", icon: IconInbox },
  { href: "/admin/subscribers", label: "Subscribers", icon: IconUsers },
];

export default function AdminShell({
  user,
  pendingPosts,
  unreadMessages,
  children,
}: {
  user: { name: string; email: string };
  pendingPosts: number;
  unreadMessages: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-50 lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-ink-950 text-ink-300 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-900 px-5">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/uploads/brand/logo.png" alt="Weltherm" width={200} height={60} className="h-8 w-auto" />
            <span className="text-xs font-bold uppercase tracking-widest text-ink-500">Admin</span>
          </Link>
          <button type="button" onClick={() => setOpen(false)} className="text-ink-400 lg:hidden" aria-label="Close menu">
            <IconX className="text-xl" />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            const badge =
              item.href === "/admin/posts" ? pendingPosts : item.href === "/admin/messages" ? unreadMessages : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-brand-600 text-white" : "text-ink-400 hover:bg-ink-900 hover:text-white"
                }`}
              >
                <Icon className="text-base" />
                {item.label}
                {badge > 0 && (
                  <span className="ml-auto rounded-full bg-heat-500 px-2 py-0.5 text-[11px] font-bold text-ink-950">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-ink-900 p-4">
          <p className="truncate text-xs font-semibold text-white">{user.name}</p>
          <p className="truncate text-xs text-ink-500">{user.email}</p>
          <div className="mt-3 flex gap-2">
            <Link
              href="/"
              className="flex-1 rounded-lg border border-ink-800 px-2 py-2 text-center text-xs font-semibold text-ink-300 hover:border-ink-700 hover:text-white"
            >
              View site
            </Link>
            <form action={logoutAction} className="flex-1">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-ink-800 px-2 py-2 text-xs font-semibold text-ink-300 hover:border-brand-600 hover:text-white"
              >
                <IconLogout /> Log out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-ink-950/50 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

      {/* Content */}
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-ink-200 bg-white px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-ink-600 hover:bg-ink-50 lg:hidden"
            aria-label="Open menu"
          >
            <IconMenu className="text-2xl" />
          </button>
          <p className="text-sm font-bold text-ink-900">Weltherm Admin</p>
          <span className="ml-auto rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">Admin</span>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
