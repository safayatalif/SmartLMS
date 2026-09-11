"use client";

import { useI18n } from "@/lib/i18n";
import { plans } from "@/lib/mock-data";

export default function AdminPlansPage() {
  const { lang } = useI18n();
  return (
    <div>
      <h1 className="font-display text-4xl">{lang === "bn" ? "প্ল্যান" : "Plans"}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.id} className="rounded-2xl border border-ink/10 bg-card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">{plan.name[lang]}</p>
            <p className="font-display mt-3 text-4xl">{plan.price === 0 ? "৳0" : `৳${plan.price}`}</p>
            <p className="mt-1 text-sm text-ink-soft">{plan.period[lang]}</p>
            <ul className="mt-5 space-y-2 text-sm text-ink-soft">
              {plan.features[lang].map((f) => (
                <li key={f}>— {f}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
