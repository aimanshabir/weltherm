import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { IconArrowRight, IconEdit } from "@/components/icons";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, guides and stories from Weltherm — home appliances, heating, kitchen and wellness.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500">News & stories</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">The Weltherm Blog</h1>
          <p className="mt-3 max-w-2xl text-ink-300">
            Guides, product news and stories about home wellness.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink-200 px-6 py-20 text-center">
            <p className="text-lg font-bold text-ink-900">No posts yet</p>
            <p className="mt-1 text-sm text-ink-500">Be the first to share a story!</p>
            <Link
              href="/blog/submit"
              className="mt-6 inline-block rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700"
            >
              Write a post
            </Link>
          </div>
        ) : (
          <>
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-3xl border border-ink-100 bg-white transition hover:shadow-xl lg:grid-cols-2"
              >
                <div className="relative min-h-64 bg-ink-50">
                  {featured.coverImage && (
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Featured</p>
                  <h2 className="mt-3 text-2xl font-extrabold leading-snug text-ink-900 group-hover:text-brand-700 sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 leading-relaxed text-ink-500">{featured.excerpt}</p>
                  <p className="mt-5 text-xs font-semibold text-ink-400">
                    {featured.publishedAt ? formatDate(featured.publishedAt) : formatDate(featured.createdAt)} ·{" "}
                    {featured.authorName}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-600">
                    Read article <IconArrowRight />
                  </span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/9] bg-ink-50">
                      {post.coverImage && (
                        <Image src={post.coverImage} alt={post.title} fill sizes="33vw" className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-semibold text-ink-400">
                        {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)} ·{" "}
                        {post.authorName}
                      </p>
                      <h3 className="mt-2 text-base font-bold leading-snug text-ink-900 group-hover:text-brand-700">
                        {post.title}
                      </h3>
                      {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-ink-500">{post.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-14 rounded-3xl bg-ink-950 px-8 py-12 text-center text-white">
              <h2 className="text-2xl font-extrabold sm:text-3xl">Have a story to share?</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-ink-300">
                We welcome guest posts from customers and writers. Submit your story — once reviewed
                by our team, it goes live on the blog.
              </p>
              <Link
                href="/blog/submit"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-brand-500"
              >
                <IconEdit /> Submit a post
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}
