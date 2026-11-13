/**
 * Admin Dashboard & Financial Control Shared Types
 * Used by UI components and the data layer (lib/api/dashboard.ts)
 */

import type { BloodGroup, MembershipType, Role, UserStatus } from "@/types";

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

export type UserSortField =
  | "createdAt"
  | "updatedAt"
  | "fullName"
  | "email"
  | "role"
  | "status";

export type SortOrder = "asc" | "desc";

export interface ManagedUser {
  id: string;
  fullName: string;
  /** Alias for compatibility with components reading `user.name`. */
  name: string;
  fatherName?: string | null;
  motherName?: string | null;
  email: string;
  profileImage?: string | null;
  imagePublicId?: string | null;
  picture?: string;
  phoneNumber?: string | null;
  phone?: string | null;
  bloodGroup?: string | null;
  bio?: string | null;
  summary?: string | null;
  status: UserStatus;
  role: Role;
  profession?: string | null;
  village?: string | null;
  currentLocation?: string | null;
  whatsappNumber?: string | null;
  membershipType?: MembershipType | null;
  facebookProfile?: string | null;
  authProvider?: string | null;
  emailVerified?: boolean | null;
  phoneVerified?: string | boolean | null;
  adminVerified?: string | boolean | null;
  googleId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  joinedAt?: string;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  role?: Role;
  status?: UserStatus;
  membershipType?: MembershipType;
  bloodGroup?: BloodGroup;
  emailVerified?: boolean;
  search?: string;
  sortBy?: UserSortField;
  sortOrder?: SortOrder;
}

export interface UsersPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UsersListResponse {
  users: ManagedUser[];
  meta: UsersPaginationMeta;
  isMockFallback?: boolean;
}

export interface UpdateManagedUserPayload {
  fullName?: string;
  fatherName?: string | null;
  motherName?: string | null;
  profileImage?: string | null;
  imagePublicId?: string | null;
  phoneNumber?: string | null;
  bloodGroup?: BloodGroup;
  bio?: string | null;
  summary?: string | null;
  profession?: string | null;
  village?: string | null;
  currentLocation?: string | null;
  whatsappNumber?: string | null;
  membershipType?: MembershipType;
  facebookProfile?: string | null;
  role?: Role;
  status?: UserStatus;
  emailVerified?: boolean;
  adminVerified?: boolean;
}

