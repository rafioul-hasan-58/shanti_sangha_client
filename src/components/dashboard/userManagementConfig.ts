import type { MembershipType, Role, UserStatus } from "@/types";
import type { UserSortField } from "@/lib/types/dashboard";

export const ROLE_OPTIONS: Role[] = ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"];

export const STATUS_OPTIONS: UserStatus[] = ["ACTIVE", "SUSPENDED"];

export const MEMBERSHIP_OPTIONS: Array<{
  value: MembershipType;
  labelEn: string;
  labelBn: string;
}> = [
  { value: "PERMANENT", labelEn: "Permanent", labelBn: "স্থায়ী সদস্য" },
  { value: "PLAYER_QUOTA", labelEn: "Player Quota", labelBn: "খেলোয়াড় কোটা" },
];

export const SORT_FIELD_OPTIONS: Array<{
  value: UserSortField;
  labelEn: string;
  labelBn: string;
}> = [
  { value: "createdAt", labelEn: "Joined Date", labelBn: "জয়েনিং ডেট" },
  { value: "updatedAt", labelEn: "Last Updated", labelBn: "সর্বশেষ আপডেট" },
  { value: "fullName", labelEn: "Full Name", labelBn: "পুরো নাম" },
  { value: "email", labelEn: "Email", labelBn: "ইমেইল" },
  { value: "role", labelEn: "Role", labelBn: "রোল" },
  { value: "status", labelEn: "Status", labelBn: "স্ট্যাটাস" },
];

export const STATUS_BADGE_MAP: Record<
  UserStatus,
  { labelEn: string; labelBn: string; className: string }
> = {
  ACTIVE: {
    labelEn: "Active",
    labelBn: "অ্যাক্টিভ",
    className: "bg-[#006a4e]/10 text-[var(--primary)] border-[#006a4e]/25",
  },
  SUSPENDED: {
    labelEn: "Suspended",
    labelBn: "ব্লকড",
    className: "bg-[#f42a41]/10 text-[var(--accent)] border-[#f42a41]/30",
  },
};

export const MEMBERSHIP_BADGE_MAP: Record<
  MembershipType,
  { labelEn: string; labelBn: string; className: string }
> = {
  PERMANENT: {
    labelEn: "Permanent",
    labelBn: "স্থায়ী",
    className: "bg-emerald-50 text-[#006a4e] border-emerald-200",
  },
  PLAYER_QUOTA: {
    labelEn: "Player Quota",
    labelBn: "খেলোয়াড় কোটা",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
};

export function formatIsoDate(value?: string | boolean | null): string {
  if (!value || typeof value !== "string") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

