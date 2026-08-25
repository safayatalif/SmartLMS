"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const links = [
    { href: "/", label: t.nav.home },
    { href: "/features", label: t.nav.features },
    { href: "/books", label: t.nav.books },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="page-pad mx-auto flex max-w-6xl items-center justify-between py-3.5">
        <Link href="/" aria-label={t.brand}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-[13px] tracking-[0.12em] uppercase md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition hover:text-wine",
                pathname === link.href ? "text-wine" : "text-ink-soft",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/sign-in"
            className="hidden text-[13px] tracking-[0.12em] uppercase text-ink-soft hover:text-ink md:inline"
          >
            {t.nav.signIn}
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-ink px-3 py-2 text-[11px] tracking-[0.12em] uppercase text-paper transition hover:bg-wine md:px-4 md:text-[12px]"
          >
            {t.nav.signUp}
          </Link>
        </div>
      </div>
    </header>
  );
}
