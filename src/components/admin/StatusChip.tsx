import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function StatusChip({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "bad" | "muted";
  children: ReactNode;
}) {
  const map = {
    ok: "bg-mint text-sage",
    warn: "bg-[#f3e3c7] text-wine",
    bad: "bg-[#f6dcd4] text-terracotta",
    muted: "bg-paper-2 text-ink-soft",
  } as const;
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] tracking-wide", map[tone])}>
      {children}
    </span>
  );
}
