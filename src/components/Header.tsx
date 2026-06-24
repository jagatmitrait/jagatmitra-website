"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface NavItem {
  name: string;
  href: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  
  const router = useRouter();
  const pathname = usePathname();

  // Navigation items
  const navItems: NavItem[] = useMemo(() => [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'What we do', href: '/what-we-do' },
    { name: 'Blogs', href: '/blog' },
    { name: 'Get Involved', href: '/get-involved' },
    { name: 'Our Initiatives', href: '/our-initiatives' },
    { name: 'Contact Us', href: '/contact' },
  ], []);

  // Scroll handler
  const handleScroll = useCallback((): void => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 50);
  }, []);

  useEffect(() => {
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  // Toggle menu handler
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Mobile nav click handler
  const handleMobileNavClick = useCallback((href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  }, [router]);

  // Active check function
  const isActive = useCallback((href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  }, [pathname]);

  // Image error handler
  const handleImageError = useCallback((): void => {
    setImageError(true);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Body scroll control
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Top orange bar */}
      <div className="bg-orange-500 h-1 sm:h-2 w-full"></div>
      
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 shadow-xl backdrop-blur-md border-b border-gray-100'
          : 'bg-white shadow-md'
      }`}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="block">
              <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  {!imageError ? (
                    <Image
                      src="/images/jagatmitra-logo.png" 
                      alt="Jagatmitra Foundation Logo"
                      width={48}
                      height={48}
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain transition-all duration-300"
                      priority
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-base sm:text-lg lg:text-xl font-bold text-blue-600 uppercase tracking-wider hover:text-green-600 transition-colors duration-300">
                    Jagatmitra
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-500 uppercase tracking-wider">
                    Foundation
                  </p>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
              {navItems.map((item: NavItem) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative font-medium text-sm lg:text-base transition-all duration-300 hover:scale-105 ${
                    isActive(item.href) 
                      ? 'text-green-600 font-semibold' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Donate Button */}
              <Link 
                href="/donate"
                className="hidden sm:block"
              >
                <div className={`flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-2 bg-green-600 text-white text-sm lg:text-base rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg ${
                  isActive('/donate') ? 'ring-2 ring-green-300' : ''
                }`}>
                  <Heart className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden lg:inline">Donate Now</span>
                  <span className="lg:hidden">Donate</span>
                </div>
              </Link>

              {/* Mobile hamburger button */}
              <button
                type="button"
                onClick={toggleMenu}
                className="md:hidden relative z-50 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 z-40 bg-white transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Menu content */}
          <div className="pt-20 px-4 h-full overflow-y-auto">
            <nav className="space-y-2">
              {navItems.map((item: NavItem) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleMobileNavClick(item.href)}
                  className={`block w-full text-left px-4 py-3 text-lg font-medium rounded-lg transition-colors duration-200 border ${
                    isActive(item.href)
                      ? 'text-green-600 bg-green-50 font-semibold border-green-200'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 border-transparent'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Donate Button */}
              <button
                type="button"
                onClick={() => handleMobileNavClick('/donate')}
                className="block w-full mt-6"
              >
                <div className={`flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 ${
                  isActive('/donate') ? 'ring-2 ring-green-300' : ''
                }`}>
                  <Heart className="w-4 h-4" />
                  <span>Donate Now</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile menu backdrop */}
        {isMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </header>
    </>
  );
};

export default Header;

