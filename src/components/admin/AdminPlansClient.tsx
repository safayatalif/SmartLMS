"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Field, Modal, TextArea, useActionToast } from "@/components/admin/FormBits";
import {
  createPlanAction,
  deletePlanAction,
  updatePlanAction,
} from "@/lib/actions/plans";
import type { ActionState } from "@/lib/actions/books";
import { useI18n } from "@/lib/i18n";
import type { Plan } from "@/lib/types";

const empty: ActionState = {};

export function AdminPlansClient({ plans }: { plans: Plan[] }) {
  const { lang } = useI18n();
  const { msg, setMsg } = useActionToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [pending, startTransition] = useTransition();
  const [createState, createAction, createPending] = useActionState(createPlanAction, empty);
  const [updateState, updateAction, updatePending] = useActionState(updatePlanAction, empty);

  useEffect(() => {
    if (createState.ok) {
      setOpen(false);
      setMsg("Plan created.");
    } else if (createState.error) setMsg(createState.error);
  }, [createState, setMsg]);

  useEffect(() => {
    if (updateState.ok) {
      setEditing(null);
      setMsg("Plan updated.");
    } else if (updateState.error) setMsg(updateState.error);
  }, [updateState, setMsg]);

  function onDelete(id: string) {
    if (!confirm("Delete this plan?")) return;
    startTransition(async () => {
      const res = await deletePlanAction(id);
      setMsg(res.error || "Plan deleted.");
    });
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-display text-4xl">{lang === "bn" ? "প্ল্যান" : "Plans"}</h1>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-ink px-4 py-2 text-sm text-paper"
        >
          Add plan
        </button>
      </div>
      {msg ? <p className="mt-3 text-sm text-wine">{msg}</p> : null}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.id} className="rounded-2xl border border-ink/10 bg-card p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">{plan.name[lang]}</p>
            <p className="font-display mt-3 text-4xl">
              {plan.price === 0 ? "৳0" : `৳${plan.price}`}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{plan.period[lang]}</p>
            <ul className="mt-5 space-y-2 text-sm text-ink-soft">
              {plan.features[lang].map((f) => (
                <li key={f}>— {f}</li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className="text-xs text-wine underline-offset-2 hover:underline"
                onClick={() => setEditing(plan)}
              >
                Edit
              </button>
              <button
                type="button"
                disabled={pending}
                className="text-xs text-ink-soft underline-offset-2 hover:underline"
                onClick={() => onDelete(plan.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <Modal open={open} title="Add plan" onClose={() => setOpen(false)}>
        <PlanForm action={createAction} pending={createPending} isCreate />
      </Modal>
      <Modal open={!!editing} title="Edit plan" onClose={() => setEditing(null)}>
        {editing ? <PlanForm action={updateAction} plan={editing} pending={updatePending} /> : null}
      </Modal>
    </div>
  );
}

function PlanForm({
  action,
  plan,
  pending,
  isCreate,
}: {
  action: (payload: FormData) => void;
  plan?: Plan;
  pending: boolean;
  isCreate?: boolean;
}) {
  return (
    <form action={action} className="grid gap-3">
      {isCreate ? (
        <Field label="Plan id (e.g. campus)" name="id" required />
      ) : (
        <input type="hidden" name="id" value={plan?.id} />
      )}
      <Field label="Name (EN)" name="nameEn" defaultValue={plan?.name.en} required />
      <Field label="Name (BN)" name="nameBn" defaultValue={plan?.name.bn} />
      <Field label="Price (BDT)" name="price" type="number" defaultValue={plan?.price ?? 0} />
      <Field label="Period (EN)" name="periodEn" defaultValue={plan?.period.en} />
      <Field label="Period (BN)" name="periodBn" defaultValue={plan?.period.bn} />
      <TextArea label="Blurb (EN)" name="blurbEn" defaultValue={plan?.blurb.en} />
      <TextArea label="Blurb (BN)" name="blurbBn" defaultValue={plan?.blurb.bn} />
      <TextArea
        label="Features EN (one per line)"
        name="featuresEn"
        defaultValue={plan?.features.en.join("\n")}
      />
      <TextArea
        label="Features BN (one per line)"
        name="featuresBn"
        defaultValue={plan?.features.bn.join("\n")}
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={plan?.featured} />
        Featured plan
      </label>
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
