"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Field, Modal, useActionToast } from "@/components/admin/FormBits";
import { StatusChip } from "@/components/admin/StatusChip";
import {
  createMemberAction,
  deleteMemberAction,
  updateMemberAction,
} from "@/lib/actions/members";
import type { ActionState } from "@/lib/actions/books";
import { useI18n } from "@/lib/i18n";
import type { Member, Plan } from "@/lib/types";
import { planLabel } from "@/lib/types";

const empty: ActionState = {};

export function AdminMembersClient({
  members,
  plans,
}: {
  members: Member[];
  plans: Plan[];
}) {
  const { t, lang } = useI18n();
  const { msg, setMsg } = useActionToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [pending, startTransition] = useTransition();
  const [createState, createAction, createPending] = useActionState(createMemberAction, empty);
  const [updateState, updateAction, updatePending] = useActionState(updateMemberAction, empty);

  useEffect(() => {
    if (createState.ok) {
      setOpen(false);
      setMsg("Member added.");
    } else if (createState.error) setMsg(createState.error);
  }, [createState, setMsg]);

  useEffect(() => {
    if (updateState.ok) {
      setEditing(null);
      setMsg("Member updated.");
    } else if (updateState.error) setMsg(updateState.error);
  }, [updateState, setMsg]);

  function onDelete(id: string) {
    if (!confirm("Delete this member?")) return;
    startTransition(async () => {
      const res = await deleteMemberAction(id);
      setMsg(res.error || "Member deleted.");
    });
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold">{t.nav.admin}</p>
          <h1 className="font-display mt-1 text-4xl">{t.admin.members}</h1>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-ink px-4 py-2 text-sm text-paper"
        >
          {t.admin.addMember}
        </button>
      </div>
      {msg ? <p className="mt-3 text-sm text-wine">{msg}</p> : null}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[0_8px_24px_rgba(28,22,18,0.04)]">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-paper-2/50 text-[11px] uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3.5 font-normal">Member</th>
              <th className="px-5 py-3.5 font-normal">Plan</th>
              <th className="px-5 py-3.5 font-normal">{t.admin.status}</th>
              <th className="px-5 py-3.5 font-normal">{t.admin.books}</th>
              <th className="px-5 py-3.5 font-normal">Joined</th>
              <th className="px-5 py-3.5 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-ink/8 hover:bg-paper/60">
                <td className="px-5 py-3.5">
                  <p>{m.name}</p>
                  <p className="text-xs text-ink-soft">{m.email}</p>
                </td>
                <td className="px-5 py-3.5">{planLabel(plans, m.plan, lang)}</td>
                <td className="px-5 py-3.5">
                  <StatusChip tone={m.status === "active" ? "ok" : m.status === "pending" ? "warn" : "muted"}>
                    {m.status === "active"
                      ? t.admin.active
                      : m.status === "pending"
                        ? t.admin.pending
                        : t.admin.expired}
                  </StatusChip>
                </td>
                <td className="px-5 py-3.5">{m.books}</td>
                <td className="px-5 py-3.5 text-ink-soft">{m.joined}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs text-wine underline-offset-2 hover:underline"
                      onClick={() => setEditing(m)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      className="text-xs text-ink-soft underline-offset-2 hover:underline"
                      onClick={() => onDelete(m.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={t.admin.addMember} onClose={() => setOpen(false)}>
        <MemberForm action={createAction} plans={plans} pending={createPending} isCreate />
      </Modal>
      <Modal open={!!editing} title="Edit member" onClose={() => setEditing(null)}>
        {editing ? (
          <MemberForm action={updateAction} plans={plans} member={editing} pending={updatePending} />
        ) : null}
      </Modal>
    </div>
  );
}

function MemberForm({
  action,
  plans,
  member,
  pending,
  isCreate,
}: {
  action: (payload: FormData) => void;
  plans: Plan[];
  member?: Member;
  pending: boolean;
  isCreate?: boolean;
}) {
  return (
    <form action={action} className="grid gap-3">
      {member ? <input type="hidden" name="id" value={member.id} /> : null}
      <Field label="Name" name="name" defaultValue={member?.name} required />
      <Field label="Email" name="email" type="email" defaultValue={member?.email} required />
      {isCreate ? (
        <>
          <Field label="Student ID" name="studentId" required />
          <Field label="Temp password" name="password" defaultValue="student123" />
        </>
      ) : null}
      <label className="block text-sm">
        Plan
        <select
          name="planId"
          defaultValue={member?.plan || "basic"}
          className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-3 py-2"
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name.en}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Status
        <select
          name="status"
          defaultValue={member?.status || "active"}
          className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-3 py-2"
        >
          <option value="active">active</option>
          <option value="pending">pending</option>
          <option value="expired">expired</option>
        </select>
      </label>
      <Field label="Books borrowed" name="booksCount" type="number" defaultValue={member?.books ?? 0} />
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-ink py-2.5 text-sm text-paper disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
