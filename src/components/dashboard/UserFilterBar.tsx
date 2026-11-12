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

const ICON_CLS = "w-3.5 h-3.5 shrink-0";

function StatusFilterIcon({ status }: { status: UserStatus | "ALL" }) {
  switch (status) {
    case "ACTIVE":
      return (
        <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "INACTIVE":
      return (
        <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "SUSPENDED":
      return (
        <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      );
    default:
      return (
        <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
  }
}

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
  hideStatusFilter?: boolean;
  onChange: <K extends keyof UserFiltersState>(
    key: K,
    value: UserFiltersState[K]
  ) => void;
  onReset: () => void;
}

export default function UserFilterBar({
  filters,
  isBn,
  hideStatusFilter = false,
  onChange,
  onReset,
}: UserFilterBarProps) {
  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    (!hideStatusFilter && filters.status !== "ALL") ||
    filters.role !== "ALL" ||
    filters.membershipType !== "ALL" ||
    filters.bloodGroup !== "ALL" ||
    filters.emailVerified !== "ALL";

  return (
    <div className="space-y-3">
      {/* Row 1: Search & Status Quick Tabs (2-per-row on mobile) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
        <div className="relative flex-1 lg:max-w-md">
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

        {!hideStatusFilter && (
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-1.5">
            {STATUS_FILTERS.map((f) => {
              const active = filters.status === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => onChange("status", f.key)}
                  className={`h-9 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center sm:justify-start gap-2 transition-colors cursor-pointer border ${
                    active
                      ? "bg-[#006a4e] border-[#006a4e] text-white shadow-2xs"
                      : "bg-[#f7f4ea]/80 border-[#006a4e]/15 text-[var(--text)] hover:bg-[#006a4e]/10 hover:text-[#006a4e]"
                  }`}
                >
                  <StatusFilterIcon status={f.key} />
                  <span>{isBn ? f.labelBn : f.labelEn}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Row 2: Organized 2-column grid on mobile, clean wrapped bar on desktop */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2">
        <ThemedSelect
          ariaLabel={isBn ? "রোল ফিল্টার" : "Filter by role"}
          value={filters.role}
          isFiltered={filters.role !== "ALL"}
          className="w-full sm:w-auto h-10 sm:h-9"
          icon={
            <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
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
          className="w-full sm:w-auto h-10 sm:h-9"
          icon={
            <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
            </svg>
          }
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
          className="w-full sm:w-auto h-10 sm:h-9"
          icon={
            <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.25C12 3.25 6 10 6 14.25a6 6 0 1012 0C18 10 12 3.25 12 3.25z" />
            </svg>
          }
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
          className="w-full sm:w-auto h-10 sm:h-9"
          icon={
            <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          onChange={(val) => onChange("emailVerified", val)}
          options={[
            {
              value: "ALL",
              label: isBn ? "ইমেইল: সব" : "Email: All",
            },
            { value: "true", label: isBn ? "ভেরিফায়েড" : "Verified Only" },
            { value: "false", label: isBn ? "অভেরিফায়েড" : "Unverified Only" },
          ]}
        />

        <ThemedSelect
          ariaLabel={isBn ? "সর্ট ফিল্ড" : "Sort by field"}
          value={filters.sortBy}
          align="right"
          className="w-full sm:w-auto sm:ml-auto h-10 sm:h-9"
          icon={
            <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          }
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
          className="w-full sm:w-auto h-10 sm:h-9 px-3 rounded-xl border border-[#006a4e]/20 bg-[#f7f4ea]/70 hover:bg-white hover:border-[#006a4e]/45 text-xs font-extrabold text-[#006a4e] inline-flex items-center justify-center sm:justify-start gap-2 transition-colors cursor-pointer"
        >
          <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>{filters.sortOrder === "desc" ? "DESC" : "ASC"}</span>
        </button>

        <ThemedSelect
          ariaLabel={isBn ? "প্রতি পেজ" : "Items per page"}
          value={String(filters.limit)}
          align="right"
          className={`h-10 sm:h-9 sm:w-auto ${
            hasActiveFilters ? "w-full" : "col-span-2 sm:col-span-1 w-full"
          }`}
          icon={
            <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          }
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
            className="w-full sm:w-auto h-10 sm:h-9 px-3 rounded-xl bg-[#f42a41]/10 hover:bg-[#f42a41] text-[var(--accent)] hover:text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <svg className={ICON_CLS} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{isBn ? "রিসেট" : "Reset"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
