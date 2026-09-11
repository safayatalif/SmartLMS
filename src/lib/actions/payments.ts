"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import type { ActionState } from "@/lib/actions/books";

export async function createPaymentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const memberId = String(formData.get("memberId") || "");
  const planId = String(formData.get("planId") || "");
  const amount = Number(formData.get("amount") || 0);
  const method = String(formData.get("method") || "bKash");
  const status = String(formData.get("status") || "paid");
  const paidAt = String(formData.get("paidAt") || new Date().toISOString().slice(0, 10));

  if (!memberId || !planId) return { error: "Member and plan required." };

  await query(
    `INSERT INTO payments (member_id, plan_id, amount, method, status, paid_at)
     VALUES ($1,$2,$3,$4,$5::payment_status,$6)`,
    [memberId, planId, amount, method, status, paidAt],
  );

  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updatePaymentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const id = String(formData.get("id") || "");
  const amount = Number(formData.get("amount") || 0);
  const method = String(formData.get("method") || "bKash");
  const status = String(formData.get("status") || "paid");
  const planId = String(formData.get("planId") || "");
  const paidAt = String(formData.get("paidAt") || "");

  if (!id) return { error: "Missing id." };

  await query(
    `UPDATE payments SET amount=$2, method=$3, status=$4::payment_status, plan_id=$5, paid_at=COALESCE(NULLIF($6,'')::date, paid_at)
     WHERE id=$1`,
    [id, amount, method, status, planId, paidAt],
  );

  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deletePaymentAction(id: string): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  await query("DELETE FROM payments WHERE id = $1", [id]);
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  return { ok: true };
}
