"use client";

import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { useI18n } from "@/lib/i18n";
import { plans } from "@/lib/mock-data";

export default function PricingPage() {
  const { t, lang } = useI18n();
  return (
    <MarketingShell>
      <section className="page-pad mx-auto max-w-6xl py-14">
        <p className="text-[11px] tracking-[0.22em] uppercase text-wine">{t.nav.pricing}</p>
        <h1 className="font-display mt-3 max-w-3xl text-5xl leading-tight">{t.pricingTitle}</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">{t.pricingLead}</p>
        <p className="mt-2 text-sm text-ink-soft">{t.billed}</p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`flex flex-col rounded-3xl border p-8 ${
                plan.featured ? "border-wine bg-wine text-paper md:-translate-y-3" : "border-ink/10 bg-card"
              }`}
            >
              <p className="text-xs tracking-[0.16em] uppercase opacity-70">{plan.name[lang]}</p>
              <p className="font-display mt-5 text-5xl">
                {plan.price === 0 ? (lang === "bn" ? "৳০" : "৳0") : `৳${plan.price}`}
              </p>
              <p className="mt-1 text-sm opacity-70">{plan.period[lang]}</p>
              <p className="mt-5 text-sm leading-6 opacity-85">{plan.blurb[lang]}</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm opacity-85">
                {plan.features[lang].map((f) => (
                  <li key={f}>— {f}</li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className={`mt-8 rounded-full px-5 py-3 text-center text-sm ${
                  plan.featured ? "bg-paper text-ink" : "bg-ink text-paper"
                }`}
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
