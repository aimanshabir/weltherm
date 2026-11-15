"use client";

import { useActionState } from "react";
import { submitPostAction, type FormState } from "@/app/actions/public";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export default function SubmitPostForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitPostAction, null);

  if (state?.ok) {
    return (
      <div className="rounded-3xl border border-brand-100 bg-brand-50 p-10 text-center">
        <p className="text-4xl">✍️</p>
        <h3 className="mt-4 text-xl font-extrabold text-ink-900">Story submitted!</h3>
        <p className="mt-2 text-sm text-ink-600">{state.message}</p>
        <a href="/blog" className="mt-6 inline-block text-sm font-bold text-brand-600 hover:underline">
          ← Back to blog
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="p-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">
            Your name *
          </label>
          <input id="p-name" name="name" required placeholder="Jane Doe" className={inputCls} />
        </div>
        <div>
          <label htmlFor="p-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">
            Email address *
          </label>
          <input id="p-email" name="email" type="email" required placeholder="jane@example.com" className={inputCls} />
        </div>
      </div>
      <div>
        <label htmlFor="p-title" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">
          Title *
        </label>
        <input id="p-title" name="title" required placeholder="How my Weltherm blanket transformed my winters" className={inputCls} />
      </div>
      <div>
        <label htmlFor="p-cover" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">
          Cover image URL <span className="font-normal normal-case text-ink-400">(optional)</span>
        </label>
        <input id="p-cover" name="coverImage" type="url" placeholder="https://…" className={inputCls} />
      </div>
      <div>
        <label htmlFor="p-content" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink-500">
          Your story * <span className="font-normal normal-case text-ink-400">(Markdown supported)</span>
        </label>
        <textarea
          id="p-content"
          name="content"
          required
          rows={12}
          minLength={100}
          placeholder={"Write your story here…\n\nYou can use **bold**, lists:\n- point one\n- point two\n\n…and headings with ##"}
          className={`${inputCls} font-mono text-[13px] leading-relaxed`}
        />
      </div>
      {state && !state.ok && (
        <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{state.message}</p>
      )}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit for review"}
        </button>
      </div>
    </form>
  );
}
