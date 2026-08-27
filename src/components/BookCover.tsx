import type { PlanId } from "@/lib/mock-data";
import { cn } from "@/lib/cn";

export function BookCover({
  title,
  palette,
  className,
  compact = false,
}: {
  title: string;
  palette: string[];
  className?: string;
  compact?: boolean;
}) {
  const [a, b, c] = palette;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2px] shadow-[6px_10px_24px_rgba(28,22,18,0.18)]",
        compact ? "aspect-[3/4]" : "aspect-[3/4]",
        className,
      )}
      style={{ background: a }}
    >
      <div
        className="absolute inset-y-0 left-0 w-[10px]"
        style={{ background: `linear-gradient(90deg, rgba(0,0,0,0.35), transparent)` }}
      />
      <div
        className="absolute inset-3 border"
        style={{ borderColor: `${b}55` }}
      />
      <div className="absolute left-0 right-0 top-[18%] gold-rule opacity-70" />
      <p
        className="font-display absolute inset-x-5 top-[28%] text-[0.95rem] leading-snug md:text-[1.05rem]"
        style={{ color: b }}
      >
        {title}
      </p>
      <div
        className="absolute bottom-4 left-5 right-5 h-[3px]"
        style={{ background: c }}
      />
      <div
        className="absolute -right-8 -top-8 h-24 w-24 rotate-12 rounded-full opacity-20"
        style={{ background: b }}
      />
    </div>
  );
}

export function TierPill({
  tier,
  label,
}: {
  tier: PlanId;
  label: string;
}) {
  const map = {
    basic: "bg-mint text-sage",
    prime: "bg-[#f3e3c7] text-wine",
    elite: "bg-ink text-paper",
  } as const;
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] tracking-wide uppercase", map[tier])}>
      {label}
    </span>
  );
}
