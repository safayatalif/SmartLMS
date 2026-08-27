"use client";

import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BookCover, TierPill } from "@/components/BookCover";
import { useI18n } from "@/lib/i18n";
import { books, planLabel } from "@/lib/mock-data";

export default function BooksPage() {
  const { t, lang } = useI18n();
  return (
    <MarketingShell>
      <section className="page-pad mx-auto max-w-6xl py-14">
        <p className="text-[11px] tracking-[0.22em] uppercase text-wine">{t.nav.books}</p>
        <h1 className="font-display mt-3 text-5xl">{t.booksTitle}</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">{t.booksLead}</p>
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="group">
              <BookCover title={book.title[lang]} palette={book.palette} />
              <p className="mt-3 font-display text-xl leading-snug group-hover:text-wine">{book.title[lang]}</p>
              <p className="text-xs text-ink-soft">{book.author}</p>
              <div className="mt-2">
                <TierPill tier={book.tier} label={planLabel(book.tier, lang)} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
