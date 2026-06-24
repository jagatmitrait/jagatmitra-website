import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConditionalLayout from "@/components/ConditionalLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jagatmitra Foundation - Making a Difference",
  description:
    "Turning hope into impact, one step at a time. Working towards better hygiene, environmental care, and community empowerment.",
  keywords:
    "NGO, social work, environment, hygiene, community development, Jagatmitra Foundation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}