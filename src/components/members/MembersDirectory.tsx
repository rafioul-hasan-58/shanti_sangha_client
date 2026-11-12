"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import UserAvatar from "@/components/layout/UserAvatar";
import RoleBadge from "@/components/layout/RoleBadge";
import VerifiedTick from "@/components/common/VerifiedTick";
import ThemedSelect from "@/components/common/ThemedSelect";
import UserPaginationBar from "@/components/dashboard/UserPaginationBar";
import { isAdminVerified } from "@/lib/authRole";
import { BLOOD_GROUP_OPTIONS } from "@/lib/bloodGroup";
import { fetchPublicMembers } from "@/lib/api/users";
import { ROLE_OPTIONS } from "@/components/dashboard/userManagementConfig";
import type {
  ManagedUser,
  SortOrder,
  UserSortField,
  UsersPaginationMeta,
  UsersQueryParams,
} from "@/lib/types/dashboard";
import type { BloodGroup, MembershipType, Role } from "@/types";
import {
  BRAND_NAME_EN,
  BRAND_NAME_UPPER_EN,
  FULL_BRAND_NAME_EN,
} from "@/lib/constants/site";
import {
  MEMBER_CARD_PALETTES,
  MemberAuthProviderIcon,
  PlayerQuotaBadgeIcon,
  formatMemberJoinDate,
  getMemberBloodLabel,
  isMemberGoogleLogin,
  IoIosArrowForward,
} from "./MemberCardShared";
import MemberDetailsModal from "./MemberDetailsModal";

type QuickTabKey = "ALL" | "PLAYER_QUOTA" | "ADMIN";

const DEFAULT_META: UsersPaginationMeta = {
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const ICON_CLS = "w-3.5 h-3.5 shrink-0";

export default function MembersDirectory({ locale }: { locale: Locale }) {
  const isBn = locale === "bn";

  const [members, setMembers] = useState<ManagedUser[]>([]);
  const [meta, setMeta] = useState<UsersPaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [isMockFallback, setIsMockFallback] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<QuickTabKey>("ALL");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [membershipFilter, setMembershipFilter] = useState<MembershipType | "ALL">("ALL");
  const [bloodGroupFilter, setBloodGroupFilter] = useState<BloodGroup | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<UserSortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [selectedMember, setSelectedMember] = useState<{
    user: ManagedUser;
    paletteIndex: number;
  } | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    const params: UsersQueryParams = {
      page,
      limit,
      status: "ACTIVE",
      sortBy,
      sortOrder,
    };

    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (roleFilter !== "ALL") params.role = roleFilter;
    if (membershipFilter !== "ALL") params.membershipType = membershipFilter;
    if (bloodGroupFilter !== "ALL") params.bloodGroup = bloodGroupFilter;

    try {
      const res = await fetchPublicMembers(params);
      setMembers(res.users);
      setMeta(res.meta);
      setIsMockFallback(Boolean(res.isMockFallback));
    } catch {
      setMembers([]);
      setMeta(DEFAULT_META);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    sortBy,
    sortOrder,
    debouncedSearch,
    roleFilter,
    membershipFilter,
    bloodGroupFilter,
  ]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const handleQuickTab = (key: QuickTabKey) => {
    setActiveTab(key);
    setPage(1);
    if (key === "ALL") {
      setRoleFilter("ALL");
      setMembershipFilter("ALL");
    } else if (key === "PLAYER_QUOTA") {
      setRoleFilter("ALL");
      setMembershipFilter("PLAYER_QUOTA");
    } else if (key === "ADMIN") {
      setMembershipFilter("ALL");
      setRoleFilter("ADMIN");
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setActiveTab("ALL");
    setRoleFilter("ALL");
    setMembershipFilter("ALL");
    setBloodGroupFilter("ALL");
    setSortBy("createdAt");
    setSortOrder("asc");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    roleFilter !== "ALL" ||
    membershipFilter !== "ALL" ||
    bloodGroupFilter !== "ALL";

  const quickTabs: Array<{ key: QuickTabKey; labelBn: string; labelEn: string }> = [
    { key: "ALL", labelBn: "সকল সদস্য", labelEn: "All Members" },
    { key: "PLAYER_QUOTA", labelBn: "খেলোয়াড় কোটা", labelEn: "Player Quota" },
    { key: "ADMIN", labelBn: "অ্যাডমিন", labelEn: "Admins" },
  ];

  const sortOptions: Array<{ value: UserSortField; labelBn: string; labelEn: string }> = [
    { value: "createdAt", labelBn: "যোগদানের তারিখ", labelEn: "Joined Date" },
    { value: "fullName", labelBn: "নাম", labelEn: "Name" },
    { value: "role", labelBn: "রোল", labelEn: "Role" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
        <span className="inline-block bg-[#006a4e]/10 text-[#006a4e] text-xs font-extrabold uppercase px-3 py-1 rounded-sm tracking-widest border border-[#006a4e]/20">
          {isBn
            ? "সাভারচালা শান্তি সংঘ সদস্য ডিরেক্টরি"
            : `${BRAND_NAME_UPPER_EN} MEMBER DIRECTORY`}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-pitch tracking-tight">
          {isBn ? "আমাদের সম্মানিত সদস্যবৃন্দ" : "Our Respected Members"}
        </h1>
        <p className="text-sm sm:text-base text-brand-700 leading-relaxed font-sans">
          {isBn
            ? "২০০৭ সাল থেকে সাভারচালা শান্তি সংঘের অগ্রযাত্রায় নিবেদিত সকল নিবন্ধিত ও সক্রিয় সদস্যদের তালিকা।"
            : `Registered and active members powering ${FULL_BRAND_NAME_EN} since 2007.`}
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-3xl bg-white border border-emerald-200/80 p-3.5 sm:p-5 shadow-xs mb-6 space-y-3">
        {/* Row 1: Search Input (left) + Total Member Badge (right) aligned seamlessly */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#006a4e]/70">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
                  ? "নাম, গ্রাম, ফোন বা পেশা দিয়ে খুঁজুন..."
                  : "Search name, village, profession..."
              }
              className="w-full h-10 pl-10 pr-9 rounded-xl border border-emerald-200/80 bg-emerald-50/55 text-pitch text-xs sm:text-sm placeholder-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/15 transition-all outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-pitch cursor-pointer"
                aria-label={isBn ? "অনুসন্ধান মুছুন" : "Clear search"}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div
            title={isBn ? "মোট সক্রিয় সদস্য" : "Total Active Members"}
            className="shrink-0 h-10 px-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs font-extrabold text-[#006a4e] inline-flex items-center gap-1.5 shadow-2xs select-none"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="whitespace-nowrap">
              {isBn ? `মোট: ${meta.total} জন` : `Total: ${meta.total}`}
            </span>
          </div>
        </div>

        {/* Row 2: 3 Equal-Width Filter Buttons Filling 100% of the Line with No Scroll */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full">
          {quickTabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleQuickTab(tab.key)}
                className={`w-full h-9 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-extrabold inline-flex items-center justify-center text-center transition-all cursor-pointer border truncate ${
                  active
                    ? "bg-[#006a4e] border-[#006a4e] text-white shadow-2xs"
                    : "bg-emerald-50/55 border-emerald-200/80 text-[var(--text)] hover:bg-emerald-100/60 hover:text-[#006a4e]"
                }`}
              >
                <span className="truncate">{isBn ? tab.labelBn : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Strict 2-Column Symmetrical Grid on Mobile, Clean Flow Bar on Desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 pt-2 border-t border-emerald-100/80">
          <ThemedSelect
            ariaLabel={isBn ? "রোল ফিল্টার" : "Filter by role"}
            value={roleFilter}
            isFiltered={roleFilter !== "ALL"}
            className="w-full sm:w-auto h-9"
            icon={
              <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            onChange={(val) => {
              setRoleFilter(val);
              setActiveTab(val === "ADMIN" ? "ADMIN" : "ALL");
              setPage(1);
            }}
            options={[
              { value: "ALL", label: isBn ? "সব রোল" : "All Roles" },
              ...ROLE_OPTIONS.filter((r) => r !== "MODERATOR").map((r) => ({
                value: r,
                label: r === "USER" ? (isBn ? "সদস্য (Member)" : "Member") : r,
              })),
            ]}
          />

          <ThemedSelect
            ariaLabel={isBn ? "রক্তের গ্রুপ ফিল্টার" : "Filter by blood group"}
            value={bloodGroupFilter}
            isFiltered={bloodGroupFilter !== "ALL"}
            className="w-full sm:w-auto h-9"
            icon={
              <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.25C12 3.25 6 10 6 14.25a6 6 0 1012 0C18 10 12 3.25 12 3.25z" />
              </svg>
            }
            onChange={(val) => {
              setBloodGroupFilter(val);
              setPage(1);
            }}
            options={[
              {
                value: "ALL",
                label: isBn ? "সব রক্তের গ্রুপ" : "All Blood Groups",
              },
              ...BLOOD_GROUP_OPTIONS.map((bg) => ({
                value: bg.value,
                label: bg.display,
              })),
            ]}
          />

          <ThemedSelect
            ariaLabel={isBn ? "সর্ট ফিল্ড" : "Sort by"}
            value={sortBy}
            align="right"
            className="w-full sm:w-auto sm:ml-auto h-9"
            icon={
              <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            }
            onChange={(val) => {
              setSortBy(val);
              setPage(1);
            }}
            options={sortOptions.map((opt) => ({
              value: opt.value,
              label: isBn ? `সর্ট: ${opt.labelBn}` : `Sort: ${opt.labelEn}`,
            }))}
          />

          <button
            type="button"
            onClick={() => {
              setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
              setPage(1);
            }}
            className="w-full min-w-0 sm:w-auto h-9 px-3 rounded-xl border border-emerald-200/80 bg-emerald-50/55 hover:bg-emerald-100/60 hover:border-[#006a4e]/40 text-xs font-extrabold text-[#006a4e] inline-flex items-center justify-center sm:justify-start gap-2 transition-colors cursor-pointer"
          >
            <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>{sortOrder === "desc" ? "DESC" : "ASC"}</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="col-span-2 sm:col-span-1 w-full sm:w-auto h-9 px-3 rounded-xl bg-[#f42a41]/10 hover:bg-[#f42a41] text-[var(--accent)] hover:text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{isBn ? "রিসেট" : "Reset"}</span>
            </button>
          )}
        </div>
      </div>

      {isMockFallback && (
        <div className="mb-5 rounded-2xl bg-[#f2b705]/15 border border-[#f2b705]/40 px-4 py-2.5 text-xs font-semibold text-[#876200]">
          {isBn
            ? "লাইভ ডাটাবেজের সাথে সংযোগ পাওয়া যায়নি—নমুনা সদস্য তালিকা দেখানো হচ্ছে।"
            : "Live database unavailable for current session — displaying club directory sample."}
        </div>
      )}

      {/* Top Pagination Bar */}
      <div className="mb-5">
        <UserPaginationBar
          meta={meta}
          limit={limit}
          loading={loading}
          isBn={isBn}
          entityLabel={isBn ? "সদস্য" : "Members"}
          onPageChange={(next) => setPage(next)}
          onLimitChange={(nextLimit) => {
            setLimit(nextLimit);
            setPage(1);
          }}
        />
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:hidden animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-emerald-50/70 border border-emerald-100" />
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-emerald-50/70 border border-emerald-100" />
            ))}
          </div>
        </>
      ) : members.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl bg-white border border-dashed border-emerald-300 p-12 text-center max-w-md mx-auto my-10">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#006a4e] flex items-center justify-center mx-auto mb-4 text-2xl">
            🔍
          </div>
          <h3 className="font-display text-lg font-bold text-pitch">
            {isBn ? "কোনো সদস্য পাওয়া যায়নি" : "No Members Found"}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            {isBn
              ? "আপনার অনুসন্ধান বা ফিল্টারের সাথে কোনো সদস্য মেলেনি। অনুগ্রহ করে ফিল্টার রিসেট করুন।"
              : "No active member matched your search or filter criteria."}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#006a4e] text-white text-xs font-bold shadow-xs hover:bg-[#005a42] transition-colors cursor-pointer"
          >
            {isBn ? "ফিল্টার রিসেট করুন" : "Reset Filters"}
          </button>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW: 2-column User Management style cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:hidden">
            {members.map((u, idx) => {
              const palette =
                MEMBER_CARD_PALETTES[idx % MEMBER_CARD_PALETTES.length];
              const isPlayerQuota = u.membershipType === "PLAYER_QUOTA";
              const isGoogleLogin = isMemberGoogleLogin(u);
              const bloodLabel = getMemberBloodLabel(u.bloodGroup);

              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedMember({ user: u, paletteIndex: idx })}
                  className={`relative text-left rounded-2xl border p-2.5 pt-3.5 sm:p-3.5 sm:pt-4 shadow-sm flex flex-col justify-between gap-2.5 min-w-0 transition-all hover:shadow-md active:scale-[0.99] cursor-pointer ${palette.card}`}
                >
                  {/* Vivid Top Color Accent Strip clipped to card curve */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[15px] overflow-hidden"
                  >
                    <span
                      className={`block w-full h-1.5 bg-gradient-to-r ${palette.bar}`}
                    />
                  </div>

                  {/* Top Corner Row: Player Quota Badge (left) & View Icon (right) */}
                  <div className="flex items-center justify-between min-h-[22px] w-full">
                    <div>{isPlayerQuota && <PlayerQuotaBadgeIcon isBn={isBn} />}</div>
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/75 text-slate-500 border border-slate-200/70"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </span>
                  </div>

                  {/* Centered Profile Picture, Name, Email & Role */}
                  <div className="flex flex-col items-center text-center min-w-0 w-full -mt-2">
                    <div className="relative">
                      <UserAvatar
                        src={u.profileImage || u.picture}
                        name={u.fullName}
                        className={`h-12 w-12 sm:h-14 sm:w-14 ring-2 ${palette.ring}`}
                      />
                      <span
                        title={isBn ? "সক্রিয়" : "Active"}
                        className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-center gap-1 min-w-0 max-w-full">
                      <h3 className="font-bold text-xs sm:text-sm text-[var(--text)] truncate">
                        {u.fullName}
                      </h3>
                      {isAdminVerified(u.adminVerified) && (
                        <VerifiedTick isBn={isBn} className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <p
                      title={u.email || undefined}
                      className="mt-0.5 w-full text-[10px] sm:text-xs font-medium text-slate-600 truncate whitespace-nowrap text-center"
                    >
                      {u.email || u.village || "—"}
                    </p>

                    <div className="mt-1.5 flex items-center justify-center gap-1 flex-wrap">
                      <RoleBadge role={u.role} isBn={isBn} />
                    </div>
                  </div>

                  {/* Footer Meta: Auth Provider & Blood Group */}
                  <div
                    className={`w-full flex items-center justify-between gap-1.5 rounded-xl border px-2.5 py-1.5 text-[10px] sm:text-[11px] text-slate-600 min-w-0 ${palette.metaBox}`}
                  >
                    <MemberAuthProviderIcon isGoogle={isGoogleLogin} isBn={isBn} />
                    <span className="font-bold text-rose-700 shrink-0">
                      🩸 {bloodLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* DESKTOP VIEW: Larger cards with rich member information */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {members.map((u, idx) => {
              const palette =
                MEMBER_CARD_PALETTES[idx % MEMBER_CARD_PALETTES.length];
              const isPlayerQuota = u.membershipType === "PLAYER_QUOTA";
              const isGoogleLogin = isMemberGoogleLogin(u);
              const bloodLabel = getMemberBloodLabel(u.bloodGroup);
              const joinedDate = formatMemberJoinDate(u, isBn);
              const phoneDisplay = u.whatsappNumber || u.phoneNumber;
              const locationDisplay = [u.village, u.currentLocation]
                .filter(Boolean)
                .filter((v, i, arr) => arr.indexOf(v) === i)
                .join(" • ");

              return (
                <article
                  key={u.id}
                  onClick={() => setSelectedMember({ user: u, paletteIndex: idx })}
                  className={`group relative rounded-3xl border p-6 shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-4 min-w-0 cursor-pointer ${palette.card}`}
                >
                  {/* Top Gradient Accent Bar */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[23px] overflow-hidden"
                  >
                    <span
                      className={`block w-full h-2 bg-gradient-to-r ${palette.bar}`}
                    />
                  </div>

                  <div className="space-y-4">
                    {/* Top Row: Role, Membership Badge & Auth Provider */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <RoleBadge role={u.role} isBn={isBn} />
                        {isPlayerQuota ? (
                          <PlayerQuotaBadgeIcon isBn={isBn} withLabel />
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border bg-white/80 text-[#006a4e] border-emerald-200/80">
                            {isBn ? "স্থায়ী" : "Permanent"}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <MemberAuthProviderIcon
                          isGoogle={isGoogleLogin}
                          isBn={isBn}
                        />
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/85 border border-emerald-200/80 text-[10px] font-bold text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{isBn ? "সক্রিয়" : "Active"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Profile Avatar + Name + Profession + Location */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative shrink-0">
                        <UserAvatar
                          src={u.profileImage || u.picture}
                          name={u.fullName}
                          className={`h-20 w-20 ring-4 ${palette.ring} shadow-md bg-white group-hover:scale-105 transition-transform duration-300`}
                        />
                        <span
                          title={isBn ? "সক্রিয় সদস্য" : "Active"}
                          className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h3 className="font-display text-lg font-extrabold text-[var(--text)] group-hover:text-[#006a4e] transition-colors truncate">
                            {u.fullName}
                          </h3>
                          {isAdminVerified(u.adminVerified) && (
                            <VerifiedTick isBn={isBn} className="w-4 h-4" />
                          )}
                        </div>

                        {u.profession && (
                          <p className="mt-0.5 text-xs font-bold text-[#006a4e] truncate">
                            💼 {u.profession}
                          </p>
                        )}

                        <p className="mt-1 text-xs font-medium text-slate-600 truncate">
                          📍 {locationDisplay || (isBn ? "সাভারচালা" : "Shavarchala")}
                        </p>
                      </div>
                    </div>

                    {/* Bio / Summary Snippet */}
                    {(u.summary || u.bio) && (
                      <div className="rounded-2xl bg-white/75 border border-slate-200/75 px-3.5 py-2.5 text-xs text-slate-600 leading-relaxed line-clamp-2 italic">
                        “{u.summary || u.bio}”
                      </div>
                    )}

                    {/* Detailed Member Meta Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div
                        className={`rounded-xl border px-3 py-2 flex items-center justify-between gap-2 ${palette.metaBox}`}
                      >
                        <span className="text-[10px] font-bold uppercase text-slate-500">
                          {isBn ? "রক্তের গ্রুপ" : "Blood"}
                        </span>
                        <span className="font-extrabold text-rose-700">
                          🩸 {bloodLabel}
                        </span>
                      </div>

                      <div
                        className={`rounded-xl border px-3 py-2 flex items-center justify-between gap-1.5 min-w-0 ${palette.softBox}`}
                      >
                        <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0">
                          {isBn ? "যোগদান" : "Joined"}
                        </span>
                        <span className="font-bold text-slate-800 truncate">
                          {joinedDate}
                        </span>
                      </div>

                      <div className="col-span-2 rounded-xl border border-slate-200/75 bg-white/80 px-3 py-2 flex items-center gap-2 min-w-0">
                        <span className="text-slate-400 shrink-0" aria-hidden="true">
                          ✉️
                        </span>
                        <span
                          title={u.email || undefined}
                          className="font-medium text-slate-700 truncate text-xs"
                        >
                          {u.email || "—"}
                        </span>
                      </div>

                      {phoneDisplay && (
                        <div className="col-span-2 rounded-xl border border-slate-200/75 bg-white/80 px-3 py-2 flex items-center justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-slate-400 shrink-0" aria-hidden="true">
                              📞
                            </span>
                            <span className="font-semibold text-slate-700 truncate">
                              {phoneDisplay}
                            </span>
                          </div>
                          {u.fatherName && (
                            <span className="text-[11px] font-medium text-slate-500 truncate max-w-[45%]">
                              {isBn ? `পিতা: ${u.fatherName}` : `S/O: ${u.fatherName}`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-black/5 flex items-center justify-between gap-2">
                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {u.whatsappNumber && (
                        <a
                          href={`https://wa.me/${u.whatsappNumber.replace(/[^\d]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp"
                          className="px-2.5 py-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] text-[11px] font-bold transition-colors"
                        >
                          💬 WhatsApp
                        </a>
                      )}
                      {u.facebookProfile && (
                        <a
                          href={u.facebookProfile}
                          target="_blank"
                          rel="noreferrer"
                          title="Facebook"
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/70 text-[11px] font-bold transition-colors"
                        >
                          Facebook ↗
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMember({ user: u, paletteIndex: idx });
                      }}
                      className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer group"
                    >
                      <span>{isBn ? "বিস্তারিত দেখুন" : "View Details"}</span>
                      <IoIosArrowForward className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* Bottom Pagination Bar */}
      <div className="mt-6">
        <UserPaginationBar
          meta={meta}
          limit={limit}
          loading={loading}
          isBn={isBn}
          entityLabel={isBn ? "সদস্য" : "Members"}
          onPageChange={(next) => setPage(next)}
          onLimitChange={(nextLimit) => {
            setLimit(nextLimit);
            setPage(1);
          }}
        />
      </div>

      {/* Registration CTA banner */}
      <div className="mt-14 rounded-3xl bg-gradient-to-r from-[#006a4e] to-[#005a42] text-white p-7 sm:p-10 shadow-lg border-b-4 border-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display text-2xl font-bold">
            {isBn
              ? "আপনিও কি সাভারচালা শান্তি সংঘের সদস্য হতে চান?"
              : `Want to Become a Member of ${BRAND_NAME_EN}?`}
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

      {/* Member Profile Details Modal */}
      <MemberDetailsModal
        member={selectedMember?.user ?? null}
        paletteIndex={selectedMember?.paletteIndex ?? 0}
        isBn={isBn}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
