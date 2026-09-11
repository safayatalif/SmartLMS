import { AdminPlansClient } from "@/components/admin/AdminPlansClient";
import { listPlans } from "@/lib/data";

export default async function AdminPlansPage() {
  const plans = await listPlans();
  return <AdminPlansClient plans={plans} />;
}
