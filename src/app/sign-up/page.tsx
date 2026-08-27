"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ScanIdModal, type ScannedId } from "@/components/ScanIdModal";
import { useI18n } from "@/lib/i18n";

export default function SignUpPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    department: "",
    email: "",
    phone: "",
  });

  function onScan(data: ScannedId) {
    setForm((prev) => ({
      ...prev,
      name: data.name,
      studentId: data.studentId,
      department: data.department,
      email: data.email,
    }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    router.push("/admin");
  }

  return (
    <div className="page-pad mx-auto flex min-h-full max-w-lg flex-col py-8 pb-16">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <LanguageToggle />
      </div>
      <h1 className="font-display mt-10 text-4xl">{t.auth.signUpTitle}</h1>
      <p className="mt-3 text-ink-soft">{t.auth.signUpLead}</p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 rounded-full border border-ink/20 px-5 py-3 text-sm tracking-[0.08em] uppercase hover:border-wine hover:text-wine"
      >
        {t.cta.scan}
      </button>
      <p className="mt-6 text-center text-xs tracking-[0.18em] uppercase text-ink-soft">{t.auth.or}</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <Field label={t.auth.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label={t.auth.id} value={form.studentId} onChange={(v) => setForm({ ...form, studentId: v })} />
        <Field label={t.auth.dept} value={form.department} onChange={(v) => setForm({ ...form, department: v })} />
        <Field label={t.auth.email} value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Field label={t.auth.phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <label className="text-sm">
          {t.auth.password}
          <input type="password" className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-4 py-3 outline-none focus:border-wine" />
        </label>
        <label className="text-sm">
          {t.auth.confirm}
          <input type="password" className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-4 py-3 outline-none focus:border-wine" />
        </label>
        <button type="submit" className="mt-2 rounded-full bg-ink py-3 text-paper hover:bg-wine">
          {t.auth.submitUp}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink-soft">
        {t.auth.haveAccount}{" "}
        <Link href="/sign-in" className="text-wine underline-offset-4 hover:underline">
          {t.nav.signIn}
        </Link>
      </p>
      {open ? <ScanIdModal onClose={() => setOpen(false)} onComplete={onScan} /> : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-4 py-3 outline-none focus:border-wine"
      />
    </label>
  );
}
