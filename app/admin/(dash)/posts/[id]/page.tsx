import { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import PostForm from "@/components/admin/post-form";

export default function EditPostPage(props: PageProps<"/admin/posts/[id]">) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-400">Loading post…</div>}>
      <Content postId={props.params} />
    </Suspense>
  );
}

async function Content({ postId }: { postId: Promise<{ id: string }> }) {
  const { id } = await postId;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">Edit post</h1>
        <p className="mt-1 text-sm text-ink-500">{post.title}</p>
      </div>
      <PostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          status: post.status,
          tags: parseJsonArray(post.tags),
          authorName: post.authorName,
          authorEmail: post.authorEmail,
        }}
      />
    </div>
  );
}
