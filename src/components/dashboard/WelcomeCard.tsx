"use client";

import React, { type ReactNode } from "react";
import { FULL_BRAND_NAME_EN } from "@/lib/constants/site";

interface WelcomeCardProps {
  adminName?: string;
  locale?: string;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  rightContent?: ReactNode;
}

export default function WelcomeCard({
  adminName = "Admin",
  locale = "en",
  badgeText,
  title,
  subtitle,
  rightContent,
}: WelcomeCardProps) {
  const isBn = locale === "bn";

  // Formatted current date
  const now = new Date();
  const dateStr = now.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const resolvedBadge =
    badgeText ??
    (isBn ? "অ্যাডমিন পোর্টাল এক্সিকিউটিভ প্যানেল" : "ADMIN EXECUTIVE SUITE");
  const resolvedTitle =
    title ??
    (isBn ? `স্বাগতম, ${adminName}!` : `Welcome back, ${adminName}!`);
  const resolvedSubtitle =
    subtitle ??
    (isBn
      ? "সাভারচালা শান্তি সংঘের আর্থিক আয়-ব্যয় হিসাব, টুর্নামেন্ট বাজেট ও ক্লাব পরিচালনা নিয়ন্ত্রণ কেন্দ্র।"
      : `${FULL_BRAND_NAME_EN} financial oversight, tournament budget allocation & operations command.`);

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #004d38 0%, #006a4e 50%, #00a67e 100%)",
      }}
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white shadow-md border border-emerald-900/20"
    >
      {/* Decorative background subtle glow & crest shape */}
      <div className="absolute -right-8 -bottom-10 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute right-12 top-6 w-32 h-32 rounded-full bg-[#f2b705]/10 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          {/* Gold Accent Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-[#f2b705]/40 text-[#f2b705] text-xs font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2b705] animate-pulse" />
            <span>{resolvedBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {resolvedTitle}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed font-medium">
            {resolvedSubtitle}
          </p>
        </div>

        {/* Date / Custom Right Slot */}
        <div className="shrink-0 flex flex-col sm:items-end justify-center">
          {rightContent ?? (
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-right">
              <p className="text-[11px] font-bold text-[#f2b705] uppercase tracking-wider">
                {isBn ? "আজকের তারিখ" : "TODAY"}
              </p>
              <p className="text-sm font-extrabold text-white">{dateStr}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
