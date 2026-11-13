"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import StatCard from "@/components/dashboard/StatCard";
import UserAvatar from "@/components/layout/UserAvatar";
import VerifiedTick from "@/components/common/VerifiedTick";

// Dynamically import ExpenseChart with SSR disabled so Recharts is never evaluated during SSR
const ExpenseChart = dynamic(
  () => import("@/components/dashboard/ExpenseChart"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded-full mb-6" />
        <div className="h-72 w-full bg-slate-100 rounded-xl" />
      </div>
    ),
  }
);
import { isAdminVerified } from "@/lib/authRole";
import { getDashboardStats } from "@/lib/api/dashboard";
import { fetchUsers } from "@/lib/api/users";
import type { DashboardStats, ManagedUser } from "@/lib/types/dashboard";
import { formatBDT } from "@/lib/constants/categories";
import { formatBloodGroupDisplay } from "@/lib/bloodGroup";
import {
  MEMBERSHIP_BADGE_MAP,
  STATUS_BADGE_MAP,
} from "./userManagementConfig";

interface AdminOverviewViewProps {
  adminName?: string;
  adminVerified?: boolean;
  locale?: string;
  onReviewPending?: () => void;
}

const MAX_OVERVIEW_PENDING = 6;

export default function AdminOverviewView({
  adminName = "Admin",
  adminVerified = false,
  locale = "en",
  onReviewPending,
}: AdminOverviewViewProps) {
  const isBn = locale === "bn";
  const admin = { name: adminName || "Admin" };

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState<ManagedUser[]>([]);
  const [totalPendingCount, setTotalPendingCount] = useState<number | null>(null);
  const [pendingLoading, setPendingLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Error loading stats:", err))
      .finally(() => setLoading(false));

    fetchUsers({ page: 1, limit: 50, sortBy: "createdAt", sortOrder: "desc" })
      .then((res) => {
        const filtered = res.users.filter((u) => !u.adminVerified);
        setTotalPendingCount(filtered.length);
        setPendingUsers(filtered.slice(0, MAX_OVERVIEW_PENDING));
      })
      .catch((err) => console.error("Error loading pending users:", err))
      .finally(() => setPendingLoading(false));
  }, []);

  const displayedPendingCount =
    totalPendingCount !== null
      ? totalPendingCount
      : (stats?.pendingMembers ?? 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. WELCOME SECTION */}
      <section aria-label="Welcome section">
        <WelcomeCard
          adminName={admin.name}
          isVerified={adminVerified}
          locale={locale}
        />
      </section>

      {/* 2. STAT CARDS ROW (2 per row on mobile, 4 per row on xl) */}
      <section aria-label="Key statistics">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
          {/* Card 1: Total Members */}
          <StatCard
            variant="primary"
            title={isBn ? "মোট ক্লাব সদস্য" : "Total Members"}
            value={loading ? "..." : (stats?.totalMembers ?? 248)}
            icon={
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            trend={{
              value: stats?.membersTrend ?? 8.5,
              label: isBn ? "গত মাসের চেয়ে বেশি" : "vs last month",
            }}
          />

          {/* Card 2: Pending Members */}
          <StatCard
            variant="accent"
            title={isBn ? "অনুমোদনের অপেক্ষায়" : "Pending Members"}
            value={loading && pendingLoading ? "..." : displayedPendingCount}
            icon={
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            trend={{
              value: stats?.pendingTrend ?? -14.2,
              label: isBn ? "গত মাসের চেয়ে" : "vs last month",
              invertColor: true,
            }}
          />

          {/* Card 3: Total Monthly Spent */}
          <StatCard
            variant="secondary"
            title={isBn ? "মাসিক মোট ব্যয়" : "Total Monthly Spent"}
            value={loading ? "..." : formatBDT(stats?.monthlySpent ?? 105400)}
            icon={
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            trend={{
              value: stats?.monthlySpentTrend ?? 11.4,
              label: isBn ? "গত মাসের চেয়ে" : "vs last month",
            }}
          />

          {/* Card 4: Yearly Spent */}
          <StatCard
            variant="teal"
            title={isBn ? "বাৎসরিক মোট ব্যয়" : "Yearly Spent"}
            value={loading ? "..." : formatBDT(stats?.yearlySpent ?? 1422000)}
            icon={
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend={{
              value: stats?.yearlySpentTrend ?? 11.9,
              label: isBn ? "গত বছরের চেয়ে" : "vs last year",
            }}
          />
        </div>
      </section>

      {/* 3. EXPENDITURE OVERVIEW & CATEGORY SHARE */}
      <section aria-label="Expenditure analysis and charts">
        <ExpenseChart locale={locale} />
      </section>

      {/* 4. PENDING USERS PREVIEW (After Expenditure Overview • Max 6: Table on Desktop, Cards on Mobile) */}
      <section aria-label="Pending user requests">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#006a4e]/15 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f2b705]/20 text-[#8a6100] border border-[#f2b705]/40">
                  <span>⏳</span>
                  <span>{isBn ? "অপেক্ষমাণ ব্যবহারকারী" : "Pending Users"}</span>
                </span>
                {!pendingLoading && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#f7f4ea] text-[#004d38] border border-[#006a4e]/15">
                    {isBn
                      ? `সর্বোচ্চ ৬ জন • মোট ${displayedPendingCount} জন`
                      : `Showing ${pendingUsers.length} of ${displayedPendingCount} (Max 6)`}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-black text-[#12231d] leading-snug">
                {isBn ? "সাম্প্রতিক অপেক্ষমাণ ইউজার" : "Recent Pending Users"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {isBn
                  ? "অনুমোদন বা যাচাইকরণের অপেক্ষায় থাকা সর্বোচ্চ ৬ জন ইউজার এখানে দেখানো হয়েছে"
                  : "Up to 6 most recent users waiting for admin verification or activation"}
              </p>
            </div>

            {onReviewPending && (
              <button
                type="button"
                onClick={onReviewPending}
                className="group inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#006a4e] hover:bg-[#004d38] text-white text-xs sm:text-sm font-extrabold shadow-sm shadow-[#006a4e]/20 transition-colors cursor-pointer shrink-0 leading-relaxed"
              >
                <span>
                  {isBn ? "সব পেন্ডিং ইউজার দেখুন" : "View All Pending Users"}
                </span>
                <svg
                  className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z" />
                </svg>
              </button>
            )}
          </div>

          {pendingLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-16 rounded-2xl bg-[#f7f4ea]/70 border border-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="rounded-2xl bg-[#f7f4ea]/70 border border-[#006a4e]/10 py-10 px-4 text-center space-y-2">
              <p className="text-2xl">🎉</p>
              <p className="text-sm font-bold text-[#12231d]">
                {isBn
                  ? "কোনো অপেক্ষমাণ ইউজার নেই!"
                  : "No pending users right now!"}
              </p>
              <p className="text-xs text-slate-500">
                {isBn
                  ? "সব সাম্প্রতিক ইউজার অনুমোদিত ও সক্রিয় রয়েছে।"
                  : "All recent registrations have been reviewed and verified."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#f7f4ea]/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">{isBn ? "সদস্য" : "User"}</th>
                      <th className="py-3.5 px-4">{isBn ? "যোগাযোগ" : "Contact"}</th>
                      <th className="py-3.5 px-4">{isBn ? "রক্ত ও এলাকা" : "Blood & Area"}</th>
                      <th className="py-3.5 px-4">{isBn ? "মেম্বারশিপ ও অবস্থা" : "Membership & Status"}</th>
                      <th className="py-3.5 px-4 text-right">{isBn ? "যোগদান" : "Joined"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {pendingUsers.map((pendingUser) => {
                      const statusMeta =
                        STATUS_BADGE_MAP[pendingUser.status] ??
                        STATUS_BADGE_MAP.ACTIVE;
                      const membershipMeta = pendingUser.membershipType
                        ? MEMBERSHIP_BADGE_MAP[pendingUser.membershipType]
                        : null;

                      return (
                        <tr
                          key={pendingUser.id}
                          className="hover:bg-[#f7f4ea]/55 transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <UserAvatar
                                src={pendingUser.profileImage || pendingUser.picture}
                                name={pendingUser.fullName}
                                className="h-9 w-9 shrink-0 ring-1 ring-[#006a4e]/20"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <p className="font-bold text-[#12231d] truncate max-w-[200px]">
                                    {pendingUser.fullName}
                                  </p>
                                  {isAdminVerified(pendingUser.adminVerified) && (
                                    <VerifiedTick isBn={isBn} className="w-3.5 h-3.5" />
                                  )}
                                </div>
                                {pendingUser.profession && (
                                  <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                    {pendingUser.profession}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-xs">
                            <p className="font-semibold text-slate-700 truncate max-w-[210px]">
                              {pendingUser.email || "—"}
                            </p>
                            {pendingUser.phoneNumber && (
                              <p className="text-slate-400 mt-0.5">
                                {pendingUser.phoneNumber}
                              </p>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-xs">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {pendingUser.bloodGroup &&
                                pendingUser.bloodGroup !== "UNKNOWN" && (
                                  <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                                    🩸 {formatBloodGroupDisplay(pendingUser.bloodGroup)}
                                  </span>
                                )}
                              <span className="text-slate-600 font-medium truncate max-w-[150px]">
                                {pendingUser.village ||
                                  pendingUser.currentLocation ||
                                  "—"}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-xs">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${statusMeta.className}`}
                              >
                                {isBn ? statusMeta.labelBn : statusMeta.labelEn}
                              </span>
                              {!pendingUser.adminVerified && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f2b705]/20 text-[#8a6100] border border-[#f2b705]/40">
                                  {isBn ? "অযাচাইকৃত" : "Unverified"}
                                </span>
                              )}
                              {membershipMeta && (
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${membershipMeta.className}`}
                                >
                                  {isBn
                                    ? membershipMeta.labelBn
                                    : membershipMeta.labelEn}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right text-xs font-semibold text-slate-500 whitespace-nowrap">
                            {pendingUser.joinedAt || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
                {pendingUsers.map((pendingUser) => {
                  const statusMeta =
                    STATUS_BADGE_MAP[pendingUser.status] ??
                    STATUS_BADGE_MAP.ACTIVE;
                  const membershipMeta = pendingUser.membershipType
                    ? MEMBERSHIP_BADGE_MAP[pendingUser.membershipType]
                    : null;

                  return (
                    <div
                      key={pendingUser.id}
                      className="rounded-2xl border border-[#006a4e]/15 bg-[#f7f4ea]/60 p-4 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <UserAvatar
                            src={pendingUser.profileImage || pendingUser.picture}
                            name={pendingUser.fullName}
                            className="h-10 w-10 shrink-0 ring-1 ring-[#006a4e]/20"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <h4 className="text-sm font-extrabold text-[#12231d] truncate leading-snug">
                                {pendingUser.fullName}
                              </h4>
                              {isAdminVerified(pendingUser.adminVerified) && (
                                <VerifiedTick isBn={isBn} className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">
                              {pendingUser.email || pendingUser.phoneNumber || "—"}
                            </p>
                          </div>
                        </div>

                        {pendingUser.joinedAt && (
                          <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                            {pendingUser.joinedAt}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#006a4e]/10">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusMeta.className}`}
                        >
                          {isBn ? statusMeta.labelBn : statusMeta.labelEn}
                        </span>
                        {!pendingUser.adminVerified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f2b705]/20 text-[#8a6100] border border-[#f2b705]/40">
                            {isBn ? "অযাচাইকৃত" : "Unverified"}
                          </span>
                        )}
                        {membershipMeta && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${membershipMeta.className}`}
                          >
                            {isBn
                              ? membershipMeta.labelBn
                              : membershipMeta.labelEn}
                          </span>
                        )}
                        {pendingUser.bloodGroup &&
                          pendingUser.bloodGroup !== "UNKNOWN" && (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                              🩸 {formatBloodGroupDisplay(pendingUser.bloodGroup)}
                            </span>
                          )}
                        {pendingUser.village && (
                          <span className="text-[10px] text-slate-500 truncate max-w-[130px]">
                            📍 {pendingUser.village}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
