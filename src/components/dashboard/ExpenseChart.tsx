"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type {
  ExpenseCategory,
  ExpenseViewMode,
  MonthlyExpense,
  YearlyExpense,
} from "@/lib/types/dashboard";
import {
  getMonthlyExpenses,
  getYearlyExpenses,
  getAvailableRangeBounds,
} from "@/lib/api/dashboard";
import {
  EXPENSE_CATEGORIES,
  CATEGORY_CONFIG,
  formatBDT,
  formatMonthLabel,
} from "@/lib/constants/categories";
import CategoryFilter from "./CategoryFilter";

interface ExpenseChartProps {
  locale?: string;
}

export default function ExpenseChart({ locale = "en" }: ExpenseChartProps) {
  const isBn = locale === "bn";

  // Client hydration check for clean Recharts rendering
  const [isMounted, setIsMounted] = useState(false);

  // View state
  const [mode, setMode] = useState<ExpenseViewMode>("monthly");
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | "ALL">("ALL");

  // Window bounds & active end positions
  const [endMonth, setEndMonth] = useState<string>("2026-11");
  const [endYear, setEndYear] = useState<number>(2026);

  // Available data range boundaries from API
  const [bounds, setBounds] = useState({
    earliestMonth: "2024-12",
    latestMonth: "2026-11",
    earliestYear: 2019,
    latestYear: 2026,
  });

  // Data fetching state
  const [monthlyData, setMonthlyData] = useState<MonthlyExpense[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyExpense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch meta boundaries once on mount
  useEffect(() => {
    getAvailableRangeBounds()
      .then((b) => setBounds(b))
      .catch((err) => console.warn("Failed to load range bounds:", err));
  }, []);

  // Fetch expense data whenever mode, end pointer, or category changes
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === "monthly") {
        const data = await getMonthlyExpenses({
          endMonth,
          months: 6,
          category: selectedCategory,
        });
        setMonthlyData(data);
      } else {
        const data = await getYearlyExpenses({
          endYear,
          years: 5,
          category: selectedCategory,
        });
        setYearlyData(data);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load expenditure data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [mode, endMonth, endYear, selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transform data for Recharts stacked bar
  const chartData = useMemo(() => {
    if (mode === "monthly") {
      return monthlyData.map((item) => ({
        key: item.month,
        label: item.label || formatMonthLabel(item.month, isBn),
        total: item.total,
        ...item.byCategory,
      }));
    }

    return yearlyData.map((item) => ({
      key: String(item.year),
      label: String(item.year),
      total: item.total,
      ...item.byCategory,
    }));
  }, [mode, monthlyData, yearlyData, isBn]);

  // Visible period total amount
  const visibleTotal = useMemo(() => {
    if (mode === "monthly") {
      return monthlyData.reduce((acc, curr) => acc + curr.total, 0);
    }
    return yearlyData.reduce((acc, curr) => acc + curr.total, 0);
  }, [mode, monthlyData, yearlyData]);

  // Compute category share breakdown for donut / summary
  const categoryShare = useMemo(() => {
    const totals: Record<ExpenseCategory, number> = {
      GPL: 0,
      SPL: 0,
      SPORTS: 0,
      GPL_FOOTBALL: 0,
      OWAJ: 0,
      OTHERS: 0,
    };

    const currentList = mode === "monthly" ? monthlyData : yearlyData;
    currentList.forEach((item) => {
      EXPENSE_CATEGORIES.forEach((cat) => {
        totals[cat] += item.byCategory[cat] || 0;
      });
    });

    return EXPENSE_CATEGORIES.map((cat) => {
      const amount = totals[cat];
      const percentage = visibleTotal > 0 ? (amount / visibleTotal) * 100 : 0;
      return {
        key: cat,
        label: isBn ? CATEGORY_CONFIG[cat].labelBn : CATEGORY_CONFIG[cat].label,
        color: CATEGORY_CONFIG[cat].color,
        amount,
        percentage: Number(percentage.toFixed(1)),
      };
    }).filter((c) => selectedCategory === "ALL" || c.key === selectedCategory);
  }, [mode, monthlyData, yearlyData, visibleTotal, selectedCategory, isBn]);

  // Navigation handlers (Shift 6 months or 5 years)
  const canGoNextMonthly = useMemo(() => {
    return endMonth < bounds.latestMonth;
  }, [endMonth, bounds.latestMonth]);

  const canGoPrevMonthly = useMemo(() => {
    // If we have at least 6 months after earliestMonth
    return endMonth > "2025-05"; // Dec 2024 + 5 months = May 2025 earliest 6-mo window end
  }, [endMonth]);

  const canGoNextYearly = useMemo(() => {
    return endYear < bounds.latestYear;
  }, [endYear, bounds.latestYear]);

  const canGoPrevYearly = useMemo(() => {
    // Earliest 5-year window ending is 2023 (2019-2023)
    return endYear > bounds.earliestYear + 4;
  }, [endYear, bounds.earliestYear]);

  const handlePrevious = () => {
    if (mode === "monthly") {
      if (!canGoPrevMonthly) return;
      // Step back 6 months
      const [year, month] = endMonth.split("-").map(Number);
      const d = new Date(year, month - 1 - 6, 1);
      const newYear = d.getFullYear();
      const newMonth = String(d.getMonth() + 1).padStart(2, "0");
      const target = `${newYear}-${newMonth}`;
      setEndMonth(target < "2025-05" ? "2025-05" : target);
    } else {
      if (!canGoPrevYearly) return;
      setEndYear((prev) => Math.max(bounds.earliestYear + 4, prev - 5));
    }
  };

  const handleNext = () => {
    if (mode === "monthly") {
      if (!canGoNextMonthly) return;
      // Step forward 6 months
      const [year, month] = endMonth.split("-").map(Number);
      const d = new Date(year, month - 1 + 6, 1);
      const newYear = d.getFullYear();
      const newMonth = String(d.getMonth() + 1).padStart(2, "0");
      const target = `${newYear}-${newMonth}`;
      setEndMonth(target > bounds.latestMonth ? bounds.latestMonth : target);
    } else {
      if (!canGoNextYearly) return;
      setEndYear((prev) => Math.min(bounds.latestYear, prev + 5));
    }
  };

  // Range text label (e.g. "Jun 2026 – Nov 2026" or "2022 – 2026")
  const rangeLabel = useMemo(() => {
    if (mode === "monthly") {
      if (monthlyData.length === 0) return endMonth;
      const start = monthlyData[0].month;
      const end = monthlyData[monthlyData.length - 1].month;
      return `${formatMonthLabel(start, isBn)} – ${formatMonthLabel(end, isBn)}`;
    }

    if (yearlyData.length === 0) return String(endYear);
    const startYear = yearlyData[0].year;
    const lastYear = yearlyData[yearlyData.length - 1].year;
    return `${startYear} – ${lastYear}`;
  }, [mode, monthlyData, yearlyData, endMonth, endYear, isBn]);

  const isNextDisabled = mode === "monthly" ? !canGoNextMonthly : !canGoNextYearly;
  const isPrevDisabled = mode === "monthly" ? !canGoPrevMonthly : !canGoPrevYearly;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
      {/* 1. SECTION HEADER & TIME MODE TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#12231d]">
              {isBn ? "ক্লাব ব্যয় ও খরচের চিত্র" : "Expenditure Overview"}
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-[#006a4e]/10 text-[#006a4e] text-xs font-bold">
              {mode === "monthly" ? (isBn ? "৬ মাস" : "6 Months") : (isBn ? "৫ বছর" : "5 Years")}
            </span>
          </div>

          {/* Visible Range Total Highlight */}
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            <span>{isBn ? "নির্বাচিত মেয়াদের মোট ব্যয়:" : "Visible Range Total:"} </span>
            <span className="font-extrabold text-[#006a4e] text-base sm:text-lg ml-1">
              {formatBDT(visibleTotal)}
            </span>
          </p>
        </div>

        {/* Controls: Monthly / Yearly Tabs & Nav Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Monthly / Yearly Segmented Switcher */}
          <div
            role="tablist"
            aria-label="Expense period mode"
            className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "monthly"}
              onClick={() => setMode("monthly")}
              style={mode === "monthly" ? { backgroundColor: "#f2b705", color: "#12231d" } : undefined}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                mode === "monthly"
                  ? "shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isBn ? "মাসিক (Monthly)" : "Monthly"}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={mode === "yearly"}
              onClick={() => setMode("yearly")}
              style={mode === "yearly" ? { backgroundColor: "#f2b705", color: "#12231d" } : undefined}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                mode === "yearly"
                  ? "shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isBn ? "বাৎসরিক (Yearly)" : "Yearly"}
            </button>
          </div>

          {/* Window Range Navigator (Previous / Next Buttons) */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isPrevDisabled || loading}
              aria-label={isBn ? "পূর্ববর্তী সময়কাল" : "Previous time window"}
              title={isBn ? "পূর্ববর্তী সময়কাল" : "Previous window"}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-xs font-extrabold text-slate-800 px-2 min-w-[130px] text-center select-none">
              {rangeLabel}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={isNextDisabled || loading}
              aria-label={isBn ? "পরবর্তী সময়কাল" : "Next time window"}
              title={isBn ? "পরবর্তী সময়কাল" : "Next window"}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY CHIPS FILTER */}
      <div>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          locale={locale}
          disabled={loading}
        />
      </div>

      {/* 3. CHART & CATEGORY BREAKDOWN (50/50 split on desktop, stacked on mobile) */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="w-full h-80 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center space-y-3 animate-pulse"
        >
          <div className="h-6 w-36 bg-slate-200 rounded-full" />
          <div className="flex items-end gap-6 h-40 w-4/5 justify-center">
            {[40, 75, 55, 90, 65, 80].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="w-12 bg-slate-200 rounded-t-lg"
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 font-bold">
            {isBn ? "ব্যয় রিপোর্ট লোড হচ্ছে..." : "Loading expenditure overview..."}
          </p>
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="w-full py-12 px-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3"
        >
          <div className="w-10 h-10 rounded-full bg-rose-100 text-[#f42a41] flex items-center justify-center mx-auto text-lg font-black">
            !
          </div>
          <h4 className="text-sm font-black text-rose-900">
            {isBn ? "তথ্য লোড করতে সমস্যা হয়েছে" : "Failed to load expenditure data"}
          </h4>
          <p className="text-xs text-rose-700 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="px-4 py-2 rounded-xl bg-[#006a4e] text-white text-xs font-bold hover:bg-[#004d38] transition-colors shadow-xs"
          >
            {isBn ? "পুনরায় চেষ্টা করুন" : "Try Again"}
          </button>
        </div>
      )}

      {!loading && !error && chartData.length === 0 && (
        <div className="w-full py-16 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <span className="text-3xl">📊</span>
          <p className="text-sm font-bold text-slate-700">
            {isBn ? "এই সময়কালের জন্য কোন ব্যয় রেকর্ড নেই" : "No expenses recorded for this period"}
          </p>
          <p className="text-xs text-slate-400">
            {isBn ? "অন্য সময়কাল বা ফিল্টার নির্বাচন করুন।" : "Try navigating to another time window or changing the category filter."}
          </p>
        </div>
      )}

      {!loading && !error && chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7 items-stretch pt-1">
          {/* Left 50%: Recharts Stacked Bar Chart */}
          <div className="w-full flex flex-col justify-center">
            {isMounted && (
              <div className="w-full h-80 sm:h-96 lg:h-[380px]">
                <p className="sr-only">
                  {`Expenditure chart for ${rangeLabel}, total ${formatBDT(visibleTotal)}.`}
                </p>

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 16, right: 10, left: -6, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="label"
                      axisLine={{ stroke: "#cbd5e1" }}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                      tickFormatter={(val: number) => {
                        if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                        if (val >= 1000) return `${Math.round(val / 1000)}k`;
                        return String(val);
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0, 106, 78, 0.04)" }}
                      content={({ active, payload, label }) => {
                        if (!active || !payload || payload.length === 0) return null;

                        const totalAmount = payload.reduce(
                          (acc, p) => acc + (typeof p.value === "number" ? p.value : 0),
                          0
                        );

                        return (
                          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 text-xs min-w-[210px] space-y-2">
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                              <span className="font-extrabold text-slate-900">{label}</span>
                              <span className="font-black text-[#006a4e]">
                                {formatBDT(totalAmount)}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {payload.map((entry, idx) => {
                                const val = typeof entry.value === "number" ? entry.value : 0;
                                if (val === 0 && selectedCategory === "ALL") return null;

                                const catKey = entry.dataKey as ExpenseCategory;
                                const catLabel =
                                  isBn && CATEGORY_CONFIG[catKey]
                                    ? CATEGORY_CONFIG[catKey].labelBn
                                    : CATEGORY_CONFIG[catKey]?.label || entry.name;

                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between gap-3 text-[11px]"
                                  >
                                    <span className="flex items-center gap-1.5 text-slate-600 font-semibold truncate">
                                      <span
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: entry.color }}
                                      />
                                      <span>{catLabel}</span>
                                    </span>
                                    <span className="font-bold text-slate-900 shrink-0">
                                      {formatBDT(val)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: "12px", fontSize: "11px", fontWeight: "700" }}
                      formatter={(value) => {
                        const catKey = value as ExpenseCategory;
                        return (
                          <span className="text-slate-700">
                            {isBn && CATEGORY_CONFIG[catKey]
                              ? CATEGORY_CONFIG[catKey].labelBn
                              : CATEGORY_CONFIG[catKey]?.label || value}
                          </span>
                        );
                      }}
                    />

                    {EXPENSE_CATEGORIES.map((cat, idx) => {
                      if (selectedCategory !== "ALL" && selectedCategory !== cat) {
                        return null;
                      }

                      const isLastCategory =
                        selectedCategory !== "ALL" || idx === EXPENSE_CATEGORIES.length - 1;

                      return (
                        <Bar
                          key={cat}
                          dataKey={cat}
                          name={cat}
                          stackId="a"
                          fill={CATEGORY_CONFIG[cat].color}
                          radius={isLastCategory ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Right 50%: Category Share & Breakdown */}
          {categoryShare.length > 0 && (
            <div className="w-full pt-6 border-t border-slate-100 lg:pt-0 lg:border-t-0 lg:border-l lg:border-slate-100 lg:pl-7 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
                  <span>{isBn ? "খাতওয়ারী ব্যয়ের অনুপাত (Category Share)" : "Category Share & Breakdown"}</span>
                  <span className="text-xs text-slate-400 font-medium">({rangeLabel})</span>
                </h3>
                <span className="text-xs font-extrabold text-[#006a4e] shrink-0">
                  100% {isBn ? "হিসাব" : "Allocated"}
                </span>
              </div>

              {/* Donut Chart */}
              <div className="h-44 sm:h-48 relative flex items-center justify-center mb-3">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryShare}
                        dataKey="amount"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={3}
                      >
                        {categoryShare.map((entry) => (
                          <Cell key={entry.key} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => [formatBDT(Number(val) || 0), isBn ? "ব্যয়" : "Expense"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {/* Center Donut Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {isBn ? "মোট" : "TOTAL"}
                  </span>
                  <span className="text-xs font-black text-[#12231d]">
                    {formatBDT(visibleTotal)}
                  </span>
                </div>
              </div>

              {/* Proportional Category Share Cards */}
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5">
                {categoryShare.map((item) => (
                  <div
                    key={item.key}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <span className="text-[11px] font-black text-slate-500 shrink-0">
                        {item.percentage}%
                      </span>
                    </div>

                    <p className="text-sm font-black text-[#12231d]">
                      {formatBDT(item.amount)}
                    </p>

                    {/* Tiny progress bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                        className="h-full rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
