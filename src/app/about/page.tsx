"use client";

import { MarketingShell } from "@/components/marketing/MarketingShell";
import { useI18n } from "@/lib/i18n";

const team = [
  { id: "2024100010063", name: "Safayat Hossen Alif", role: { en: "Admin / catalog", bn: "অ্যাডমিন / ক্যাটালগ" } },
  { id: "2024100010069", name: "Md. Samiul Haque", role: { en: "Visitor journeys", bn: "ভিজিটর যাত্রা" } },
  { id: "2024100010074", name: "Md. Mustasin Billah", role: { en: "Reader journeys", bn: "রিডার যাত্রা" } },
];

export default function AboutPage() {
  const { t, lang } = useI18n();
  return (
    <MarketingShell>
      <section className="page-pad mx-auto max-w-4xl py-14">
        <p className="text-[11px] tracking-[0.22em] uppercase text-wine">{t.nav.about}</p>
        <h1 className="font-display mt-3 text-5xl leading-tight">{t.aboutTitle}</h1>
        <p className="mt-6 text-lg leading-8 text-ink-soft">{t.aboutBody}</p>
        <div className="gold-rule my-12" />
        <h2 className="font-display text-3xl">{t.team}</h2>
        <ul className="mt-6 divide-y divide-ink/10">
          {team.map((person) => (
            <li key={person.id} className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:justify-between">
              <span className="font-display text-2xl">{person.name}</span>
              <span className="text-sm text-ink-soft">
                {person.id} · {person.role[lang]}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-12 space-y-6">
          <h2 className="font-display text-3xl">{t.faqTitle}</h2>
          {t.faqs.map((faq) => (
            <article key={faq.q}>
              <h3 className="text-lg">{faq.q}</h3>
              <p className="mt-2 text-ink-soft">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
