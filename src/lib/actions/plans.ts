"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import type { ActionState } from "@/lib/actions/books";

export async function createPlanAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const id = String(formData.get("id") || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
  const nameEn = String(formData.get("nameEn") || "").trim();
  const nameBn = String(formData.get("nameBn") || nameEn).trim();
  const price = Number(formData.get("price") || 0);
  const periodEn = String(formData.get("periodEn") || "/ month").trim();
  const periodBn = String(formData.get("periodBn") || periodEn).trim();
  const blurbEn = String(formData.get("blurbEn") || "").trim();
  const blurbBn = String(formData.get("blurbBn") || blurbEn).trim();
  const featuresEn = String(formData.get("featuresEn") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const featuresBn = String(formData.get("featuresBn") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const featured = formData.get("featured") === "on";

  if (!id || !nameEn) return { error: "Plan id and name required." };

  try {
    await query(
      `INSERT INTO plans (id, name, price, period, featured, blurb, features)
       VALUES ($1,$2::jsonb,$3,$4::jsonb,$5,$6::jsonb,$7::jsonb)`,
      [
        id,
        JSON.stringify({ en: nameEn, bn: nameBn }),
        price,
        JSON.stringify({ en: periodEn, bn: periodBn }),
        featured,
        JSON.stringify({ en: blurbEn, bn: blurbBn }),
        JSON.stringify({
          en: featuresEn.length ? featuresEn : ["Catalog access"],
          bn: featuresBn.length ? featuresBn : featuresEn,
        }),
      ],
    );
  } catch {
    return { error: "Could not create plan (id may already exist)." };
  }

  revalidatePath("/admin/plans");
  revalidatePath("/pricing");
  revalidatePath("/");
  return { ok: true };
}

export async function updatePlanAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const id = String(formData.get("id") || "");
  const nameEn = String(formData.get("nameEn") || "").trim();
  const nameBn = String(formData.get("nameBn") || nameEn).trim();
  const price = Number(formData.get("price") || 0);
  const periodEn = String(formData.get("periodEn") || "/ month").trim();
  const periodBn = String(formData.get("periodBn") || periodEn).trim();
  const blurbEn = String(formData.get("blurbEn") || "").trim();
  const blurbBn = String(formData.get("blurbBn") || blurbEn).trim();
  const featuresEn = String(formData.get("featuresEn") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const featuresBn = String(formData.get("featuresBn") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const featured = formData.get("featured") === "on";

  if (!id || !nameEn) return { error: "Missing fields." };

  await query(
    `UPDATE plans SET name=$2::jsonb, price=$3, period=$4::jsonb, featured=$5,
       blurb=$6::jsonb, features=$7::jsonb WHERE id=$1`,
    [
      id,
      JSON.stringify({ en: nameEn, bn: nameBn }),
      price,
      JSON.stringify({ en: periodEn, bn: periodBn }),
      featured,
      JSON.stringify({ en: blurbEn, bn: blurbBn }),
      JSON.stringify({
        en: featuresEn,
        bn: featuresBn.length ? featuresBn : featuresEn,
      }),
    ],
  );

  revalidatePath("/admin/plans");
  revalidatePath("/pricing");
  revalidatePath("/");
  return { ok: true };
}

export async function deletePlanAction(id: string): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const books = await query<{ c: string }>(
    "SELECT COUNT(*)::text AS c FROM books WHERE tier = $1",
    [id],
  );
  const members = await query<{ c: string }>(
    "SELECT COUNT(*)::text AS c FROM members WHERE plan_id = $1",
    [id],
  );
  if (Number(books.rows[0].c) > 0 || Number(members.rows[0].c) > 0) {
    return { error: "Plan is in use by books or members." };
  }

  await query("DELETE FROM plans WHERE id = $1", [id]);
  revalidatePath("/admin/plans");
  revalidatePath("/pricing");
  return { ok: true };
}
