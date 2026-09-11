"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-8 border-t border-ink/10 bg-forest text-paper">
      <div className="page-pad mx-auto grid max-w-6xl gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo inverted />
          <p className="mt-4 max-w-sm text-sm leading-7 text-paper/70">{t.tagline}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-paper/75">
          <Link href="/features" className="hover:text-gold">{t.nav.features}</Link>
          <Link href="/books" className="hover:text-gold">{t.nav.books}</Link>
          <Link href="/pricing" className="hover:text-gold">{t.nav.pricing}</Link>
          <Link href="/how-it-works" className="hover:text-gold">{t.nav.how}</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm text-paper/75">
          <Link href="/about" className="hover:text-gold">{t.nav.about}</Link>
          <Link href="/sign-in" className="hover:text-gold">{t.nav.signIn}</Link>
          <Link href="/sign-up" className="hover:text-gold">{t.nav.signUp}</Link>
          <Link href="/admin" className="hover:text-gold">{t.nav.admin}</Link>
        </div>
      </div>
      <div className="page-pad mx-auto flex max-w-6xl flex-col gap-1 border-t border-paper/10 py-5 pb-24 text-xs text-paper/50 md:flex-row md:justify-between md:pb-5">
        <span>{t.footer.rights}</span>
        <span>{t.footer.note}</span>
      </div>
    </footer>
  );
}
