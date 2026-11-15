"use client";

import { useActionState } from "react";
import { subscribeAction, type FormState } from "@/app/actions/public";

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(subscribeAction, null);

  return (
    <div>
      {state?.ok ? (
        <p className="rounded-xl bg-brand-600/15 px-4 py-3 text-sm font-medium text-brand-200">
          {state.message}
        </p>
      ) : (
        <form action={formAction} className="flex gap-2">
          <label htmlFor="newsletter-email" className="sr-only">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            placeholder="Your email address"
            className="w-full min-w-0 rounded-xl border border-ink-800 bg-ink-900 px-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:border-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60"
          >
            {pending ? "…" : "Sign up"}
          </button>
        </form>
      )}
      {state && !state.ok && <p className="mt-2 text-sm text-brand-300">{state.message}</p>}
    </div>
  );
}
