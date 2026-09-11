"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ScanIdModal, type ScannedId } from "@/components/ScanIdModal";
import { signUpAction, type AuthState } from "@/lib/actions/auth";
import { useI18n } from "@/lib/i18n";

const initial: AuthState = {};

export default function SignUpPage() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    department: "",
    email: "",
    phone: "",
  });
  const [state, action, pending] = useActionState(signUpAction, initial);

  function onScan(data: ScannedId) {
    setForm((prev) => ({
      ...prev,
      name: data.name,
      studentId: data.studentId,
      department: data.department,
      email: data.email,
    }));
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
      <form action={action} className="mt-6 grid gap-4">
        <Field
          label={t.auth.name}
          name="name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <Field
          label={t.auth.id}
          name="studentId"
          value={form.studentId}
          onChange={(v) => setForm({ ...form, studentId: v })}
        />
        <Field
          label={t.auth.dept}
          name="department"
          value={form.department}
          onChange={(v) => setForm({ ...form, department: v })}
        />
        <Field
          label={t.auth.email}
          name="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <Field
          label={t.auth.phone}
          name="phone"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />
        <label className="text-sm">
          {t.auth.password}
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-4 py-3 outline-none focus:border-wine"
          />
        </label>
        <label className="text-sm">
          {t.auth.confirm}
          <input
            name="confirm"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-4 py-3 outline-none focus:border-wine"
          />
        </label>
        {state.error ? <p className="text-sm text-wine">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-ink py-3 text-paper hover:bg-wine disabled:opacity-60"
        >
          {pending ? "…" : t.auth.submitUp}
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
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-4 py-3 outline-none focus:border-wine"
      />
    </label>
  );
}
