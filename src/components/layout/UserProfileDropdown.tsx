"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { AuthUser } from "@/types";
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

  const { logout } = useAuth();
  const { role } = useRole();
  const isBn = locale === "bn";

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close on outside click
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

  // Close on Escape key
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

  // Keyboard navigation
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

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* 1. TRIGGER PILL BUTTON (Matching the screenshot pill style) */}
      <button
        ref={triggerRef}
        type="button"
        id="user-profile-trigger"
        onClick={toggleDropdown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="User profile menu"
        className={`group flex items-center gap-2.5 bg-white text-slate-800 rounded-full pl-1.5 pr-3.5 py-1 border transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
          isOpen
            ? "border-purple-300 ring-2 ring-purple-200/80 shadow-md"
            : "border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm"
        }`}
      >
        {/* Avatar with Green Online Dot */}
        <div className="relative shrink-0">
          {user.picture ? (
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image
                src={user.picture}
                alt={user.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006a4e] text-white font-extrabold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Green Online Dot */}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        {/* User Name & Subtitle (2 Lines) */}
        <div className="hidden sm:flex flex-col text-left justify-center leading-tight min-w-0">
          <span className="text-xs font-bold text-slate-800 max-w-[125px] truncate">
            {user.name}
          </span>
          <span className="text-[10px] text-slate-400 font-medium truncate">
            {role === "admin"
              ? isBn
                ? "অ্যাডমিন"
                : "Admin"
              : isBn
              ? "মেম্বার"
              : "Member"}
          </span>
        </div>
      </button>

      {/* 2. DROPDOWN POPUP CARD */}
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs sm:hidden"
            onClick={closeDropdown}
            aria-hidden="true"
          />

          {/* White Card Container */}
          <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-profile-trigger"
            onKeyDown={handleMenuKeyDown}
            className="min-w-[260px] max-w-sm w-max fixed sm:absolute bottom-4 sm:bottom-auto inset-x-4 sm:inset-x-auto sm:right-0 sm:top-full z-50 sm:mt-2.5  sm:w-76 rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 sm:origin-top-right select-none"
          >
            {/* Identity Header */}
            <div className="flex items-start gap-3.5">
              {/* Profile Avatar */}
              <div className="relative shrink-0">
                {user.picture ? (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={user.picture}
                      alt={user.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#006a4e] text-white font-extrabold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name, Email & Micro-Badges */}
              <div className="min-w-0 flex-1 text-left">
                <h4 className="text-sm font-bold text-slate-800 truncate leading-snug">
                  {user.name}
                </h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {user.email || (isBn ? "ক্লাব মেম্বার" : "Club Member")}
                </p>
              </div>
            </div>

            {/* Subtle Divider Line */}
            <div className="border-b border-slate-100 my-4" />

            {/* Menu Items List */}
            <div className="space-y-1 text-left">
              <Link
                href={`/${locale}/dashboard`}
                role="menuitem"
                tabIndex={0}
                onClick={closeDropdown}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <span className="text-base leading-none">📊</span>
                <span>{isBn ? "লার্নিং ড্যাশবোর্ড" : " Dashboard"}</span>
              </Link>

              <Link
                href={`/${locale}/dashboard`}
                role="menuitem"
                tabIndex={0}
                onClick={closeDropdown}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <span className="text-base leading-none">⚙️</span>
                <span>{isBn ? "সেটিংস ও প্রোফাইল" : "Settings & Profile"}</span>
              </Link>

              <Link
                href={`/${locale}/members`}
                role="menuitem"
                tabIndex={0}
                onClick={closeDropdown}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <span className="text-base leading-none">💬</span>
                <span>{isBn ? "সদস্য ডিরেক্টরি" : "Club Members"}</span>
              </Link>

              <Link
                href={`/${locale}/admin`}
                role="menuitem"
                tabIndex={0}
                onClick={closeDropdown}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <span className="text-base leading-none">🛡️</span>
                <span>{isBn ? "অ্যাডমিন প্যানেল" : "Admin Panel"}</span>
              </Link>
            </div>

            {/* Bottom Divider Line */}
            <div className="border-t border-slate-100 my-3.5" />

            {/* Sign Out Button (Rose/Red accent matching screenshot) */}
            <button
              type="button"
              role="menuitem"
              tabIndex={0}
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-rose-50 text-rose-500 font-bold text-xs sm:text-sm transition-colors cursor-pointer text-left"
            >
              <svg
                className="w-4 h-4 stroke-current stroke-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>{isBn ? "লগআউট" : "Sign Out"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
