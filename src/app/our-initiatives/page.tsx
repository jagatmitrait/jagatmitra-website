import React from 'react';
import OurInitiativesSection from '@/components/OurInitiativesSection';

export const metadata = {
  title: 'Our Initiatives | Jagatmitra Foundation',
  description:
    'Explore the initiatives under Jagatmitra Foundation that are creating impact, driving innovation, and building a better tomorrow.',
};

export default function OurInitiativesPage() {
  return (
    <main className="min-h-screen">
      <OurInitiativesSection />
    </main>
  );
}