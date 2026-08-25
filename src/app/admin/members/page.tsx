"use client";

import { StatusChip } from "@/components/admin/StatusChip";
import { useI18n } from "@/lib/i18n";
import { members, planLabel } from "@/lib/mock-data";

export default function AdminMembersPage() {
  const { t, lang } = useI18n();
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold">{t.nav.admin}</p>
          <h1 className="font-display mt-1 text-4xl">{t.admin.members}</h1>
        </div>
        <button className="rounded-full bg-ink px-4 py-2 text-sm text-paper">{t.admin.addMember}</button>
      </div>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[0_8px_24px_rgba(28,22,18,0.04)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-paper-2/50 text-[11px] uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3.5 font-normal">Member</th>
              <th className="px-5 py-3.5 font-normal">Plan</th>
              <th className="px-5 py-3.5 font-normal">{t.admin.status}</th>
              <th className="px-5 py-3.5 font-normal">{t.admin.books}</th>
              <th className="px-5 py-3.5 font-normal">Joined</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-ink/8 hover:bg-paper/60">
                <td className="px-5 py-3.5">
                  <p>{m.name}</p>
                  <p className="text-xs text-ink-soft">{m.email}</p>
                </td>
                <td className="px-5 py-3.5">{planLabel(m.plan, lang)}</td>
                <td className="px-5 py-3.5">
                  <StatusChip tone={m.status === "active" ? "ok" : m.status === "pending" ? "warn" : "muted"}>
                    {m.status === "active" ? t.admin.active : m.status === "pending" ? t.admin.pending : t.admin.expired}
                  </StatusChip>
                </td>
                <td className="px-5 py-3.5">{m.books}</td>
                <td className="px-5 py-3.5 text-ink-soft">{m.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
