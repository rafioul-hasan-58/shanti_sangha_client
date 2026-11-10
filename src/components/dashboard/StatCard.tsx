"use client";

import React from "react";
import Link from "next/link";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number; // e.g. 8.5 or -14.2
    label?: string; // e.g. "vs last month"
    invertColor?: boolean; // if positive is bad or negative is good (e.g. pending members)
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
  accentColor?: string; // Optional custom top border or accent
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  badge,
  actionLink,
  onActionClick,
}: StatCardProps) {
  // Determine trend color (default: positive = green, negative = red)
  const isPositive = trend ? trend.value >= 0 : false;
  const isGood = trend?.invertColor ? !isPositive : isPositive;

  return (
    <div className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top Header: Icon & Optional Badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#006a4e] border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
          {icon}
        </div>

        {badge && (
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide border shadow-2xs ${
              badge.variant === "red"
                ? "bg-[#f42a41]/10 text-[#f42a41] border-[#f42a41]/30"
                : badge.variant === "gold"
                ? "bg-[#f2b705]/15 text-[#b48300] border-[#f2b705]/40"
                : "bg-emerald-50 text-[#006a4e] border-emerald-200"
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {/* Main Stat Metric */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-black text-[#12231d] tracking-tight">
          {value}
        </h3>
      </div>

      {/* Bottom Footer: Trend and / or Review Link */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        {trend ? (
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md ${
                isGood
                  ? "bg-emerald-50 text-[#006a4e]"
                  : "bg-[#f42a41]/10 text-[#f42a41]"
              }`}
            >
              {isPositive ? (
                <svg
                  className="w-3.5 h-3.5 stroke-[2.5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg
                  className="w-3.5 h-3.5 stroke-[2.5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              <span>
                {isPositive ? "+" : ""}
                {trend.value}%
              </span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {trend.label || "vs last month"}
            </span>
          </div>
        ) : (
          <div />
        )}

        {/* Action Link (e.g. Review link for Pending Members) */}
        {actionLink && (
          <Link
            href={actionLink.href}
            onClick={onActionClick}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#006a4e] hover:text-[#004d38] hover:underline transition-colors"
          >
            <span>{actionLink.label}</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
