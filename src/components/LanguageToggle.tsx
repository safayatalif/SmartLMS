"use client";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function LanguageToggle({ inverted = false }: { inverted?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={cn(
        "inline-flex rounded-full border p-0.5 text-[11px] tracking-[0.14em] uppercase",
        inverted ? "border-paper/25 text-paper" : "border-ink/15 text-ink",
      )}
    >
      {(["en", "bn"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={cn(
            "rounded-full px-2.5 py-1 transition",
            lang === code
              ? inverted
                ? "bg-paper text-ink"
                : "bg-ink text-paper"
              : "opacity-60 hover:opacity-100",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
