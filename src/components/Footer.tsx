"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin,
  ArrowRight,
  Phone,
  Clock,
  Heart,
  X,
  ArrowLeft,
} from "lucide-react";
import { FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const getDeviceType = (() => {
  let cachedDeviceType: string | null = null;
  let lastWidth = 0;
  
  return () => {
    if (typeof window === "undefined") return "laptop";
    
    const currentWidth = window.innerWidth;
    if (cachedDeviceType && Math.abs(currentWidth - lastWidth) < 50) {
      return cachedDeviceType;
    }
    
    lastWidth = currentWidth;
    if (currentWidth <= 768) {
      cachedDeviceType = "phone";
    } else if (currentWidth <= 1024) {
      cachedDeviceType = "tablet";
    } else {
      cachedDeviceType = "laptop";
    }
    
    return cachedDeviceType;
  };
})();

const PolicyModal = React.memo(({
  title,
  children,
  isActive,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo.png"
                  alt="JagatMitra Foundation Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-bold">{title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {children}
        </div>
      </div>
    </div>
  );
});

PolicyModal.displayName = 'PolicyModal';

const Footer = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const cleanupExtensionAttributes = () => {
      const elementsWithFdProcessedId = document.querySelectorAll('[fdprocessedid]');
      elementsWithFdProcessedId.forEach(element => {
        element.removeAttribute('fdprocessedid');
      });
    };

    cleanupExtensionAttributes();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'fdprocessedid') {
          const target = mutation.target as Element;
          target.removeAttribute('fdprocessedid');
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['fdprocessedid'],
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  const quickLinks = useMemo(() => [
    { name: "About Us", href: "/about" },
    { name: "Contact us", href: "/contact" },
    { name: "Volunteer", href: "/get-involved" },
    { name: "Internship", href: "/get-involved" },
    { name: "Ethics and Compliance", href: "/get-involved" },
    { name: "Blog", href: "/blog" },
  ], []);

  const socialLinks = useMemo(() => [
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/jagatmitra.foundation?igsh=ZXZ5dmpzZ2xidHNq",
      external: true,
      label: "Instagram",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/jagatmitra-foundation-172439352/",
      external: true,
      label: "LinkedIn",
    },
    {
      icon: FaYoutube,
      href: "https://www.youtube.com/@jagatmitrafoundation7991",
      external: true,
      label: "Youtube",
    },
  ], []);

  const currentYear = useMemo(() => {
    if (!isClient) return 2024;
    return new Date().getFullYear();
  }, [isClient]);

  const openModal = useCallback((modalType: string) => {
    setActiveModal(modalType);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = "unset";
    }
  }, []);

  const handleExternalLinkClick = useCallback((e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (!isClient) return;
    
    const device = getDeviceType();
    if (device === "phone") {
      window.location.href = href;
    } else if (device === "tablet") {
      window.open(href, "_self");
    } else {
      window.open(href, "_blank");
    }
  }, [isClient]);

  const policyContent = useMemo(() => ({
    privacy: <div className="prose max-w-none"><section className="mb-8"><h3 className="text-xl font-semibold mb-4 text-blue-600">Preamble</h3><p className="text-gray-700">JagatMitra Foundation values the trust of its employees, members, donors, beneficiaries, and stakeholders. This Privacy Policy explains how we collect, use, store, and protect personal information.</p></section></div>,
    posh: <div className="prose max-w-none"><section className="mb-8"><h3 className="text-xl font-semibold mb-4 text-blue-600">Preamble</h3><p className="text-gray-700">JagatMitra Foundation is committed to providing a safe, dignified, respectful, and inclusive work environment to all its employees, members, interns, consultants, volunteers, visitors, and partners.</p></section></div>,
    transparency: <div className="prose max-w-none"><section className="mb-8"><h3 className="text-xl font-semibold mb-4 text-blue-600">Preamble</h3><p className="text-gray-700">JagatMitra Foundation is committed to the highest standards of transparency, accountability, and integrity.</p></section></div>,
  }), []);

  if (!isClient) {
    return (
      <footer
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('/images/hands-plant.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-green-400">Loading...</h2>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <>
      <footer
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('/images/hands-plant.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-orange-500 rounded-full blur-2xl" />
        </div>

        <div className="relative">
          <div className="container mx-auto px-4 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h2 className="text-3xl font-bold mb-4 text-green-400">Growing Together</h2>
                  <p className="text-gray-200 leading-relaxed mb-6">Just like the plant in caring hands, every donation nurtures hope and helps communities flourish. Together, we can create lasting change and build a better tomorrow.</p>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-green-400/30 rounded-full animate-pulse" />
                  <div className="absolute bottom-20 left-4 w-6 h-6 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-xl backdrop-blur-sm bg-opacity-90 hover:scale-105 transition-transform duration-300">
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Support Our Mission
                  </h4>
                  <p className="text-sm opacity-90 mb-4">Every contribution helps us create lasting change in communities worldwide.</p>
                  <Link href="/donate">
                    <button className="border border-white text-white hover:bg-white hover:text-green-600 px-6 py-2 rounded-lg transition-all duration-300" suppressHydrationWarning={true}>
                      Donate Now 
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/20 bg-black/40 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Link href="/" className="block">
                  <div className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 relative">
                      <Image src="/logo.png" alt="Jagatmitra Foundation Logo" fill className="object-contain" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-blue-400 uppercase tracking-wider hover:text-green-400 transition-colors duration-300 whitespace-nowrap">Jagatmitra Foundation</h1>
                    </div>
                  </div>
                </Link>

                <p className="text-gray-300 leading-relaxed mb-6 mt-4">Turning hope into impact, one step at a time. We strive for action through compassionate initiatives that create lasting change in communities worldwide.</p>

                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      onClick={(e) => handleExternalLinkClick(e, social.href)}
                      className="w-10 h-10 bg-white/10 hover:bg-green-600 rounded-full flex items-center justify-center transition-all hover:scale-125 hover:rotate-12 backdrop-blur-sm"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-6 text-green-400 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Quick Links
                </h3>
                <div className="space-y-3">
                  {quickLinks.map((link) => (
                    <div key={link.name} className="group">
                      <Link href={link.href} className="flex items-center text-gray-300 hover:text-green-400 transition-all hover:translate-x-2 duration-300">
                        <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {link.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-6 text-green-400 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 hover:translate-x-2 transition-transform duration-300">
                    <MapPin className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div className="text-gray-300 text-sm">
                      <p className="font-medium text-green-300">Registered Office:</p>
                      <p>220, Global Business Park</p>
                      <p>Zirakpur, Punjab</p>
                      <br />
                      <p className="font-medium text-green-300">Headquarters:</p>
                      <p>DG-3/29 , Charak Sadan Road, Vikaspuri</p>
                      <p>New Delhi - 110018</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 hover:translate-x-2 transition-transform duration-300">
                    <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <a href="mailto:support@jagatmitrafoundation.com" onClick={(e) => handleExternalLinkClick(e, "mailto:support@jagatmitrafoundation.com")} className="text-gray-300 text-sm hover:text-green-400 transition-colors">support@jagatmitrafoundation.com</a>
                  </div>
                  <div className="flex items-center space-x-3 hover:translate-x-2 transition-transform duration-300">
                    <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <a href="tel:011-45653583" onClick={(e) => handleExternalLinkClick(e, "tel:011-45653583")} className="text-gray-300 text-sm hover:text-green-400 transition-colors">011-45653583</a>
                  </div>
                  <div className="flex items-start space-x-3 hover:translate-x-2 transition-transform duration-300">
                    <Clock className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div className="text-gray-300 text-sm">
                      <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p>Sat: 9:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 bg-black/60 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">� {currentYear} Jagatmitra Foundation. All rights reserved.</p>

              <div className="flex space-x-6 text-sm">
                <button onClick={() => openModal("privacy")} className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer" suppressHydrationWarning={true}>Privacy Policy</button>
                <button onClick={() => openModal("posh")} className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer" suppressHydrationWarning={true}>POSH Policy</button>
                <button onClick={() => openModal("transparency")} className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer" suppressHydrationWarning={true}>Transparency Policy</button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PolicyModal title="Privacy Policy" isActive={activeModal === "privacy"} onClose={closeModal}>{policyContent.privacy}</PolicyModal>
      <PolicyModal title="Prevention of Sexual Harassment (POSH) Policy" isActive={activeModal === "posh"} onClose={closeModal}>{policyContent.posh}</PolicyModal>
      <PolicyModal title="Transparency & Accountability Policy" isActive={activeModal === "transparency"} onClose={closeModal}>{policyContent.transparency}</PolicyModal>
    </>
  );
};

export default Footer;

