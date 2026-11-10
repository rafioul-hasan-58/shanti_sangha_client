"use client";

import React from "react";
import type { ExpenseCategory } from "@/lib/types/dashboard";
import { EXPENSE_CATEGORIES, CATEGORY_CONFIG } from "@/lib/constants/categories";

export interface CategoryFilterProps {
  selectedCategory: ExpenseCategory | "ALL";
  onSelectCategory: (category: ExpenseCategory | "ALL") => void;
  locale?: string;
  disabled?: boolean;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  locale = "en",
  disabled = false,
}: CategoryFilterProps) {
  const isBn = locale === "bn";

  const options: Array<{ key: ExpenseCategory | "ALL"; label: string; color?: string }> = [
    { key: "ALL", label: isBn ? "সকল ক্যাটাগরি (All)" : "All" },
    ...EXPENSE_CATEGORIES.map((cat) => ({
      key: cat,
      label: isBn ? CATEGORY_CONFIG[cat].labelBn : CATEGORY_CONFIG[cat].label,
      color: CATEGORY_CONFIG[cat].color,
    })),
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Filter expenditure by category"
      className="flex items-center gap-2 flex-wrap"
    >
      {options.map((opt) => {
        const isSelected = selectedCategory === opt.key;

        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelectCategory(opt.key)}
            style={
              isSelected
                ? {
                    backgroundColor: "#f2b705", // gold accent
                    color: "#12231d",          // dark text
                    borderColor: "#e0a800",
                  }
                : undefined
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-200 cursor-pointer border shadow-2xs select-none disabled:opacity-50 disabled:cursor-not-allowed ${
              isSelected
                ? "shadow-sm scale-102 ring-2 ring-[#f2b705]/30"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            {/* Color indicator dot */}
            {opt.color ? (
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10"
                style={{ backgroundColor: opt.color }}
                aria-hidden="true"
              />
            ) : (
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 bg-slate-400"
                aria-hidden="true"
              />
            )}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
