"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const items = [
    { href: "/admin", label: t.admin.overview, icon: IconGrid },
    { href: "/admin/books", label: t.admin.books, icon: IconBook },
    { href: "/admin/members", label: t.admin.members, icon: IconPeople },
    { href: "/admin/plans", label: t.admin.plans, icon: IconCard },
    { href: "/admin/payments", label: t.admin.payments, icon: IconCoin },
  ];

  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-paper">
      <aside className="hidden h-full w-[268px] shrink-0 flex-col bg-forest text-paper md:flex">
        <div className="shrink-0 border-b border-paper/10 px-5 py-6">
          <Link href="/" className="inline-block">
            <Logo inverted />
          </Link>
          <p className="mt-4 text-[10px] tracking-[0.22em] uppercase text-gold/80">Librarian desk</p>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
          {items.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-paper/10 text-gold shadow-[inset_3px_0_0_0_#c4a35a]"
                    : "text-paper/70 hover:bg-paper/5 hover:text-paper",
                )}
              >
                <item.icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-paper/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-paper/8 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-xs font-medium text-forest">
              SA
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm">Safayat Alif</p>
              <p className="text-[11px] text-paper/50">Admin · CSE</p>
            </div>
          </div>
          <Link href="/" className="mt-3 block px-1 text-[11px] text-paper/45 hover:text-gold">
            ← Back to SmartLMS
          </Link>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-20 flex shrink-0 items-center gap-3 border-b border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur md:px-8">
          <label className="relative min-w-0 flex-1 md:max-w-sm">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-soft">
              <SearchIcon />
            </span>
            <input
              placeholder={t.admin.search}
              className="w-full rounded-full border border-ink/10 bg-card py-2 pr-4 pl-9 text-sm outline-none focus:border-gold"
            />
          </label>
          <div className="ml-auto flex items-center gap-2.5">
            <LanguageToggle />
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-wine text-xs text-paper md:flex">
              SA
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-10">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 md:hidden">
        <ul className="grid grid-cols-5 text-[10px] uppercase tracking-wide">
          {items.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-0.5 px-1 text-center",
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
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}
function IconBook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 19V5c3.2 0 5 1.4 7 1.4S15.8 5 19 5v14c-3.2 0-5 1.3-7 1.3S8.2 19 5 19Z" />
    </svg>
  );
}
function IconPeople() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M16 19c.4-2 1.7-3.2 3.5-3.6" />
    </svg>
  );
}
function IconCard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
function IconCoin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M9.5 10.5c.5-.8 1.4-1.2 2.5-1.2 1.5 0 2.5.8 2.5 2s-1 2-2.5 2-2.5.8-2.5 2c0 .4.2.8.5 1.1" />
    </svg>
  );
}
