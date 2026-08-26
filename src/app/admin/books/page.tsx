"use client";

import { BookCover, TierPill } from "@/components/BookCover";
import { useI18n } from "@/lib/i18n";
import { books, planLabel } from "@/lib/mock-data";

export default function AdminBooksPage() {
  const { t, lang } = useI18n();
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold">{t.nav.admin}</p>
          <h1 className="font-display mt-1 text-4xl">{t.admin.books}</h1>
        </div>
        <button className="rounded-full bg-ink px-4 py-2 text-sm text-paper">{t.admin.addBook}</button>
      </div>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[0_8px_24px_rgba(28,22,18,0.04)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-paper-2/50 text-[11px] uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3.5 font-normal">Title</th>
              <th className="px-5 py-3.5 font-normal">Plan</th>
              <th className="px-5 py-3.5 font-normal">{t.admin.copies}</th>
              <th className="px-5 py-3.5 font-normal">{t.admin.loaned}</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-t border-ink/8 hover:bg-paper/60">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10">
                      <BookCover title={book.title[lang]} palette={book.palette} compact />
                    </div>
                    <div>
                      <p>{book.title[lang]}</p>
                      <p className="text-xs text-ink-soft">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <TierPill tier={book.tier} label={planLabel(book.tier, lang)} />
                </td>
                <td className="px-5 py-3.5">{book.copies}</td>
                <td className="px-5 py-3.5">{book.borrowed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
