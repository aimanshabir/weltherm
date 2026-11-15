"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CATEGORY_GROUPS } from "@/lib/site";
import {
  IconMenu,
  IconX,
  IconPhone,
  IconMail,
  IconChevronDown,
  IconFacebook,
  IconInstagram,
} from "@/components/icons";

export type NavCategory = { name: string; slug: string; group: string; count: number };

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products", dropdown: true },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact us" },
];

export default function SiteHeader({ categories }: { categories: NavCategory[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();

  const groups = CATEGORY_GROUPS.map((g) => ({
    ...g,
    cats: categories.filter((c) => c.group === g.key),
  })).filter((g) => g.cats.length > 0);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-ink-950 text-ink-200 text-xs sm:text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5">
          <div className="flex items-center gap-4">
            <a href="tel:18005726223" className="flex items-center gap-1.5 hover:text-white">
              <IconPhone className="text-brand-400" />
              <span className="hidden sm:inline">1800-572-6223</span>
              <span className="sm:hidden">Call us</span>
            </a>
            <a href="mailto:info@weltherm.com" className="hidden items-center gap-1.5 hover:text-white md:flex">
              <IconMail className="text-brand-400" />
              info@weltherm.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline text-ink-400">Follow us</span>
            <a
              href="https://www.facebook.com/weltherm.home"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-white"
            >
              <IconFacebook />
            </a>
            <a
              href="https://www.instagram.com/weltherm_appliances/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-white"
            >
              <IconInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-ink-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Weltherm home">
            <Image
              src="/uploads/brand/logo.png"
              alt="Weltherm"
              width={300}
              height={90}
              priority
              className="h-9 w-auto sm:h-10"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {LINKS.map((link) =>
              link.dropdown ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-brand-50 hover:text-brand-700 ${
                      pathname.startsWith("/products") ? "text-brand-700" : "text-ink-700"
                    }`}
                  >
                    {link.label}
                    <IconChevronDown className={`text-xs transition-transform ${productsOpen ? "rotate-180" : ""}`} />
                  </Link>

                  {productsOpen && (
                    <div className="absolute left-1/2 top-full z-50 w-[34rem] -translate-x-1/2 pt-2">
                      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-xl shadow-ink-900/5 animate-fade-in">
                        {groups.map((g) => (
                          <div key={g.key}>
                            <Link
                              href={`/products?category=${g.cats[0].slug}`}
                              className="text-[11px] font-bold uppercase tracking-wider text-ink-400 hover:text-brand-600"
                            >
                              {g.label}
                            </Link>
                            <ul className="mt-2 space-y-1">
                              {g.cats.map((c) => (
                                <li key={c.slug}>
                                  <Link
                                    href={`/products?category=${c.slug}`}
                                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-ink-600 hover:bg-brand-50 hover:text-brand-700"
                                  >
                                    <span className="capitalize">{c.name.toLowerCase()}</span>
                                    <span className="text-xs text-ink-300">{c.count}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="col-span-2 mt-1 border-t border-ink-100 pt-3">
                          <Link
                            href="/products"
                            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                          >
                            View all products →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-brand-50 hover:text-brand-700 ${
                    pathname === link.href ? "text-brand-700" : "text-ink-700"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="hidden rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:inline-flex"
            >
              All Products
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="rounded-lg p-2 text-ink-700 hover:bg-ink-50 lg:hidden"
            >
              {mobileOpen ? <IconX className="text-2xl" /> : <IconMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav
            className="border-t border-ink-100 bg-white px-4 pb-6 pt-2 lg:hidden animate-fade-in"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-1">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                      pathname === link.href ? "bg-brand-50 text-brand-700" : "text-ink-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-ink-100 pt-4">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-ink-400">Shop by category</p>
              <div className="mt-2 grid grid-cols-2 gap-x-2">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/products?category=${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm capitalize text-ink-600 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {c.name.toLowerCase()}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
