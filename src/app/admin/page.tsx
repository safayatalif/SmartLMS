"use client";

import Link from "next/link";
import { StatusChip } from "@/components/admin/StatusChip";
import { useI18n } from "@/lib/i18n";
import { books, members, planLabel, stats } from "@/lib/mock-data";

export default function AdminHomePage() {
  const { t, lang } = useI18n();
  const cards = [
    { label: t.admin.membersLabel, value: stats.members.toLocaleString(), hint: "+18 this week" },
    { label: t.admin.titlesLabel, value: stats.books.toLocaleString(), hint: "12 new titles" },
    { label: t.admin.borrowedLabel, value: stats.borrowed.toLocaleString(), hint: "71% of shelf" },
    { label: t.admin.revenueLabel, value: `৳${stats.revenue.toLocaleString()}`, hint: "August so far" },
  ];

  return (
    <div>
      <p className="text-[11px] tracking-[0.2em] uppercase text-gold">{t.nav.admin}</p>
      <h1 className="font-display mt-1 text-4xl">{t.admin.greeting}</h1>
      <p className="mt-2 text-ink-soft">{t.admin.greetingSub}</p>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-ink/10 bg-card p-5 shadow-[0_8px_24px_rgba(28,22,18,0.04)]">
            <p className="text-[11px] tracking-[0.14em] uppercase text-ink-soft">{card.label}</p>
            <p className="font-display mt-2 text-3xl">{card.value}</p>
            <p className="mt-2 text-[11px] text-sage">{card.hint}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-2xl border border-ink/10 bg-card p-5 shadow-[0_8px_24px_rgba(28,22,18,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">{t.admin.recentMembers}</h2>
            <Link href="/admin/members" className="text-[11px] tracking-[0.14em] uppercase text-wine">
              {t.admin.viewAll}
            </Link>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="pb-3 font-normal">Name</th>
                <th className="hidden pb-3 font-normal md:table-cell">Plan</th>
                <th className="pb-3 font-normal">{t.admin.status}</th>
              </tr>
            </thead>
            <tbody>
              {members.slice(0, 5).map((m) => (
                <tr key={m.id} className="border-t border-ink/8">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-[10px] text-paper">
                        {m.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </span>
                      <div>
                        <p>{m.name}</p>
                        <p className="text-xs text-ink-soft">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden py-3 md:table-cell">{planLabel(m.plan, lang)}</td>
                  <td className="py-3">
                    <StatusChip tone={m.status === "active" ? "ok" : m.status === "pending" ? "warn" : "muted"}>
                      {m.status === "active" ? t.admin.active : m.status === "pending" ? t.admin.pending : t.admin.expired}
                    </StatusChip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-card p-5 shadow-[0_8px_24px_rgba(28,22,18,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">{t.admin.popular}</h2>
            <Link href="/admin/books" className="text-[11px] tracking-[0.14em] uppercase text-wine">
              {t.admin.viewAll}
            </Link>
          </div>
          <ul className="space-y-4">
            {books.slice(0, 5).map((book) => (
              <li key={book.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm">{book.title[lang]}</p>
                  <p className="text-xs text-ink-soft">
                    {book.borrowed}/{book.copies} {t.admin.loaned}
                  </p>
                </div>
                <span className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-paper-2">
                  <span
                    className="block h-full rounded-full bg-wine"
                    style={{ width: `${Math.round((book.borrowed / book.copies) * 100)}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
