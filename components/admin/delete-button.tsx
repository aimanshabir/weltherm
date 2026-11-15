"use client";

export function DeleteButton({
  action,
  id,
  label = "Delete",
  message = "Are you sure? This cannot be undone.",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  message?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-bold text-brand-600 transition hover:bg-brand-600 hover:text-white"
      >
        {label}
      </button>
    </form>
  );
}
