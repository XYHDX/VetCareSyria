'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { getNavLinks } from '@/config/navigation';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const toggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-emerald-100/60 shadow-sm" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-6">
        <Link href="/#home" className="flex items-center gap-3" onClick={closeMenu}>
          <div className="relative h-11 w-11 rounded-xl bg-emerald-50 ring-1 ring-emerald-100/70 overflow-hidden">
            <Image
              src="/images/vetcare-logo.svg"
              alt="VetcareSyria logo"
              fill
              sizes="44px"
              className="object-contain"
            />
          </div>
          <div className="leading-tight">
            <div className="text-xl font-display font-semibold text-emerald-900 tracking-tight">
              VetcareSyria
            </div>
          </div>
        </Link>

        <div className={`hidden md:flex items-center ${isArabic ? 'space-x-reverse space-x-7 text-lg' : 'space-x-6 text-lg'}`}>
          <nav className={`flex ${isArabic ? 'space-x-reverse space-x-7' : 'space-x-6'}`}>
            {getNavLinks(isArabic).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-emerald-800 font-medium transition-colors text-[17px]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <LanguageToggle />
        </div>

        <div className="md:hidden flex items-center gap-3">
          <LanguageToggle />
          <button
            className="text-gray-700 hover:text-emerald-800 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-white border-t border-emerald-100"
          >
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            {getNavLinks(isArabic).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-emerald-800 font-medium transition-colors py-2 text-[17px]"
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
