"use client";

import Link from "next/link";
import { use } from "react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BookCover, TierPill } from "@/components/BookCover";
import { useI18n } from "@/lib/i18n";
import { getBook, planLabel } from "@/lib/mock-data";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, lang } = useI18n();
  const book = getBook(id);

  if (!book) {
    return (
      <MarketingShell>
        <p className="page-pad py-20">Book not found.</p>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell>
      <section className="page-pad mx-auto grid max-w-5xl gap-12 py-14 md:grid-cols-[280px_1fr]">
        <BookCover title={book.title[lang]} palette={book.palette} />
        <div>
          <TierPill tier={book.tier} label={planLabel(book.tier, lang)} />
          <h1 className="font-display mt-4 text-5xl leading-tight">{book.title[lang]}</h1>
          <p className="mt-3 text-ink-soft">{book.author}</p>
          <p className="mt-6 max-w-xl leading-8">{book.summary[lang]}</p>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-ink-soft">{lang === "bn" ? "পাতা" : "Pages"}</dt>
              <dd className="font-display text-2xl">{book.pages}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">{lang === "bn" ? "বছর" : "Year"}</dt>
              <dd className="font-display text-2xl">{book.year}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">{lang === "bn" ? "রেটিং" : "Rating"}</dt>
              <dd className="font-display text-2xl">{book.rating}</dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/sign-up" className="rounded-full bg-ink px-6 py-3 text-paper">
              {t.locked}
            </Link>
            <Link href="/books" className="rounded-full border border-ink/20 px-6 py-3">
              {t.allBooks}
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
