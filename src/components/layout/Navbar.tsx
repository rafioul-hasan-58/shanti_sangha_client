"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: `/${locale}#about`,
      label: dict.nav.about || (locale === "bn" ? "আমাদের সম্পর্কে" : "About Us"),
      hasDropdown: true,
    },
    {
      href: `/${locale}#committee`,
      label: dict.nav.committee || (locale === "bn" ? "কমিটি" : "Comette"),
      hasDropdown: false,
    },
    {
      href: `/${locale}#gallery`,
      label: dict.nav.gallery || (locale === "bn" ? "গ্যালারি" : "Gallery"),
      hasDropdown: true,
    },
    {
      href: `/${locale}#gpl`,
      label: dict.nav.gpl || "GPL",
      hasDropdown: false,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#006a4e] border-b-[3px] border-white shadow-md">
      <div className="mx-auto flex h-16 md:h-[68px] max-w-7xl items-center justify-between pl-4 pr-0">
        {/* Brand / Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 sm:gap-3.5 py-1 group outline-none focus:outline-none focus-visible:outline-none ring-0 select-none"
        >
          {/* 3D Flipping Logo */}
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 flex items-center justify-center perspective-800">
            <div className="relative w-full h-full transform-style-3d animate-logo-flip">
              {/* Front Face */}
              <div className="absolute inset-0 backface-hidden flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Shanti Sangha Logo"
                  width={64}
                  height={64}
                  priority
                  className="h-full w-full object-contain drop-shadow-md"
                />
              </div>
              {/* Back Face (rotated 180deg so both sides remain right-side up) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Shanti Sangha Logo"
                  width={64}
                  height={64}
                  priority
                  className="h-full w-full object-contain drop-shadow-md"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center leading-tight select-none">
            <span className="font-extrabold text-xs sm:text-sm md:text-[15px] tracking-wider text-white uppercase font-sans">
              {locale === "bn" ? "সাভারচালা" : "SHAVARCHALA"}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-white/90 uppercase font-sans mt-0.5">
              {locale === "bn" ? "শান্তি সংঘ" : "SHANTI SANGHA"}
            </span>
          </div>
        </Link>

        {/* Center / Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 h-full">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 text-xs lg:text-sm font-bold uppercase tracking-wider text-white hover:text-white/80 transition-colors"
            >
              <span>{item.label}</span>
              {item.hasDropdown && (
                <svg
                  className="w-3 h-3 fill-current opacity-80"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Action: Language Switcher + Login Button */}
        <div className="flex items-center h-full">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center mr-3">
            <LanguageSwitcher locale={locale} />
          </div>

          {/* Login Button (Full height white block matching BCB style) */}
          <Link
            href={`/${locale}/dashboard`}
            className="self-stretch flex items-center justify-center px-5 sm:px-8 bg-white text-[#006a4e] font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-neutral-100 transition-colors shadow-inner"
          >
            {dict.nav.login || (locale === "bn" ? "লগইন" : "LOGIN")}
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-3 text-white hover:text-white/80 focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#005a42] border-t border-white/20 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-white hover:text-white/80 py-2 border-b border-white/10"
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <svg className="w-3.5 h-3.5 fill-current opacity-80" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                )}
              </Link>
            ))}
          </nav>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/80 font-semibold">Language</span>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      )}
    </header>
  );
}
