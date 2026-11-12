"use client";

import React, { useEffect, useState } from "react";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import StatCard from "@/components/dashboard/StatCard";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import { getDashboardStats } from "@/lib/api/dashboard";
import type { DashboardStats } from "@/lib/types/dashboard";
import { formatBDT } from "@/lib/constants/categories";

interface AdminOverviewViewProps {
  adminName?: string;
  locale?: string;
  onReviewPending?: () => void;
}

export default function AdminOverviewView({
  adminName = "Admin",
  locale = "en",
  onReviewPending,
}: AdminOverviewViewProps) {
  const isBn = locale === "bn";
  const admin = { name: adminName || "Admin" };

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Error loading stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. WELCOME SECTION */}
      <section aria-label="Welcome section">
        <WelcomeCard adminName={admin.name} locale={locale} />
      </section>

      {/* 2. STAT CARDS ROW (4 theme-colored cards) */}
      <section aria-label="Key statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Total Members */}
          <StatCard
            variant="primary"
            title={isBn ? "মোট ক্লাব সদস্য" : "Total Members"}
            value={loading ? "..." : (stats?.totalMembers ?? 248)}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            value={loading ? "..." : (stats?.pendingMembers ?? 12)}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            badge={{
              text: isBn ? "যাচাই প্রয়োজন" : "Needs Review",
              variant: "red",
            }}
            trend={{
              value: stats?.pendingTrend ?? -14.2,
              label: isBn ? "গত মাসের চেয়ে" : "vs last month",
              invertColor: true,
            }}
            actionLink={{
              href: `/${locale}/admin/members/pending`,
              label: isBn ? "রিভিউ করুন" : "Review",
            }}
            onActionClick={onReviewPending}
          />

          {/* Card 3: Total Monthly Spent */}
          <StatCard
            variant="secondary"
            title={isBn ? "মাসিক মোট ব্যয়" : "Total Monthly Spent"}
            value={loading ? "..." : formatBDT(stats?.monthlySpent ?? 105400)}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    </div>
  );
}
