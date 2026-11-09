"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { AuthUser, Role } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";

interface UserProfileDropdownProps {
  user: AuthUser;
  locale: Locale;
  onLogout?: () => void;
  className?: string;
}

export default function UserProfileDropdown({
  user,
  locale,
  onLogout,
  className = "",
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { logout } = useAuth();
  const { role, setRole } = useRole();
  const isBn = locale === "bn";

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle outside click dismissal
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  // Handle Escape key dismissal
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        closeDropdown();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDropdown]);

  // Keyboard navigation within the menu
  const handleMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a[role="menuitem"], button[role="menuitem"]'
    );
    const elements = Array.from(focusable);
    const currentIndex = elements.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % elements.length;
      elements[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + elements.length) % elements.length;
      elements[prevIndex]?.focus();
    } else if (e.key === "Tab") {
      closeDropdown();
    }
  };

  const handleSignOut = () => {
    closeDropdown();
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const handleRoleToggle = (nextRole: Role) => {
    setRole(nextRole);
    closeDropdown();
    router.push(`/${locale}/${nextRole === "admin" ? "admin" : "dashboard"}`);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* 1. TRIGGER ELEMENT */}
      <button
        ref={triggerRef}
        type="button"
        id="user-profile-trigger"
        onClick={toggleDropdown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={isBn ? "ইউজার প্রোফাইল মেনু" : "User profile menu"}
        className={`group flex items-center gap-2 rounded-full py-1 pl-1.5 pr-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer select-none ${
          isOpen
            ? "bg-[#004d38] ring-2 ring-white/40 shadow-inner"
            : "bg-[#005a42] hover:bg-[#004d38] border border-white/20 shadow-xs"
        }`}
      >
        {/* Avatar Container with Indicator Slot */}
        <div className="relative shrink-0">
          {user.picture ? (
            <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full border border-white/40 shadow-xs">
              <Image
                src={user.picture}
                alt={user.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white font-extrabold text-[#006a4e] text-xs shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Indicator Slot (Online dot / Google provider badge) */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-white ring-1 ring-white">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
        </div>

        {/* Trigger Label (Truncated User Name) */}
        <span className="hidden max-w-[110px] lg:max-w-[130px] truncate text-xs font-bold tracking-wide text-white">
          {user.name}
        </span>

        {/* Chevron Slot */}
        <svg
          className={`h-3.5 w-3.5 text-white/80 transition-transform duration-200 group-hover:text-white ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 2. POPUP CONTAINER & MOBILE OVERLAY */}
      {isOpen && (
        <>
          {/* Mobile Backdrop (<640px) */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:hidden"
            onClick={closeDropdown}
            aria-hidden="true"
          />

          {/* Card Container (Anchored on Desktop, Bottom/Centered Sheet on Mobile) */}
          <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-profile-trigger"
            onKeyDown={handleMenuKeyDown}
            className="fixed sm:absolute bottom-0 sm:bottom-auto inset-x-0 sm:inset-x-auto sm:right-0 sm:top-full z-50 sm:mt-2.5 w-full sm:w-80 rounded-t-3xl sm:rounded-2xl bg-white border border-neutral-200/90 shadow-2xl ring-1 ring-black/5 overflow-hidden animate-in fade-in zoom-in-95 duration-150 sm:origin-top-right select-none"
          >
            {/* Mobile Sheet Grab Handle */}
            <div className="flex sm:hidden justify-center pt-2.5 pb-1">
              <span className="h-1.5 w-10 rounded-full bg-neutral-300" />
            </div>

            {/* SECTION 1: IDENTITY HEADER */}
            <div className="p-4 bg-gradient-to-br from-neutral-50 via-white to-neutral-50/50 border-b border-neutral-200/80">
              <div className="flex items-start gap-3.5">
                {/* Larger Profile Picture / Initials */}
                <div className="relative shrink-0">
                  {user.picture ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-[#006a4e]/20 shadow-xs">
                      <Image
                        src={user.picture}
                        alt={user.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#006a4e] text-white font-extrabold text-lg shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Status Indicator */}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>

                {/* Identity Slots */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-extrabold text-neutral-900 truncate leading-snug">
                    {user.name}
                  </h4>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">
                    {user.email || (isBn ? "ক্লাব মেম্বার" : "Club Member")}
                  </p>

                  {/* Micro-badge / Metric Tag Slot */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {user.provider === "google" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/80 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                        <span>Google Verified</span>
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-[#006a4e]">
                        {isBn ? "ক্লাব অ্যাকাউন্ট" : "Club Account"}
                      </span>
                    )}

                    <span className="inline-block rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-600 uppercase">
                      {role === "admin" ? (isBn ? "অ্যাডমিন" : "Admin") : (isBn ? "মেম্বার" : "Member")}
                    </span>
                  </div>
                </div>

                {/* Mobile Close Button */}
                <button
                  type="button"
                  onClick={closeDropdown}
                  className="sm:hidden text-neutral-400 hover:text-neutral-700 p-1"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* SECTION 2: NAVIGATIONAL & FEATURE SLOTS (BODY) */}
            <div className="p-2 space-y-1">
              {/* Item 1: Member Dashboard */}
              <Link
                href={`/${locale}/dashboard`}
                role="menuitem"
                tabIndex={0}
                onClick={closeDropdown}
                className="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100/90 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#006a4e]/10 text-[#006a4e] group-hover:bg-[#006a4e] group-hover:text-white transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-bold text-neutral-800 group-hover:text-neutral-900 leading-tight">
                      {isBn ? "সদস্য ড্যাশবোর্ড" : "Member Dashboard"}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {isBn ? "প্রোফাইল ও কার্যক্রম দেখুন" : "View your club activities"}
                    </p>
                  </div>
                </div>
                <svg className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-700 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Item 2: Admin Panel */}
              <Link
                href={`/${locale}/admin`}
                role="menuitem"
                tabIndex={0}
                onClick={closeDropdown}
                className="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100/90 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-bold text-neutral-800 group-hover:text-neutral-900 leading-tight">
                      {isBn ? "অ্যাডমিন প্যানেল" : "Admin Panel"}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {isBn ? "ব্যবস্থাপনা ও নিয়ন্ত্রণ" : "Club management & controls"}
                    </p>
                  </div>
                </div>
                <span className="inline-block rounded-md bg-amber-100/70 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                  {isBn ? "অ্যাডমিন" : "Admin"}
                </span>
              </Link>

              {/* Item 3: Members Directory */}
              <Link
                href={`/${locale}/members`}
                role="menuitem"
                tabIndex={0}
                onClick={closeDropdown}
                className="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100/90 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-bold text-neutral-800 group-hover:text-neutral-900 leading-tight">
                      {isBn ? "সদস্য ডিরেক্টরি" : "Members Directory"}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {isBn ? "সকল রেজিস্টার্ড সদস্য" : "Browse all club members"}
                    </p>
                  </div>
                </div>
                <svg className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-700 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Sub-group Divider */}
              <div className="my-1.5 border-t border-neutral-100" />

              {/* Quick Role Switcher Row */}
              <div className="px-3 py-2 flex items-center justify-between rounded-xl bg-neutral-50/80 border border-neutral-100">
                <span className="text-[11px] font-bold text-neutral-600">
                  {isBn ? "বর্তমান ভিউ:" : "Active View:"}
                </span>
                <div className="inline-flex rounded-lg bg-neutral-200/80 p-0.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => handleRoleToggle("user")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      role === "user"
                        ? "bg-white text-[#006a4e] shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    {isBn ? "মেম্বার" : "Member"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleToggle("admin")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      role === "admin"
                        ? "bg-[#006a4e] text-white shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    {isBn ? "অ্যাডমিন" : "Admin"}
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 3: BOTTOM ACTION / SESSION FOOTER */}
            <div className="p-2 border-t border-neutral-200/80 bg-neutral-50/60">
              <button
                type="button"
                role="menuitem"
                tabIndex={0}
                onClick={handleSignOut}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100/70 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">
                      {isBn ? "লগআউট করুন" : "Sign Out"}
                    </p>
                    <p className="text-[10px] text-red-400 group-hover:text-red-500">
                      {isBn ? "বর্তমান সেশন সমাপ্ত করুন" : "End active session"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-red-400 group-hover:text-red-600">
                  {isBn ? "প্রস্থান" : "Exit"}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

