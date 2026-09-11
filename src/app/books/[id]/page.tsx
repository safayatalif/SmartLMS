import { BookDetailClient } from "@/components/BookDetailClient";
import { getBook, listPlans } from "@/lib/data";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [book, plans] = await Promise.all([getBook(id), listPlans()]);
  return <BookDetailClient book={book} plans={plans} />;
}
