"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ADMIN_NAV_ITEMS,
  MOBILE_BOTTOM_TAB_IDS,
  isAdminPathActive,
  withLocaleHref,
  type NavItem,
} from "@/lib/config/adminNav";
import MobileNavSheet from "./MobileNavSheet";

interface MobileBottomNavProps {
  locale: string;
}

/**
 * Mobile bottom navigation bar (`< md`) with 4 primary tabs:
 * Dashboard (direct link), Committee / Pioneers / Admin (one-tap bottom sheet).
 */
export default function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const pathname = usePathname() || "";
  const isBn = locale === "bn";
  const [sheetItem, setSheetItem] = useState<NavItem | null>(null);

  const primaryTabs = MOBILE_BOTTOM_TAB_IDS.map((id) =>
    ADMIN_NAV_ITEMS.find((item) => item.id === id)
  ).filter((item): item is NavItem => Boolean(item));

  return (
    <>
      <nav
        aria-label="Mobile admin navigation"
        style={{
          background:
            "linear-gradient(90deg, #004d38 0%, #006a4e 50%, #004d38 100%)",
        }}
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#f2b705]/30 shadow-2xl"
      >
        <div className="grid grid-cols-4 h-16 px-1">
          {primaryTabs.map((item) => {
            const Icon = item.icon;
            const tabLabel = isBn
              ? item.shortLabelBn || item.labelBn
              : item.shortLabelEn || item.labelEn;

            const isTabActive = item.href
              ? isAdminPathActive(pathname, item.href)
              : Boolean(
                  item.children?.some((child) =>
                    isAdminPathActive(pathname, child.href)
                  )
                ) || sheetItem?.id === item.id;

            if (item.href && !item.children?.length) {
              return (
                <Link
                  key={item.id}
                  href={withLocaleHref(item.href, locale)}
                  onClick={() => setSheetItem(null)}
                  aria-current={isTabActive ? "page" : undefined}
                  className={`relative flex flex-col items-center justify-center gap-1 rounded-xl mx-0.5 my-1 transition-colors focus-visible:ring-2 focus-visible:ring-[#f2b705] ${
                    isTabActive
                      ? "bg-white/15 text-[#f2b705] font-extrabold"
                      : "text-[#f7f4ea]/85 hover:text-white font-semibold"
                  }`}
                >
                  {isTabActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-4 right-4 h-0.5 rounded-b-full bg-[#f2b705]"
                    />
                  )}
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-[11px] truncate max-w-full px-1 leading-tight">
                    {tabLabel}
                  </span>
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                aria-expanded={sheetItem?.id === item.id}
                onClick={() =>
                  setSheetItem((prev) => (prev?.id === item.id ? null : item))
                }
                className={`relative flex flex-col items-center justify-center gap-1 rounded-xl mx-0.5 my-1 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#f2b705] ${
                  isTabActive
                    ? "bg-white/15 text-[#f2b705] font-extrabold"
                    : "text-[#f7f4ea]/85 hover:text-white font-semibold"
                }`}
              >
                {isTabActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-4 right-4 h-0.5 rounded-b-full bg-[#f2b705]"
                  />
                )}
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[11px] truncate max-w-full px-1 leading-tight">
                  {tabLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <MobileNavSheet
        item={sheetItem}
        locale={locale}
        pathname={pathname}
        onClose={() => setSheetItem(null)}
      />
    </>
  );
}

