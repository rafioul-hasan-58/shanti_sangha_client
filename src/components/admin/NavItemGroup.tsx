"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import {
  ADMIN_UI_COPY,
  isAdminPathActive,
  withLocaleHref,
  type NavItem,
} from "@/lib/config/adminNav";

interface NavItemGroupProps {
  item: NavItem;
  locale: string;
  pathname: string;
  collapsed: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onItemKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
}

function CookingPill({ isBn }: { isBn: boolean }) {
  return (
    <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#f2b705]/20 border border-[#f2b705]/50 text-[#f2b705] text-[10px] font-extrabold leading-relaxed">
      <span aria-hidden="true">🍳</span>
      <span>{isBn ? ADMIN_UI_COPY.soonBadgeBn : ADMIN_UI_COPY.soonBadgeEn}</span>
    </span>
  );
}

/**
 * Single desktop navigation item or accordion parent with children & collapsed-rail flyout.
 */
export default function NavItemGroup({
  item,
  locale,
  pathname,
  collapsed,
  isOpen,
  onToggle,
  onItemKeyDown,
}: NavItemGroupProps) {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const isBn = locale === "bn";
  const label = isBn ? item.labelBn : item.labelEn;
  const Icon = item.icon;
  const children = item.children ?? [];
  const hasChildren = children.length > 0;

  const isDirectActive = Boolean(
    item.href && isAdminPathActive(pathname, item.href)
  );
  const isChildActive = children.some((c) =>
    isAdminPathActive(pathname, c.href)
  );
  const isActive = isDirectActive || isChildActive;

  // 1. Leaf Item (no children)
  if (!hasChildren && item.href) {
    const targetHref = withLocaleHref(item.href, locale);
    return (
      <Link
        href={targetHref}
        data-nav-trigger="true"
        onKeyDown={onItemKeyDown}
        aria-current={isActive ? "page" : undefined}
        title={collapsed ? label : undefined}
        className={`relative group flex items-center ${
          collapsed ? "justify-center px-2" : "justify-between px-3.5"
        } py-2.5 rounded-xl text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#f2b705] ${
          isActive
            ? "bg-white/10 text-white font-bold shadow-2xs"
            : "text-[#f7f4ea]/90 font-medium hover:bg-white/10 hover:text-white"
        }`}
      >
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#f2b705]"
          />
        )}

        <span className="flex items-center gap-3 min-w-0">
          <Icon
            className={`w-5 h-5 shrink-0 transition-colors ${
              isActive
                ? "text-[#f2b705]"
                : "text-[#f7f4ea]/85 group-hover:text-white"
            }`}
          />
          {!collapsed && (
            <span className="truncate leading-relaxed">{label}</span>
          )}
        </span>

        {!collapsed && item.status === "cooking" && <CookingPill isBn={isBn} />}
      </Link>
    );
  }

  // 2. Parent Item with Children (Accordion when expanded, Floating Flyout when collapsed rail)
  return (
    <div
      className="relative"
      onMouseEnter={() => collapsed && setFlyoutOpen(true)}
      onMouseLeave={() => collapsed && setFlyoutOpen(false)}
    >
      <button
        type="button"
        data-nav-trigger="true"
        onKeyDown={onItemKeyDown}
        onClick={() => {
          if (collapsed) {
            setFlyoutOpen((prev) => !prev);
          } else {
            onToggle();
          }
        }}
        aria-expanded={collapsed ? flyoutOpen : isOpen}
        title={collapsed ? label : undefined}
        className={`relative w-full group flex items-center ${
          collapsed ? "justify-center px-2" : "justify-between px-3.5"
        } py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#f2b705] ${
          isActive
            ? "bg-white/10 text-white font-bold"
            : "text-[#f7f4ea]/90 font-medium hover:bg-white/10 hover:text-white"
        }`}
      >
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#f2b705]"
          />
        )}

        <span className="flex items-center gap-3 min-w-0">
          <Icon
            className={`w-5 h-5 shrink-0 transition-colors ${
              isActive
                ? "text-[#f2b705]"
                : "text-[#f7f4ea]/85 group-hover:text-white"
            }`}
          />
          {!collapsed && (
            <span className="truncate leading-relaxed">{label}</span>
          )}
        </span>

        {!collapsed && (
          <svg
            aria-hidden="true"
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            } ${isActive ? "text-[#f2b705]" : "text-[#f7f4ea]/70"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {/* Expanded Sidebar: Smooth Height Accordion */}
      {!collapsed && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-1 ml-4 pl-3 border-l border-white/15 space-y-1 py-0.5">
              {children.map((child) => {
                const childActive = isAdminPathActive(pathname, child.href);
                const childLabel = isBn ? child.labelBn : child.labelEn;
                return (
                  <Link
                    key={child.href}
                    href={withLocaleHref(child.href, locale)}
                    aria-current={childActive ? "page" : undefined}
                    className={`relative flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#f2b705] ${
                      childActive
                        ? "bg-white/15 text-[#f2b705] font-bold"
                        : "text-[#f7f4ea]/85 hover:bg-white/10 hover:text-white font-medium"
                    }`}
                  >
                    <span className="truncate leading-relaxed">
                      {childLabel}
                    </span>
                    {child.status === "cooking" && <CookingPill isBn={isBn} />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Rail Mode: Floating One-Tap Flyout */}
      {collapsed && flyoutOpen && (
        <div
          role="menu"
          className="absolute left-full top-0 ml-2 z-50 w-60 rounded-2xl bg-[#004d38] border border-[#f2b705]/30 shadow-2xl p-2 space-y-1 text-white"
        >
          <div className="px-3 py-1.5 border-b border-white/10 text-[11px] font-extrabold uppercase tracking-wider text-[#f2b705] leading-relaxed">
            {label}
          </div>
          {children.map((child) => {
            const childActive = isAdminPathActive(pathname, child.href);
            const childLabel = isBn ? child.labelBn : child.labelEn;
            return (
              <Link
                key={child.href}
                href={withLocaleHref(child.href, locale)}
                onClick={() => setFlyoutOpen(false)}
                aria-current={childActive ? "page" : undefined}
                className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#f2b705] ${
                  childActive
                    ? "bg-white/15 text-[#f2b705] font-bold"
                    : "text-[#f7f4ea] hover:bg-white/10 font-medium"
                }`}
              >
                <span className="truncate leading-relaxed">{childLabel}</span>
                {child.status === "cooking" && <CookingPill isBn={isBn} />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
