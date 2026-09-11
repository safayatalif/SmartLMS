"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export type ActionState = { error?: string; ok?: boolean };

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function createBookAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const titleEn = String(formData.get("titleEn") || "").trim();
  const titleBn = String(formData.get("titleBn") || titleEn).trim();
  const author = String(formData.get("author") || "").trim();
  const categoryEn = String(formData.get("categoryEn") || "General").trim();
  const categoryBn = String(formData.get("categoryBn") || categoryEn).trim();
  const tier = String(formData.get("tier") || "basic");
  const pages = Number(formData.get("pages") || 0);
  const year = Number(formData.get("year") || new Date().getFullYear());
  const rating = Number(formData.get("rating") || 4.5);
  const copies = Number(formData.get("copies") || 1);
  const borrowed = Number(formData.get("borrowed") || 0);
  const summaryEn = String(formData.get("summaryEn") || "").trim();
  const summaryBn = String(formData.get("summaryBn") || summaryEn).trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugInput || slugify(titleEn);
  const palette = [
    String(formData.get("color1") || "#7a2e3a"),
    String(formData.get("color2") || "#f3eee4"),
    String(formData.get("color3") || "#1c1612"),
  ];

  if (!titleEn || !author || !slug) return { error: "Title, author required." };

  try {
    await query(
      `INSERT INTO books (slug, title, author, category, tier, pages, year, rating, copies, borrowed, summary, palette)
       VALUES ($1,$2::jsonb,$3,$4::jsonb,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb)`,
      [
        slug,
        JSON.stringify({ en: titleEn, bn: titleBn }),
        author,
        JSON.stringify({ en: categoryEn, bn: categoryBn }),
        tier,
        pages,
        year,
        rating,
        copies,
        borrowed,
        JSON.stringify({ en: summaryEn, bn: summaryBn }),
        JSON.stringify(palette),
      ],
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return { error: "A book with this slug already exists." };
    }
    return { error: "Could not create book." };
  }

  revalidatePath("/admin/books");
  revalidatePath("/books");
  revalidatePath("/");
  return { ok: true };
}

export async function updateBookAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };

  const slug = String(formData.get("slug") || "");
  const titleEn = String(formData.get("titleEn") || "").trim();
  const titleBn = String(formData.get("titleBn") || titleEn).trim();
  const author = String(formData.get("author") || "").trim();
  const categoryEn = String(formData.get("categoryEn") || "General").trim();
  const categoryBn = String(formData.get("categoryBn") || categoryEn).trim();
  const tier = String(formData.get("tier") || "basic");
  const pages = Number(formData.get("pages") || 0);
  const year = Number(formData.get("year") || 0);
  const rating = Number(formData.get("rating") || 0);
  const copies = Number(formData.get("copies") || 0);
  const borrowed = Number(formData.get("borrowed") || 0);
  const summaryEn = String(formData.get("summaryEn") || "").trim();
  const summaryBn = String(formData.get("summaryBn") || summaryEn).trim();
  const palette = [
    String(formData.get("color1") || "#7a2e3a"),
    String(formData.get("color2") || "#f3eee4"),
    String(formData.get("color3") || "#1c1612"),
  ];

  if (!slug || !titleEn || !author) return { error: "Missing fields." };

  await query(
    `UPDATE books SET
       title = $2::jsonb,
       author = $3,
       category = $4::jsonb,
       tier = $5,
       pages = $6,
       year = $7,
       rating = $8,
       copies = $9,
       borrowed = $10,
       summary = $11::jsonb,
       palette = $12::jsonb
     WHERE slug = $1`,
    [
      slug,
      JSON.stringify({ en: titleEn, bn: titleBn }),
      author,
      JSON.stringify({ en: categoryEn, bn: categoryBn }),
      tier,
      pages,
      year,
      rating,
      copies,
      borrowed,
      JSON.stringify({ en: summaryEn, bn: summaryBn }),
      JSON.stringify(palette),
    ],
  );

  revalidatePath("/admin/books");
  revalidatePath("/books");
  revalidatePath(`/books/${slug}`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteBookAction(slug: string): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  await query("DELETE FROM books WHERE slug = $1", [slug]);
  revalidatePath("/admin/books");
  revalidatePath("/books");
  revalidatePath("/");
  return { ok: true };
}
