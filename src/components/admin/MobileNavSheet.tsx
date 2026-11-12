"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ADMIN_UI_COPY,
  isAdminPathActive,
  withLocaleHref,
  type NavItem,
} from "@/lib/config/adminNav";

interface MobileNavSheetProps {
  item: NavItem | null;
  locale: string;
  pathname: string;
  onClose: () => void;
}

/**
 * Slide-up bottom sheet displaying a parent group's children as >=52px one-tap rows.
 */
export default function MobileNavSheet({
  item,
  locale,
  pathname,
  onClose,
}: MobileNavSheetProps) {
  const isBn = locale === "bn";

  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  if (!item || !item.children?.length) return null;

  const Icon = item.icon;
  const parentTitle = isBn ? item.labelBn : item.labelEn;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex items-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-up Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={parentTitle}
        className="relative z-10 w-full rounded-t-3xl bg-white border-t border-[#006a4e]/20 shadow-2xl pb-6 pt-3 px-4 animate-sheet-up"
      >
        {/* Drag Handle */}
        <div
          aria-hidden="true"
          className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300"
        />

        {/* Sheet Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="h-9 w-9 rounded-xl bg-[#006a4e] text-[#f2b705] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </span>
            <h2 className="text-base font-black text-[#12231d] truncate leading-relaxed">
              {parentTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={
              isBn ? ADMIN_UI_COPY.closeSheetBn : ADMIN_UI_COPY.closeSheetEn
            }
            className="h-9 w-9 rounded-xl bg-[#f7f4ea] hover:bg-[#006a4e]/10 text-[#12231d] flex items-center justify-center font-bold cursor-pointer focus-visible:ring-2 focus-visible:ring-[#f2b705]"
          >
            ✕
          </button>
        </div>

        {/* One-tap Child Rows (min-h-[52px]) */}
        <div className="mt-3 space-y-2 max-h-[60vh] overflow-y-auto">
          {item.children.map((child) => {
            const active = isAdminPathActive(pathname, child.href);
            const childLabel = isBn ? child.labelBn : child.labelEn;

            return (
              <Link
                key={child.href}
                href={withLocaleHref(child.href, locale)}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`min-h-[52px] w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border text-sm transition-all focus-visible:ring-2 focus-visible:ring-[#f2b705] ${
                  active
                    ? "bg-[#006a4e] border-[#006a4e] text-white font-bold shadow-sm"
                    : "bg-[#f7f4ea]/70 border-[#006a4e]/15 text-[#12231d] font-semibold hover:bg-[#006a4e]/10"
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      active ? "bg-[#f2b705]" : "bg-[#006a4e]/40"
                    }`}
                  />
                  <span className="truncate leading-relaxed">{childLabel}</span>
                </span>

                <span className="shrink-0 flex items-center gap-2">
                  {child.status === "cooking" && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold leading-relaxed ${
                        active
                          ? "bg-[#f2b705] text-[#12231d]"
                          : "bg-[#f2b705]/25 border border-[#f2b705]/60 text-[#12231d]"
                      }`}
                    >
                      <span aria-hidden="true">🍳</span>
                      <span>
                        {isBn
                          ? ADMIN_UI_COPY.soonBadgeBn
                          : ADMIN_UI_COPY.soonBadgeEn}
                      </span>
                    </span>
                  )}
                  <svg
                    aria-hidden="true"
                    className={`w-4 h-4 ${
                      active ? "text-[#f2b705]" : "text-slate-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

