"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "./ui/AnimatedSection";
import Image from "next/image";

const Affiliations: React.FC = () => {
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "laptop">(
    "laptop"
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType("mobile");
      } else if (width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("laptop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const affiliations = [
    {
      name: "UNDESA",
      fullName:
        "Associated with United Nations Department of Economic and Social Affairs (UN DESA)",
      logo: "/images/affiliations/undesa-logo.png",
      color: "bg-blue-500",
      url: "https://www.un.org/en/desa",
    },
    {
      name: "UN PARTNER PORTAL",
      fullName: "Registered with United Nations Partner Portal (UNPP)",
      logo: "/images/affiliations/unpp-logo.png",
      color: "bg-blue-600",
      url: "https://www.un.org/partnerships",
    },
    {
      name: "NITI Aayog",
      fullName: "Registered with NITI Aayog, Government of India",
      logo: "/images/affiliations/niti-aayog-logo.png",
      color: "bg-orange-500",
      url: "https://www.niti.gov.in",
    },
    {
      name: "CSR",
      fullName:
        "CSR Registration Certified (eligible for Corporate Social Responsibility collaborations)",
      logo: "/images/affiliations/csr-logo.png",
      color: "bg-green-500",
      url: "#",
    },
  ];

  const getGridConfig = () => {
    switch (deviceType) {
      case "mobile":
        return {
          grid: "grid-cols-1 sm:grid-cols-2",
          spacing: "gap-4",
          padding: "px-4",
          logoSize: "w-20 h-20",
          cardPadding: "p-6",
        };
      case "tablet":
        return {
          grid: "grid-cols-2 lg:grid-cols-3",
          spacing: "gap-6",
          padding: "px-6",
          logoSize: "w-24 h-24",
          cardPadding: "p-8",
        };
      default:
        return {
          grid: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
          spacing: "gap-8",
          padding: "px-4",
          logoSize: "w-24 h-24",
          cardPadding: "p-8",
        };
    }
  };

  const config = getGridConfig();

  const handleAffiliationClick = (
    e: React.MouseEvent<HTMLDivElement>,
    url: string,
    name: string
  ) => {
    e.preventDefault();

    if (url === "#") {
      alert(`${name} certification details coming soon!`);
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleBadgeClick = (
    e: React.MouseEvent<HTMLDivElement>,
    badge: string
  ) => {
    e.preventDefault();
    alert(`Learn more about our ${badge} status coming soon!`);
  };

  return (
    <section className={`py-12 md:py-16 lg:py-20 bg-white ${config.padding}`}>
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-8 md:mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <h2 className={`font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent ${deviceType === "mobile" ? "text-3xl leading-tight" : deviceType === "tablet" ? "text-4xl" : "text-5xl"}`}>
              Recognition & Affiliation
            </h2>
            <div className="flex justify-center mb-6">
              <div className={`${deviceType === "mobile" ? "w-20" : deviceType === "tablet" ? "w-24" : "w-28"} h-1 bg-gradient-to-r from-green-500 to-teal-400 rounded-full`}></div>
            </div>
            <p className={`${deviceType === "mobile" ? "text-sm px-4" : deviceType === "tablet" ? "text-base px-8" : "text-lg"} text-gray-600 max-w-2xl mx-auto font-medium`}>
              Trusted partnerships with global organizations and government bodies
            </p>
          </motion.div>
        </AnimatedSection>

        <div className={`grid ${config.grid} ${config.spacing}`}>
          {affiliations.map((affiliation, index) => (
            <motion.div
              key={affiliation.name}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={deviceType !== "mobile" ? { y: -10, scale: 1.02 } : {}}
              className="group cursor-pointer"
              onClick={(e) => handleAffiliationClick(e, affiliation.url, affiliation.name)}
            >
              <div className={`bg-green-100 rounded-xl h-full flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 hover:bg-green-200 transition-all shadow-lg hover:shadow-xl ${config.cardPadding}`}>
                <motion.div whileHover={deviceType !== "mobile" ? { scale: 1.1, rotate: 5 } : {}} className="flex-shrink-0">
                  <Image
                    src={affiliation.logo}
                    alt={affiliation.name}
                    width={96}
                    height={96}
                    className={`${config.logoSize} object-contain`}
                    onError={(e) => {
                      const colorMap: { [key: string]: string } = {
                        "bg-blue-500": "#3b82f6",
                        "bg-blue-600": "#2563eb",
                        "bg-orange-500": "#f97316",
                        "bg-green-500": "#10b981",
                      };

                      e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="96" height="96" rx="16" fill="white" stroke="${colorMap[affiliation.color] || "#3b82f6"}" stroke-width="2"/>
        <text x="48" y="55" text-anchor="middle" fill="${colorMap[affiliation.color] || "#3b82f6"}" font-family="Arial" font-size="14" font-weight="bold">${affiliation.name.charAt(0)}</text>
      </svg>
    `)}`;
                    }}
                  />
                </motion.div>

                <h3 className={`${deviceType === "mobile" ? "text-base" : deviceType === "tablet" ? "text-lg" : "text-xl"} font-bold text-gray-900`}>
                  {affiliation.name}
                </h3>

                <p className={`${deviceType === "mobile" ? "text-xs px-2" : "text-sm"} text-gray-700 leading-relaxed flex-grow`}>
                  {affiliation.fullName}
                </p>

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center bg-green-600 text-white font-semibold rounded-full ${deviceType === "mobile" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"}`}
                >
                  Verified
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatedSection className="mt-8 md:mt-12 lg:mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl text-white text-center ${deviceType === "mobile" ? "p-6" : "p-8"}`}
          >
            <h3 className={`${deviceType === "mobile" ? "text-xl" : deviceType === "tablet" ? "text-2xl" : "text-2xl lg:text-3xl"} font-bold mb-4`}>
              Trusted by Global Organizations
            </h3>
            <p className={`${deviceType === "mobile" ? "text-sm leading-relaxed" : deviceType === "tablet" ? "text-base" : "text-lg"} opacity-90 mb-6`}>
              Our partnerships and certifications demonstrate our commitment to transparency, accountability, and effective social impact.
            </p>
            <div className={`flex flex-wrap justify-center ${deviceType === "mobile" ? "gap-2" : "gap-4"}`}>
              {[
                "UN Registered",
                "Government Certified",
                "CSR Eligible",
                "Transparent Operations",
              ].map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={deviceType !== "mobile" ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleBadgeClick(e, badge)}
                  className={`bg-white/20 rounded-full font-semibold cursor-pointer hover:bg-white/30 transition-all ${deviceType === "mobile" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"}`}
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Affiliations;
