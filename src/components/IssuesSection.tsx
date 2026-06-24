'use client'
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Droplets, Trees, Users, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Issue {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  delay: number;
}

const IssuesSection: React.FC = () => {
  const router = useRouter();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Memoize issues array to prevent recreation
const issues: Issue[] = useMemo(() => [
  {
    id: 1,
    title: "Clean Water & Hygiene: A Right, Not a Privilege.",
    description: "Over 2 billion people lack access to safe drinking water. We intervene at the grassroots  delivering hygiene awareness, clean water access, and sanitation support to communities left behind. Because a healthy life begins with clean hands and safe water.",
    icon: Droplets,
    image: "/images/hygiene.jpg",
    color: "bg-blue-500",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    delay: 0,
  },
  {
    id: 2,
    title: "Healing the Planet, One Tree at a Time.",
    description: "India loses thousands of hectares of green cover every year. We fight back  through mass tree plantation drives, zero-waste community campaigns, and climate action workshops. Every tree we plant is a promise to future generations: we will not leave you a broken world.",
    icon: Trees,
    image: "/images/environment.jpg",
    color: "bg-green-500",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-500",
    delay: 0.1,
  },
  {
    id: 3,
    title: "Choking Cities. Silent Victims. We Act.",
    description: "Air and land pollution are silent killers robbing millions of healthy years. Our on-ground teams run targeted clean-up campaigns, plastic-reduction drives, and environmental literacy programs  turning communities from polluters to protectors.",
    icon: Users,
    image: "/images/pollution.jpg",
    color: "bg-orange-500",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500",
    delay: 0.2,
  },
  {
    id: 4,
    title: "Self-Reliant Communities. Unbreakable Bonds.",
    description: "The strongest safety net is the one woven by neighbours. We build community resilience through skill development, local leadership training, and mutual-aid networks  so that when crisis strikes, no one faces it alone.",
    icon: Heart,
    image: "/images/community.jpg",
    color: "bg-purple-500",
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-500",
    delay: 0.3,
  },
], []);
  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = issues.map((issue, issueIndex) => {
        return new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, issueIndex]));
            resolve();
          };
          img.onerror = () => {
            setLoadedImages(prev => new Set([...prev, issueIndex]));
            resolve();
          };
          img.src = issue.image;
        });
      });

      await Promise.all(imagePromises);
      setImagesLoaded(true);
    };

    loadImages();
  }, [issues]);

  // Memoize navigation handlers
  const handleNavigate = useCallback((path: string): void => {
    router.push(path);
  }, [router]);

  // Memoize error handler
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.currentTarget;
    target.src = `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:0.2" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#grad)"/>
        <circle cx="200" cy="150" r="50" fill="#3B82F6" fill-opacity="0.3"/>
        <text x="200" y="155" text-anchor="middle" fill="#1F2937" font-family="Arial" font-size="16" font-weight="bold">Image</text>
      </svg>
    `)}`;
  }, []);

  // Show loading state
  if (!imagesLoaded) {
    return (
      <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Simplified background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4 sm:mb-6">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
  <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
    THE CRISES WE REFUSE TO IGNORE
  </span>
</h2>
          
          <div className="w-20 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 mx-auto rounded-full" />
          
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-4 sm:mt-6 max-w-2xl mx-auto px-4">
             Real problems. Real people. Real action  because silence is never an option.
          </p>
        </div>

        {/* Issues Grid */}
        <div className="space-y-16 sm:space-y-20 lg:space-y-32">
          {issues.map((issue: Issue, index: number) => (
            <div
              key={issue.id}
              className={`flex flex-col items-center gap-8 sm:gap-10 lg:gap-12 xl:gap-16 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
            >
              {/* Image Section */}
              <div className="w-full lg:w-1/2 relative group max-w-lg lg:max-w-none">
                <div className="relative">
                  {/* Main Image Container */}
                  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl hover:scale-[1.02] transition-transform duration-500">
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${issue.gradientFrom} ${issue.gradientTo} opacity-20 z-10`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20" />
                    
                    <Image
                      src={issue.image}
                      alt={issue.title}
                      width={400}
                      height={384}
                      className={`w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover transition-transform duration-500 ${
                        loadedImages.has(index) ? 'hover:scale-105' : ''
                      }`}
                      priority={index < 2}
                      onError={handleImageError}
                    />

                    {/* Floating Icon */}
                    <div className={`absolute top-3 right-3 sm:top-6 sm:right-6 z-30 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${issue.gradientFrom} ${issue.gradientTo} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300`}>
                      <issue.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                    </div>

                    {/* Simplified Corner Decoration */}
                    <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 z-30">
                      <div className={`w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${issue.gradientFrom} ${issue.gradientTo} rounded-full opacity-60 blur-lg`}></div>
                      <div className={`absolute top-1 left-1 sm:top-2 sm:left-2 w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${issue.gradientFrom} ${issue.gradientTo} rounded-full flex items-center justify-center`}>
                        <div className="flex space-x-0.5 sm:space-x-1">
                          {[0, 1, 2].map((i: number) => (
                            <div
                              key={i}
                              className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Simplified Floating Elements */}
                  <div className={`absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 ${issue.color} opacity-20 rounded-full blur-xl`} />
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 lg:space-y-8 px-4 sm:px-0">
                <div>
                  {/* Simplified Header Elements */}
                  <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 ${issue.color} rounded-full`} />
                    <div className="flex space-x-0.5 sm:space-x-1">
                      {[0, 1, 2].map((i: number) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full"
                        />
                      ))}
                    </div>
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 ${issue.color} rounded-full`} />
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6 hover:scale-[1.02] transition-transform duration-300 text-center lg:text-left">
                    <span className={`bg-gradient-to-r ${issue.gradientFrom} ${issue.gradientTo} bg-clip-text text-transparent`}>
                      {issue.title}
                    </span>
                  </h3>
                </div>

                <div className="relative">
                  {/* Background decoration for text */}
                  <div className={`absolute -left-2 sm:-left-4 top-0 w-0.5 sm:w-1 h-full bg-gradient-to-b ${issue.gradientFrom} ${issue.gradientTo} rounded-full hidden lg:block`} />
                  
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed lg:pl-8 relative text-center lg:text-left">
                    {issue.description}
                  </p>
                </div>

                {/* Action Indicator */}
                <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3 pt-2 sm:pt-4">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 ${issue.color} rounded-full shadow-lg`} />
                  <span className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Active Initiative
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 sm:mt-24 lg:mt-32 px-4">
          <div className="relative">
            {/* Simplified background decorative elements */}
            <div className="absolute -top-5 -right-5 sm:-top-10 sm:-right-10 w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border border-dashed border-green-300 rounded-full opacity-30" />
            <div className="absolute -bottom-5 -left-5 sm:-bottom-10 sm:-left-10 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border border-dashed border-blue-300 rounded-full opacity-30" />

            <div className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-0.5 sm:p-1">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden">
                {/* Inner gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 opacity-60" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-purple-500 rounded-full mb-4 sm:mb-6">
                    <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>

                 <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
  <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
    The World Needs You. Now More Than Ever.
  </span>
</h3>

<p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 text-gray-600 max-w-3xl mx-auto">
  Thousands of lives hang in the balance. Your time, your skills, or your donation can tip the scale toward hope. Join India&apos;s fastest-growing grassroots movement.
</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-lg sm:max-w-none mx-auto">
                    <button
                      onClick={() => handleNavigate('/get-involved')}
                      className="group inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden hover:scale-105 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      <span className="relative flex items-center space-x-2">
                        <span>Volunteer Now</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigate('/what-we-do')}
                      className="group inline-flex items-center justify-center border-2 sm:border-3 border-gray-300 hover:border-purple-400 text-gray-700 hover:text-purple-600 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105 hover:-translate-y-1"
                    >
                      <span className="flex items-center space-x-2">
                        <span>Learn More</span>
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuesSection;
