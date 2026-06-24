"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Award,
} from "lucide-react";

// Types
interface ContactInfo {
  icon: typeof Mail;
  title: string;
  details: string;
  subtitle: string;
  color: string;
}

interface OrganizationInfo {
  icon: typeof Globe;
  title: string;
  description: string;
  color: string;
}

// Fixed positions for floating shapes to prevent hydration mismatch
const FLOATING_SHAPE_POSITIONS = [
  { top: 10, left: 20, duration: 14, delay: 0 },
  { top: 25, left: 80, duration: 16, delay: 1 },
  { top: 40, left: 15, duration: 12, delay: 2 },
  { top: 60, left: 70, duration: 18, delay: 0.5 },
  { top: 75, left: 30, duration: 15, delay: 1.5 },
  { top: 85, left: 85, duration: 13, delay: 2.5 },
  { top: 15, left: 60, duration: 17, delay: 3 },
  { top: 50, left: 45, duration: 14, delay: 3.5 },
  { top: 30, left: 90, duration: 16, delay: 4 },
  { top: 70, left: 10, duration: 15, delay: 4.5 },
  { top: 90, left: 55, duration: 13, delay: 0.2 },
  { top: 35, left: 35, duration: 18, delay: 1.2 },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Contact: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoized static data
  const contactInfo = useMemo<ContactInfo[]>(
    () => [
      {
        icon: Mail,
        title: "Email Us",
        details: "support@jagatmitrafoundation.com",
        subtitle: "We'll respond within 24 hours",
        color: "from-blue-500 to-cyan-500",
      },
      {
        icon: Phone,
        title: "Call Us",
        details: "011-45653583",
        subtitle: "Mon-Fri, 9AM-6PM IST",
        color: "from-green-500 to-emerald-500",
      },
      {
        icon: MapPin,
        title: "Registered Office",
        details: "Office no. 220 Global Business Park",
        subtitle: "Zirakpur, Punjab 141003",
        color: "from-purple-500 to-pink-500",
      },
      {
        icon: MapPin,
        title: "Headquarters",
        details: "DG-3/29,Charak Sadan Road,Vikaspuri",
        subtitle: "New Delhi - 110018",
        color: "from-orange-500 to-red-500",
      },
    ],
    []
  );

  const organizationInfo = useMemo<OrganizationInfo[]>(
    () => [
      {
        icon: Globe,
        title: "Global Reach",
        description:
          "Working with communities worldwide to create sustainable change through local initiatives and partnerships.",
        color: "from-indigo-500 to-purple-500",
      },
      {
        icon: Users,
        title: "Community Focus",
        description:
          "Empowering communities through grassroots programs in education, environment, and social development.",
        color: "from-green-500 to-teal-500",
      },
      {
        icon: Award,
        title: "Recognized Impact",
        description:
          "Registered with Government of India and eligible for CSR collaborations with transparent operations.",
        color: "from-yellow-500 to-orange-500",
      },
    ],
    []
  );

  // Fixed FloatingShapes component with deterministic positions
  const FloatingShapes = useMemo(
    () => (
      <>
        {/* Background decorative shapes */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-32 -right-32 w-64 h-64 opacity-20"
          >
            <div className="w-full h-full bg-white rounded-full"></div>
          </motion.div>

          <motion.div
            animate={{
              rotate: -360,
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-20 -left-20 w-40 h-40 opacity-20"
          >
            <div
              className="w-full h-full bg-white"
              style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
            ></div>
          </motion.div>

          {/* Floating mini shapes with fixed positions */}
          {FLOATING_SHAPE_POSITIONS.map((position, i) => (
            <motion.div
              key={`floating-shape-${i}`}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: position.duration,
                repeat: Infinity,
                delay: position.delay,
                ease: "easeInOut",
              }}
              className="absolute w-3 h-3 bg-white opacity-30 rounded-full"
              style={{
                top: `${position.top}%`,
                left: `${position.left}%`,
              }}
            />
          ))}
        </div>
      </>
    ),
    []
  );

  // Don't render until component is mounted to prevent hydration issues
  if (!mounted) {
    return (
      <main className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Creative Page Header */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {FloatingShapes}

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="inline-block mb-8"
          >
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <Mail
                className="w-12 h-12 text-white relative z-10"
                aria-hidden="true"
              />

              {/* Orbiting dots */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
                aria-hidden="true"
              >
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                <div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white"
                  style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                ></div>
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl opacity-90 max-w-3xl mx-auto"
          >
            Connect with us to learn more about our work, explore collaboration
            opportunities, or discover how you can make a meaningful impact in
            communities worldwide.
          </motion.p>
        </div>
      </section>

      {/* Contact Information Cards with Creative Design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
            {contactInfo.map((info) => (
              <motion.div
                key={info.title}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-center relative overflow-hidden">
                  {/* Background gradient decoration */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                    aria-hidden="true"
                  ></div>

                  {/* Floating icon with creative background */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-20 h-20 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative overflow-hidden`}
                  >
                    <div
                      className="absolute inset-0 bg-white/10 backdrop-blur-sm"
                      aria-hidden="true"
                    ></div>
                    <info.icon
                      className="w-10 h-10 text-white relative z-10"
                      aria-hidden="true"
                    />

                    {/* Mini floating decoration */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-white/50 rounded-full"
                      aria-hidden="true"
                    />
                  </motion.div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {info.title}
                  </h3>
                  <p className="text-gray-700 font-medium mb-2">
                    {info.details}
                  </p>
                  <p className="text-sm text-gray-600">{info.subtitle}</p>

                  {/* Corner decoration */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute top-4 right-4 w-6 h-6 border border-dashed border-gray-200 rounded-full opacity-50"
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form and Organization Info */}
          <div className="space-y-16">
            {/* Organization Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Main Info Card */}
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 rounded-3xl text-white relative overflow-hidden">
                {/* Background decoration */}
                <motion.div
                  animate={{
                    rotate: -360,
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full"
                  aria-hidden="true"
                />

                <motion.div
                  animate={{
                    x: [0, 20, 0],
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/10"
                  style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6">
                    Jagatmitra Foundation
                  </h3>
                  <p className="mb-8 opacity-90 text-lg leading-relaxed">
                    &quot;Friend of the World&quot; - We are committed to
                    creating sustainable change through community-driven
                    initiatives that address critical challenges in education,
                    environment, women empowerment, and social development.
                  </p>

                  <ul className="space-y-4" role="list">
                    {[
                      "Registered with Government of India",
                      "UN SDG Aligned Programs",
                      "CSR Partnership Eligible",
                      "Transparent Operations",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 bg-white rounded-full flex-shrink-0"
                          aria-hidden="true"
                        ></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Organization Highlights */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6"
              >
                {organizationInfo.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity`}
                      aria-hidden="true"
                    ></div>

                    <div className="relative z-10 flex items-start space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0`}
                      >
                        <item.icon
                          className="w-7 h-7 text-white"
                          aria-hidden="true"
                        />
                      </motion.div>

                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
