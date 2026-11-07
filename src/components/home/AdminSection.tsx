"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { digitalAdmins } from "@/data/admins";

interface Props {
  locale: Locale;
}

export default function AdminSection({ locale }: Props) {
  const isBn = locale === "bn";

  return (
    <section id="media-admin" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-block bg-[#006a4e]/10 text-[#006a4e] text-xs font-extrabold uppercase px-3 py-1 rounded-sm tracking-widest border border-[#006a4e]/20">
            {isBn ? "ডিজিটাল ও মিডিয়া উইং" : "DIGITAL & MEDIA WING"}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-pitch mt-2 flex items-center gap-2">
            <span>{isBn ? "ফেসবুক ও ওয়েবসাইট অ্যাডমিন প্যানেল" : "Facebook & Website Admin Panel"}</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-600 font-medium mt-1">
            {isBn
              ? `মোট ১২ জন সদস্য দ্বারা পরিচালিত ক্লাবের অফিসিয়াল ওয়েবসাইট, পেজ ও ডিজিটাল প্রযুক্তি দল`
              : `12-member dedicated team managing official website, Facebook page & digital media`}
          </p>
        </div>

        {/* Facebook Link Pill */}
        <div className="shrink-0">
          <a
            href="https://web.facebook.com/s.s.royals2007"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 px-4 py-2 text-xs font-bold transition-all shadow-xs"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>{isBn ? "অফিসিয়াল পেজে যান" : "Visit Official Page"}</span>
          </a>
        </div>
      </div>

      {/* Grid of Admin Cards (12 Members) */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {digitalAdmins.map((admin, idx) => {
          const name = isBn ? admin.nameBn : admin.nameEn;
          const role = isBn ? admin.adminRoleBn : admin.adminRoleEn;
          const badge = isBn ? admin.badgeBn : admin.badgeEn;

          return (
            <Link
              key={admin.id}
              href={`/${locale}/${admin.id}`}
              className="group rounded-2xl border border-brand-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-[#006a4e]/40 transition-all flex flex-col items-center text-center animate-in fade-in duration-300 block cursor-pointer"
            >
              {/* Photo */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden mb-4 ring-2 ring-brand-100 group-hover:ring-[#006a4e] group-hover:scale-105 transition-all bg-brand-50 shadow-xs shrink-0">
                <Image
                  src={admin.image}
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

              {/* Admin Badge */}
              {badge && (
                <div className="mt-2">
                  <span className="inline-block rounded-full bg-[#006a4e]/10 border border-[#006a4e]/20 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide text-[#006a4e]">
                    {badge}
                  </span>
                </div>
              )}

              {/* Role Title */}
              <p className="mt-2 text-xs text-brand-600 line-clamp-2 leading-relaxed">
                {role}
              </p>

              {/* View Details Link */}
              <div className="mt-3 text-[11px] font-bold text-[#006a4e] inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:underline">
                <span>{isBn ? "বিস্তারিত দেখুন" : "View Details"}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
