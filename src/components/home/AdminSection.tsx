"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { digitalAdmins } from "@/data/admins";

interface Props {
  locale: Locale;
}

export default function AdminSection({ locale }: Props) {
  const [showAll, setShowAll] = useState(false);
  const isBn = locale === "bn";

  // Initially show 8 admins (2 rows of 4 on desktop), expand to all 12 on click
  const visibleAdmins = showAll ? digitalAdmins : digitalAdmins.slice(0, 8);

  return (
    <section id="media-admin" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
      {/* Distinctive Section Container Frame */}
      <div className="rounded-3xl bg-gradient-to-b from-[#eaf6f0] via-[#f3f9f5] to-[#e5f4ec] border border-[#006a4e]/25 p-5 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle Decorative Ambient Lighting */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#1877F2]/12 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#006a4e]/10 text-[#006a4e] text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-widest border border-[#006a4e]/25">
              <span className="w-2 h-2 rounded-full bg-[#006a4e] animate-pulse" />
              <span>{isBn ? "ডিজিটাল ও মিডিয়া উইং" : "DIGITAL & MEDIA WING"}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-pitch mt-2 flex items-center gap-2">
              <span>{isBn ? "ফেসবুক ও ওয়েবসাইট অ্যাডমিন প্যানেল" : "Facebook & Website Admin Panel"}</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-700 font-medium mt-1">
              {isBn
                ? `মোট ${digitalAdmins.length} জন সদস্য দ্বারা পরিচালিত ক্লাবের অফিসিয়াল ওয়েবসাইট, পেজ ও ডিজিটাল প্রযুক্তি দল`
                : `${digitalAdmins.length}-member dedicated team managing official website, Facebook page & digital media`}
            </p>
          </div>

          {/* Facebook Link Pill */}
          <div className="shrink-0">
            <a
              href="https://web.facebook.com/s.s.royals2007"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 px-4 py-2 text-xs font-bold transition-all shadow-xs group"
            >
              <svg className="w-3.5 h-3.5 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{isBn ? "অফিসিয়াল পেজে যান" : "Visit Official Page"}</span>
            </a>
          </div>
        </div>

        {/* Grid of Admin Cards (8 initially, 12 when expanded) */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
          {visibleAdmins.map((admin, idx) => {
            const name = isBn ? admin.nameBn : admin.nameEn;
            const role = isBn ? admin.adminRoleBn : admin.adminRoleEn;
            const badge = isBn ? admin.badgeBn : admin.badgeEn;

            // Distinct tech indicator icon based on role/portfolio
            const iconBadge =
              admin.id === "harun"
                ? "👑"
                : admin.id === "asraful"
                ? "🎬"
                : admin.id === "mahbub"
                ? "📝"
                : admin.id === "alamin"
                ? "📈"
                : admin.id === "himel"
                ? "📱"
                : admin.id === "adil"
                ? "⚡"
                : admin.id === "sourav"
                ? "💻"
                : admin.id === "rishan"
                ? "🎥"
                : admin.id === "shahin"
                ? "🏛️"
                : admin.id === "sojol"
                ? "📡"
                : admin.id === "labib"
                ? "🏏"
                : admin.id === "sohan"
                ? "📢"
                : "🌐";

            return (
              <Link
                key={admin.id}
                href={`/${locale}/${admin.id}`}
                className="group rounded-2xl border border-[#006a4e]/20 bg-white/95 backdrop-blur-xs p-5 shadow-xs hover:shadow-xl hover:border-[#006a4e] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center animate-in fade-in block cursor-pointer"
              >
                {/* Photo Frame: Circular with dual-color tech gradient ring */}
                <div className="relative mb-4 shrink-0">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#006a4e] via-[#059669] to-[#1877F2] shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                      <Image
                        src={admin.image}
                        alt={name}
                        fill
                        unoptimized={admin.image.endsWith(".svg")}
                        sizes="(max-width: 640px) 96px, 112px"
                        priority={idx < 4}
                        className="object-cover object-top"
                      />
                    </div>
                  </div>

                  {/* Corner Portfolio Emblem */}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#006a4e] text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
                    {iconBadge}
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-bold text-sm sm:text-base text-pitch group-hover:text-[#006a4e] transition-colors leading-snug">
                  {name}
                </h3>

                {/* Admin Designation Badge (Single, Non-Redundant) */}
                <div className="mt-2.5">
                  <span className="inline-block rounded-full bg-[#006a4e]/10 border border-[#006a4e]/20 px-3 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide text-[#006a4e]">
                    {badge || role}
                  </span>
                </div>

                {/* View Details Link */}
                <div className="mt-3 text-[11px] font-bold text-[#006a4e] inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:underline">
                  <span>{isBn ? "বিস্তারিত দেখুন" : "View Details"}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All / Show Less Button */}
        {digitalAdmins.length > 8 && (
          <div className="mt-10 flex justify-center relative z-10">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-full bg-[#006a4e] px-8 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-[#005a42] hover:shadow-lg active:scale-95 transition-all"
            >
              <span>
                {showAll
                  ? isBn
                    ? "সংক্ষেপ করুন"
                    : "Show Less"
                  : isBn
                  ? `সকল অ্যাডমিন দেখুন (${digitalAdmins.length})`
                  : `View All Admins (${digitalAdmins.length})`}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  showAll ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
