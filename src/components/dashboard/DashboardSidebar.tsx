"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import RoleBadge from "@/components/layout/RoleBadge";
import UserAvatar from "@/components/layout/UserAvatar";
import VerifiedTick from "@/components/common/VerifiedTick";
import type { AuthUser } from "@/types";
import navConfig from "@/data/dashboardNav.json";
import { hasDashboardAccess, isAdminVerified, normalizeRole } from "@/lib/authRole";
import { ADMIN_UI_COPY } from "@/lib/config/adminNav";
import { BRAND_NAME_EN } from "@/lib/constants/site";

export interface NavSubItemConfig {
  id: string;
  labelBn: string;
  labelEn: string;
  icon?: string;
  type?: "tab" | "link";
  href?: string;
  status?: "ready" | "cooking";
  adminOnly?: boolean;
  showPendingBadge?: boolean;
}

export interface NavItemConfig {
  id: string;
  labelBn: string;
  labelEn: string;
  icon: string;
  type: "tab" | "link" | "action" | "group";
  href?: string;
  status?: "ready" | "cooking";
  hasChevron?: boolean;
  adminOnly?: boolean;
  showPendingBadge?: boolean;
  subItems?: NavSubItemConfig[];
  children?: NavSubItemConfig[];
}

export interface NavCategoryConfig {
  id: string;
  titleBn: string;
  titleEn: string;
  adminOnly?: boolean;
  // badge?: string;
  items: NavItemConfig[];
}

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  locale?: string;
  user: AuthUser | null;
  isAdmin: boolean;
  displayName: string;
  pendingCount?: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onLogout: () => void;
}

/** Render appropriate SVG icon by icon key */
function NavIcon({ name, className = "w-5 h-5 shrink-0" }: { name: string; className?: string }) {
  switch (name) {
    case "dashboard":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
        </svg>
      );
    case "chat":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case "sports":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case "members":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "welfare":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case "shield_check":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "users_cog":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="9" cy="7.5" r="3.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 20a6.5 6.5 0 0110.2-5.3" />
          <circle cx="18" cy="15.5" r="2.2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 11.8v1.2m0 5v1.2m3.7-3.7h-1.2m-5 0h-1.2m6.3-2.6l-.85.85m-3.9 3.9l-.85.85m5.6 0l-.85-.85m-3.9-3.9l-.85-.85"
          />
        </svg>
      );
    case "live":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "finance":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "crown":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18M4 15l2-9 6 5 6-5 2 9H4z" />
        </svg>
      );
    case "award":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="9" r="5.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l-1 7 4-2 4 2-1-7" />
        </svg>
      );
    case "users":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "user":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="8" r="4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 20a8 8 0 0116 0" />
        </svg>
      );
    case "user_check":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="9" cy="8" r="3.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 20a6.5 6.5 0 0113 0M16 11l2 2 4-4" />
        </svg>
      );
    case "wallet":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h13a2 2 0 012 2v2h-5a2 2 0 00-2 2v2a2 2 0 002 2h5v2a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          <circle cx="16.5" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export default function DashboardSidebar({
  activeTab,
  setActiveTab,
  locale = "bn",
  user,
  isAdmin,
  displayName,
  pendingCount = 0,
  mobileOpen,
  setMobileOpen,
  onLogout,
}: DashboardSidebarProps) {
  const isBn = locale === "bn";
  const resolvedRole = user
    ? normalizeRole(user.role)
    : isAdmin
      ? "ADMIN"
      : "USER";
  const resolvedIsAdmin = hasDashboardAccess(resolvedRole);
  const categories = navConfig.categories as unknown as NavCategoryConfig[];
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    leadership: true,
    admin_users: true,
  });

  const handleAction = (item: NavItemConfig) => {
    if (item.id === "ai_chat") {
      if (typeof window !== "undefined") {
        const chatBtn = document.querySelector(
          'button[aria-label="Chat with assistant"]'
        ) as HTMLButtonElement | null;
        if (chatBtn) chatBtn.click();
      }
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Element (Drawer on mobile, sticky sidebar on desktop) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-[82vw] max-w-[320px] md:w-64 lg:w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 shadow-2xl md:shadow-none md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 1. Header: Brand & Hub */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group select-none"
          >
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-2xl bg-gradient-to-tr from-[#006a4e] to-[#059669] p-2 flex items-center justify-center shadow-xs">
              <Image
                src="/logo.png"
                alt={BRAND_NAME_EN}
                fill
                className="object-contain p-1 drop-shadow-xs"
              />
            </div>
            <div>
              <h2 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-[#006a4e] transition-colors leading-tight tracking-tight">
                {isBn ? "সাভারচালা শান্তি সংঘ" : BRAND_NAME_EN}
              </h2>
              <p className="text-[11px] sm:text-xs font-semibold text-[#006a4e] mt-0.5">
                {isBn ? "ক্লাব পোর্টাল হাব" : "Club Portal Hub"}
              </p>
            </div>
          </Link>

          {/* Mobile close button (Clean ✕ matching reference screenshot) */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="md:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 2. Middle: Navigation Items from JSON Config */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {categories.map((category, catIdx) => {
            // Filter admin only categories
            if (category.adminOnly && !resolvedIsAdmin) return null;

            return (
              <div
                key={category.id}
                className={catIdx > 0 ? "pt-2 border-t border-slate-100" : ""}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between px-3 mb-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    {isBn ? category.titleBn : category.titleEn}
                  </p>

                </div>

                {/* Category Items */}
                <nav className="space-y-1.5">
                  {category.items.map((item) => {
                    if (item.adminOnly && !resolvedIsAdmin) return null;

                    const label = isBn ? item.labelBn : item.labelEn;
                    const visibleSubItems = (
                      item.children ??
                      item.subItems ??
                      []
                    ).filter((sub) => !(sub.adminOnly && !resolvedIsAdmin));
                    const hasSubItems = visibleSubItems.length > 0;
                    const isSubItemActive = visibleSubItems.some(
                      (sub) => sub.id === activeTab
                    );
                    const isUserManagementTab =
                      item.id === "admin_users" &&
                      (activeTab === "admin_users" ||
                        activeTab === "admin_users_all" ||
                        activeTab === "admin_users_pending");
                    const isActive =
                      activeTab === item.id ||
                      isSubItemActive ||
                      isUserManagementTab;
                    const isExpanded =
                      Boolean(expandedGroups[item.id]) || isSubItemActive;
                    const soonBadgeText = isBn
                      ? ADMIN_UI_COPY.soonBadgeBn
                      : ADMIN_UI_COPY.soonBadgeEn;

                    // Parent Item with Collapsible Sub-tabs (e.g., Leadership -> Pioneers / Committee / Admins)
                    if (
                      (item.type === "group" || item.type === "tab") &&
                      hasSubItems
                    ) {
                      return (
                        <div key={item.id} className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedGroups((prev) => ({
                                ...prev,
                                [item.id]: !isExpanded,
                              }));
                              if (
                                item.type === "tab" &&
                                !isActive &&
                                visibleSubItems[0]
                              ) {
                                setActiveTab(visibleSubItems[0].id);
                              }
                            }}
                            aria-expanded={isExpanded}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                              isActive
                                ? "bg-[#006a4e] text-white shadow-md shadow-[#006a4e]/25 font-bold"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <NavIcon
                                name={item.icon}
                                className={`w-5 h-5 shrink-0 ${
                                  isActive ? "text-white" : "text-slate-500"
                                }`}
                              />
                              <span className="truncate">{label}</span>
                            </div>

                            <svg
                              className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              } ${isActive ? "text-white" : "text-slate-400"}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {isExpanded && (
                            <div className="ml-5 pl-3 border-l-2 border-[#006a4e]/20 space-y-1 py-0.5">
                              {visibleSubItems.map((sub) => {
                                const subLabel = isBn ? sub.labelBn : sub.labelEn;
                                const subActive =
                                  activeTab === sub.id ||
                                  (item.type === "tab" &&
                                    activeTab === item.id &&
                                    sub.id === visibleSubItems[0]?.id);
                                const isCooking = sub.status === "cooking";
                                const subClassName = `w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                                  subActive
                                    ? "bg-[#006a4e]/10 text-[#006a4e] font-extrabold"
                                    : "text-slate-600 font-semibold hover:bg-[#f7f4ea] hover:text-[#006a4e]"
                                }`;

                                const subInner = (
                                  <>
                                    <span className="flex items-center gap-2 min-w-0">
                                      {sub.icon ? (
                                        <NavIcon
                                          name={sub.icon}
                                          className={`w-4 h-4 shrink-0 ${
                                            subActive
                                              ? "text-[#006a4e]"
                                              : "text-slate-400"
                                          }`}
                                        />
                                      ) : (
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                            subActive
                                              ? "bg-[#006a4e]"
                                              : "bg-slate-300"
                                          }`}
                                        />
                                      )}
                                      <span className="truncate leading-relaxed">
                                        {subLabel}
                                      </span>
                                    </span>

                                    <span className="flex items-center gap-1 shrink-0">
                                      {isCooking && (
                                        <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#f2b705]/20 text-[#996d00] border border-[#f2b705]/40">
                                          <span>🍳</span>
                                          <span>{soonBadgeText}</span>
                                        </span>
                                      )}
                                      {sub.showPendingBadge && pendingCount > 0 && (
                                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                          {pendingCount}
                                        </span>
                                      )}
                                    </span>
                                  </>
                                );

                                if (sub.type === "link" && sub.href) {
                                  const subHref = sub.href.startsWith("/")
                                    ? `/${locale}${sub.href}`
                                    : sub.href;
                                  return (
                                    <Link
                                      key={sub.id}
                                      href={subHref}
                                      onClick={() => setMobileOpen(false)}
                                      className={subClassName}
                                    >
                                      {subInner}
                                    </Link>
                                  );
                                }

                                return (
                                  <button
                                    key={sub.id}
                                    type="button"
                                    onClick={() => {
                                      setActiveTab(sub.id);
                                      setMobileOpen(false);
                                    }}
                                    className={subClassName}
                                  >
                                    {subInner}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Tab Item (Switches Dashboard View)
                    if (item.type === "tab") {
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#006a4e] text-white shadow-md shadow-[#006a4e]/25 font-bold"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <NavIcon
                              name={item.icon}
                              className={`w-5 h-5 shrink-0 ${
                                isActive
                                  ? "text-white"
                                  : "text-slate-500 group-hover:text-slate-800"
                              }`}
                            />
                            <span className="truncate leading-relaxed">{label}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.status === "cooking" && (
                              <span
                                className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                                  isActive
                                    ? "bg-[#f2b705] text-[#12231d]"
                                    : "bg-[#f2b705]/20 text-[#996d00] border border-[#f2b705]/40"
                                }`}
                              >
                                <span>🍳</span>
                                <span>{soonBadgeText}</span>
                              </span>
                            )}

                            {/* Dynamic Pending Count for admin */}
                            {item.showPendingBadge && pendingCount > 0 && (
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  isActive
                                    ? "bg-white text-[#006a4e]"
                                    : "bg-red-500 text-white"
                                }`}
                              >
                                {pendingCount}
                              </span>
                            )}

                            {/* Tag Badge */}
                            {/* {item.badge && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  item.badge.type === "danger"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {item.badge.text}
                              </span>
                            )} */}

                            {/* Chevron */}
                            {item.hasChevron && !isActive && (
                              <svg
                                className="w-4 h-4 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    }

                    // Link Item (Navigates to Page)
                    if (item.type === "link" && item.href) {
                      const fullHref = item.href.startsWith("/")
                        ? `/${locale}${item.href}`
                        : item.href;

                      return (
                        <Link
                          key={item.id}
                          href={fullHref}
                          onClick={() => setMobileOpen(false)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <NavIcon
                              name={item.icon}
                              className="w-5 h-5 text-slate-500 group-hover:text-slate-800 shrink-0"
                            />
                            <span className="truncate">{label}</span>
                          </div>

                          {item.hasChevron && (
                            <svg
                              className="w-4 h-4 text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </Link>
                      );
                    }

                    // Action Item (e.g., AI Chat Launcher)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleAction(item)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <NavIcon
                            name={item.icon}
                            className="w-5 h-5 text-slate-500 group-hover:text-slate-800 shrink-0"
                          />
                          <span className="truncate">{label}</span>
                        </div>

                        {/* {item.badge && (
                          <span className="text-emerald-500 text-sm">
                            {item.badge.text}
                          </span>
                        )} */}
                      </button>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* 3. Bottom: Profile Card & Direct Sign Out (Matching Screenshot) */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-3">
          {/* User Profile Card (Clicking opens Profile & Settings) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              setActiveTab("profile");
              setMobileOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveTab("profile");
                setMobileOpen(false);
              }
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer select-none group ${
              activeTab === "profile"
                ? "bg-[#006a4e]/10 border-[#006a4e] ring-2 ring-[#006a4e]/25 shadow-xs"
                : "bg-white border-slate-200/90 hover:border-[#006a4e]/40 hover:shadow-xs"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <UserAvatar
                  src={user?.picture}
                  name={displayName}
                  className="h-10 w-10 ring-1 ring-slate-200"
                />
              </div>

              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-1 min-w-0">
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-[#006a4e] transition-colors leading-tight">
                    {displayName}
                  </h5>
                  {isAdminVerified(user?.adminVerified) && (
                    <VerifiedTick isBn={isBn} className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="mt-1">
                  <RoleBadge role={resolvedRole} isBn={isBn} />
                </div>
              </div>
            </div>

            {/* Subtle Settings Gear Icon */}
            <div className="text-slate-400 group-hover:text-[#006a4e] p-1.5 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          {/* Sign Out & Theme Toggle (Matching Screenshot Layout) */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{isBn ? "সাইন আউট" : "Sign Out"}</span>
            </button>

            <LanguageSwitcher locale={locale as any} variant="toggle" />
          </div>
        </div>
      </aside>
    </>
  );
}

