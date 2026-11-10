import type { BloodGroup } from "@/types";

export interface BloodGroupOption {
  value: BloodGroup;
  display: string;
  labelEn: string;
  labelBn: string;
}

export const BLOOD_GROUP_OPTIONS: BloodGroupOption[] = [
  { value: "UNKNOWN", display: "Unknown", labelEn: "Unknown / Not specified", labelBn: "অজানা / এখনো দেওয়া হয়নি" },
  { value: "A_POSITIVE", display: "A+", labelEn: "A+ (A Positive)", labelBn: "এ পজিটিভ (A+)" },
  { value: "A_NEGATIVE", display: "A-", labelEn: "A- (A Negative)", labelBn: "এ নেগেটিভ (A-)" },
  { value: "B_POSITIVE", display: "B+", labelEn: "B+ (B Positive)", labelBn: "বি পজিটিভ (B+)" },
  { value: "B_NEGATIVE", display: "B-", labelEn: "B- (B Negative)", labelBn: "বি নেগেটিভ (B-)" },
  { value: "AB_POSITIVE", display: "AB+", labelEn: "AB+ (AB Positive)", labelBn: "এবি পজিটিভ (AB+)" },
  { value: "AB_NEGATIVE", display: "AB-", labelEn: "AB- (AB Negative)", labelBn: "এবি নেগেটিভ (AB-)" },
  { value: "O_POSITIVE", display: "O+", labelEn: "O+ (O Positive)", labelBn: "ও পজিটিভ (O+)" },
  { value: "O_NEGATIVE", display: "O-", labelEn: "O- (O Negative)", labelBn: "ও নেগেটিভ (O-)" },
];

export function formatBloodGroupDisplay(bg?: string | null): string {
  if (!bg) return "UNKNOWN";
  const upper = bg.toUpperCase();
  if (upper === "A_POSITIVE" || upper === "A+") return "A+";
  if (upper === "A_NEGATIVE" || upper === "A-") return "A-";
  if (upper === "B_POSITIVE" || upper === "B+") return "B+";
  if (upper === "B_NEGATIVE" || upper === "B-") return "B-";
  if (upper === "AB_POSITIVE" || upper === "AB+") return "AB+";
  if (upper === "AB_NEGATIVE" || upper === "AB-") return "AB-";
  if (upper === "O_POSITIVE" || upper === "O+") return "O+";
  if (upper === "O_NEGATIVE" || upper === "O-") return "O-";
  return bg;
}

export function toPrismaBloodGroup(bg?: string | null): BloodGroup {
  if (!bg) return "UNKNOWN";
  const upper = bg.toUpperCase();
  if (upper === "A+" || upper === "A_POSITIVE") return "A_POSITIVE";
  if (upper === "A-" || upper === "A_NEGATIVE") return "A_NEGATIVE";
  if (upper === "B+" || upper === "B_POSITIVE") return "B_POSITIVE";
  if (upper === "B-" || upper === "B_NEGATIVE") return "B_NEGATIVE";
  if (upper === "AB+" || upper === "AB_POSITIVE") return "AB_POSITIVE";
  if (upper === "AB-" || upper === "AB_NEGATIVE") return "AB_NEGATIVE";
  if (upper === "O+" || upper === "O_POSITIVE") return "O_POSITIVE";
  if (upper === "O-" || upper === "O_NEGATIVE") return "O_NEGATIVE";
  return "UNKNOWN";
}

