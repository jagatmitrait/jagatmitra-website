/* src/components/OurInitiativesSection.tsx */
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Users,
  Lightbulb,
  Heart,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

// DATA - Edit all initiative details here
const topInitiatives = [
  {
    id: "vyomme",
    logo: "/images/initiatives/vyomme-logo.png",
    name: "Vyomme Divine Essentials",
    tagline: "Natural. Pure. Divine. Essentials for a better you and a better planet.",
    kpi: { value: "10K+", label: "Products Delivered", Icon: ShoppingCart },
    href: "#",
  },
  {
    id: "sheride",
    logo: "/images/initiatives/sheride-logo.png",
    name: "She Ride",
    tagline: "Empowering women through safe rides, confidence, and community.",
    kpi: { value: "5K+", label: "Women Empowered", Icon: Users },
    href: "https://she-ride-phi.vercel.app",
  },
  {
    id: "icvast",
    logo: "/images/initiatives/icvast-logo.png",
    name: "ICVAST",
    tagline: "Transforming ideas into innovation for a smarter tomorrow.",
    kpi: { value: "120+", label: "Projects Initiated", Icon: Lightbulb },
    href: "https://digitalhealthidentity.online/",
  },
  {
    id: "lifecare",
    logo: "/images/initiatives/lifecare-logo.png",
    name: "LifeCare",
    tagline: "Accessible healthcare solutions for a healthier society.",
    kpi: { value: "7K+", label: "Lives Impacted", Icon: Heart },
    href: "https://lifecarepolyclinic.com",
  },
];

const bottomInitiatives = [
  {
    id: "legal",
    logo: "/images/initiatives/legal-logo.png",
    name: "Legal Services",
    tagline: "Providing trusted legal support for justice and equality.",
    kpi: { value: "3K+", label: "Beneficiaries Served", Icon: Users },
    href: "https://jagatmitralegal.in",
  },
  {
    id: "a3health",
    logo: "/images/initiatives/a3health-logo.png",
    name: "A3 Health Card",
    tagline: "Affordable healthcare access for every individual.",
    kpi: { value: "15K+", label: "Cards Issued", Icon: CreditCard },
    href: "https://digitalhealthidentity.com/",
  },
  {
    id: "shotspot",
    logo: "/images/shotspot-logo.png",
    name: "ShotSpot",
    tagline: "Transforming Immunization Through Digital Innovation.",
    kpi: { value: "25K+", label: "Lives Touched", Icon: Users },
    href: "https://shotspot.in",
  },
];

interface KpiCardProps {
  value: string;
  label: string;
  Icon: LucideIcon;
}

const KpiPill: React.FC<KpiCardProps> = ({ value, label, Icon }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
      <Icon size={20} strokeWidth={1.8} className="text-green-600" />
    </div>
    <div>
      <p className="text-xl font-bold text-green-600 leading-tight">{value}</p>
      <p className="text-xs text-gray-500 leading-tight">{label}</p>
    </div>
  </div>
);

interface InitiativeCardProps {
  logo: string;
  name: string;
  tagline: string;
  kpi: KpiCardProps;
  href: string;
}

const InitiativeCard: React.FC<InitiativeCardProps> = ({
  logo,
  name,
  tagline,
  kpi,
  href,
}) => (
  <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center mb-4">
      <Image
        src={logo}
        alt={`${name} logo`}
        width={96}
        height={96}
        className="object-cover w-full h-full"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </div>

    <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">{name}</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-5 min-h-[2.5rem]">
      {tagline}
    </p>

    <KpiPill {...kpi} />

    <Link
      href={href}
      target={href !== "#" ? "_blank" : undefined}
      rel={href !== "#" ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors duration-200 w-full justify-center"
    >
      <span aria-hidden="true">Explore</span>
    </Link>
  </div>
);

const OurInitiativesSection: React.FC = () => {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/background image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-14">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Our Initiatives
          </p>
          <div className="mx-auto w-14 h-0.5 bg-green-500 mb-5" />

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5 max-w-2xl mx-auto">
            Empowering Change Through Purpose-Driven Initiatives
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore the initiatives under Jagatmitra Foundation that are creating impact,
            driving innovation, and building a better tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {topInitiatives.map((item) => (
            <InitiativeCard key={item.id} {...item} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {bottomInitiatives.map((item) => (
            <InitiativeCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurInitiativesSection;
