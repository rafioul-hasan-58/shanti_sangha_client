import type { ExpenseCategory } from "@/lib/types/dashboard";

export interface CategoryMeta {
  key: ExpenseCategory;
  label: string;
  labelBn: string;
  color: string;
  description: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "GPL",
  "SPL",
  "SPORTS",
  "GPL_FOOTBALL",
  "OWAJ",
  "OTHERS",
];

export const CATEGORY_CONFIG: Record<ExpenseCategory, CategoryMeta> = {
  GPL: {
    key: "GPL",
    label: "GPL",
    labelBn: "জিপিএল ক্রিকেট",
    color: "#006a4e", // --primary
    description: "GPL Cricket Tournament, team gear & match costs",
  },
  SPL: {
    key: "SPL",
    label: "SPL",
    labelBn: "এসপিএল প্রিমিয়ার লিগ",
    color: "#00a67e", // --primary-light
    description: "Shanti Sangha Premier League (Football & Cricket)",
  },
  SPORTS: {
    key: "SPORTS",
    label: "Sports",
    labelBn: "বাৎসরিক ক্রীড়া",
    color: "#004d38", // --primary-dark
    description: "Annual sports day, athletics, badminton & volleyball",
  },
  GPL_FOOTBALL: {
    key: "GPL_FOOTBALL",
    label: "GPL Football",
    labelBn: "জি-ফুটবল টুর্নামেন্ট",
    color: "#0284c7", // Vibrant football blue
    description: "Monsoon regional football championship & friendly cups",
  },
  OWAJ: {
    key: "OWAJ",
    label: "Owaj",
    labelBn: "বাৎসরিক ওয়াজ মাহফিল",
    color: "#f2b705", // --secondary (gold)
    description: "Annual religious waz mahfil, sound, tent & guest logistics",
  },
  OTHERS: {
    key: "OTHERS",
    label: "Others",
    labelBn: "অন্যান্য খরচ",
    color: "#94a3b8", // Slate neutral
    description: "Club room maintenance, utilities, stationery & operations",
  },
};

/**
 * Format currency amounts in Bangladeshi Taka (৳) with Bengali grouping (en-BD)
 * E.g. 485000 -> "৳ 4,85,000"
 */
export function formatBDT(amount: number): string {
  try {
    const formattedNumber = new Intl.NumberFormat("en-BD").format(amount);
    return `৳ ${formattedNumber}`;
  } catch {
    return `৳ ${amount.toLocaleString()}`;
  }
}

/**
 * Format month string "YYYY-MM" to readable label
 * E.g. "2026-11" -> "Nov 2026"
 */
export function formatMonthLabel(monthStr: string, isBn = false): string {
  const [year, month] = monthStr.split("-").map(Number);
  if (!year || !month) return monthStr;
  const date = new Date(year, month - 1, 1);
  return isBn
    ? date.toLocaleDateString("bn-BD", { month: "short", year: "numeric" })
    : date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

