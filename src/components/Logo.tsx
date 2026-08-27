import { cn } from "@/lib/cn";

export function Logo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  const ink = inverted ? "#F3EEE4" : "#1C1612";
  const wine = inverted ? "#E8C9A0" : "#7A2E3A";
  const gold = "#C4A35A";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        aria-hidden="true"
      >
        <rect x="1" y="1" width="32" height="32" rx="4" stroke={gold} strokeWidth="1.2" />
        <path
          d="M8 25.5V9.5c4.2 0 6.4 1.6 9 1.6s4.8-1.6 9-1.6v16c-4.2 0-6.4 1.5-9 1.5s-4.8-1.5-9-1.5Z"
          stroke={ink}
          strokeWidth="1.4"
          fill={inverted ? "rgba(243,238,228,0.08)" : "rgba(243,238,228,0.7)"}
        />
        <path d="M17 11.1v16" stroke={wine} strokeWidth="1.4" />
        <circle cx="24.2" cy="8.2" r="1.3" fill={gold} />
      </svg>
      <span
        className="font-display text-[1.35rem] leading-none tracking-tight"
        style={{ color: inverted ? "#F3EEE4" : undefined }}
      >
        SmartLMS
      </span>
    </span>
  );
}
