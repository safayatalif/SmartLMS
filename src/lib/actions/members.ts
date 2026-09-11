"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import type { ActionState } from "@/lib/actions/books";

export async function createMemberAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const studentId = String(formData.get("studentId") || "").trim();
  const planId = String(formData.get("planId") || "basic");
  const status = String(formData.get("status") || "active");
  const booksCount = Number(formData.get("booksCount") || 0);
  const password = String(formData.get("password") || "student123");

  if (!name || !email || !studentId) return { error: "Name, email, student ID required." };

  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await query<{ id: string }>(
      `INSERT INTO users (email, student_id, password_hash, role, name)
       VALUES ($1,$2,$3,'STUDENT',$4)
       RETURNING id`,
      [email, studentId, hash, name],
    );
    await query(
      `INSERT INTO members (user_id, name, email, plan_id, status, books_count)
       VALUES ($1,$2,$3,$4,$5::member_status,$6)`,
      [rows[0].id, name, email, planId, status, booksCount],
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return { error: "Email or student ID already exists." };
    }
    return { error: "Could not create member." };
  }

  revalidatePath("/admin/members");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateMemberAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const planId = String(formData.get("planId") || "basic");
  const status = String(formData.get("status") || "active");
  const booksCount = Number(formData.get("booksCount") || 0);

  if (!id || !name || !email) return { error: "Missing fields." };

  await query(
    `UPDATE members SET name=$2, email=$3, plan_id=$4, status=$5::member_status, books_count=$6
     WHERE id=$1`,
    [id, name, email, planId, status, booksCount],
  );

  revalidatePath("/admin/members");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteMemberAction(id: string): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  const { rows } = await query<{ user_id: string | null }>(
    "SELECT user_id FROM members WHERE id = $1",
    [id],
  );
  await query("DELETE FROM members WHERE id = $1", [id]);
  if (rows[0]?.user_id) {
    await query("DELETE FROM users WHERE id = $1 AND role = 'STUDENT'", [rows[0].user_id]);
  }
  revalidatePath("/admin/members");
  revalidatePath("/admin");
  revalidatePath("/admin/payments");
  return { ok: true };
}
