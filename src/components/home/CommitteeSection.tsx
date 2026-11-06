"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { committeeMembers } from "@/data/committee";

export default function CommitteeSection({ locale }: { locale: Locale }) {
  const [showAll, setShowAll] = useState(false);
  const isBn = locale === "bn";

  // Initially show 8 members (2 rows of 4 on desktop), expand to all 16 on click
  const visibleMembers = showAll ? committeeMembers : committeeMembers.slice(0, 8);

  return (
    <section id="committee" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <span className="inline-block bg-[#006a4e]/10 text-[#006a4e] text-xs font-extrabold uppercase px-3 py-1 rounded-sm tracking-widest border border-[#006a4e]/20">
            {isBn ? "নেতৃত্ব ও ব্যবস্থাপনা" : "LEADERSHIP & MANAGEMENT"}
          </span>
          <h2 className="font-display text-3xl font-extrabold text-pitch mt-2">
            {isBn ? "কার্যনির্বাহী কমিটি" : "Executive Committee"}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-brand-600 font-medium">
          {isBn
            ? `মোট ${committeeMembers.length} জন সদস্য দ্বারা পরিচালিত পরিষদ`
            : `Governing council of ${committeeMembers.length} executive members`}
        </p>
      </div>

      {/* Grid of Committee Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {visibleMembers.map((member, idx) => {
          const name = isBn ? member.nameBn : member.nameEn;
          const role = isBn ? member.roleBn : member.roleEn;

          return (
            <Link
              key={member.id}
              href={`/${locale}/${member.id}`}
              className="group rounded-2xl border border-brand-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-[#006a4e]/40 transition-all flex flex-col items-center text-center animate-in fade-in duration-300 block cursor-pointer"
            >
              {/* Photo */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-4 ring-2 ring-brand-100 group-hover:ring-[#006a4e] group-hover:scale-105 transition-all bg-brand-50 shadow-xs shrink-0">
                <Image
                  src={member.image}
                  alt={name}
                  width={120}
                  height={120}
                  priority={idx < 4}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Name */}
              <h3 className="font-bold text-sm sm:text-base text-pitch group-hover:text-[#006a4e] transition-colors leading-snug">
                {name}
              </h3>

              {/* Role badge */}
              <div className="mt-2">
                <span className="inline-block rounded-full bg-brand-50 border border-brand-200/70 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#006a4e]">
                  {role}
                </span>
              </div>

              <div className="mt-3 text-[11px] font-bold text-[#006a4e] inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:underline">
                <span>{isBn ? "বিস্তারিত দেখুন" : "View Details"}</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All / Show Less Button */}
      <div className="mt-10 flex justify-center">
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
              ? `সকল সদস্য দেখুন (${committeeMembers.length})`
              : `View All Committee Members (${committeeMembers.length})`}
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
    </section>
  );
}

