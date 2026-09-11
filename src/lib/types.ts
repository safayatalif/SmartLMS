export type PlanId = "basic" | "prime" | "elite" | string;
export type UserRole = "ADMIN" | "STUDENT";
export type MemberStatus = "active" | "pending" | "expired";
export type PaymentStatus = "paid" | "failed";

export type LangText = { en: string; bn: string };
export type LangList = { en: string[]; bn: string[] };

export type Plan = {
  id: string;
  name: LangText;
  price: number;
  period: LangText;
  featured: boolean;
  blurb: LangText;
  features: LangList;
};

export type Book = {
  id: string;
  title: LangText;
  author: string;
  category: LangText;
  tier: PlanId;
  pages: number;
  year: number;
  rating: number;
  copies: number;
  borrowed: number;
  summary: LangText;
  palette: string[];
};

export type Member = {
  id: string;
  name: string;
  email: string;
  plan: PlanId;
  status: MemberStatus;
  joined: string;
  books: number;
  userId?: string | null;
};

export type Payment = {
  id: string;
  member: string;
  memberId: string;
  plan: string;
  planId: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  date: string;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  studentId: string;
  department?: string | null;
};

export function planLabel(plans: Plan[], id: PlanId, lang: "en" | "bn") {
  const plan = plans.find((p) => p.id === id);
  return plan ? plan.name[lang] : String(id);
}
