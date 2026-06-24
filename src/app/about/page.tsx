/* src/app/about/page.tsx */

'use client';

import React from 'react';
import AboutSection from '@/components/AboutSection';
import Leadership from '@/components/Leadership';
import Affiliations from '@/components/Affiliations';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <main className="min-h-screen">
      
      {/* Page Header */}
      <section className="py-40 bg-gradient-to-br from-green-600 to-blue-600 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('/images/team-collaboration.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl opacity-90 max-w-3xl mx-auto"
          >
            Learn more about our mission, vision, and the dedicated team working 
            to create positive change in communities worldwide.
          </motion.p>
        </div>
      </section>

      <AboutSection />
      <Leadership />
      <Affiliations />
    </main>
  );
}

