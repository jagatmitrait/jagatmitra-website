'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes: no header/footer
    return <>{children}</>;
  }

  // Regular routes: include header/footer
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {children}
      </main>
      <Footer />
    </>
  );
}