import type { Metadata } from "next";
import { OFFICES, SITE } from "@/lib/site";
import ContactForm from "@/components/contact-form";
import { IconPhone, IconMail, IconMapPin } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Reach Weltherm — call 1800-572-6223, email info@weltherm.com, or visit our offices in India, UAE, USA and Canada.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Contact us</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">How can we help you?</h1>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-300">
            You can also reach out to us directly for assistance in purchasing our products or for
            any service-related query. Mail us at{" "}
            <a href={`mailto:${SITE.connectEmail}`} className="text-brand-400 underline underline-offset-4">
              {SITE.connectEmail}
            </a>{" "}
            or call {SITE.phone}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-extrabold text-ink-900">Our offices</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {OFFICES.map((office) => (
                <div key={office.country} className="rounded-2xl border border-ink-100 bg-white p-5">
                  <p className="flex items-center gap-2 text-sm font-extrabold text-brand-600">
                    <IconMapPin /> {office.country}
                  </p>
                  <address className="mt-2 not-italic text-xs leading-relaxed text-ink-500">
                    {office.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              ))}
            </div>

            <h2 className="mt-10 text-2xl font-extrabold text-ink-900">Call us</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-600">
              {SITE.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="hover:text-brand-600">
                    {phone}
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-2xl font-extrabold text-ink-900">Send us a mail</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={`mailto:${SITE.email}`} className="font-semibold text-brand-600 hover:underline">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.supportEmail}`} className="font-semibold text-brand-600 hover:underline">
                  {SITE.supportEmail}
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-ink-100 bg-ink-50/50 p-6 sm:p-10">
            <h2 className="text-2xl font-extrabold text-ink-900">Get in touch</h2>
            <p className="mt-2 text-sm text-ink-500">
              Weltherm Electric products are available near you — ask us anything.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
