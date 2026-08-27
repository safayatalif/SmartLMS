"use client";

import { MarketingShell } from "@/components/marketing/MarketingShell";
import { useI18n } from "@/lib/i18n";

export default function FeaturesPage() {
  const { t } = useI18n();
  return (
    <MarketingShell>
      <section className="page-pad mx-auto max-w-6xl py-14">
        <p className="text-[11px] tracking-[0.22em] uppercase text-wine">{t.nav.features}</p>
        <h1 className="font-display mt-3 max-w-3xl text-5xl leading-tight">{t.featuresTitle}</h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">{t.featuresLead}</p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {t.featureItems.map((item, i) => (
            <article key={item.title} className="flex gap-5 rounded-3xl border border-ink/10 bg-card p-8">
              <span className="font-display text-3xl text-gold">0{i + 1}</span>
              <div>
                <h2 className="font-display text-3xl">{item.title}</h2>
                <p className="mt-3 leading-7 text-ink-soft">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
