import { AdminMembersClient } from "@/components/admin/AdminMembersClient";
import { listMembers, listPlans } from "@/lib/data";

export default async function AdminMembersPage() {
  const [members, plans] = await Promise.all([listMembers(), listPlans()]);
  return <AdminMembersClient members={members} plans={plans} />;
}
