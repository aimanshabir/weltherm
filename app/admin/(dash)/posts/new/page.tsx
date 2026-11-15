import PostForm from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-ink-900">Write post</h1>
      <PostForm />
    </div>
  );
}
