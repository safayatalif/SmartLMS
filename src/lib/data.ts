import { query } from "@/lib/db";
import type { Book, Member, Payment, Plan, PlanId } from "@/lib/types";

function asJson<T>(v: unknown): T {
  if (typeof v === "string") return JSON.parse(v) as T;
  return v as T;
}

function mapBook(row: Record<string, unknown>): Book {
  return {
    id: String(row.slug),
    title: asJson(row.title),
    author: String(row.author),
    category: asJson(row.category),
    tier: String(row.tier) as PlanId,
    pages: Number(row.pages),
    year: Number(row.year),
    rating: Number(row.rating),
    copies: Number(row.copies),
    borrowed: Number(row.borrowed),
    summary: asJson(row.summary),
    palette: asJson(row.palette),
  };
}

function mapPlan(row: Record<string, unknown>): Plan {
  return {
    id: String(row.id),
    name: asJson(row.name),
    price: Number(row.price),
    period: asJson(row.period),
    featured: Boolean(row.featured),
    blurb: asJson(row.blurb),
    features: asJson(row.features),
  };
}

export async function listPlans(): Promise<Plan[]> {
  const { rows } = await query("SELECT * FROM plans ORDER BY price ASC");
  return rows.map(mapPlan);
}

export async function getPlan(id: string): Promise<Plan | null> {
  const { rows } = await query("SELECT * FROM plans WHERE id = $1", [id]);
  return rows[0] ? mapPlan(rows[0]) : null;
}

export async function listBooks(): Promise<Book[]> {
  const { rows } = await query("SELECT * FROM books ORDER BY title->>'en' ASC");
  return rows.map(mapBook);
}

export async function getBook(slug: string): Promise<Book | null> {
  const { rows } = await query("SELECT * FROM books WHERE slug = $1", [slug]);
  return rows[0] ? mapBook(rows[0]) : null;
}

export async function listMembers(): Promise<Member[]> {
  const { rows } = await query(
    `SELECT id, user_id, name, email, plan_id, status, joined, books_count
     FROM members ORDER BY joined DESC`,
  );
  return rows.map((r) => ({
    id: String(r.id),
    userId: r.user_id ? String(r.user_id) : null,
    name: String(r.name),
    email: String(r.email),
    plan: String(r.plan_id),
    status: r.status as Member["status"],
    joined: new Date(String(r.joined)).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    }),
    books: Number(r.books_count),
  }));
}

export async function listPayments(): Promise<Payment[]> {
  const { rows } = await query(
    `SELECT p.id, p.member_id, p.plan_id, p.amount, p.method, p.status, p.paid_at,
            m.name AS member_name, pl.name AS plan_name
     FROM payments p
     JOIN members m ON m.id = p.member_id
     JOIN plans pl ON pl.id = p.plan_id
     ORDER BY p.paid_at DESC`,
  );
  return rows.map((r) => {
    const planName = asJson<{ en: string }>(r.plan_name);
    return {
      id: String(r.id),
      memberId: String(r.member_id),
      member: String(r.member_name),
      planId: String(r.plan_id),
      plan: planName.en,
      amount: Number(r.amount),
      method: String(r.method),
      status: r.status as Payment["status"],
      date: new Date(String(r.paid_at)).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  });
}

export async function getOverviewStats() {
  const [members, books, borrowed, revenue] = await Promise.all([
    query<{ c: string }>("SELECT COUNT(*)::text AS c FROM members"),
    query<{ c: string }>("SELECT COUNT(*)::text AS c FROM books"),
    query<{ c: string }>("SELECT COALESCE(SUM(borrowed),0)::text AS c FROM books"),
    query<{ c: string }>(
      "SELECT COALESCE(SUM(amount),0)::text AS c FROM payments WHERE status = 'paid'",
    ),
  ]);
  return {
    members: Number(members.rows[0].c),
    books: Number(books.rows[0].c),
    borrowed: Number(borrowed.rows[0].c),
    revenue: Number(revenue.rows[0].c),
  };
}

export async function findUserByLogin(login: string) {
  const { rows } = await query<{
    id: string;
    email: string;
    student_id: string;
    password_hash: string;
    role: "ADMIN" | "STUDENT";
    name: string;
    department: string | null;
  }>(
    `SELECT id, email, student_id, password_hash, role, name, department
     FROM users
     WHERE email = $1 OR student_id = $1
     LIMIT 1`,
    [login.trim()],
  );
  return rows[0] ?? null;
}
