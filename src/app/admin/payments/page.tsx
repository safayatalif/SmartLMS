"use client";

import { StatusChip } from "@/components/admin/StatusChip";
import { useI18n } from "@/lib/i18n";
import { payments } from "@/lib/mock-data";

export default function AdminPaymentsPage() {
  const { t } = useI18n();
  return (
    <div>
      <p className="text-[11px] tracking-[0.2em] uppercase text-gold">{t.nav.admin}</p>
      <h1 className="font-display mt-1 text-4xl">{t.admin.payments}</h1>
      <p className="mt-2 text-sm text-ink-soft">bKash, Nagad, Rocket and cards — this month’s paper.</p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[0_8px_24px_rgba(28,22,18,0.04)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-paper-2/50 text-[11px] uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3.5 font-normal">Member</th>
              <th className="px-5 py-3.5 font-normal">Plan</th>
              <th className="px-5 py-3.5 font-normal">Amount</th>
              <th className="px-5 py-3.5 font-normal">Method</th>
              <th className="px-5 py-3.5 font-normal">{t.admin.status}</th>
              <th className="px-5 py-3.5 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-ink/8 hover:bg-paper/60">
                <td className="px-5 py-3.5">{p.member}</td>
                <td className="px-5 py-3.5">{p.plan}</td>
                <td className="px-5 py-3.5 font-medium">৳{p.amount}</td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px]">{p.method}</span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusChip tone={p.status === "paid" ? "ok" : "bad"}>
                    {p.status === "paid" ? t.admin.paid : t.admin.failed}
                  </StatusChip>
                </td>
                <td className="px-5 py-3.5 text-ink-soft">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
