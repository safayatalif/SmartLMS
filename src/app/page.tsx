"use client";

import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BookCover, TierPill } from "@/components/BookCover";
import { ShelfArt } from "@/components/ShelfArt";
import { useI18n } from "@/lib/i18n";
import { books, plans, planLabel } from "@/lib/mock-data";

export default function HomePage() {
  const { t, lang } = useI18n();
  const featured = books.slice(0, 4);

  return (
    <MarketingShell>
      <section className="page-pad mx-auto grid max-w-6xl items-center gap-8 py-10 md:grid-cols-2 md:gap-10 md:py-16">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.22em] uppercase text-wine">{t.hero.kicker}</p>
          <h1 className="font-display mt-4 text-[2.6rem] leading-[1.05] md:text-6xl">{t.hero.title}</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-ink-soft">{t.hero.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up" className="rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-wine">
              {t.cta.start}
            </Link>
            <Link href="/books" className="rounded-full border border-ink/20 px-6 py-3 text-sm hover:border-wine hover:text-wine">
              {t.cta.browse}
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-xs tracking-[0.14em] uppercase text-ink-soft">
            <span>{t.social.readers}</span>
            <span>{t.social.titles}</span>
            <span>{t.social.mobile}</span>
          </div>
        </div>
        <div className="relative min-h-[320px] min-w-0 md:min-h-[390px]">
          <ShelfArt />
        </div>
      </section>

      <div className="gold-rule mx-auto max-w-5xl" />

      <section className="page-pad mx-auto max-w-6xl py-16">
        <p className="text-[11px] tracking-[0.22em] uppercase text-gold">01</p>
        <h2 className="font-display mt-2 text-4xl">{t.featuresTitle}</h2>
        <p className="mt-3 max-w-lg text-ink-soft">{t.featuresLead}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {t.featureItems.map((item) => (
            <article key={item.title} className="rounded-2xl border border-ink/10 bg-card p-6">
              <h3 className="font-display text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-forest py-16 text-paper">
        <div className="page-pad mx-auto max-w-6xl">
          <p className="text-[11px] tracking-[0.22em] uppercase text-gold">02</p>
          <h2 className="font-display mt-2 text-4xl">{t.howTitle}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {t.howSteps.map((step) => (
              <div key={step.n} className="border-t border-paper/20 pt-5">
                <p className="font-display text-3xl text-gold">{step.n}</p>
                <h3 className="mt-3 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-paper/70">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-pad mx-auto max-w-6xl py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-gold">03</p>
            <h2 className="font-display mt-2 text-4xl">{t.booksTitle}</h2>
            <p className="mt-3 max-w-lg text-ink-soft">{t.booksLead}</p>
          </div>
          <Link href="/books" className="hidden text-sm tracking-[0.12em] uppercase text-wine md:inline">
            {t.allBooks}
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {featured.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="group">
              <BookCover title={book.title[lang]} palette={book.palette} />
              <p className="mt-3 font-display text-lg leading-snug group-hover:text-wine">{book.title[lang]}</p>
              <p className="text-xs text-ink-soft">{book.author}</p>
              <div className="mt-2">
                <TierPill tier={book.tier} label={planLabel(book.tier, lang)} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-pad mx-auto max-w-6xl pb-16">
        <p className="text-[11px] tracking-[0.22em] uppercase text-gold">04</p>
        <h2 className="font-display mt-2 text-4xl">{t.pricingTitle}</h2>
        <p className="mt-3 max-w-lg text-ink-soft">{t.pricingLead}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`rounded-3xl border p-7 ${plan.featured ? "border-wine bg-wine text-paper" : "border-ink/10 bg-card"}`}
            >
              <p className="text-xs tracking-[0.16em] uppercase opacity-70">{plan.name[lang]}</p>
              <p className="font-display mt-4 text-5xl">
                {plan.price === 0 ? (lang === "bn" ? "ফ্রি" : "Free") : `৳${plan.price}`}
              </p>
              <p className="mt-1 text-sm opacity-70">{plan.period[lang]}</p>
              <p className="mt-5 text-sm leading-6 opacity-80">{plan.blurb[lang]}</p>
              <Link
                href="/sign-up"
                className={`mt-8 inline-block rounded-full px-5 py-2.5 text-sm ${plan.featured ? "bg-paper text-ink" : "bg-ink text-paper"}`}
              >
                {t.cta.start}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
