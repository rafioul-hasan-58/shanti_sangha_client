"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { PersonDetail } from "@/data/people";
import { allPeople } from "@/data/people";

interface Props {
  person: PersonDetail;
  locale: Locale;
}

export default function PersonDetailsView({ person, locale }: Props) {
  const isBn = locale === "bn";
  const [copied, setCopied] = useState(false);

  const name = isBn ? person.nameBn : person.nameEn;
  const secondaryName = isBn ? person.nameEn : person.nameBn;
  const role = isBn ? person.roleBn : person.roleEn;
  const badge = isBn ? person.badgeBn : person.badgeEn;
  const village = isBn ? person.villageBn : person.villageEn;
  const bio = isBn ? person.bioBn : person.bioEn;
  const responsibilities = isBn ? person.responsibilitiesBn : person.responsibilitiesEn;
  const quote = isBn ? person.quoteBn : person.quoteEn;

  // Other leaders to explore (exclude current person)
  const otherPeople = allPeople.filter((p) => p.id !== person.id).slice(0, 6);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-chalk pb-20">
      {/* Top Navigation & Breadcrumb Bar */}
      <div className="bg-[#006a4e] text-white border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3.5 flex items-center justify-between text-xs sm:text-sm">
          <Link
            href={`/${locale}${person.type === "pioneer" ? "#pioneer-of-peace" : "#committee"}`}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-bold transition-colors group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span>
              {isBn
                ? person.type === "pioneer"
                  ? "শান্তির অগ্রদূত সেকশনে ফিরুন"
                  : "কার্যনির্বাহী কমিটিতে ফিরুন"
                : person.type === "pioneer"
                ? "Back to Pioneers"
                : "Back to Committee"}
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-200">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {isBn ? "হোম" : "Home"}
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}${person.type === "pioneer" ? "#pioneer-of-peace" : "#committee"}`}
              className="hover:text-white transition-colors"
            >
              {person.type === "pioneer"
                ? isBn
                  ? "শান্তির অগ্রদূত"
                  : "Pioneers"
                : isBn
                ? "কমিটি"
                : "Committee"}
            </Link>
            <span>/</span>
            <span className="text-white font-bold truncate max-w-[160px]">{name}</span>
          </div>
        </div>
      </div>

      {/* Hero Showcase Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#005a42] via-[#006a4e] to-[#0A3123] text-white pt-10 pb-16 sm:pb-20 shadow-lg">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />

        <div className="mx-auto max-w-6xl px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10">
            {/* Portrait Photo Column */}
            <div className="relative shrink-0">
              <div
                className={`relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-3xl overflow-hidden shadow-2xl ring-4 ${
                  person.type === "pioneer"
                    ? "ring-amber-400/60 bg-[#d5eedd]"
                    : "ring-white/50 bg-white"
                }`}
              >
                <Image
                  src={person.image}
                  alt={name}
                  fill
                  unoptimized
                  priority
                  className="object-cover object-top"
                />
              </div>

              {/* Status Badge Over Photo */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-[#006a4e] text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-lg border-2 border-[#006a4e]/20 flex items-center gap-1.5">
                <span>{person.type === "pioneer" ? "👑" : "🏛️"}</span>
                <span>{role}</span>
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 text-center md:text-left space-y-3.5 pt-2">
              {/* Category & ID Chip */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full bg-white/15 text-white border border-white/25 backdrop-blur-xs">
                  <span>{badge}</span>
                </span>
                <span className="inline-block text-[11px] font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-black/30 text-emerald-200 border border-white/10">
                  {person.memberId}
                </span>
              </div>

              {/* Name Display */}
              <div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                  {name}
                </h1>
                <p className="text-base sm:text-lg font-semibold text-emerald-200/90 mt-1">
                  {secondaryName}
                </p>
              </div>

              {/* Club & Village Subtitle */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-1 gap-x-3 text-xs sm:text-sm text-white/90">
                <span className="font-bold flex items-center gap-1">
                  <span>⚽</span>
                  <span>{isBn ? "সাভারচালা শান্তি সংঘ" : "Shavarchala Shanti Sangha"}</span>
                </span>
                <span className="opacity-50">•</span>
                <span className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{village}</span>
                </span>
                <span className="opacity-50">•</span>
                <span className="flex items-center gap-1">
                  <span>📅</span>
                  <span>{isBn ? `যোগদান: ${person.joiningYear}` : `Joined: ${person.joiningYear}`}</span>
                </span>
              </div>

              {/* Inspirational Motto Quote if available */}
              {quote && (
                <div className="pt-2">
                  <blockquote className="text-xs sm:text-sm italic text-amber-200/90 bg-white/10 border-l-3 border-amber-400 px-3.5 py-2 rounded-r-xl max-w-xl">
                    "{quote}"
                  </blockquote>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#006a4e] hover:bg-brand-50 text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span>
                    {copied
                      ? isBn
                        ? "✓ লিংক কপি হয়েছে!"
                        : "✓ Link Copied!"
                      : isBn
                      ? "প্রোফাইল শেয়ার করুন"
                      : "Share Profile"}
                  </span>
                </button>

                <a
                  href="https://web.facebook.com/s.s.royals2007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2] text-white hover:bg-[#166fe5] text-xs font-bold shadow-md active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>{isBn ? "ক্লাব ফেসবুক পেজ" : "Club Facebook"}</span>
                </a>

                <Link
                  href={`/${locale}/members`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all"
                >
                  <span>👥</span>
                  <span>{isBn ? "সকল সদস্য ডিরেক্টরি" : "All Members"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="mx-auto max-w-6xl px-4 -mt-8 relative z-20 space-y-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-200/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#006a4e] flex items-center justify-center text-xl shrink-0">
              🏅
            </div>
            <div>
              <p className="text-[11px] font-bold text-brand-500 uppercase tracking-wider">
                {isBn ? "ক্লাবে পদবি" : "Designation"}
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-pitch truncate mt-0.5">
                {role}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-200/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
              📅
            </div>
            <div>
              <p className="text-[11px] font-bold text-brand-500 uppercase tracking-wider">
                {isBn ? "যোগদানের বছর" : "Joined"}
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-pitch truncate mt-0.5">
                {person.joiningYear}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-200/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl shrink-0">
              🩸
            </div>
            <div>
              <p className="text-[11px] font-bold text-brand-500 uppercase tracking-wider">
                {isBn ? "রক্তের গ্রুপ" : "Blood Group"}
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-pitch truncate mt-0.5">
                {person.bloodGroup}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-200/90 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
              📍
            </div>
            <div>
              <p className="text-[11px] font-bold text-brand-500 uppercase tracking-wider">
                {isBn ? "গ্রাম / এলাকা" : "Village"}
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-pitch truncate mt-0.5">
                {village}
              </p>
            </div>
          </div>
        </div>

        {/* Biography & Club Contribution Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-brand-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-brand-100">
            <span className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/80 text-[#006a4e] flex items-center justify-center text-lg">
              📖
            </span>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-pitch">
                {isBn ? "অভিভাষণ ও ক্লাবের সংক্ষিপ্ত ইতিবৃত্ত" : "Biography & Leadership Journey"}
              </h2>
              <p className="text-xs text-brand-600">
                {isBn
                  ? `সাভারচালা শান্তি সংঘে ${name}-এর অবদান`
                  : `Contributions of ${name} to Shanti Sangha`}
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-brand-800 leading-relaxed font-sans font-normal whitespace-pre-line">
            {bio}
          </p>

          {/* Key Responsibilities / Achievements */}
          <div className="pt-4 space-y-3.5">
            <h3 className="font-bold text-sm sm:text-base text-pitch flex items-center gap-2">
              <span className="text-[#006a4e]">✓</span>
              <span>{isBn ? "প্রধান দায়িত্ব ও সাংগঠনিক অবদান:" : "Key Roles & Responsibilities:"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {responsibilities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-brand-50/70 border border-brand-200/80 text-xs sm:text-sm text-brand-800 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-[#006a4e] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explore Other Leaders Section */}
        <div className="pt-4 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="inline-block bg-[#006a4e]/10 text-[#006a4e] text-xs font-extrabold uppercase px-3 py-1 rounded-sm tracking-wider">
                {isBn ? "ক্লাবের অন্যান্য নেতৃবৃন্দ" : "OTHER LEADERS & PIONEERS"}
              </span>
              <h2 className="font-display text-2xl font-extrabold text-pitch mt-1.5">
                {isBn ? "আরও নেতৃবৃন্দের প্রোফাইল দেখুন" : "Explore More Leaders"}
              </h2>
            </div>
            <Link
              href={`/${locale}/members`}
              className="text-xs sm:text-sm font-bold text-[#006a4e] hover:underline flex items-center gap-1"
            >
              <span>{isBn ? "সকল সদস্য ডিরেক্টরি দেখুন" : "View All Members Directory"}</span>
              <span>→</span>
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {otherPeople.map((other) => {
              const otherName = isBn ? other.nameBn : other.nameEn;
              const otherRole = isBn ? other.roleBn : other.roleEn;

              return (
                <Link
                  key={other.id}
                  href={`/${locale}/${other.slug}`}
                  className="group rounded-2xl border border-brand-200/80 bg-white p-3.5 shadow-xs hover:shadow-md hover:border-[#006a4e] transition-all flex flex-col items-center text-center"
                >
                  <div
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden mb-3 ring-2 group-hover:scale-105 transition-all shrink-0 ${
                      other.type === "pioneer"
                        ? "ring-amber-400/50 bg-[#d5eedd]"
                        : "ring-brand-200 bg-brand-50"
                    }`}
                  >
                    <Image
                      src={other.image}
                      alt={otherName}
                      fill
                      unoptimized
                      className="object-cover object-top"
                    />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-pitch group-hover:text-[#006a4e] transition-colors line-clamp-1 leading-snug">
                    {otherName}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-brand-600 font-medium line-clamp-1 mt-0.5">
                    {otherRole}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

