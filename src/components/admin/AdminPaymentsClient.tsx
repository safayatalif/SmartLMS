"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Field, Modal, useActionToast } from "@/components/admin/FormBits";
import { StatusChip } from "@/components/admin/StatusChip";
import {
  createPaymentAction,
  deletePaymentAction,
  updatePaymentAction,
} from "@/lib/actions/payments";
import type { ActionState } from "@/lib/actions/books";
import { useI18n } from "@/lib/i18n";
import type { Member, Payment, Plan } from "@/lib/types";

const empty: ActionState = {};

export function AdminPaymentsClient({
  payments,
  members,
  plans,
}: {
  payments: Payment[];
  members: Member[];
  plans: Plan[];
}) {
  const { t } = useI18n();
  const { msg, setMsg } = useActionToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [pending, startTransition] = useTransition();
  const [createState, createAction, createPending] = useActionState(createPaymentAction, empty);
  const [updateState, updateAction, updatePending] = useActionState(updatePaymentAction, empty);

  useEffect(() => {
    if (createState.ok) {
      setOpen(false);
      setMsg("Payment recorded.");
    } else if (createState.error) setMsg(createState.error);
  }, [createState, setMsg]);

  useEffect(() => {
    if (updateState.ok) {
      setEditing(null);
      setMsg("Payment updated.");
    } else if (updateState.error) setMsg(updateState.error);
  }, [updateState, setMsg]);

  function onDelete(id: string) {
    if (!confirm("Delete this payment?")) return;
    startTransition(async () => {
      const res = await deletePaymentAction(id);
      setMsg(res.error || "Payment deleted.");
    });
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold">{t.nav.admin}</p>
          <h1 className="font-display mt-1 text-4xl">{t.admin.payments}</h1>
          <p className="mt-2 text-sm text-ink-soft">bKash, Nagad, Rocket and cards.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-ink px-4 py-2 text-sm text-paper"
        >
          Add payment
        </button>
      </div>
      {msg ? <p className="mt-3 text-sm text-wine">{msg}</p> : null}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-ink/10 bg-card shadow-[0_8px_24px_rgba(28,22,18,0.04)]">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-paper-2/50 text-[11px] uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-5 py-3.5 font-normal">Member</th>
              <th className="px-5 py-3.5 font-normal">Plan</th>
              <th className="px-5 py-3.5 font-normal">Amount</th>
              <th className="px-5 py-3.5 font-normal">Method</th>
              <th className="px-5 py-3.5 font-normal">{t.admin.status}</th>
              <th className="px-5 py-3.5 font-normal">Date</th>
              <th className="px-5 py-3.5 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-ink/8 hover:bg-paper/60">
                <td className="px-5 py-3.5">{p.member}</td>
                <td className="px-5 py-3.5">{p.plan}</td>
                <td className="px-5 py-3.5 font-medium">৳{p.amount}</td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px]">{p.method}</span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusChip tone={p.status === "paid" ? "ok" : "bad"}>
                    {p.status === "paid" ? t.admin.paid : t.admin.failed}
                  </StatusChip>
                </td>
                <td className="px-5 py-3.5 text-ink-soft">{p.date}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs text-wine underline-offset-2 hover:underline"
                      onClick={() => setEditing(p)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      className="text-xs text-ink-soft underline-offset-2 hover:underline"
                      onClick={() => onDelete(p.id)}
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

      <Modal open={open} title="Add payment" onClose={() => setOpen(false)}>
        <PaymentForm
          action={createAction}
          members={members}
          plans={plans}
          pending={createPending}
        />
      </Modal>
      <Modal open={!!editing} title="Edit payment" onClose={() => setEditing(null)}>
        {editing ? (
          <PaymentForm
            action={updateAction}
            members={members}
            plans={plans}
            payment={editing}
            pending={updatePending}
          />
        ) : null}
      </Modal>
    </div>
  );
}

function PaymentForm({
  action,
  members,
  plans,
  payment,
  pending,
}: {
  action: (payload: FormData) => void;
  members: Member[];
  plans: Plan[];
  payment?: Payment;
  pending: boolean;
}) {
  return (
    <form action={action} className="grid gap-3">
      {payment ? <input type="hidden" name="id" value={payment.id} /> : null}
      {!payment ? (
        <label className="block text-sm">
          Member
          <select
            name="memberId"
            required
            className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-3 py-2"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="block text-sm">
        Plan
        <select
          name="planId"
          defaultValue={payment?.planId || plans[0]?.id}
          className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-3 py-2"
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name.en}
            </option>
          ))}
        </select>
      </label>
      <Field label="Amount" name="amount" type="number" defaultValue={payment?.amount ?? 50} />
      <label className="block text-sm">
        Method
        <select
          name="method"
          defaultValue={payment?.method || "bKash"}
          className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-3 py-2"
        >
          {["bKash", "Nagad", "Rocket", "Card"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Status
        <select
          name="status"
          defaultValue={payment?.status || "paid"}
          className="mt-1 w-full rounded-xl border border-ink/15 bg-card px-3 py-2"
        >
          <option value="paid">paid</option>
          <option value="failed">failed</option>
        </select>
      </label>
      <Field
        label="Date"
        name="paidAt"
        type="date"
        defaultValue={new Date().toISOString().slice(0, 10)}
      />
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
