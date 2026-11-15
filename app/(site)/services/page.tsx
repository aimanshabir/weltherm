import Link from "next/link";
import type { Metadata } from "next";
import { SERVICES, SITE } from "@/lib/site";
import {
  IconHeadset,
  IconWrench,
  IconDoc,
  IconReturn,
  IconShield,
  IconCheck,
  IconPhone,
  IconMail,
  IconArrowRight,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Weltherm's service promise — customer support, repair or replacement guarantee, zero paperwork, easy returns and no-questions-asked service.",
};

const ICONS: Record<string, React.ComponentType> = {
  headset: IconHeadset,
  wrench: IconWrench,
  doc: IconDoc,
  return: IconReturn,
  shield: IconShield,
  check: IconCheck,
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Services</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Our Service Promise</h1>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-300">
            The promise Weltherm appliances provide is the ability to preventatively service a home
            appliance rather than reaching the point of breaking. We uphold a{" "}
            <em className="text-white">“leave no trace”</em> commitment and employ only highly
            qualified professionals you can depend on.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.icon] ?? IconCheck;
            return (
              <div
                key={s.title}
                className="group rounded-3xl border border-ink-100 bg-white p-8 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-xl text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon />
                </span>
                <h2 className="mt-5 text-lg font-bold text-ink-900">{s.title}</h2>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{s.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-brand-700 py-14 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Get in touch</h2>
            <p className="mt-2 text-brand-100">
              For any service-related query, our team is a call or mail away.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={`tel:${SITE.phone.replace(/-/g, "")}`}
              className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 transition hover:bg-white/15"
            >
              <IconPhone className="text-2xl text-white" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-200">Call us</p>
                <p className="font-bold">{SITE.phone}</p>
              </div>
            </a>
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 transition hover:bg-white/15"
            >
              <IconMail className="text-2xl text-white" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-200">Mail us</p>
                <p className="font-bold break-all">{SITE.supportEmail}</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">
            Every Weltherm product is a promise
          </h2>
          <p className="mt-4 leading-relaxed text-ink-600">
            One-year warranty on all products. 7-day return and replacement. On-site or
            service-center support depending on your warranty. That&apos;s the Weltherm way.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
          >
            Contact support <IconArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
