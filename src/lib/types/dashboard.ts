/**
 * Admin Dashboard & Financial Control Shared Types
 * Used by UI components and the data layer (lib/api/dashboard.ts)
 */

import type { Role, UserStatus } from "@/types";

export type ExpenseCategory =
  | "GPL"
  | "SPL"
  | "SPORTS"
  | "GPL_FOOTBALL"
  | "OWAJ"
  | "OTHERS";

export interface DashboardStats {
  totalMembers: number;
  pendingMembers: number;
  monthlySpent: number;
  yearlySpent: number;
  totalExpenditure?: number;
  membersTrend?: number;      // e.g. +8.5 (% vs last month)
  pendingTrend?: number;      // e.g. -14.2 (% vs last month)
  monthlySpentTrend?: number; // e.g. +11.4 (% vs last month)
  yearlySpentTrend?: number;  // e.g. +11.9 (% vs last year)
  expenditureTrend?: number;
}

export interface MonthlyExpense {
  month: string;              // "YYYY-MM", e.g. "2026-11"
  label: string;              // formatted label, e.g. "Nov 2026" or "Nov"
  total: number;
  byCategory: Record<ExpenseCategory, number>;
}

export interface YearlyExpense {
  year: number;               // e.g. 2026
  label: string;              // e.g. "2026"
  total: number;
  byCategory: Record<ExpenseCategory, number>;
}

export type ExpenseViewMode = "monthly" | "yearly";

export interface ExpenseFilterParams {
  category: ExpenseCategory | "ALL";
}

export interface MonthlyExpenseParams extends ExpenseFilterParams {
  endMonth: string;
  months: number;
}

export interface YearlyExpenseParams extends ExpenseFilterParams {
  endYear: number;
  years: number;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: Role;
  status: UserStatus;
  phone?: string | null;
  bloodGroup?: string | null;
  village?: string | null;
  joinedAt?: string;
}

