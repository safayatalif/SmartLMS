import type { Metadata } from "next";
import { Fraunces, Noto_Sans_Bengali, Noto_Serif_Bengali, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const notoSansBn = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bn",
  subsets: ["bengali"],
});

const notoSerifBn = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bn",
  subsets: ["bengali"],
});

export const metadata: Metadata = {
  title: "SmartLMS — The library in your pocket",
  description:
    "A student library for Southeast University. Browse stacks, scan your ID, and read on your phone.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${fraunces.variable} ${notoSansBn.variable} ${notoSerifBn.variable} h-full antialiased`}
    >
      <body className="min-h-dvh" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
