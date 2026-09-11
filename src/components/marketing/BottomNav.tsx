"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function BottomNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const items = [
    { href: "/", label: t.nav.home, icon: HomeIcon },
    { href: "/books", label: t.nav.books, icon: BookIcon },
    { href: "/pricing", label: t.nav.pricing, icon: CardIcon },
    { href: "/sign-in", label: t.nav.signIn, icon: UserIcon },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 px-2 py-2 backdrop-blur md:hidden">
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-1 text-[10px] tracking-wide uppercase",
                  active ? "text-wine" : "text-ink-soft",
                )}
              >
                <item.icon />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 10.5 12 4l8 6.5V20H4z" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 19V5c3.5 0 5 1.5 7 1.5S15.5 5 19 5v14c-3.5 0-5 1.4-7 1.4S8.5 19 5 19Z" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.6-3 4-4.5 7-4.5s5.4 1.5 7 4.5" />
    </svg>
  );
}
