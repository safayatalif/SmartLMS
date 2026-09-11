import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.user) redirect("/sign-in");
  if (session.user.role !== "ADMIN") redirect("/books");

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
