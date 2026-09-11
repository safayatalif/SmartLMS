import { BooksClient } from "@/components/BooksClient";
import { listBooks, listPlans } from "@/lib/data";

export default async function BooksPage() {
  const [books, plans] = await Promise.all([listBooks(), listPlans()]);
  return <BooksClient books={books} plans={plans} />;
}
