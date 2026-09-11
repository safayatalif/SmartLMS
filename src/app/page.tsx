import { HomeClient } from "@/components/HomeClient";
import { listBooks, listPlans } from "@/lib/data";

export default async function HomePage() {
  const [books, plans] = await Promise.all([listBooks(), listPlans()]);
  return <HomeClient books={books} plans={plans} />;
}
