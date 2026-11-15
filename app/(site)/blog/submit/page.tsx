import type { Metadata } from "next";
import SubmitPostForm from "@/components/submit-post-form";

export const metadata: Metadata = {
  title: "Submit a post",
  description: "Share your story on the Weltherm blog — guest posts are reviewed by our team before publishing.",
};

export default function SubmitPostPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Community blog</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Share your story</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">
            Everyone is welcome to write for the Weltherm blog — customers, writers and
            enthusiasts. Submissions are reviewed by our team and published once approved.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <SubmitPostForm />
      </section>
    </>
  );
}
