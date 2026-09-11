import { PricingClient } from "@/components/PricingClient";
import { listPlans } from "@/lib/data";

export default async function PricingPage() {
  const plans = await listPlans();
  return <PricingClient plans={plans} />;
}
