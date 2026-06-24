'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatedSection } from './ui/AnimatedSection';
import { Users, Heart, Lightbulb, Target, TreePine, Hand, Award, Globe, Sparkles, Star, LucideIcon } from 'lucide-react';

// Type definitions
interface CoreGoal {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgPattern: string;
}

interface ImpactStat {
  number: number;
  label: string;
  icon: LucideIcon;
  color: string;
}

interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  accentColor: string;
}

interface ValueCardProps {
  value: Value;
  index: number;
}

interface GoalCardProps {
  goal: CoreGoal;
  index: number;
}

interface ImpactStatProps {
  stat: ImpactStat;
  index: number;
}

const AboutSection = () => {
  // Optimized Counter animation hook
  const useCountUp = (end: number, duration: number = 2000, delay: number = 0): [number, React.Dispatch<React.SetStateAction<boolean>>] => {
    const [count, setCount] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
      if (!isVisible) return;

      const startTime = Date.now() + delay;
      let animationFrame: number;

      const updateCount = () => {
        const now = Date.now();
        if (now < startTime) {
          animationFrame = requestAnimationFrame(updateCount);
          return;
        }

        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOutCubic * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };

      animationFrame = requestAnimationFrame(updateCount);
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, delay, isVisible]);

    return [count, setIsVisible];
  };

  // Memoized data arrays to prevent re-creation on each render
const coreGoals = useMemo(() => [
  {
    title: "Unleash Women's Potential",
    description: "Education, vocational mastery, health empowerment, and financial independence — because no woman should ever be held back.",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    bgPattern: "bg-pink-50"
  },
  {
    title: "Give Every Child a Future",
    description: "Quality education, nutrition, safety, and love — the non-negotiables every child deserves from day one.",
    icon: Users,
    color: "from-blue-500 to-cyan-600",
    bgPattern: "bg-blue-50"
  },
  {
    title: "Protect Our Only Planet",
    description: "Mass tree planting, climate literacy, and community conservation — fighting for the earth before it's too late.",
    icon: TreePine,
    color: "from-green-500 to-emerald-600",
    bgPattern: "bg-green-50"
  },
  {
    title: "Honour Our Elders",
    description: "Healthcare access, social connection, and age-friendly dignity — because those who built our world deserve our best care.",
    icon: Hand,
    color: "from-purple-500 to-violet-600",
    bgPattern: "bg-purple-50"
  },
  {
    title: "Break the Cycle of Poverty",
    description: "Skills, livelihoods, and community-powered resources — dismantling poverty one family at a time.",
    icon: Target,
    color: "from-orange-500 to-red-600",
    bgPattern: "bg-orange-50"
  },
  {
    title: "Build Unstoppable Alliances",
    description: "Governments, corporations, and global bodies — united behind a single mission to amplify impact at scale.",
    icon: Globe,
    color: "from-indigo-500 to-purple-600",
    bgPattern: "bg-indigo-50"
  },
  {
    title: "Lead the SDG Revolution",
    description: "UN-aligned, CSR-certified, globally recognised — driving measurable progress on the world's most urgent goals.",
    icon: Award,
    color: "from-teal-500 to-green-600",
    bgPattern: "bg-teal-50"
  }
], []);

  const impactStats = useMemo(() => [
    { number: 10000, label: "Trees Planted", icon: TreePine, color: "from-green-400 to-emerald-500" },
    { number: 3000, label: "Women Empowered", icon: Users, color: "from-pink-400 to-rose-500" },
    { number: 2500, label: "Children Supported", icon: Heart, color: "from-blue-400 to-cyan-500" },
    { number: 1200, label: "Elderly Cared For", icon: Hand, color: "from-purple-400 to-violet-500" },
  ], []);

  const values = useMemo(() => [
    {
      icon: Users,
      title: "Children",
      description: "Ensuring every child has the right to education, nutrition, protection, and a safe environment to grow and thrive.",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      accentColor: "border-blue-200"
    },
    {
      icon: Heart,
      title: "Women",
      description: "Empowering women through awareness, legal support, health initiatives, and skill development to help them become self-reliant and confident.",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      accentColor: "border-pink-200"
    },
    {
      icon: Lightbulb,
      title: "Environment",
      description: "Advocating for sustainable living, climate action, and environmental protection to safeguard our planet for future generations.",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      accentColor: "border-green-200"
    }
  ], []);

  // Optimized animation variants to prevent object recreation
  const fadeInUp = useMemo(() => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true }
  }), []);

  const scaleIn = useMemo(() => ({
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true }
  }), []);

  // Memoized components for frequently used elements
  const BackgroundPattern = useMemo(() => (
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-32 sm:w-52 md:w-72 h-32 sm:h-52 md:h-72 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 sm:bottom-40 right-4 sm:right-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl"></div>
    </div>
  ), []);

  // Memoized sections to prevent unnecessary re-renders
  const AboutUsSection = useMemo(() => (
    <AnimatedSection className="mb-12 sm:mb-16 lg:mb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Left Side - Enhanced Image Card with responsive sizing */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative">
            {/* Floating Elements - Responsive positioning */}
            <motion.div
              animate={{ y: [-20, 20, -20] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 sm:-top-8 -left-4 sm:-left-8 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl sm:rounded-2xl shadow-xl z-10 flex items-center justify-center"
            >
              <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
            </motion.div>
            
            <motion.div
              animate={{ y: [20, -20, 20] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-3 sm:-bottom-6 -right-3 sm:-right-6 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full shadow-lg z-10 flex items-center justify-center"
            >
              <Heart className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </motion.div>

            {/* Main Image - Responsive sizing with Next.js Image */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 z-10"></div>
              <div className="relative w-full h-64 sm:h-80 md:h-96">
                <Image
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Jagatmitra Foundation Team"
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-700"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20"></div>
              
              {/* Overlay Content - Responsive text sizes */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-30">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">Our Dedicated Team</h3>
                <p className="text-white/90 text-xs sm:text-sm">Working together for a better tomorrow</p>
              </div>
            </motion.div>

            {/* Stats Badge - Responsive positioning */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute top-12 sm:top-20 -right-4 sm:-right-8 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 z-20"
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">5+</div>
                <div className="text-xs font-medium text-gray-600">Years of Impact</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Enhanced Content with responsive spacing */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6 sm:space-y-8"
        >
          <div>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "auto" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-block"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                About Jagatmitra Foundation
              </h2>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full mb-6 sm:mb-8"
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100"
            >
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
  <span className="font-semibold text-green-600">Jagatmitra Foundation</span> is a Section 8 non-profit, founded in 2020, on one unshakeable belief: <span className="font-semibold text-blue-600">every human being deserves dignity, opportunity, and a healthy planet.</span> We don&apos;t just raise awareness — we show up, roll up our sleeves, and get to work.
</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-100"
            >
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
  Backed by <span className="font-semibold text-purple-600">12A & 80G Income Tax certifications</span> (all donations are 100% tax-exempt) and <span className="font-semibold text-pink-600">CSR-1 certified</span> — making us the ideal partner for corporations seeking meaningful, audited social impact.
</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100"
            >
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
  Recognised by the <span className="font-semibold text-blue-600">United Nations (UNPP, UNDESA & UNGM)</span> — authorising us to collaborate with 23 international organisations on global development goals. Local roots. Global reach.
</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-0.5 rounded-xl sm:rounded-2xl"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <p className="text-gray-800 font-medium leading-relaxed text-sm sm:text-base">
  &ldquo;We don&apos;t wait for the world to change. We go into the streets, the villages, and the homes — and we change it ourselves.&rdquo;
</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  ), []);

  const VisionMissionSection = useMemo(() => (
    <AnimatedSection className="mb-12 sm:mb-16 lg:mb-20">
      <div className="text-center mb-8 sm:mb-12">
        <motion.h2
          {...fadeInUp}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          Our Vision & Mission
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "120px" }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-1.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full mx-auto"
        />
      </div>

      <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 overflow-hidden min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
        {/* Responsive colorful drops */}
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 sm:top-20 left-16 sm:left-32 w-8 sm:w-12 md:w-16 h-12 sm:h-16 md:h-24 bg-red-400 rounded-full opacity-80 blur-sm"
        ></motion.div>
        <motion.div
          animate={{ y: [15, -15, 15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-16 sm:top-32 right-20 sm:right-40 w-6 sm:w-8 md:w-12 h-10 sm:h-12 md:h-20 bg-orange-400 rounded-full opacity-80 blur-sm"
        ></motion.div>
        <motion.div
          animate={{ x: [-8, 8, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 sm:top-40 left-10 sm:left-20 w-5 sm:w-6 md:w-10 h-8 sm:h-10 md:h-16 bg-blue-400 rounded-full opacity-80 blur-sm"
        ></motion.div>
        <motion.div
          animate={{ x: [8, -8, 8] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-18 sm:top-36 right-12 sm:right-24 w-4 sm:w-5 md:w-8 h-7 sm:h-8 md:h-14 bg-green-400 rounded-full opacity-80 blur-sm"
        ></motion.div>

        {/* Real Hands Silhouette Behind Circles - Responsive sizing with Next.js Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 flex justify-center items-center"
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative w-[200px] sm:w-[350px] lg:w-[500px] h-[160px] sm:h-[280px] lg:h-[400px] opacity-25"
          >
            <Image
              src="/images/hands-silhouette.png"
              alt="Hands Silhouette"
              fill
              className="object-contain filter grayscale"
              priority={false}
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 relative z-10 pt-8">
          {/* Vision Circle - Responsive sizing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -100 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Outer Drop Shadow for Vision Circle - Responsive */}
              <div className="absolute inset-0 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-red-600/40 rounded-full blur-3xl transform translate-y-4 sm:translate-y-6 translate-x-1 sm:translate-x-2"></div>
              
              {/* Vision Circle - Responsive with better mobile text sizing */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-2xl flex flex-col justify-center items-center text-white p-3 sm:p-4 lg:p-6 text-center overflow-hidden"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Decorative inner circles - Responsive */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:right-8 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 bg-red-400/30 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ scale: [1, 0.8, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-6 sm:left-8 lg:left-12 w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 bg-pink-400/30 rounded-full"
                ></motion.div>
                
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">VISION</h3>
               <p className="text-xs sm:text-sm lg:text-base leading-tight sm:leading-relaxed opacity-95 px-1 sm:px-2 max-w-[140px] sm:max-w-none">
  A world where no child goes to bed hungry, no woman is denied her rights, and no community is left behind — where humanity and nature thrive together.
</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Mission Circle - Responsive sizing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Outer Drop Shadow for Mission Circle - Responsive */}
              <div className="absolute inset-0 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-green-600/40 rounded-full blur-3xl transform translate-y-4 sm:translate-y-6 translate-x-1 sm:translate-x-2"></div>
              
              {/* Mission Circle - Responsive with better mobile text sizing */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl flex flex-col justify-center items-center text-white p-3 sm:p-4 lg:p-6 text-center overflow-hidden"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Decorative inner circles - Responsive */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                  className="absolute top-4 sm:top-6 lg:top-10 left-4 sm:left-6 lg:left-10 w-10 sm:w-16 lg:w-20 h-10 sm:h-16 lg:h-20 bg-green-400/20 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ scale: [1, 0.7, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                  className="absolute bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8 w-7 sm:w-10 lg:w-14 h-7 sm:h-10 lg:h-14 bg-emerald-400/30 rounded-full"
                ></motion.div>
                
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4">MISSION</h3>
                <p className="text-xs sm:text-sm lg:text-base leading-tight sm:leading-relaxed opacity-95 px-1 sm:px-2 max-w-[140px] sm:max-w-none">
  To ignite lasting change by empowering women, protecting children, uplifting the elderly, and healing the environment through bold, on-ground action and global partnerships.
</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  ), [fadeInUp]);

  // Memoized Value card component
  const ValueCard = React.memo<ValueCardProps>(({ value, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      whileHover={{ y: -15, scale: 1.02 }}
      className="group relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity`}></div>
      <div className={`relative ${value.bgColor} rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg group-hover:shadow-2xl transition-all duration-300 border-2 ${value.accentColor} overflow-hidden`}>
        {/* Background Images for all cards */}
        {value.title === "Children" && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl sm:rounded-3xl"
              style={{
                backgroundImage: "url('/images/children.jpg')",
              }}
            ></div>
            <div className="absolute inset-0 bg-blue-50/85 rounded-2xl sm:rounded-3xl"></div>
          </>
        )}
        
        {value.title === "Women" && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl sm:rounded-3xl"
              style={{
                backgroundImage: "url('/images/women.jpg')",
              }}
            ></div>
            <div className="absolute inset-0 bg-pink-50/85 rounded-2xl sm:rounded-3xl"></div>
          </>
        )}

        {value.title === "Environment" && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl sm:rounded-3xl"
              style={{
                backgroundImage: "url('/images/environment-care.jpg')",
              }}
            ></div>
            <div className="absolute inset-0 bg-green-50/85 rounded-2xl sm:rounded-3xl"></div>
          </>
        )}

        {/* Icon - Responsive sizing */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`relative z-10 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br ${value.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl`}
        >
          <value.icon className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
        </motion.div>

        {/* Content - Responsive text */}
        <div className="relative z-10 text-center">
          <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            {value.title}
          </h4>
       <p className="text-gray-700 leading-relaxed text-sm">
  The planet cannot wait. We champion sustainable living, climate action, and conservation — because protecting the environment isn&apos;t a choice, it&apos;s our collective responsibility to every generation that comes after us.
</p>
        </div>

        {/* Decorative Elements - Responsive positioning */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-6 sm:w-8 h-6 sm:h-8 opacity-20"
        >
          <Star className={`w-full h-full text-${value.color.split('-')[1]}-500`} />
        </motion.div>
      </div>
    </motion.div>
  ));

  ValueCard.displayName = 'ValueCard';

  // Memoized Goal card component
  const GoalCard = React.memo<GoalCardProps>(({ goal, index }) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ scale: 1.05, y: -5 }}
        className={`group relative ${index === coreGoals.length - 1 ? 'sm:col-span-2 xl:col-span-1 sm:mx-auto xl:mx-0' : ''}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity`}></div>
        <div className={`relative ${goal.bgPattern} border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
          {/* Background Decoration - Responsive */}
          <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 opacity-10">
            <div className={`w-full h-full bg-gradient-to-br ${goal.color} rounded-full`}></div>
          </div>

          {/* Icon - Responsive sizing */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`relative z-10 w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br ${goal.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}
          >
            <goal.icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
          </motion.div>

          {/* Content - Responsive text */}
          <div className="relative z-10">
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
              {goal.title}
            </h4>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {goal.description}
            </p>
          </div>

          {/* Number Badge - Responsive */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 w-6 sm:w-8 h-6 sm:h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <span className="text-xs font-bold text-gray-600">{index + 1}</span>
          </motion.div>
        </div>
      </motion.div>
    );
  });

  GoalCard.displayName = 'GoalCard';

  // Memoized Impact Stat component
  const ImpactStat = React.memo<ImpactStatProps>(({ stat, index }) => {
    const [count, setIsVisible] = useCountUp(stat.number, 2000, index * 300);
    const IconComponent = stat.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        whileInView={{ 
          opacity: 1, 
          scale: 1, 
          y: 0
        }}
        onViewportEnter={() => setIsVisible(true)}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        whileHover={{ scale: 1.05, y: -5 }}
        className="text-center group"
      >
        {/* Icon with gradient background - Professional icons */}
        <motion.div
          whileHover={{ scale: 1.2, rotate: 10 }}
          className={`w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl group-hover:shadow-2xl transition-shadow`}
        >
          <IconComponent className="w-7 sm:w-8 lg:w-10 h-7 sm:h-8 lg:h-10 text-white" />
        </motion.div>
        
        {/* Number with counting animation - Responsive text */}
        <motion.div
          className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg"
        >
          {count > 0 ? `${count.toLocaleString()}+` : '0+'}
        </motion.div>
        
        <div className="text-white/90 font-medium text-xs sm:text-sm lg:text-base">
          {stat.label}
        </div>
      </motion.div>
    );
  });

  ImpactStat.displayName = 'ImpactStat';

  return (
    <div className="relative overflow-hidden">
      {BackgroundPattern}

      <section className="relative py-10 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* About Us Section */}
          {AboutUsSection}

          {/* Vision & Mission */}
          {VisionMissionSection}

          {/* What We Stand For - Responsive grid */}
          <AnimatedSection className="mb-12 sm:mb-16 lg:mb-24">
            <div className="text-center mb-8 sm:mb-12">
              <motion.h3
                {...fadeInUp}
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
              >
                What We Stand For
              </motion.h3>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100px" }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-1.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full mx-auto mb-4 sm:mb-6"
              />
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
  Three pillars. One purpose. An unstoppable commitment to people and planet.
</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <ValueCard key={value.title} value={value} index={index} />
              ))}
            </div>
          </AnimatedSection>

          {/* Core Goals - Responsive grid layout */}
          <AnimatedSection className="mb-12 sm:mb-16 lg:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <motion.h3
                {...fadeInUp}
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
              >
                Our Core Goals
              </motion.h3>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100px" }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-1.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full mx-auto mb-4 sm:mb-6"
              />
              <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto px-4">
  Seven bold commitments. One relentless drive to make the world fairer, greener, and more humane.
</p>
            </div>

            {/* Responsive grid with centered last item */}
            <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {coreGoals.map((goal, index) => (
                <GoalCard key={goal.title} goal={goal} index={index} />
              ))}
            </div>
          </AnimatedSection>

          {/* Our Impact - Responsive stats layout */}
          <AnimatedSection className="mb-0">
            <div className="text-center mb-8 sm:mb-12">
              <motion.h3
                {...fadeInUp}
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
              >
                Our Impact
              </motion.h3>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-1.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full mx-auto mb-4 sm:mb-6"
              />
              <p className="text-gray-600 text-base sm:text-lg px-4">
  Numbers don&apos;t lie. Here&apos;s what standing up for people and planet actually looks like.
</p>
            </div>

            <motion.div
              {...scaleIn}
              className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-1 sm:p-2 shadow-2xl"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
                {/* Responsive grid: 2x2 on mobile, 4 cols on larger screens */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {impactStats.map((stat, index) => (
                    <ImpactStat key={stat.label} stat={stat} index={index} />
                  ))}
                </div>
              </div>

              {/* Animated background elements - Responsive sizing */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-4 sm:top-8 left-4 sm:left-8 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 bg-white/10 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-10 lg:w-20 h-10 sm:w-16 lg:h-20 bg-white/10 rounded-full"
              ></motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;


