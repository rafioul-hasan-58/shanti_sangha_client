"use client";

import React from "react";
import Link from "next/link";

export type StatCardTheme = "primary" | "accent" | "secondary" | "teal";

interface ThemeStyle {
  card: string;
  topBar: string;
  glow: string;
  iconBox: string;
  title: string;
  divider: string;
  action: string;
}

const CARD_THEMES: Record<StatCardTheme, ThemeStyle> = {
  primary: {
    card: "bg-gradient-to-br from-white via-white to-[#006a4e]/10 border-[#006a4e]/20",
    topBar: "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]",
    glow: "bg-[#006a4e]/15",
    iconBox: "bg-[var(--primary)] text-white shadow-sm",
    title: "text-[#004d38]/85",
    divider: "border-[#006a4e]/10",
    action: "text-[var(--primary)] hover:text-[var(--primary-dark)]",
  },
  accent: {
    card: "bg-gradient-to-br from-white via-white to-[#f42a41]/10 border-[#f42a41]/25",
    topBar: "bg-gradient-to-r from-[var(--accent)] to-[#ff6b7b]",
    glow: "bg-[#f42a41]/15",
    iconBox: "bg-[var(--accent)] text-white shadow-sm",
    title: "text-[#b81d30]/85",
    divider: "border-[#f42a41]/15",
    action: "text-[var(--accent)] hover:text-[#c81e32]",
  },
  secondary: {
    card: "bg-gradient-to-br from-white via-[#f7f4ea]/60 to-[#f2b705]/15 border-[#f2b705]/35",
    topBar: "bg-gradient-to-r from-[var(--secondary)] to-[#d99b00]",
    glow: "bg-[#f2b705]/20",
    iconBox: "bg-[var(--secondary)] text-[var(--text)] shadow-sm",
    title: "text-[#8a6500]",
    divider: "border-[#f2b705]/20",
    action: "text-[#9c7200] hover:text-[#735300]",
  },
  teal: {
    card: "bg-gradient-to-br from-white via-white to-[#00a67e]/10 border-[#00a67e]/25",
    topBar: "bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)]",
    glow: "bg-[#00a67e]/15",
    iconBox: "bg-[var(--primary-light)] text-white shadow-sm",
    title: "text-[#006a4e]/85",
    divider: "border-[#00a67e]/15",
    action: "text-[#007a5c] hover:text-[var(--primary-dark)]",
  },
};

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: StatCardTheme;
  trend?: {
    value: number;
    label?: string;
    invertColor?: boolean;
  };
  badge?: {
    text: string;
    variant?: "red" | "gold" | "green";
  };
  actionLink?: {
    href: string;
    label: string;
  };
  onActionClick?: () => void;
}

export default function StatCard({
  title,
  value,
  icon,
  variant = "primary",
  trend,
  badge,
  actionLink,
  onActionClick,
}: StatCardProps) {
  const theme = CARD_THEMES[variant];
  const isPositive = trend ? trend.value >= 0 : false;
  const isGood = trend?.invertColor ? !isPositive : isPositive;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-5 border shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between ${theme.card}`}
    >
      {/* Top theme accent bar */}
      <div className={`absolute inset-x-0 top-0 h-1 ${theme.topBar}`} />
      {/* Subtle decorative corner glow */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl ${theme.glow}`}
      />

      {/* Top Header: Icon & Optional Badge */}
      <div className="relative flex items-start justify-between gap-3 mb-4">
        <div
          className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ${theme.iconBox}`}
        >
          {icon}
        </div>

        {badge && (
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide border shadow-2xs ${
              badge.variant === "red"
                ? "bg-[#f42a41]/10 text-[var(--accent)] border-[#f42a41]/30"
                : badge.variant === "gold"
                ? "bg-[#f2b705]/20 text-[#9c7200] border-[#f2b705]/45"
                : "bg-[#006a4e]/10 text-[var(--primary)] border-[#006a4e]/25"
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {/* Main Stat Metric */}
      <div className="relative">
        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${theme.title}`}>
          {title}
        </p>
        <h3 className="text-2xl sm:text-[26px] font-black text-[var(--text)] tracking-tight leading-tight">
          {value}
        </h3>
      </div>

      {/* Bottom Footer: Trend and / or Review Link */}
      <div className={`relative mt-4 pt-3 border-t flex items-center justify-between gap-2 flex-wrap ${theme.divider}`}>
        {trend ? (
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md ${
                isGood
                  ? "bg-[#006a4e]/10 text-[var(--primary)]"
                  : "bg-[#f42a41]/10 text-[var(--accent)]"
              }`}
            >
              {isPositive ? (
                <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              <span>
                {isPositive ? "+" : ""}
                {trend.value}%
              </span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {trend.label || "vs last month"}
            </span>
          </div>
        ) : (
          <div />
        )}

        {actionLink && (
          <Link
            href={actionLink.href}
            onClick={onActionClick}
            className={`inline-flex items-center gap-1 text-xs font-extrabold hover:underline transition-colors ${theme.action}`}
          >
            <span>{actionLink.label}</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
