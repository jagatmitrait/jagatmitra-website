'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from './ui/Card';
import { AnimatedSection } from './ui/AnimatedSection';
import { FaLinkedin } from 'react-icons/fa';

const Leadership: React.FC = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'laptop'>('laptop');

  // Detect device type
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('laptop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const leaders = [
    {
      name: "Dr. Gaurav Aggarwal",
      position: "CHAIRMAN",
      description: "A public health expert with UN experience, committed to social justice and welfare. Jagatmitra Foundation reflects his vision to uplift children, women, and the environment.",
      image: "/images/leaders/chairman.png",
      social: {
        linkedin: "https://www.linkedin.com/in/dr-gaurav-aggarwal-2b0a298?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      }
    },
    {
      name: "Ms. Akansha",
      position: "DIRECTOR",
      description: "Oversees the foundation's daily operations with a focus on strategic ideas and action. Plays a key role in driving environmental programs and building support systems for women and children.",
      image: "/images/leaders/chairman.png",
      social: {
        linkedin: "https://www.linkedin.com/in/akansha-phore-26a02b217?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      }
    }
  ];

  const teamMembers = [
    {
      name: "Mr. Ajay Kumar",
      position: "SECRETARY",
      description: "Ensures smooth operations and effective project management, playing a vital role in turning goals into actionable particularly in women's empowerment initiatives."
    },
    {
      name: "Ms. Renu",
      position: "TREASURER",
      description: "Oversees all the financial operations within the foundation while ensuring that the resources are used responsibly to support environmental efforts and programs for widows and orphans."
    },
    {
      name: "Mr. Chavvi Goyal",
      position: "MEMBER",
      description: "Actively supports the foundation in community engagement and project implementation, playing a key role in creating lasting, positive change for those we serve."
    },
    {
      name: "Ms. Ajayta Chanana",
      position: "MEMBER",
      description: "Provides our team valuable support and insights that strengthen our outreach efforts and enhance the impact of our programs on the ground."
    }
  ];

  // Dynamic grid configurations based on device
  const getGridConfig = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          leadersGrid: 'grid-cols-1',
          teamGrid: 'grid-cols-1 sm:grid-cols-2',
          spacing: 'gap-4',
          padding: 'px-4'
        };
      case 'tablet':
        return {
          leadersGrid: 'grid-cols-1 sm:grid-cols-2',
          teamGrid: 'grid-cols-2 lg:grid-cols-3',
          spacing: 'gap-6',
          padding: 'px-6'
        };
      default: // laptop
        return {
          leadersGrid: 'grid-cols-1 lg:grid-cols-2',
          teamGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
          spacing: 'gap-8',
          padding: 'px-4'
        };
    }
  };

  const config = getGridConfig();

  // Handle social link clicks with preventDefault
  const handleSocialClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string, platform: string) => {
    e.preventDefault();
    
    if (url === '#') {
      // Handle placeholder links
      alert(`${platform} profile coming soon!`);
      return;
    }

    // Handle external links (LinkedIn in this case)
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handle image errors with fallback
  const handleImageError = (leaderName: string) => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4ade80;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#16a34a;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="80" fill="url(#grad1)"/>
        <circle cx="80" cy="60" r="25" fill="white" fill-opacity="0.9"/>
        <path d="M125 125C125 95.3 101.7 80 80 80C58.3 80 35 95.3 35 125H125Z" fill="white" fill-opacity="0.9"/>
        <text x="80" y="145" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle">${leaderName.split(' ')[0]}</text>
      </svg>
    `)}`;
  };

  return (
    <section className={`py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white ${config.padding}`}>
      <div className="container mx-auto">
        {/* Header */}
        <AnimatedSection className="text-center mb-8 md:mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main heading with blue gradient */}
            <h2 className={`
              font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent
              ${deviceType === 'mobile' 
                ? 'text-3xl leading-tight' 
                : deviceType === 'tablet' 
                  ? 'text-4xl' 
                  : 'text-5xl'
              }
            `}>
              Leaders Behind the Mission
            </h2>
            
            {/* Green underline */}
            <div className="flex justify-center mb-6">
              <div className={`
                h-1 bg-gradient-to-r from-green-500 to-teal-400 rounded-full
                ${deviceType === 'mobile' ? 'w-20' : deviceType === 'tablet' ? 'w-24' : 'w-28'}
              `}></div>
            </div>
            
            {/* Subtitle */}
            <p className={`
              text-gray-600 max-w-2xl mx-auto font-medium
              ${deviceType === 'mobile' 
                ? 'text-sm px-4' 
                : deviceType === 'tablet' 
                  ? 'text-base px-8' 
                  : 'text-lg'
              }
            `}>
              Meet the dedicated individuals driving positive change
            </p>
          </motion.div>
        </AnimatedSection>

        {/* Main Leaders */}
        <div className={`grid ${config.leadersGrid} ${config.spacing} mb-8 md:mb-12 lg:mb-16`}>
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="text-center h-full group">
                <motion.div
                  whileHover={deviceType !== 'mobile' ? { scale: 1.05 } : {}}
                  className="relative mb-4 md:mb-6"
                >
                  {/* Enhanced container for transparent images */}
                  <div className={`
                    ${deviceType === 'mobile' ? 'w-32 h-32' : deviceType === 'tablet' ? 'w-36 h-36' : 'w-40 h-40'} 
                    mx-auto relative
                  `}>
                    {/* Background circle with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-white rounded-full shadow-2xl ring-4 ring-green-200 group-hover:ring-green-400 transition-all duration-300"></div>
                    
                    {/* Image container */}
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-contain p-3 md:p-4 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-md"
                        style={{
                          mixBlendMode: 'multiply',
                        }}
                        onError={(e) => {
                          e.currentTarget.src = handleImageError(leader.name);
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Position badge */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className={`
                      bg-green-600 text-white rounded-full font-semibold shadow-lg
                      ${deviceType === 'mobile' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'}
                    `}>
                      {leader.position}
                    </div>
                  </div>
                </motion.div>

                <h3 className={`
                  font-bold text-gray-900 mb-3 md:mb-4 mt-6 md:mt-8
                  ${deviceType === 'mobile' ? 'text-xl' : 'text-2xl'}
                `}>
                  {leader.name}
                </h3>

                <p className={`
                  text-gray-700 leading-relaxed mb-4 md:mb-6
                  ${deviceType === 'mobile' ? 'text-sm px-2' : 'text-base'}
                `}>
                  {leader.description}
                </p>

                {/* Social Links */}
                <div className={`flex justify-center ${deviceType === 'mobile' ? 'space-x-3' : 'space-x-4'}`}>
                  {Object.entries(leader.social).map(([platform, url]) => (
                    <motion.a
                      key={platform}
                      href={url}
                      onClick={(e) => handleSocialClick(e, url, platform)}
                      whileHover={deviceType !== 'mobile' ? { scale: 1.2, rotate: 5 } : {}}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        bg-gray-100 hover:bg-green-600 rounded-full flex items-center justify-center 
                        transition-all duration-300 shadow-md hover:shadow-lg group cursor-pointer
                        ${deviceType === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'}
                      `}
                    >
                      <FaLinkedin className={`
                        text-gray-600 group-hover:text-white transition-colors
                        ${deviceType === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'}
                      `} />
                    </motion.a>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <AnimatedSection className="mb-8 md:mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-4 md:p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-green-500 relative overflow-hidden"
          >
            {/* Decorative background element */}
            <div className={`
              absolute top-0 right-0 bg-gradient-to-bl from-green-100 to-transparent rounded-full opacity-50
              ${deviceType === 'mobile' ? 'w-20 h-20 -mr-10 -mt-10' : 'w-32 h-32 -mr-16 -mt-16'}
            `}></div>
            
            <p className={`
              text-gray-700 leading-relaxed text-center italic relative z-10
              ${deviceType === 'mobile' ? 'text-sm' : deviceType === 'tablet' ? 'text-base' : 'text-lg'}
            `}>
              &ldquo;The Jagat Mitra Foundation is guided by a passionate and dedicated leadership 
              team committed to fostering a sustainable future and empowering vulnerable 
              communities. Our organization focuses on environmental conservation and 
              simultaneously champions the cause of women&rsquo;s empowerment, including 
              support for widows and orphans.&rdquo;
            </p>
          </motion.div>
        </AnimatedSection>

        {/* Team Members */}
        <div className={`grid ${config.teamGrid} ${config.spacing}`}>
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`
                text-center h-full bg-gradient-to-br from-green-600 to-green-700 text-white 
                hover:from-green-700 hover:to-green-800 transition-all duration-300 
                shadow-lg hover:shadow-xl
                ${deviceType !== 'mobile' ? 'transform hover:-translate-y-2' : ''}
              `}>
                <div className="mb-4">
                  <h4 className={`font-bold mb-2 ${
                    deviceType === 'mobile' 
                      ? 'text-lg' 
                      : deviceType === 'tablet' 
                        ? 'text-lg' 
                        : 'text-xl'
                  }`}>
                    {member.name}
                  </h4>
                  <div className={`
                    inline-block bg-white/20 backdrop-blur-sm rounded-full font-semibold border border-white/30
                    ${deviceType === 'mobile' 
                      ? 'px-3 py-1 text-xs' 
                      : deviceType === 'tablet' 
                        ? 'px-3 py-1 text-xs' 
                        : 'px-4 py-2 text-sm'
                    }
                  `}>
                    {member.position}
                  </div>
                </div>
                <p className={`
                  opacity-90 leading-relaxed
                  ${deviceType === 'mobile' 
                    ? 'text-sm px-2' 
                    : deviceType === 'tablet' 
                      ? 'text-sm' 
                      : 'text-sm'
                  }
                `}>
                  {member.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;


