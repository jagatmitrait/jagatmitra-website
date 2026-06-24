
/* src/components/Hero.tsx */

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/Button";
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const [isDragging, setIsDragging] = useState(false);

  // Memoize slides to prevent recreation on every render
const slides = useMemo(
  () => [
    {
      title: "Igniting Change. Restoring Dignity.",
      subtitle: "Where compassion meets action — transforming lives across India, one community at a time.",
      image: "/images/image1.png",
    },
    {
      title: "Stronger Communities. Brighter Futures.",
      subtitle: "Rooted in purpose. Driven by people. Building sustainable change from the ground up.",
      image: "/images/community.jpg",
    },
    {
      title: "Every Life Deserves a Fighting Chance.",
      subtitle: "From children to the elderly — we stand for those who need it most.",
      image: "/images/environment.jpg",
    },
  ],
  []
);

  // Preload images for better performance
  useEffect(() => {
    const imagePromises = slides.map((slide) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = slide.image;
      });
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(() => setImagesLoaded(true)); // Still show component even if images fail
  }, [slides]);

  // Memoize slide change handler
  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Memoize social click handler
  const handleSocialClick = useCallback((index: number) => {
    const socialLinks = [
      "https://www.instagram.com/jagatmitra.foundation?igsh=ZXZ5dmpzZ2xidHNq",
      "https://www.linkedin.com/in/jagatmitra-foundation-172439352/",
      "https://www.youtube.com/@jagatmitrafoundation7991",
    ];
    window.open(socialLinks[index], "_blank");
  }, []);

  // Auto-slide timer with proper cleanup
  useEffect(() => {
    if (!imagesLoaded || isDragging) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, imagesLoaded, isDragging]);

  // Memoize social icons to prevent recreation
  const socialIcons = useMemo(() => [FaInstagram, FaLinkedin, FaYoutube], []);

  // Handle image errors
  const handleImageError = useCallback((imageKey: string) => {
    setImageErrors(prev => ({ ...prev, [imageKey]: true }));
  }, []);

  // Fallback SVG for images
  const getFallbackSvg = useCallback((type: 'person' | 'volunteer') => {
    const personSvg = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDIwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjQwIiByeD0iOCIgZmlsbD0iIzRhZGU4MCIvPgo8cGF0aCBkPSJNMTAwIDEwMEMxMTAuNDU3IDEwMCAxMTkgOTEuNDU3IDExOSA4MUMxMTkgNzAuNTQzIDExMC40NTcgNjIgMTAwIDYyQzg5LjU0MyA2MiA4MSA3MC41NDMgODEgODFDODEgOTEuNDU3IDg5LjU0MyAxMDAgMTAwIDEwMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNjAgMTgwQzE2MCAxNDcuNjQ3IDEzMi4zNTMgMTIwIDEwMCAxMjBDNjcuNjQ3IDEyMCA0MCAxNDcuNjQ3IDQwIDE4MEgxNjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";
    const volunteerSvg = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDIwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjQwIiByeD0iOCIgZmlsbD0iIzE1ODAzZCIvPgo8cGF0aCBkPSJNMTAwIDYwTDExMCAxMDBIMTAwTDkwIDEwMEwxMDAgNjBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNTAgMTIwSDY1TDEwMCAxODBMMTM1IDEyMEgxNTBMMTAwIDYwTDUwIDEyMFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";
    return type === 'person' ? personSvg : volunteerSvg;
  }, []);

  // Handle drag end for slider
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const threshold = 50;
    setIsDragging(false);
    
    if (info.offset.x > threshold) {
      // Dragged right - go to previous slide
      setCurrentSlide((prev) => prev === 0 ? slides.length - 1 : prev - 1);
    } else if (info.offset.x < -threshold) {
      // Dragged left - go to next slide
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  }, [slides.length]);

  // Show loading state while images are loading
  if (!imagesLoaded) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="relative h-screen flex flex-col justify-between overflow-hidden"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      dragElastic={0.1}
    >
      {/* Optimized Background Images with lazy loading effect */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              // Remove backgroundAttachment: 'fixed' as it causes performance issues on mobile
            }}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 container mx-auto px-4 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left Side - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }} // Reduced duration
            className="text-white space-y-6 lg:space-y-8 text-center lg:text-left"
          >
            <motion.h1
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }} // Reduced duration and delay
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              key={`subtitle-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }} // Reduced duration and delay
              className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-md mx-auto lg:mx-0"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* Social Icons - Optimized with memoized handlers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }} // Reduced delay
              className="flex space-x-3 justify-center lg:justify-start mt-6 lg:mt-8"
            >
              {socialIcons.map((Icon, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }} // Reduced scale for better performance
                  whileTap={{ scale: 0.98 }} // Reduced scale
                  onClick={() => handleSocialClick(index)}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded border border-white/30 flex items-center justify-center hover:bg-white/20 transition-all duration-200 cursor-pointer"
                  aria-label={`Social link ${index + 1}`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - 2x2 Grid of Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }} // Reduced duration and delay
            className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 h-[300px] sm:h-[400px] lg:h-[500px] w-full max-w-[400px] lg:max-w-[500px] mx-auto"
          >
            {/* Top Left - Image Card */}
            <motion.div
              whileHover={{ scale: 1.01 }} // Reduced scale
              className="bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl overflow-hidden border border-white/20 relative"
            >
              {imageErrors['image2'] ? (
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${getFallbackSvg('person')})` }}
                />
              ) : (
                <Image
                  src="/images/image2.png"
                  alt="Impact image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onError={() => handleImageError('image2')}
                />
              )}
            </motion.div>

            {/* Top Right - Donate Card */}
            <motion.div
              whileHover={{ scale: 1.01 }} // Reduced scale
              className="bg-green-700/95 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 flex flex-col items-center text-center justify-center border border-green-500/30"
            >
              <h3 className="text-white font-bold text-xs sm:text-sm lg:text-lg mb-2 lg:mb-4 leading-tight">
  Your ₹100 today feeds a child, plants a tree, and changes a life.
</h3>
              <Link href="/donate" className="w-full">
                <Button className="bg-white/20 hover:bg-white text-white hover:text-green-600 border border-white/30 hover:border-white font-semibold px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-md lg:rounded-lg transition-all duration-200 w-full text-xs sm:text-sm lg:text-base">
                  Donate
                </Button>
              </Link>
            </motion.div>

            {/* Bottom Left - Enroll Card */}
            <motion.div
              whileHover={{ scale: 1.01 }} // Reduced scale
              className="bg-green-700/95 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 flex flex-col items-center text-center justify-center border border-green-500/30"
            >
              <h3 className="text-white font-bold text-xs sm:text-sm lg:text-lg mb-2 lg:mb-4 leading-tight">
  Be the change you wish to see. Volunteer with us today.
</h3>
              <Link href="/get-involved" className="w-full">
                <Button className="bg-white/20 hover:bg-white text-white hover:text-green-700 border border-white/30 hover:border-white font-semibold px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-md lg:rounded-lg transition-all duration-200 w-full text-xs sm:text-sm lg:text-base">
                  Enroll Now
                </Button>
              </Link>
            </motion.div>

            {/* Bottom Right - Volunteer Image Card */}
            <motion.div
              whileHover={{ scale: 1.01 }} // Reduced scale
              className="bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl overflow-hidden border border-white/20 relative"
            >
              {imageErrors['image3'] ? (
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${getFallbackSvg('volunteer')})` }}
                />
              ) : (
                <Image
                  src="/images/image3.png"
                  alt="Volunteer image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onError={() => handleImageError('image3')}
                />
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators - Bottom Center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }} // Reduced delay
        className="relative z-10 flex justify-center pb-6 lg:pb-8"
      >
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white transition-all duration-300 hover:scale-110 ${
                index === currentSlide ? "bg-white" : "bg-transparent"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Optimized Floating Animation Elements - Reduced complexity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-10, 10, -10] }} // Reduced range
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-2 h-2 sm:w-3 sm:h-3 bg-white/20 rounded-full" // Reduced opacity
        />
        <motion.div
          animate={{ y: [10, -10, 10] }} // Reduced range
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-40 right-20 sm:right-40 w-3 h-3 sm:w-4 sm:h-4 bg-green-400/30 rounded-full" // Reduced opacity
        />
        <motion.div
          animate={{ y: [-15, 15, -15] }} // Reduced range
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-40 left-20 sm:left-40 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400/40 rounded-full" // Reduced opacity
        />
      </div>
    </motion.section>
  );
};

export default Hero;
