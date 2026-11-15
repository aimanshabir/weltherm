import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { STATS } from "@/lib/site";
import { IconArrowRight, IconCheck, IconSparkles, IconShield, IconFire } from "@/components/icons";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Weltherm — running the home appliance industry successfully since 2015. Our story, mission, vision and values.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Our story</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">About Weltherm</h1>
          <p className="mt-3 max-w-2xl text-ink-300">
            Extraordinary experiences — running the home appliance industry successfully since 2015.
          </p>
        </div>
      </section>

      {/* How it started */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">How it all started</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Built on quality, trusted by families
            </h2>
            <p className="mt-5 leading-relaxed text-ink-600">
              Weltherm is specialized in manufacturing the complete range of the most advanced and
              high-quality home appliances. For us, quality is the topmost priority — it begins at
              the raw-material stage and carries through to after-sales service.
            </p>
            <p className="mt-4 leading-relaxed text-ink-600">
              What we aim: to serve our clients effectively and cater to their varied needs. By
              focusing on utmost satisfaction, we&apos;ve grown consistently while meeting the specific
              demands of the market. Our next goal is to make Weltherm services available across
              PAN India.
            </p>
            <dl className="mt-10 grid grid-cols-4 gap-4 border-t border-ink-100 pt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dd className="text-2xl font-extrabold text-brand-600">{s.value}</dd>
                  <dd className="mt-1 text-[11px] uppercase tracking-wide text-ink-400">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-brand-50" aria-hidden />
            <Image
              src="/uploads/brand/hero-gas-heater.png"
              alt="Weltherm gas heater"
              width={800}
              height={800}
              className="relative w-full rounded-[2rem] object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-ink-50/70 py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2">
          <div className="rounded-3xl bg-ink-950 p-10 text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600/20 text-2xl text-brand-400">
              <IconFire />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold">Our Mission</h2>
            <p className="mt-3 leading-relaxed text-ink-300">
              To develop cooperative, long-term and healthy relationships by providing quality
              products at economical prices with in-time delivery. We focus on quality from the raw
              stage itself — leaving no stone unturned to serve our clients with utmost
              satisfaction.
            </p>
          </div>
          <div className="rounded-3xl border border-ink-100 bg-white p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl text-brand-600">
              <IconSparkles />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold text-ink-900">Our Vision</h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              To serve our esteemed clients with a comprehensive range of high-quality home
              appliances that improve everyday wellness — becoming a household name across India
              and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">What we stand for</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">Our core values</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Brand Excellence",
              text: "We entered the market to provide efficient service for all client needs — affordable home appliances for everyone, backed by reliable before and after-sale service.",
            },
            {
              title: "Operational Excellence",
              text: "Our operations excellence supports business transformation with a relentless focus on quality, delivery and continuous improvement.",
            },
            {
              title: "Go-To-Market Excellence",
              text: "We utilize our resources wisely to deliver unique value to customers and earn a strong reputation in the market — online, offline and across marketplaces.",
            },
          ].map((v) => (
            <div key={v.title} className="rounded-3xl border border-ink-100 bg-white p-8 transition hover:shadow-lg">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <IconShield />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink-900">{v.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* T&C + CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-10 rounded-3xl bg-ink-950 p-10 text-white lg:grid-cols-2 lg:p-14">
          <div>
            <h2 className="text-2xl font-extrabold">Terms &amp; conditions</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink-300">
              {[
                "Return or replacement within 7 days from the date of delivery.",
                "One-year warranty on all products from the date on the invoice.",
                "Products are serviced at the nearest service center for replacement or refund.",
                "Service is available during our operation hours, on-site or at a customer service center depending on warranty type.",
                "Charges may apply for services outside warranty coverage.",
                "Warranty requires the warranty card and/or valid proof of purchase.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-xs text-brand-400">
                    <IconCheck />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">Ready to bring wellness home?</h2>
            <p className="mt-3 text-ink-300">
              Explore our range of heaters, blankets, kitchen and wellness appliances.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-500"
            >
              Explore products <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
