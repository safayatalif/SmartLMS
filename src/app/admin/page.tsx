import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";
import { getOverviewStats, listBooks, listMembers, listPlans } from "@/lib/data";

export default async function AdminHomePage() {
  const [stats, members, books, plans] = await Promise.all([
    getOverviewStats(),
    listMembers(),
    listBooks(),
    listPlans(),
  ]);
  return (
    <AdminOverviewClient stats={stats} members={members} books={books} plans={plans} />
  );
}
