"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { AuthUser } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import UserAvatar from "./UserAvatar";
import RoleBadge from "./RoleBadge";
import VerifiedTick from "@/components/common/VerifiedTick";
import { isAdminVerified, normalizeRole } from "@/lib/authRole";

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
  const resolvedRole = normalizeRole(user.role ?? role);
  const statusDotClass =
    user.status === "SUSPENDED"
      ? "bg-rose-500"
      : user.status === "INACTIVE"
        ? "bg-amber-400"
        : "bg-emerald-500";

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
      {/* 1. TRIGGER BUTTON (Clean Round Circle Profile Picture) */}
      <button
        ref={triggerRef}
        type="button"
        id="user-profile-trigger"
        onClick={toggleDropdown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="User profile menu"
        className={`group relative rounded-full p-0.5 transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-white ${
          isOpen
            ? "ring-2 ring-white shadow-md scale-105"
            : "hover:scale-105 transition-transform"
        }`}
      >
        {/* Profile picture with round circle (falls back to club placeholder avatar) */}
        <UserAvatar
          src={user.picture}
          name={user.name}
          className="h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-white/90 shadow-xs bg-white"
        />

        {/* Status Dot */}
        <span
          className={`absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full ${statusDotClass} ring-2 ring-white`}
        />
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
            className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-76 max-w-[calc(100vw-24px)] rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 origin-top-right select-none"
          >
            {/* Identity Header */}
            <div className="flex items-start gap-3.5">
              {/* Profile Avatar */}
              <div className="relative shrink-0">
                <UserAvatar
                  src={user.picture}
                  name={user.name}
                  className="h-12 w-12 ring-2 ring-[#006a4e]/15 shadow-xs"
                />
              </div>

              {/* Name, Email & Role / Micro-Badges */}
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate leading-snug">
                    {user.name}
                  </h4>
                  {isAdminVerified(user.adminVerified) && (
                    <VerifiedTick isBn={isBn} className="w-4 h-4" />
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {user.email || (isBn ? "ক্লাব মেম্বার" : "Club Member")}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <RoleBadge role={resolvedRole} isBn={isBn} />

                  {user.status && user.status !== "ACTIVE" && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border leading-relaxed ${
                        user.status === "SUSPENDED"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {user.status === "SUSPENDED"
                        ? isBn
                          ? "স্থগিত"
                          : "Suspended"
                        : isBn
                          ? "নিষ্ক্রিয়"
                          : "Inactive"}
                    </span>
                  )}

                  {user.bloodGroup && user.bloodGroup !== "UNKNOWN" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 leading-relaxed">
                      🩸 {user.bloodGroup}
                    </span>
                  )}
                  {user.profession && (
                    <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px] leading-relaxed">
                      {user.profession}
                    </span>
                  )}
                </div>
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
                <span>{isBn ? "ড্যাশবোর্ড" : " Dashboard"}</span>
              </Link>

              <Link
                href={`/${locale}/dashboard?tab=profile`}
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
