/* src/app/page.tsx */

import React from 'react';
import Hero from '@/components/Hero';
import IssuesSection from '@/components/IssuesSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <IssuesSection />
    </main>
  );
}
