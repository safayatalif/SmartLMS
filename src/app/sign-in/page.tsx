"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ScanIdModal, type ScannedId } from "@/components/ScanIdModal";
import { useI18n } from "@/lib/i18n";

export default function SignInPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState("");

  function onScan(data: ScannedId) {
    setStudentId(data.studentId);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    router.push("/admin");
  }

  return (
    <div className="page-pad mx-auto flex min-h-full max-w-lg flex-col py-8">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <LanguageToggle />
      </div>
      <h1 className="font-display mt-12 text-4xl">{t.auth.signInTitle}</h1>
      <p className="mt-3 text-ink-soft">{t.auth.signInLead}</p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 rounded-full border border-ink/20 px-5 py-3 text-sm tracking-[0.08em] uppercase hover:border-wine hover:text-wine"
      >
        {t.cta.scan}
      </button>
      <p className="mt-6 text-center text-xs tracking-[0.18em] uppercase text-ink-soft">{t.auth.or}</p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <label className="text-sm">
          {t.auth.id}
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-4 py-3 outline-none focus:border-wine"
            placeholder="ID or email"
          />
        </label>
        <label className="text-sm">
          {t.auth.password}
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-4 py-3 outline-none focus:border-wine"
            placeholder="••••••••"
          />
        </label>
        <button type="submit" className="mt-2 rounded-full bg-ink py-3 text-paper hover:bg-wine">
          {t.auth.submitIn}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink-soft">
        {t.auth.noAccount}{" "}
        <Link href="/sign-up" className="text-wine underline-offset-4 hover:underline">
          {t.nav.signUp}
        </Link>
      </p>
      <p className="mt-4 text-xs text-ink-soft">{t.auth.mockAdmin}</p>
      {open ? <ScanIdModal onClose={() => setOpen(false)} onComplete={onScan} /> : null}
    </div>
  );
}
