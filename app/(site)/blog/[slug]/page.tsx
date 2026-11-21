import Link from "next/link";
import SmartImage from "@/components/smart-image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getPost, getPublishedPosts } from "@/lib/queries";
import { formatDate, parseJsonArray } from "@/lib/utils";
import { Markdown } from "@/components/markdown";

export async function generateStaticParams() {
  const posts = await db.post.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt ?? post.content.slice(0, 150),
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post || post.status !== "PUBLISHED") notFound();

  const all = await getPublishedPosts();
  const more = all.filter((p) => p.slug !== post.slug).slice(0, 2);
  const tags = parseJsonArray(post.tags);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <nav className="text-xs font-medium text-ink-400">
        <Link href="/blog" className="hover:text-brand-600">
          ← Back to blog
        </Link>
      </nav>

      <header className="mt-6">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm font-semibold text-ink-400">
          By {post.authorName} · {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
        </p>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.coverImage && (
        <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-3xl bg-ink-50">
          <SmartImage src={post.coverImage} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        </div>
      )}

      <div className="mt-10">
        <Markdown content={post.content} />
      </div>

      {more.length > 0 && (
        <div className="mt-16 border-t border-ink-100 pt-10">
          <h2 className="text-lg font-extrabold text-ink-900">Keep reading</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {more.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-2xl border border-ink-100 p-5 transition hover:border-brand-200 hover:shadow-lg"
              >
                <p className="text-xs font-semibold text-ink-400">
                  {p.publishedAt ? formatDate(p.publishedAt) : formatDate(p.createdAt)}
                </p>
                <h3 className="mt-1.5 font-bold leading-snug text-ink-900 group-hover:text-brand-700">{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
