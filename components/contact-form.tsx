"use client";

import { useActionState } from "react";
import { contactAction, type FormState } from "@/app/actions/public";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(contactAction, null);

  if (state?.ok) {
    return (
      <div className="rounded-3xl border border-brand-100 bg-brand-50 p-10 text-center">
        <p className="text-4xl">🎉</p>
        <h3 className="mt-4 text-xl font-extrabold text-ink-900">Message sent!</h3>
        <p className="mt-2 text-sm text-ink-600">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="c-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">
          First name *
        </label>
        <input id="c-name" name="name" required placeholder="John" className={inputCls} />
      </div>
      <div>
        <label htmlFor="c-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">
          Email address *
        </label>
        <input id="c-email" name="email" type="email" required placeholder="john@example.com" className={inputCls} />
      </div>
      <div>
        <label htmlFor="c-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">
          Phone number
        </label>
        <input id="c-phone" name="phone" type="tel" placeholder="+91 98765 43210" className={inputCls} />
      </div>
      <div>
        <label htmlFor="c-subject" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">
          Subject
        </label>
        <input id="c-subject" name="subject" placeholder="Product enquiry" className={inputCls} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">
          Message *
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={5}
          placeholder="How can we help you?"
          className={inputCls}
        />
      </div>
      {state && !state.ok && (
        <p className="sm:col-span-2 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
          {state.message}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Sending…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
