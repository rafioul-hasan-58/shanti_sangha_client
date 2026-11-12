import type {
  DashboardStats,
  ExpenseCategory,
  ManagedUser,
  MonthlyExpense,
  YearlyExpense,
} from "@/lib/types/dashboard";
import { formatMonthLabel } from "@/lib/constants/categories";

/**
 * Static Mock Data for Admin Dashboard Overview
 * Realistic financial and membership data for Shavarchala Shanti Sangho.
 * When real API is connected, only `lib/api/dashboard.ts` needs updating.
 */

/**
 * 24 months of historical expenses (Dec 2024 to Nov 2026)
 * Varied seasonal spikes and zeros in certain categories.
 */
interface RawMonthlyData {
  month: string;
  byCategory: Record<ExpenseCategory, number>;
}

const RAW_MONTHLY_DATA: RawMonthlyData[] = [
  {
    month: "2024-12",
    byCategory: { GPL: 28000, SPL: 0, SPORTS: 4500, GPL_FOOTBALL: 0, OWAJ: 42000, OTHERS: 8500 },
  },
  {
    month: "2025-01",
    byCategory: { GPL: 35000, SPL: 0, SPORTS: 9000, GPL_FOOTBALL: 0, OWAJ: 55000, OTHERS: 9200 },
  },
  {
    month: "2025-02",
    byCategory: { GPL: 22000, SPL: 0, SPORTS: 48000, GPL_FOOTBALL: 0, OWAJ: 12000, OTHERS: 7800 },
  },
  {
    month: "2025-03",
    byCategory: { GPL: 8000, SPL: 12000, SPORTS: 14000, GPL_FOOTBALL: 0, OWAJ: 0, OTHERS: 6500 },
  },
  {
    month: "2025-04",
    byCategory: { GPL: 0, SPL: 38000, SPORTS: 5000, GPL_FOOTBALL: 15000, OWAJ: 0, OTHERS: 6200 },
  },
  {
    month: "2025-05",
    byCategory: { GPL: 0, SPL: 64000, SPORTS: 7500, GPL_FOOTBALL: 22000, OWAJ: 0, OTHERS: 8900 },
  },
  {
    month: "2025-06",
    byCategory: { GPL: 0, SPL: 52000, SPORTS: 8000, GPL_FOOTBALL: 34000, OWAJ: 0, OTHERS: 9500 },
  },
  {
    month: "2025-07",
    byCategory: { GPL: 0, SPL: 45000, SPORTS: 6200, GPL_FOOTBALL: 41000, OWAJ: 0, OTHERS: 7800 },
  },
  {
    month: "2025-08",
    byCategory: { GPL: 0, SPL: 29000, SPORTS: 4500, GPL_FOOTBALL: 28000, OWAJ: 0, OTHERS: 8200 },
  },
  {
    month: "2025-09",
    byCategory: { GPL: 11000, SPL: 0, SPORTS: 12000, GPL_FOOTBALL: 14000, OWAJ: 0, OTHERS: 7400 },
  },
  {
    month: "2025-10",
    byCategory: { GPL: 24000, SPL: 0, SPORTS: 8500, GPL_FOOTBALL: 0, OWAJ: 18000, OTHERS: 8100 },
  },
  {
    month: "2025-11",
    byCategory: { GPL: 31000, SPL: 0, SPORTS: 6000, GPL_FOOTBALL: 0, OWAJ: 48000, OTHERS: 9000 },
  },
  {
    month: "2025-12",
    byCategory: { GPL: 38000, SPL: 0, SPORTS: 5500, GPL_FOOTBALL: 0, OWAJ: 62000, OTHERS: 10500 },
  },
  {
    month: "2026-01",
    byCategory: { GPL: 42000, SPL: 0, SPORTS: 11000, GPL_FOOTBALL: 0, OWAJ: 68000, OTHERS: 11200 },
  },
  {
    month: "2026-02",
    byCategory: { GPL: 26000, SPL: 0, SPORTS: 54000, GPL_FOOTBALL: 0, OWAJ: 15000, OTHERS: 9500 },
  },
  {
    month: "2026-03",
    byCategory: { GPL: 9500, SPL: 18000, SPORTS: 16000, GPL_FOOTBALL: 0, OWAJ: 0, OTHERS: 8200 },
  },
  {
    month: "2026-04",
    byCategory: { GPL: 0, SPL: 44000, SPORTS: 7000, GPL_FOOTBALL: 18000, OWAJ: 0, OTHERS: 7600 },
  },
  {
    month: "2026-05",
    byCategory: { GPL: 0, SPL: 72000, SPORTS: 8500, GPL_FOOTBALL: 26000, OWAJ: 0, OTHERS: 10400 },
  },
  {
    month: "2026-06",
    byCategory: { GPL: 0, SPL: 68000, SPORTS: 9200, GPL_FOOTBALL: 38000, OWAJ: 0, OTHERS: 11000 },
  },
  {
    month: "2026-07",
    byCategory: { GPL: 0, SPL: 58000, SPORTS: 7400, GPL_FOOTBALL: 46000, OWAJ: 0, OTHERS: 8800 },
  },
  {
    month: "2026-08",
    byCategory: { GPL: 0, SPL: 35000, SPORTS: 5200, GPL_FOOTBALL: 32000, OWAJ: 0, OTHERS: 9100 },
  },
  {
    month: "2026-09",
    byCategory: { GPL: 14000, SPL: 0, SPORTS: 14500, GPL_FOOTBALL: 16000, OWAJ: 0, OTHERS: 8400 },
  },
  {
    month: "2026-10",
    byCategory: { GPL: 29000, SPL: 0, SPORTS: 9800, GPL_FOOTBALL: 0, OWAJ: 24000, OTHERS: 9600 },
  },
  {
    month: "2026-11",
    byCategory: { GPL: 36000, SPL: 0, SPORTS: 7200, GPL_FOOTBALL: 0, OWAJ: 52000, OTHERS: 10200 },
  },
];

/**
 * Compute total and formatted label for monthly records
 */
export const MOCK_MONTHLY_EXPENSES: MonthlyExpense[] = RAW_MONTHLY_DATA.map((item) => {
  const total = Object.values(item.byCategory).reduce((sum, val) => sum + val, 0);
  return {
    month: item.month,
    label: formatMonthLabel(item.month),
    total,
    byCategory: item.byCategory,
  };
});

/**
 * 8 years of historical expenses (2019 to 2026)
 */
interface RawYearlyData {
  year: number;
  byCategory: Record<ExpenseCategory, number>;
}

const RAW_YEARLY_DATA: RawYearlyData[] = [
  {
    year: 2019,
    byCategory: { GPL: 110000, SPL: 145000, SPORTS: 68000, GPL_FOOTBALL: 72000, OWAJ: 125000, OTHERS: 45000 },
  },
  {
    year: 2020,
    byCategory: { GPL: 75000, SPL: 95000, SPORTS: 35000, GPL_FOOTBALL: 45000, OWAJ: 85000, OTHERS: 38000 },
  },
  {
    year: 2021,
    byCategory: { GPL: 130000, SPL: 175000, SPORTS: 82000, GPL_FOOTBALL: 88000, OWAJ: 140000, OTHERS: 52000 },
  },
  {
    year: 2022,
    byCategory: { GPL: 165000, SPL: 220000, SPORTS: 95000, GPL_FOOTBALL: 110000, OWAJ: 165000, OTHERS: 64000 },
  },
  {
    year: 2023,
    byCategory: { GPL: 195000, SPL: 265000, SPORTS: 115000, GPL_FOOTBALL: 135000, OWAJ: 190000, OTHERS: 76000 },
  },
  {
    year: 2024,
    byCategory: { GPL: 220000, SPL: 310000, SPORTS: 130000, GPL_FOOTBALL: 160000, OWAJ: 215000, OTHERS: 88000 },
  },
  {
    year: 2025,
    byCategory: { GPL: 245000, SPL: 355000, SPORTS: 148000, GPL_FOOTBALL: 185000, OWAJ: 240000, OTHERS: 98000 },
  },
  {
    year: 2026,
    byCategory: { GPL: 275000, SPL: 395000, SPORTS: 165000, GPL_FOOTBALL: 210000, OWAJ: 265000, OTHERS: 112000 },
  },
];

export const MOCK_YEARLY_EXPENSES: YearlyExpense[] = RAW_YEARLY_DATA.map((item) => {
  const total = Object.values(item.byCategory).reduce((sum, val) => sum + val, 0);
  return {
    year: item.year,
    label: String(item.year),
    total,
    byCategory: item.byCategory,
  };
});

const latestMonthSpent =
  MOCK_MONTHLY_EXPENSES[MOCK_MONTHLY_EXPENSES.length - 1]?.total ?? 105400;
const latestYearSpent =
  MOCK_YEARLY_EXPENSES[MOCK_YEARLY_EXPENSES.length - 1]?.total ?? 1422000;

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalMembers: 248,
  pendingMembers: 12,
  monthlySpent: latestMonthSpent,
  yearlySpent: latestYearSpent,
  totalExpenditure: latestYearSpent,
  membersTrend: 8.5,
  pendingTrend: -14.2,
  monthlySpentTrend: 11.4,
  yearlySpentTrend: 11.9,
  expenditureTrend: 5.3,
};

export const MOCK_MANAGED_USERS: ManagedUser[] = [
  {
    id: "usr-001",
    name: "Sourav Prodhan",
    email: "souravprodhan58@gmail.com",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    phone: "+880 1711-234567",
    bloodGroup: "B+",
    village: "সাভারচালা",
    joinedAt: "2024-01-12",
  },
  {
    id: "usr-002",
    name: "Rafioul Hasan",
    email: "rafioulhasan2@gmail.com",
    role: "ADMIN",
    status: "ACTIVE",
    phone: "+880 1812-987654",
    bloodGroup: "O+",
    village: "সাভারচালা",
    joinedAt: "2024-02-05",
  },
  {
    id: "usr-003",
    name: "Md. Kamrul Islam",
    email: "kamrul.islam@shantisangho.com",
    role: "MODERATOR",
    status: "ACTIVE",
    phone: "+880 1915-445566",
    bloodGroup: "A+",
    village: "সাভারচালা",
    joinedAt: "2024-05-19",
  },
  {
    id: "usr-004",
    name: "Tanvir Ahmed",
    email: "tanvir.ahmed@example.com",
    role: "USER",
    status: "ACTIVE",
    phone: "+880 1712-345678",
    bloodGroup: "AB+",
    village: "সখিপুর",
    joinedAt: "2025-03-11",
  },
  {
    id: "usr-005",
    name: "Mahmudul Hasan",
    email: "mahmud.h@example.com",
    role: "USER",
    status: "INACTIVE",
    phone: "+880 1823-456789",
    bloodGroup: "O+",
    village: "সাভারচালা",
    joinedAt: "2025-08-22",
  },
  {
    id: "usr-006",
    name: "Shakil Hossain",
    email: "shakil.h@example.com",
    role: "USER",
    status: "ACTIVE",
    phone: "+880 1934-567890",
    bloodGroup: "B-",
    village: "গজারিয়া",
    joinedAt: "2026-01-15",
  },
  {
    id: "usr-007",
    name: "Naimur Rahman",
    email: "naimur.r@example.com",
    role: "MODERATOR",
    status: "ACTIVE",
    phone: "+880 1621-112233",
    bloodGroup: "A+",
    village: "সাভারচালা",
    joinedAt: "2026-04-03",
  },
  {
    id: "usr-008",
    name: "Ariful Islam",
    email: "ariful.islam@example.com",
    role: "USER",
    status: "SUSPENDED",
    phone: "+880 1552-778899",
    bloodGroup: "UNKNOWN",
    village: "সখিপুর",
    joinedAt: "2026-06-28",
  },
];

