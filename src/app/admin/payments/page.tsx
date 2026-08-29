import { AdminPaymentsClient } from "@/components/admin/AdminPaymentsClient";
import { listMembers, listPayments, listPlans } from "@/lib/data";

export default async function AdminPaymentsPage() {
  const [payments, members, plans] = await Promise.all([
    listPayments(),
    listMembers(),
    listPlans(),
  ]);
  return <AdminPaymentsClient payments={payments} members={members} plans={plans} />;
}
