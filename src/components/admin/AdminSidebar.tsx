"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import {
  ADMIN_NAV_ITEMS,
  ADMIN_UI_COPY,
  findParentNavForPath,
  withLocaleHref,
} from "@/lib/config/adminNav";
import NavItemGroup from "./NavItemGroup";

interface AdminSidebarProps {
  locale: string;
}

/**
 * Desktop-only fixed left navigation sidebar (`w-64`, collapsible to `w-20` rail)
 * driven completely by `lib/config/adminNav.ts`.
 */
export default function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname() || "";
  const isBn = locale === "bn";
  const navRef = useRef<HTMLElement>(null);

  const [collapsed, setCollapsed] = useState(false);
  const [openGroupId, setOpenGroupId] = useState<string | null>(() => {
    const activeParent = findParentNavForPath(pathname);
    return activeParent?.children?.length ? activeParent.id : null;
  });

  // Auto-expand the active route's parent whenever route changes
  useEffect(() => {
    const activeParent = findParentNavForPath(pathname);
    if (activeParent?.children?.length) {
      setOpenGroupId(activeParent.id);
    }
  }, [pathname]);

  const handleNavKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const container = navRef.current;
    if (!container) return;

    const triggers = Array.from(
      container.querySelectorAll<HTMLElement>('[data-nav-trigger="true"]')
    );
    if (triggers.length === 0) return;

    const currentIndex = triggers.indexOf(e.currentTarget);
    if (currentIndex === -1) return;

    e.preventDefault();
    const nextIndex =
      e.key === "ArrowDown"
        ? (currentIndex + 1) % triggers.length
        : (currentIndex - 1 + triggers.length) % triggers.length;
    triggers[nextIndex]?.focus();
  };

  return (
    <aside
      style={{
        background:
          "linear-gradient(180deg, #004d38 0%, #006a4e 60%, #00a67e 100%)",
      }}
      className={`hidden md:flex flex-col justify-between shrink-0 sticky top-0 h-screen text-[#f7f4ea] border-r border-[#004d38]/40 shadow-xl transition-[width] duration-300 z-30 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header: Brand + Collapse Rail Toggle */}
      <div className="flex flex-col min-h-0 flex-1">
        <div
          className={`p-4 border-b border-white/15 flex items-center ${
            collapsed ? "justify-center flex-col gap-2" : "justify-between gap-2"
          }`}
        >
          <Link
            href={withLocaleHref("/admin/dashboard", locale)}
            className="flex items-center gap-2.5 min-w-0 rounded-xl focus-visible:ring-2 focus-visible:ring-[#f2b705]"
          >
            <div className="relative h-9 w-9 shrink-0 rounded-xl bg-white/15 border border-[#f2b705]/40 p-1 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt={ADMIN_UI_COPY.brandEn}
                fill
                className="object-contain p-1"
              />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-black text-white truncate leading-relaxed">
                  {isBn ? ADMIN_UI_COPY.brandBn : ADMIN_UI_COPY.brandEn}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#f2b705] truncate">
                  {isBn ? ADMIN_UI_COPY.portalBn : ADMIN_UI_COPY.portalEn}
                </p>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={
              collapsed
                ? isBn ? ADMIN_UI_COPY.expandLabelBn : ADMIN_UI_COPY.expandLabelEn
                : isBn ? ADMIN_UI_COPY.collapseLabelBn : ADMIN_UI_COPY.collapseLabelEn
            }
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#f7f4ea] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#f2b705]"
          >
            <svg
              aria-hidden="true"
              className={`w-4 h-4 transition-transform duration-200 ${
                collapsed ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links & Accordions */}
        <nav
          ref={navRef}
          aria-label={isBn ? ADMIN_UI_COPY.portalBn : ADMIN_UI_COPY.portalEn}
          className={`flex-1 p-3 space-y-1.5 ${
            collapsed ? "overflow-visible" : "overflow-y-auto"
          }`}
        >
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavItemGroup
              key={item.id}
              item={item}
              locale={locale}
              pathname={pathname}
              collapsed={collapsed}
              isOpen={openGroupId === item.id}
              onToggle={() =>
                setOpenGroupId((prev) => (prev === item.id ? null : item.id))
              }
              onItemKeyDown={handleNavKeyDown}
            />
          ))}
        </nav>
      </div>

      {/* Bottom: Language Switcher & Public Site Link */}
      <div className="p-3 border-t border-white/15 space-y-2.5">
        {!collapsed && (
          <div className="flex items-center justify-center">
            <LanguageSwitcher locale={locale as Locale} variant="toggle" />
          </div>
        )}

        <Link
          href={`/${locale}`}
          title={
            collapsed
              ? isBn ? ADMIN_UI_COPY.homeLinkBn : ADMIN_UI_COPY.homeLinkEn
              : undefined
          }
          className={`flex items-center ${
            collapsed ? "justify-center px-2" : "justify-center gap-2 px-3"
          } py-2 rounded-xl bg-black/15 hover:bg-white/15 text-xs font-bold text-[#f7f4ea] transition-colors focus-visible:ring-2 focus-visible:ring-[#f2b705]`}
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4 shrink-0 text-[#f2b705]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          {!collapsed && (
            <span className="truncate leading-relaxed">
              {isBn ? ADMIN_UI_COPY.homeLinkBn : ADMIN_UI_COPY.homeLinkEn}
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
}
