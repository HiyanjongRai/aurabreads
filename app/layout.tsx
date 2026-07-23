import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AuraBeads – Fashion Jewelry",
  description:
    "Trendy, stylish & affordable fashion jewelry for every woman. Earrings, necklaces, bracelets, rings and more. Free shipping on orders over $50.",
  keywords: "fashion jewelry, earrings, necklaces, bracelets, rings, gold jewelry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
