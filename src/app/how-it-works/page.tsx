"use client";

import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { useI18n } from "@/lib/i18n";

export default function HowItWorksPage() {
  const { t } = useI18n();
  return (
    <MarketingShell>
      <section className="page-pad mx-auto max-w-5xl py-14">
        <p className="text-[11px] tracking-[0.22em] uppercase text-wine">{t.nav.how}</p>
        <h1 className="font-display mt-3 text-5xl leading-tight">{t.howTitle}</h1>
        <ol className="mt-12 space-y-8">
          {t.howSteps.map((step) => (
            <li key={step.n} className="grid gap-4 border-b border-ink/10 pb-8 md:grid-cols-[120px_1fr]">
              <span className="font-display text-5xl text-gold">{step.n}</span>
              <div>
                <h2 className="font-display text-3xl">{step.title}</h2>
                <p className="mt-3 max-w-xl leading-7 text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link href="/sign-up" className="mt-10 inline-block rounded-full bg-ink px-6 py-3 text-paper">
          {t.cta.start}
        </Link>
      </section>
    </MarketingShell>
  );
}
