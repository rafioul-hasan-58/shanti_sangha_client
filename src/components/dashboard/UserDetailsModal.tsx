"use client";

import { useEffect, useState } from "react";
import UserAvatar from "@/components/layout/UserAvatar";
import RoleBadge from "@/components/layout/RoleBadge";
import { fetchUserById } from "@/lib/api/users";
import { formatBloodGroupDisplay } from "@/lib/bloodGroup";
import type { ManagedUser } from "@/lib/types/dashboard";
import {
  MEMBERSHIP_BADGE_MAP,
  STATUS_BADGE_MAP,
  formatIsoDate,
} from "./userManagementConfig";

interface UserDetailsModalProps {
  user: ManagedUser | null;
  isBn: boolean;
  isSelf: boolean;
  onClose: () => void;
  onEdit: (user: ManagedUser) => void;
  onToggleBlock: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}

/**
 * Modal inspecting full sanitized user details loaded via `GET /api/v1/users/:id`.
 */
export default function UserDetailsModal({
  user,
  isBn,
  isSelf,
  onClose,
  onEdit,
  onToggleBlock,
  onDelete,
}: UserDetailsModalProps) {
  const [freshUser, setFreshUser] = useState<ManagedUser | null>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setFreshUser(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setFreshUser(user);
    setLoading(true);
    setError(null);

    fetchUserById(user.id)
      .then((loaded) => {
        if (!cancelled) setFreshUser(loaded);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load user details");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user || !freshUser) return null;

  const statusMeta = STATUS_BADGE_MAP[freshUser.status] ?? STATUS_BADGE_MAP.ACTIVE;
  const membershipMeta = freshUser.membershipType
    ? MEMBERSHIP_BADGE_MAP[freshUser.membershipType]
    : null;
  const isBlocked = freshUser.status === "SUSPENDED";

  const infoRows: Array<{ label: string; value: string }> = [
    { label: isBn ? "ইমেইল" : "Email", value: freshUser.email || "—" },
    { label: isBn ? "ফোন" : "Phone", value: freshUser.phoneNumber || "—" },
    { label: isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp", value: freshUser.whatsappNumber || "—" },
    { label: isBn ? "পিতার নাম" : "Father's Name", value: freshUser.fatherName || "—" },
    { label: isBn ? "মাতার নাম" : "Mother's Name", value: freshUser.motherName || "—" },
    { label: isBn ? "রক্তের গ্রুপ" : "Blood Group", value: formatBloodGroupDisplay(freshUser.bloodGroup) },
    { label: isBn ? "পেশা" : "Profession", value: freshUser.profession || "—" },
    { label: isBn ? "গ্রাম" : "Village", value: freshUser.village || "—" },
    { label: isBn ? "বর্তমান ঠিকানা" : "Current Location", value: freshUser.currentLocation || "—" },
    { label: isBn ? "অথ প্রোভাইডার" : "Auth Provider", value: freshUser.authProvider || "—" },
    { label: isBn ? "যোগদানের তারিখ" : "Created At", value: formatIsoDate(freshUser.createdAt) },
    { label: isBn ? "সর্বশেষ আপডেট" : "Updated At", value: formatIsoDate(freshUser.updatedAt) },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5 min-w-0">
            <UserAvatar
              src={freshUser.profileImage || freshUser.picture}
              name={freshUser.fullName}
              className="h-14 w-14 border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-lg font-black text-[var(--text)] truncate">
                  {freshUser.fullName}
                </h4>
                {isSelf && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {isBn ? "আপনি" : "You"}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono truncate mt-0.5">
                ID: {freshUser.id}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                <RoleBadge role={freshUser.role} isBn={isBn} />
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusMeta.className}`}>
                  {isBn ? statusMeta.labelBn : statusMeta.labelEn}
                </span>
                {membershipMeta && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${membershipMeta.className}`}>
                    {isBn ? membershipMeta.labelBn : membershipMeta.labelEn}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isBn ? "বন্ধ করুন" : "Close"}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {loading && (
          <p className="text-xs font-semibold text-[#006a4e] animate-pulse">
            {isBn ? "সার্ভার থেকে সর্বশেষ তথ্য লোড হচ্ছে..." : "Refreshing latest profile from server..."}
          </p>
        )}

        {error && (
          <div className="rounded-xl bg-[#f42a41]/10 border border-[#f42a41]/25 px-3 py-2 text-xs font-semibold text-[var(--accent)]">
            {error}
          </div>
        )}

        {/* Verification Badges */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
              freshUser.emailVerified
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
          >
            {freshUser.emailVerified
              ? isBn ? "✓ ইমেইল ভেরিফায়েড" : "✓ Email Verified"
              : isBn ? "✕ ইমেইল ভেরিফায়েড নয়" : "✕ Email Unverified"}
          </span>
          <span
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
              freshUser.adminVerified
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {freshUser.adminVerified
              ? isBn
                ? `✓ অ্যাডমিন অনুমোদিত (${formatIsoDate(freshUser.adminVerified)})`
                : `✓ Admin Verified (${formatIsoDate(freshUser.adminVerified)})`
              : isBn ? "⏳ অ্যাডমিন অনুমোদন বাকি" : "⏳ Pending Admin Verification"}
          </span>
          {freshUser.facebookProfile && (
            <a
              href={freshUser.facebookProfile}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:underline"
            >
              Facebook ↗
            </a>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {infoRows.map((row) => (
            <div key={row.label} className="rounded-2xl bg-[#f7f4ea]/60 px-3.5 py-2.5 border border-slate-100">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {row.label}
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 break-words">
                {row.value}
              </p>
            </div>
          ))}
        </div>

        {(freshUser.summary || freshUser.bio) && (
          <div className="space-y-2 rounded-2xl bg-slate-50 p-3.5 border border-slate-100 text-xs text-slate-700">
            {freshUser.summary && (
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-400">
                  {isBn ? "সংক্ষিপ্ত পরিচিতি" : "Summary"}
                </p>
                <p className="mt-0.5">{freshUser.summary}</p>
              </div>
            )}
            {freshUser.bio && (
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-400">
                  {isBn ? "বিস্তারিত বায়ো" : "Bio"}
                </p>
                <p className="mt-0.5">{freshUser.bio}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onEdit(freshUser)}
            className="px-4 py-2 rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {isBn ? "তথ্য এডিট করুন" : "Edit User"}
          </button>

          <button
            type="button"
            disabled={isSelf}
            onClick={() => onToggleBlock(freshUser)}
            className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
          >
            {isBlocked
              ? isBn ? "আনব্লক করুন" : "Unblock"
              : isBn ? "ব্লক করুন" : "Block"}
          </button>

          <button
            type="button"
            disabled={isSelf}
            onClick={() => onDelete(freshUser)}
            className="px-4 py-2 rounded-xl border border-[#f42a41]/30 bg-[#f42a41]/10 hover:bg-[#f42a41] hover:text-white text-[var(--accent)] text-xs font-bold transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
          >
            {isBn ? "ডিলিট" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

