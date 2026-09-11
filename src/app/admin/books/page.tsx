import { AdminBooksClient } from "@/components/admin/AdminBooksClient";
import { listBooks, listPlans } from "@/lib/data";

export default async function AdminBooksPage() {
  const [books, plans] = await Promise.all([listBooks(), listPlans()]);
  return <AdminBooksClient books={books} plans={plans} />;
}
