/**
 * ============================================================================
 * Dashboard Data Layer API
 * ============================================================================
 * All dashboard UI components call these functions exclusively.
 *
 * TO CONNECT BACKEND:
 * Replace the implementations in this file with real fetch/axios API calls.
 * No UI components need to be changed!
 */

import type {
  DashboardStats,
  ExpenseCategory,
  ManagedUser,
  MonthlyExpense,
  YearlyExpense,
  MonthlyExpenseParams,
  YearlyExpenseParams,
} from "@/lib/types/dashboard";
import type { Role, UserStatus } from "@/types";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_MANAGED_USERS,
  MOCK_MONTHLY_EXPENSES,
  MOCK_YEARLY_EXPENSES,
} from "@/lib/mock/dashboard";
import { fetchWithAuth } from "@/lib/api";
import { normalizeRole, normalizeUserStatus } from "@/lib/authRole";
import { formatMonthLabel } from "@/lib/constants/categories";

/**
 * Fetch top-level dashboard statistics (total members, pending, total expenditure, trends)
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // TODO: replace with fetch('/api/admin/dashboard/stats') when backend is ready
  await new Promise((resolve) => setTimeout(resolve, 80)); // simulate slight async dispatch
  return { ...MOCK_DASHBOARD_STATS };
}

/**
 * Fetch monthly expenses for a given time window and category filter
 *
 * @param params.endMonth - Inclusive end month string ("YYYY-MM", e.g. "2026-11")
 * @param params.months - Number of months in the window (e.g. 6)
 * @param params.category - Selected category or 'ALL'
 */
export async function getMonthlyExpenses(
  params: MonthlyExpenseParams
): Promise<MonthlyExpense[]> {
  // TODO: replace with fetch(`/api/admin/dashboard/expenses/monthly?endMonth=${params.endMonth}&months=${params.months}&category=${params.category}`) when backend is ready
  await new Promise((resolve) => setTimeout(resolve, 100));

  const { endMonth, months, category } = params;

  // Find index of endMonth in sorted monthly data
  const endIndex = MOCK_MONTHLY_EXPENSES.findIndex((m) => m.month === endMonth);
  if (endIndex === -1) {
    // If not found, fallback to the latest available months
    const slice = MOCK_MONTHLY_EXPENSES.slice(-months);
    return filterMonthlyByCategory(slice, category);
  }

  const startIndex = Math.max(0, endIndex - months + 1);
  const sliced = MOCK_MONTHLY_EXPENSES.slice(startIndex, endIndex + 1);

  return filterMonthlyByCategory(sliced, category);
}

/**
 * Helper to filter or isolate categories in monthly expenses
 */
function filterMonthlyByCategory(
  items: MonthlyExpense[],
  category: ExpenseCategory | "ALL"
): MonthlyExpense[] {
  return items.map((item) => {
    if (category === "ALL") {
      return { ...item };
    }

    const isolatedCategoryAmount = item.byCategory[category] ?? 0;
    const filteredCategories: Record<ExpenseCategory, number> = {
      GPL: 0,
      SPL: 0,
      SPORTS: 0,
      GPL_FOOTBALL: 0,
      OWAJ: 0,
      OTHERS: 0,
      [category]: isolatedCategoryAmount,
    };

    return {
      month: item.month,
      label: item.label || formatMonthLabel(item.month),
      total: isolatedCategoryAmount,
      byCategory: filteredCategories,
    };
  });
}

/**
 * Fetch yearly expenses for a given time window and category filter
 *
 * @param params.endYear - Inclusive end year number (e.g. 2026)
 * @param params.years - Number of years in the window (e.g. 5)
 * @param params.category - Selected category or 'ALL'
 */
export async function getYearlyExpenses(
  params: YearlyExpenseParams
): Promise<YearlyExpense[]> {
  // TODO: replace with fetch(`/api/admin/dashboard/expenses/yearly?endYear=${params.endYear}&years=${params.years}&category=${params.category}`) when backend is ready
  await new Promise((resolve) => setTimeout(resolve, 100));

  const { endYear, years, category } = params;

  const endIndex = MOCK_YEARLY_EXPENSES.findIndex((y) => y.year === endYear);
  if (endIndex === -1) {
    const slice = MOCK_YEARLY_EXPENSES.slice(-years);
    return filterYearlyByCategory(slice, category);
  }

  const startIndex = Math.max(0, endIndex - years + 1);
  const sliced = MOCK_YEARLY_EXPENSES.slice(startIndex, endIndex + 1);

  return filterYearlyByCategory(sliced, category);
}

function filterYearlyByCategory(
  items: YearlyExpense[],
  category: ExpenseCategory | "ALL"
): YearlyExpense[] {
  return items.map((item) => {
    if (category === "ALL") {
      return { ...item };
    }

    const isolatedCategoryAmount = item.byCategory[category] ?? 0;
    const filteredCategories: Record<ExpenseCategory, number> = {
      GPL: 0,
      SPL: 0,
      SPORTS: 0,
      GPL_FOOTBALL: 0,
      OWAJ: 0,
      OTHERS: 0,
      [category]: isolatedCategoryAmount,
    };

    return {
      year: item.year,
      label: item.label,
      total: isolatedCategoryAmount,
      byCategory: filteredCategories,
    };
  });
}

/**
 * Range boundaries query to determine Previous / Next button disabled state
 */
export async function getAvailableRangeBounds(): Promise<{
  earliestMonth: string;
  latestMonth: string;
  earliestYear: number;
  latestYear: number;
}> {
  // TODO: replace with API meta endpoint when backend is ready
  return {
    earliestMonth: MOCK_MONTHLY_EXPENSES[0]?.month ?? "2024-12",
    latestMonth: MOCK_MONTHLY_EXPENSES[MOCK_MONTHLY_EXPENSES.length - 1]?.month ?? "2026-11",
    earliestYear: MOCK_YEARLY_EXPENSES[0]?.year ?? 2019,
    latestYear: MOCK_YEARLY_EXPENSES[MOCK_YEARLY_EXPENSES.length - 1]?.year ?? 2026,
  };
}

function mapRawUser(raw: Record<string, unknown>, idx: number): ManagedUser {
  const id = String(raw.id ?? raw._id ?? `user-${idx + 1}`);
  const picture =
    (typeof raw.avatar === "string" && raw.avatar.trim()) ||
    (typeof raw.picture === "string" && raw.picture.trim()) ||
    undefined;

  return {
    id,
    name: typeof raw.name === "string" && raw.name.trim() ? raw.name : "Club Member",
    email: typeof raw.email === "string" ? raw.email : "",
    picture,
    role: normalizeRole(raw.role),
    status: normalizeUserStatus(raw.status) ?? "ACTIVE",
    phone:
      typeof raw.whatsappNumber === "string"
        ? raw.whatsappNumber
        : typeof raw.phone === "string"
          ? raw.phone
          : null,
    bloodGroup: typeof raw.bloodGroup === "string" ? raw.bloodGroup : null,
    village: typeof raw.village === "string" ? raw.village : null,
    joinedAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt.slice(0, 10)
        : undefined,
  };
}

/**
 * Fetch all club users for Admin User Management (`GET /users`), falling back to mock data if offline.
 */
export async function getManagedUsers(): Promise<ManagedUser[]> {
  try {
    const res = await fetchWithAuth("/users");
    if (res.ok) {
      const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
      const dataObj = json?.data;
      const list = Array.isArray(dataObj)
        ? dataObj
        : Array.isArray((dataObj as Record<string, unknown> | undefined)?.users)
          ? ((dataObj as Record<string, unknown>).users as unknown[])
          : Array.isArray(json?.users)
            ? (json.users as unknown[])
            : null;
      if (list) {
        return list
          .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
          .map(mapRawUser);
      }
    }
  } catch {
    // Fallback to mock users when backend is unreachable
  }

  return MOCK_MANAGED_USERS.map((u) => ({ ...u }));
}

export async function updateManagedUserRole(userId: string, role: Role): Promise<void> {
  try {
    await fetchWithAuth(`/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  } catch {
    // Allow optimistic local update in offline/mock mode
  }
}

export async function updateManagedUserStatus(userId: string, status: UserStatus): Promise<void> {
  try {
    await fetchWithAuth(`/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  } catch {
    // Allow optimistic local update in offline/mock mode
  }
}

