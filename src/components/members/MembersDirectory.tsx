"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { allClubMembers, type MemberCategory, type ClubMember } from "@/data/members";

export default function MembersDirectory({ locale }: { locale: Locale }) {
  const isBn = locale === "bn";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MemberCategory>("all");

  const categories: { key: MemberCategory; labelBn: string; labelEn: string }[] = [
    { key: "all", labelBn: "সকল সদস্য", labelEn: "All Members" },
    { key: "executive", labelBn: "কার্যনির্বাহী কমিটি", labelEn: "Executive Committee" },
    { key: "general", labelBn: "সাধারণ সদস্য", labelEn: "General Members" },
    { key: "advisor", labelBn: "উপদেষ্টামণ্ডলী", labelEn: "Advisors" },
    { key: "player", labelBn: "খেলোয়াড়বৃন্দ", labelEn: "Players" },
  ];

  // Filter members based on search query and category
  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allClubMembers.filter((member) => {
      // Category filter
      if (selectedCategory !== "all" && member.category !== selectedCategory) {
        return false;
      }

      // Search query filter (matches Bangla name, English name, Member ID, or Role)
      if (q) {
        const matchesBn = member.nameBn.toLowerCase().includes(q);
        const matchesEn = member.nameEn.toLowerCase().includes(q);
        const matchesId = member.memberId.toLowerCase().includes(q);
        const matchesRoleBn = member.roleBn.toLowerCase().includes(q);
        const matchesRoleEn = member.roleEn.toLowerCase().includes(q);
        const matchesVillage = member.villageBn.toLowerCase().includes(q) || member.villageEn.toLowerCase().includes(q);

        return matchesBn || matchesEn || matchesId || matchesRoleBn || matchesRoleEn || matchesVillage;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <span className="inline-block bg-[#006a4e]/10 text-[#006a4e] text-xs font-extrabold uppercase px-3 py-1 rounded-sm tracking-widest border border-[#006a4e]/20">
          {isBn ? "সাভারচালা শান্তি সংঘ সদস্য ডিরেক্টরি" : "SHANTI SANGHA MEMBER DIRECTORY"}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-pitch tracking-tight">
          {isBn ? "আমাদের সম্মানিত সদস্যবৃন্দ" : "Our Respected Members"}
        </h1>
        <p className="text-sm sm:text-base text-brand-700 leading-relaxed font-sans">
          {isBn
            ? "২০০৭ সাল থেকে সাভারচালা শান্তি সংঘের অগ্রযাত্রায় নিবেদিত সকল সম্মানিত উপদেষ্টা, কার্যনির্বাহী সদস্য, সাধারণ সদস্য ও ক্রীড়াবিদদের তালিকা।"
            : "The dedicated advisors, executive committee members, general members, and athletes powering Shavarchala Shanti Sangha since 2007."}
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-3xl bg-white border border-brand-200/90 p-5 sm:p-7 shadow-sm mb-10 space-y-5">
        {/* Search Bar Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isBn
                ? "নাম দিয়ে সদস্য খুঁজুন... (যেমন: মাহফুজ, রাকিব, সৌরভ, Mustakim...)"
                : "Search member by name... (e.g. Mahfuz, Rakib, Sourav, Mustakim...)"
            }
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-brand-200 bg-brand-50/40 text-pitch text-sm sm:text-base placeholder-brand-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-400 hover:text-pitch"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Pills & Count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-[#006a4e] text-white shadow-xs"
                      : "bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-pitch"
                  }`}
                >
                  {isBn ? cat.labelBn : cat.labelEn}
                </button>
              );
            })}
          </div>

          <div className="text-xs font-bold text-brand-600 shrink-0">
            {isBn
              ? `মোট পাওয়া গেছে: ${filteredMembers.length} জন`
              : `Found: ${filteredMembers.length} members`}
          </div>
        </div>
      </div>

      {/* Member Cards Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} isBn={isBn} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl bg-white border border-dashed border-brand-300 p-12 text-center max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-[#006a4e] flex items-center justify-center mx-auto mb-4 text-2xl">
            🔍
          </div>
          <h3 className="font-display text-lg font-bold text-pitch">
            {isBn ? "কোনো সদস্য পাওয়া যায়নি" : "No Members Found"}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-brand-600">
            {isBn
              ? `"${searchQuery}" নামে কোনো সদস্য তালিকায় নেই। বানান যাচাই করে পুনরায় চেষ্টা করুন।`
              : `No member matched "${searchQuery}". Please check the spelling or clear the filter.`}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-5 px-5 py-2 rounded-xl bg-[#006a4e] text-white text-xs font-bold shadow-xs hover:bg-[#005a42] transition-colors"
          >
            {isBn ? "অনুসন্ধান রিসেট করুন" : "Reset Search"}
          </button>
        </div>
      )}

      {/* Registration CTA banner */}
      <div className="mt-16 rounded-3xl bg-gradient-to-r from-[#006a4e] to-[#005a42] text-white p-8 sm:p-10 shadow-lg border-b-4 border-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display text-2xl font-bold">
            {isBn ? "আপনিও কি সাভারচালা শান্তি সংঘের সদস্য হতে চান?" : "Want to Become a Member of Shanti Sangha?"}
          </h3>
          <p className="text-white/85 text-xs sm:text-sm max-w-xl">
            {isBn
              ? "ক্লাবের নিয়মিত খেলাধুলা, বাৎসরিক টুর্নামেন্ট ও সামাজিক কর্মকাণ্ডে সক্রিয়ভাবে অংশ নিতে এখনই নিবন্ধন করুন।"
              : "Register today to participate in our regular sports, annual SPL tournament, and community leadership programs."}
          </p>
        </div>
        <Link
          href={`/${locale}/register`}
          className="shrink-0 px-6 py-3 rounded-xl bg-white text-[#006a4e] font-extrabold text-sm uppercase tracking-wider hover:bg-neutral-100 transition-all shadow-md active:scale-95"
        >
          {isBn ? "সদস্য হিসেবে যোগ দিন" : "Join As Member"}
        </Link>
      </div>
    </div>
  );
}

function MemberCard({ member, isBn }: { member: ClubMember; isBn: boolean }) {
  // Category styling
  const categoryBadge = {
    executive: {
      bg: "bg-emerald-50 text-[#006a4e] border-emerald-200",
      labelBn: "কার্যনির্বাহী",
      labelEn: "Executive",
    },
    general: {
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      labelBn: "সাধারণ সদস্য",
      labelEn: "General",
    },
    advisor: {
      bg: "bg-purple-50 text-purple-700 border-purple-200",
      labelBn: "উপদেষ্টা",
      labelEn: "Advisor",
    },
    player: {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      labelBn: "খেলোয়াড়",
      labelEn: "Player",
    },
  }[member.category];

  return (
    <div className="group rounded-2xl border border-brand-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-[#006a4e]/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top bar: Member ID & Category Pill */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="font-mono text-[10px] font-bold text-brand-500 uppercase tracking-wider">
            {member.memberId}
          </span>
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${categoryBadge.bg}`}
          >
            {isBn ? categoryBadge.labelBn : categoryBadge.labelEn}
          </span>
        </div>

        {/* Member Avatar / Photo */}
        <div className="relative mx-auto w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-[#006a4e]/20 group-hover:border-[#006a4e] group-hover:scale-105 transition-all duration-300 shadow-xs bg-brand-50">
          {member.image ? (
            <Image
              src={member.image}
              alt={isBn ? member.nameBn : member.nameEn}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#006a4e] to-[#005a42] text-white font-display text-2xl font-bold">
              {member.nameEn.charAt(0)}
            </div>
          )}
        </div>

        {/* Name & Role */}
        <div className="text-center">
          <h3 className="font-display text-base font-bold text-pitch group-hover:text-[#006a4e] transition-colors line-clamp-1">
            {isBn ? member.nameBn : member.nameEn}
          </h3>
          <p className="mt-1 text-xs font-semibold text-[#006a4e] line-clamp-1">
            {isBn ? member.roleBn : member.roleEn}
          </p>
          <p className="text-[11px] text-brand-500 mt-0.5">
            {isBn ? member.nameEn : member.nameBn}
          </p>
        </div>
      </div>

      {/* Bottom Meta Information */}
      <div className="mt-4 pt-3 border-t border-brand-100 grid grid-cols-2 gap-2 text-[11px] text-brand-600">
        <div>
          <span className="block text-[10px] text-brand-400 font-semibold uppercase">
            {isBn ? "রক্তের গ্রুপ" : "Blood"}
          </span>
          <span className="font-bold text-red-600">
            🩸 {member.bloodGroup || "—"}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-[10px] text-brand-400 font-semibold uppercase">
            {isBn ? "যোগদান" : "Joined"}
          </span>
          <span className="font-bold text-pitch">
            {member.joiningYear}
          </span>
        </div>
      </div>
    </div>
  );
}

