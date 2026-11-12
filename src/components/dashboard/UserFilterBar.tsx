"use client";

import { BLOOD_GROUP_OPTIONS } from "@/lib/bloodGroup";
import type { SortOrder, UserSortField } from "@/lib/types/dashboard";
import type { BloodGroup, MembershipType, Role, UserStatus } from "@/types";
import {
  MEMBERSHIP_OPTIONS,
  ROLE_OPTIONS,
  SORT_FIELD_OPTIONS,
} from "./userManagementConfig";

const STATUS_FILTERS: Array<{
  key: UserStatus | "ALL";
  labelEn: string;
  labelBn: string;
}> = [
  { key: "ALL", labelEn: "All", labelBn: "সবাই" },
  { key: "ACTIVE", labelEn: "Active", labelBn: "সক্রিয়" },
  { key: "INACTIVE", labelEn: "Inactive", labelBn: "নিষ্ক্রিয়" },
  { key: "SUSPENDED", labelEn: "Suspended", labelBn: "স্থগিত" },
];

export interface UserFiltersState {
  search: string;
  status: UserStatus | "ALL";
  role: Role | "ALL";
  membershipType: MembershipType | "ALL";
  bloodGroup: BloodGroup | "ALL";
  emailVerified: "ALL" | "true" | "false";
  sortBy: UserSortField;
  sortOrder: SortOrder;
  limit: number;
}

interface UserFilterBarProps {
  filters: UserFiltersState;
  isBn: boolean;
  onChange: <K extends keyof UserFiltersState>(
    key: K,
    value: UserFiltersState[K]
  ) => void;
  onReset: () => void;
}

const SELECT_CLASS =
  "h-9 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:bg-white focus:border-[#006a4e] outline-none cursor-pointer";

export default function UserFilterBar({
  filters,
  isBn,
  onChange,
  onReset,
}: UserFilterBarProps) {
  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    filters.status !== "ALL" ||
    filters.role !== "ALL" ||
    filters.membershipType !== "ALL" ||
    filters.bloodGroup !== "ALL" ||
    filters.emailVerified !== "ALL";

  return (
    <div className="space-y-3">
      {/* Row 1: Search & Status Quick Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder={
              isBn
                ? "নাম, ইমেইল, ফোন, গ্রাম বা পেশা..."
                : "Search name, email, phone, village, profession..."
            }
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-[var(--text)] placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => {
            const active = filters.status === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => onChange("status", f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  active
                    ? "bg-[var(--primary)] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isBn ? f.labelBn : f.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Role, Membership, Blood Group, Email Verified, Sort & Page Size */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label={isBn ? "রোল ফিল্টার" : "Filter by role"}
          value={filters.role}
          onChange={(e) => onChange("role", e.target.value as Role | "ALL")}
          className={SELECT_CLASS}
        >
          <option value="ALL">{isBn ? "সব রোল" : "All Roles"}</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          aria-label={isBn ? "মেম্বারশিপ ফিল্টার" : "Filter by membership"}
          value={filters.membershipType}
          onChange={(e) =>
            onChange("membershipType", e.target.value as MembershipType | "ALL")
          }
          className={SELECT_CLASS}
        >
          <option value="ALL">
            {isBn ? "সব মেম্বারশিপ" : "All Memberships"}
          </option>
          {MEMBERSHIP_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>
              {isBn ? m.labelBn : m.labelEn}
            </option>
          ))}
        </select>

        <select
          aria-label={isBn ? "রক্তের গ্রুপ ফিল্টার" : "Filter by blood group"}
          value={filters.bloodGroup}
          onChange={(e) =>
            onChange("bloodGroup", e.target.value as BloodGroup | "ALL")
          }
          className={SELECT_CLASS}
        >
          <option value="ALL">{isBn ? "সব রক্তের গ্রুপ" : "All Blood Groups"}</option>
          {BLOOD_GROUP_OPTIONS.map((bg) => (
            <option key={bg.value} value={bg.value}>
              {bg.display}
            </option>
          ))}
        </select>

        <select
          aria-label={isBn ? "ইমেইল ভেরিফিকেশন" : "Email verification filter"}
          value={filters.emailVerified}
          onChange={(e) =>
            onChange("emailVerified", e.target.value as "ALL" | "true" | "false")
          }
          className={SELECT_CLASS}
        >
          <option value="ALL">
            {isBn ? "ইমেইল ভেরিফিকেশন: সব" : "Email Verified: All"}
          </option>
          <option value="true">{isBn ? "ভেরিফায়েড" : "Verified Only"}</option>
          <option value="false">{isBn ? "অভেরিফায়েড" : "Unverified Only"}</option>
        </select>

        <div className="flex items-center gap-1.5 ml-auto">
          <select
            aria-label={isBn ? "সর্ট ফিল্ড" : "Sort by field"}
            value={filters.sortBy}
            onChange={(e) => onChange("sortBy", e.target.value as UserSortField)}
            className={SELECT_CLASS}
          >
            {SORT_FIELD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {isBn ? `সর্ট: ${opt.labelBn}` : `Sort: ${opt.labelEn}`}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              onChange("sortOrder", filters.sortOrder === "desc" ? "asc" : "desc")
            }
            title={
              filters.sortOrder === "desc"
                ? isBn ? "নতুন/বড় থেকে ছোট" : "Descending"
                : isBn ? "পুরনো/ছোট থেকে বড়" : "Ascending"
            }
            className="h-9 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-extrabold text-slate-700 cursor-pointer"
          >
            {filters.sortOrder === "desc" ? "↓ DESC" : "↑ ASC"}
          </button>

          <select
            aria-label={isBn ? "প্রতি পেজ" : "Items per page"}
            value={filters.limit}
            onChange={(e) => onChange("limit", Number(e.target.value))}
            className={SELECT_CLASS}
          >
            <option value={10}>10 / {isBn ? "পেজ" : "page"}</option>
            <option value={20}>20 / {isBn ? "পেজ" : "page"}</option>
            <option value={50}>50 / {isBn ? "পেজ" : "page"}</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="h-9 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
            >
              {isBn ? "রিসেট" : "Reset"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

