import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-xs tracking-[0.2em] uppercase text-wine">404</p>
      <h1 className="font-display text-4xl">This shelf is empty.</h1>
      <Link href="/" className="rounded-full bg-ink px-5 py-2 text-sm text-paper">
        Back to SmartLMS
      </Link>
    </div>
  );
}
