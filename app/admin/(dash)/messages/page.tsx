import { Suspense } from "react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { toggleMessageReadAction, deleteMessageAction } from "@/app/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import { IconMail, IconPhone } from "@/components/icons";

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-400">Loading messages…</div>}>
      <MessagesContent />
    </Suspense>
  );
}

async function MessagesContent() {
  const messages = await db.message.findMany({ orderBy: { createdAt: "desc" } });
  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">Messages</h1>
        <p className="mt-1 text-sm text-ink-500">
          {messages.length} total · {unread} unread
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 px-6 py-16 text-center text-sm text-ink-400">
          No messages yet. Submissions from the contact form will appear here.
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-2xl border bg-white p-5 ${m.isRead ? "border-ink-100" : "border-brand-200 bg-brand-50/30"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-ink-900">
                    {m.isRead ? "" : "🔴 "}
                    {m.name}
                    {m.subject && <span className="ml-2 font-semibold text-ink-500">— {m.subject}</span>}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-400">
                    <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-brand-600">
                      <IconMail /> {m.email}
                    </a>
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-brand-600">
                        <IconPhone /> {m.phone}
                      </a>
                    )}
                    <span>{formatDate(m.createdAt)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={toggleMessageReadAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-600 hover:border-brand-500 hover:text-brand-600"
                    >
                      Mark as {m.isRead ? "unread" : "read"}
                    </button>
                  </form>
                  <DeleteButton action={deleteMessageAction} id={m.id} message="Delete this message?" />
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap rounded-xl bg-ink-50 p-4 text-sm leading-relaxed text-ink-700">
                {m.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
