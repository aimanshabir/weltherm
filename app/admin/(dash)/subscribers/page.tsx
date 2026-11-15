import { Suspense } from "react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { deleteSubscriberAction } from "@/app/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";

export default function AdminSubscribersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-ink-400">Loading subscribers…</div>}>
      <SubscribersContent />
    </Suspense>
  );
}

async function SubscribersContent() {
  const subscribers = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">Newsletter subscribers</h1>
        <p className="mt-1 text-sm text-ink-500">{subscribers.length} subscribers</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink-100 bg-white">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
              <th className="px-4 py-3 font-bold">Email</th>
              <th className="px-4 py-3 font-bold">Subscribed</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-ink-50/50">
                <td className="px-4 py-3">
                  <a href={`mailto:${s.email}`} className="font-semibold text-ink-900 hover:text-brand-600">
                    {s.email}
                  </a>
                </td>
                <td className="px-4 py-3 text-xs text-ink-500">{formatDate(s.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <DeleteButton action={deleteSubscriberAction} id={s.id} message={`Remove ${s.email}?`} label="Remove" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <p className="px-4 py-12 text-center text-sm text-ink-400">No subscribers yet.</p>
        )}
      </div>
    </div>
  );
}
