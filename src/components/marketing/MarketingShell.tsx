"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
