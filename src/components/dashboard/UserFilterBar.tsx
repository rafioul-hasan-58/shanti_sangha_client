"use client";

import ThemedSelect from "@/components/common/ThemedSelect";
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
            className="w-4 h-4 text-[#006a4e]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#006a4e]/20 bg-[#f7f4ea]/60 text-sm text-[var(--text)] placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/15 outline-none transition-all"
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
                    ? "bg-[#006a4e] text-white shadow-2xs"
                    : "bg-[#f7f4ea] text-[var(--text)] hover:bg-[#006a4e]/10 hover:text-[#006a4e]"
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
        <ThemedSelect
          ariaLabel={isBn ? "রোল ফিল্টার" : "Filter by role"}
          value={filters.role}
          isFiltered={filters.role !== "ALL"}
          onChange={(val) => onChange("role", val)}
          options={[
            { value: "ALL", label: isBn ? "সব রোল" : "All Roles" },
            ...ROLE_OPTIONS.map((r) => ({ value: r, label: r })),
          ]}
        />

        <ThemedSelect
          ariaLabel={isBn ? "মেম্বারশিপ ফিল্টার" : "Filter by membership"}
          value={filters.membershipType}
          isFiltered={filters.membershipType !== "ALL"}
          onChange={(val) => onChange("membershipType", val)}
          options={[
            {
              value: "ALL",
              label: isBn ? "সব মেম্বারশিপ" : "All Memberships",
            },
            ...MEMBERSHIP_OPTIONS.map((m) => ({
              value: m.value,
              label: isBn ? m.labelBn : m.labelEn,
            })),
          ]}
        />

        <ThemedSelect
          ariaLabel={isBn ? "রক্তের গ্রুপ ফিল্টার" : "Filter by blood group"}
          value={filters.bloodGroup}
          isFiltered={filters.bloodGroup !== "ALL"}
          onChange={(val) => onChange("bloodGroup", val)}
          options={[
            {
              value: "ALL",
              label: isBn ? "সব রক্তের গ্রুপ" : "All Blood Groups",
            },
            ...BLOOD_GROUP_OPTIONS.map((bg) => ({
              value: bg.value,
              label: bg.display,
            })),
          ]}
        />

        <ThemedSelect
          ariaLabel={isBn ? "ইমেইল ভেরিফিকেশন" : "Email verification filter"}
          value={filters.emailVerified}
          isFiltered={filters.emailVerified !== "ALL"}
          onChange={(val) => onChange("emailVerified", val)}
          options={[
            {
              value: "ALL",
              label: isBn ? "ইমেইল ভেরিফিকেশন: সব" : "Email Verified: All",
            },
            { value: "true", label: isBn ? "ভেরিফায়েড" : "Verified Only" },
            { value: "false", label: isBn ? "অভেরিফায়েড" : "Unverified Only" },
          ]}
        />

        <div className="flex flex-wrap items-center gap-1.5 sm:ml-auto">
          <ThemedSelect
            ariaLabel={isBn ? "সর্ট ফিল্ড" : "Sort by field"}
            value={filters.sortBy}
            align="right"
            onChange={(val) => onChange("sortBy", val)}
            options={SORT_FIELD_OPTIONS.map((opt) => ({
              value: opt.value,
              label: isBn ? `সর্ট: ${opt.labelBn}` : `Sort: ${opt.labelEn}`,
            }))}
          />

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
            className="h-9 px-3 rounded-xl border border-[#006a4e]/20 bg-[#f7f4ea]/70 hover:bg-white hover:border-[#006a4e]/45 text-xs font-extrabold text-[#006a4e] transition-colors cursor-pointer"
          >
            {filters.sortOrder === "desc" ? "↓ DESC" : "↑ ASC"}
          </button>

          <ThemedSelect
            ariaLabel={isBn ? "প্রতি পেজ" : "Items per page"}
            value={String(filters.limit)}
            align="right"
            onChange={(val) => onChange("limit", Number(val))}
            options={[
              { value: "10", label: `10 / ${isBn ? "পেজ" : "page"}` },
              { value: "20", label: `20 / ${isBn ? "পেজ" : "page"}` },
              { value: "50", label: `50 / ${isBn ? "পেজ" : "page"}` },
            ]}
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="h-9 px-3 rounded-xl bg-[#f42a41]/10 hover:bg-[#f42a41] text-[var(--accent)] hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {isBn ? "রিসেট" : "Reset"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
