"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trees, Users, Heart, Briefcase, Home } from "lucide-react";
import Image from "next/image";

const WhatWeDo: React.FC = () => {
  const programs = [
    {
      icon: Trees,
      title: "Environmental Conservation",
      description:
        "We work tirelessly to protect and restore our environment through tree plantation drives, waste management initiatives, and sustainability education. Our comprehensive environmental programs aim to create greener communities and combat climate change through grassroots action and community engagement.",
      color: "bg-green-500",
    },
    {
      icon: Heart,
      title: "Women Empowerment",
      description:
        "Supporting women's rights, economic independence, and leadership development through skill training, microfinance programs, and advocacy. We believe in creating opportunities for women to become self-reliant and confident contributors to their communities and families.",
      color: "bg-pink-500",
    },
    {
      icon: Users,
      title: "Children's Welfare",
      description:
        "Ensuring every child has access to education, healthcare, and a safe environment to grow. Our programs focus on child protection, educational support, nutritional assistance, and creating safe spaces where children can learn, play, and develop their full potential.",
      color: "bg-purple-500",
    },
    {
      icon: Home,
      title: "Community Development",
      description:
        "Building stronger, more resilient communities through infrastructure development, capacity building, and social cohesion programs. We work closely with local leaders to identify needs and implement sustainable solutions that benefit entire communities.",
      color: "bg-blue-500",
    },
  ];

  const employmentPrograms = [
    {
      icon: Heart,
      title: "Supporting Widows",
      description:
        "Providing employment opportunities and financial independence to widows through skill development programs, small business loans, and sustainable livelihood projects.",
      placeholder: "/images/WIDOW_SUPPORT.jpg",
      color: "bg-rose-500",
    },
    {
      icon: Users,
      title: "Orphan Care & Employment",
      description:
        "Creating pathways for orphaned youth through vocational training, mentorship programs, and job placement assistance to build secure, independent futures.",
      placeholder: "/images/ORPHAN_CARE.jpg",
      color: "bg-indigo-500",
    },
    {
      icon: Briefcase,
      title: "Elderly Employment",
      description:
        "Recognizing the value of elderly wisdom and experience by providing suitable employment opportunities that maintain dignity while ensuring financial security.",
      placeholder: "/images/ELDERLY_EMPLOYMENT.jpg",
      color: "bg-amber-500",
    },
  ];

  const imageGallery = [
    {
      placeholder: "/images/PLACEHOLDER_ENV_WORK_1.jpg",
      title: "Environmental Work",
      description: "Tree plantation and environmental awareness",
    },
    {
      placeholder: "/images/PLACEHOLDER_WOMEN.jpg",
      title: "Women Training",
      description: "Skill development and empowerment programs",
    },
    {
      placeholder: "/images/PLACEHOLDER_CHILDREN_EDUCATION.jpg",
      title: "Children Education",
      description: "Educational support and child welfare",
    },
    {
      placeholder: "/images/PLACEHOLDER_COMMUNITY_BUILDING.jpg",
      title: "Community Building",
      description: "Infrastructure and social development",
    },
  ];

  const products = [
    {
      placeholder: "/images/AGARBATTI_PRODUCTION.jpg",
      title: "Traditional Agarbatti Production",
      description:
        "Our widows create high-quality incense sticks using traditional methods and natural ingredients. This sustainable livelihood program provides them with steady income while preserving cultural craftsmanship and supporting their families.",
      features: [
        "100% Natural Ingredients",
        "Traditional Methods",
        "Quality Assured",
        "Supporting Widows",
      ],
    },
    {
      placeholder: "/images/GHEE_PRODUCTION.jpg",
      title: "Pure Ghee Manufacturing",
      description:
        "Produced by skilled widows using time-honored techniques, our pure ghee maintains traditional quality standards while creating meaningful employment. Each product represents economic empowerment and community support.",
      features: [
        "Pure & Traditional",
        "Handcrafted Quality",
        "Community Made",
        "Economic Empowerment",
      ],
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section
        className="py-40 bg-gradient-to-br from-green-600 to-blue-600 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.5)), url('/images/WhatWeDo.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            What We Do
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl opacity-90 max-w-3xl mx-auto"
          >
            Discover our comprehensive programs and initiatives designed to
            create sustainable impact in communities across the globe.
          </motion.p>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div
                  className={`w-16 h-16 ${program.color} rounded-full flex items-center justify-center mb-6`}
                >
                  <program.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {program.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {program.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Employment Programs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Providing Employment & Hope
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in creating sustainable livelihoods for those who need
              it most - widows, orphans, and elderly individuals who deserve
              dignity and financial independence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {employmentPrograms.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-gray-200 relative">
                  <Image
                    src={program.placeholder}
                    alt={program.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                      const sibling = img.nextElementSibling as HTMLElement;
                      if (sibling) sibling.style.display = "flex";
                    }}
                  />

                  <div className="hidden w-full h-full bg-gray-100 items-center justify-center text-gray-500">
                    {program.placeholder}
                  </div>
                </div>
                <div className="p-6">
                  <div
                    className={`w-12 h-12 ${program.color} rounded-full flex items-center justify-center mb-4`}
                  >
                    <program.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {program.title}
                  </h3>
                  <p className="text-gray-600">{program.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Work in Action
            </h2>
            <p className="text-xl text-gray-600">
              Visual stories of impact and transformation in communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {imageGallery.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-gray-200 relative">
                  <Image
                    src={item.placeholder}
                    alt={item.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                      const sibling = img.nextElementSibling as HTMLElement;
                      if (sibling) sibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-full h-full bg-gray-100 items-center justify-center text-gray-500 text-sm text-center px-2">
                    {item.placeholder}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Made with Love & Tradition
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our products are more than just items - they represent hope,
              dignity, and economic empowerment for the women who create them
              with their skilled hands and caring hearts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="h-64 bg-gray-200 relative">
                  <Image
                    src={product.placeholder}
                    alt={product.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                      const sibling = img.nextElementSibling as HTMLElement;
                      if (sibling) sibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-full h-full bg-gray-100 items-center justify-center text-gray-500 text-center px-4">
                    {product.placeholder}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {product.title}
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {product.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default WhatWeDo;

