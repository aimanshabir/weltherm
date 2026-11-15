import Link from "next/link";
import Image from "next/image";
import { SITE, CATEGORY_GROUPS } from "@/lib/site";
import { getCurrentYear } from "@/lib/queries";
import NewsletterForm from "@/components/newsletter-form";
import { IconPhone, IconMail, IconMapPin, IconFacebook, IconInstagram } from "@/components/icons";

export default async function SiteFooter({ categories }: { categories: { name: string; slug: string; group: string }[] }) {
  const year = await getCurrentYear();
  const topCats = [...categories]
    .sort((a, b) => CATEGORY_GROUPS.findIndex((g) => g.key === a.group) - CATEGORY_GROUPS.findIndex((g) => g.key === b.group))
    .slice(0, 8);

  return (
    <footer className="mt-auto bg-ink-950 text-ink-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/uploads/brand/logo.png" alt="Weltherm" width={280} height={84} className="h-11 w-auto" />
          <p className="mt-4 text-sm leading-relaxed text-ink-400">
            {SITE.tagline}. We entered the market with a goal to provide efficient, affordable home
            appliances to everyone — running successfully since 2015.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-full border border-ink-800 p-2.5 text-ink-400 transition hover:border-brand-600 hover:text-white"
            >
              <IconFacebook />
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-ink-800 p-2.5 text-ink-400 transition hover:border-brand-600 hover:text-white"
            >
              <IconInstagram />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Quick menu</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Home", "/"],
              ["About us", "/about"],
              ["Services", "/services"],
              ["Products", "/products"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-ink-400 transition hover:text-brand-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Categories</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {topCats.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="capitalize text-ink-400 transition hover:text-brand-400"
                >
                  {c.name.toLowerCase()}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="font-semibold text-brand-400 transition hover:text-brand-300">
                All products →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-400">
            <li className="flex items-start gap-2.5">
              <IconPhone className="mt-0.5 shrink-0 text-brand-500" />
              <a href="tel:18005726223" className="hover:text-brand-400">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <IconMail className="mt-0.5 shrink-0 text-brand-500" />
              <a href={`mailto:${SITE.email}`} className="hover:text-brand-400">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <IconMapPin className="mt-0.5 shrink-0 text-brand-500" />
              <span>Gurugram, Haryana, India</span>
            </li>
          </ul>

          <h3 className="mt-7 text-sm font-bold uppercase tracking-wider text-white">Keep up to date</h3>
          <div className="mt-3">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-ink-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-ink-500 sm:flex-row">
          <p>
            © {year} Weltherm home appliances. All rights reserved.
          </p>
          <p className="flex items-center gap-4">
            <span>You can also find us on</span>
            <a
              href={SITE.flipkartUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-ink-800 px-2.5 py-1 font-semibold text-ink-300 transition hover:border-brand-600 hover:text-white"
            >
              Flipkart
            </a>
            <a
              href={SITE.amazonUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-ink-800 px-2.5 py-1 font-semibold text-ink-300 transition hover:border-brand-600 hover:text-white"
            >
              Amazon
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
