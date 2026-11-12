"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/layout/UserAvatar";
import RoleBadge from "@/components/layout/RoleBadge";
import VerifiedTick from "@/components/common/VerifiedTick";
import { useAuth } from "@/context/AuthContext";
import { isAdminVerified } from "@/lib/authRole";
import {
  fetchUserById,
  toggleBlockUserById,
  updateUserById,
} from "@/lib/api/users";
import { formatBloodGroupDisplay } from "@/lib/bloodGroup";
import type { ManagedUser } from "@/lib/types/dashboard";
import {
  DeleteActionIcon,
  EditActionIcon,
  SuspendActionIcon,
} from "./UserActionIcons";
import UserEditModal from "./UserEditModal";
import UserDeleteConfirmModal from "./UserDeleteConfirmModal";
import {
  MEMBERSHIP_BADGE_MAP,
  STATUS_BADGE_MAP,
  formatIsoDate,
} from "./userManagementConfig";

interface UserDetailsPageViewProps {
  userId: string;
  locale: string;
  backTab?: "admin_users_all" | "admin_users_pending";
}

/**
 * Dynamic full-page user details view loaded via `GET /api/v1/users/:id`.
 */
export default function UserDetailsPageView({
  userId,
  locale,
  backTab = "admin_users_all",
}: UserDetailsPageViewProps) {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const isBn = locale === "bn";
  const backHref = `/${locale}/dashboard?tab=${backTab}`;

  const [freshUser, setFreshUser] = useState<ManagedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchUserById(userId)
      .then((loaded) => {
        if (!cancelled) setFreshUser(loaded);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : isBn
                ? "ব্যবহারকারীর তথ্য লোড করা যায়নি।"
                : "Failed to load user details."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, isBn]);

  const isSelf = Boolean(authUser?.id && freshUser?.id === authUser.id);
  const isBlocked = freshUser?.status === "SUSPENDED";

  const handleToggleSuspend = async () => {
    if (!freshUser || isSelf || busy) return;
    setBusy(true);
    setFeedback(null);
    try {
      const res = await toggleBlockUserById(freshUser.id);
      setFreshUser(res.user);
      setFeedback({ type: "success", text: res.message });
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : isBn
              ? "স্ট্যাটাস পরিবর্তন করা যায়নি।"
              : "Failed to update user status.",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleApprove = async () => {
    if (!freshUser || busy) return;
    setBusy(true);
    setFeedback(null);
    try {
      const res = await updateUserById(freshUser.id, {
        adminVerified: true,
        status: "ACTIVE",
      });
      setFreshUser(res.user);
      setFeedback({
        type: "success",
        text: isBn
          ? `${res.user.fullName} অনুমোদিত ও সক্রিয় করা হয়েছে`
          : `${res.user.fullName} approved & activated`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : isBn
              ? "অনুমোদন করা যায়নি।"
              : "Failed to approve user.",
      });
    } finally {
      setBusy(false);
    }
  };

  const formattedBlood = freshUser
    ? formatBloodGroupDisplay(freshUser.bloodGroup)
    : "UNKNOWN";
  const bloodLabel =
    !formattedBlood || formattedBlood.trim().toUpperCase() === "UNKNOWN"
      ? "N/A"
      : formattedBlood;

  const isGoogleLogin = Boolean(
    freshUser?.authProvider?.toUpperCase().includes("GOOGLE") || freshUser?.googleId
  );

  const statusMeta = freshUser
    ? STATUS_BADGE_MAP[freshUser.status] ?? STATUS_BADGE_MAP.ACTIVE
    : STATUS_BADGE_MAP.ACTIVE;
  const membershipMeta = freshUser?.membershipType
    ? MEMBERSHIP_BADGE_MAP[freshUser.membershipType]
    : null;

  const infoRows: Array<{ label: string; value: string }> = freshUser
    ? [
        { label: isBn ? "ইমেইল" : "Email", value: freshUser.email || "—" },
        { label: isBn ? "ফোন" : "Phone", value: freshUser.phoneNumber || "—" },
        { label: isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp", value: freshUser.whatsappNumber || "—" },
        { label: isBn ? "পিতার নাম" : "Father's Name", value: freshUser.fatherName || "—" },
        { label: isBn ? "মাতার নাম" : "Mother's Name", value: freshUser.motherName || "—" },
        { label: isBn ? "রক্তের গ্রুপ" : "Blood Group", value: bloodLabel },
        { label: isBn ? "পেশা" : "Profession", value: freshUser.profession || "—" },
        { label: isBn ? "গ্রাম" : "Village", value: freshUser.village || "—" },
        { label: isBn ? "বর্তমান ঠিকানা" : "Current Location", value: freshUser.currentLocation || "—" },
        { label: isBn ? "অথ প্রোভাইডার" : "Auth Provider", value: freshUser.authProvider || "—" },
        { label: isBn ? "যোগদানের তারিখ" : "Created At", value: formatIsoDate(freshUser.createdAt) },
        { label: isBn ? "সর্বশেষ আপডেট" : "Updated At", value: formatIsoDate(freshUser.updatedAt) },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#f7f4ea] pb-16 text-[var(--text)]">
      {/* Top Emerald Navigation & Breadcrumb Bar */}
      <div className="bg-[#006a4e] text-white border-b border-white/10 sticky top-0 z-30 shadow-xs">
        <div className="mx-auto max-w-5xl px-4 py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-white/95 hover:text-white font-bold transition-colors group"
          >
            <svg
              className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M14.71 6.71a.996.996 0 0 0-1.41 0L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59a.996.996 0 1 0 1.41-1.41L10.83 12l3.88-3.88c.38-.38.38-1.02 0-1.41z" />
            </svg>
            <span>{isBn ? "ইউজার তালিকায় ফিরুন" : "Back to Users"}</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-100 min-w-0">
            <Link href={`/${locale}/dashboard`} className="hover:text-white transition-colors">
              {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
            </Link>
            <span>/</span>
            <Link href={backHref} className="hover:text-white transition-colors">
              {isBn ? "ইউজার ম্যানেজমেন্ট" : "Users"}
            </Link>
            <span>/</span>
            <span className="text-white font-bold truncate max-w-[200px]">
              {freshUser?.fullName || userId}
            </span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8 space-y-6">
        {feedback && (
          <div
            className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-xs font-bold border ${
              feedback.type === "error"
                ? "bg-[#f42a41]/10 border-[#f42a41]/30 text-[var(--accent)]"
                : "bg-[#006a4e]/10 border-[#006a4e]/25 text-[#006a4e]"
            }`}
          >
            <span>{feedback.text}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="opacity-70 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {loading && !freshUser ? (
          <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-xs space-y-5 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-emerald-100/70" />
              <div className="space-y-2.5 flex-1">
                <div className="h-5 w-48 rounded-lg bg-slate-200" />
                <div className="h-3.5 w-64 rounded-lg bg-slate-100" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-16 rounded-2xl bg-emerald-50/50" />
              ))}
            </div>
          </div>
        ) : error && !freshUser ? (
          <div className="rounded-3xl bg-white border border-[#f42a41]/25 p-8 text-center space-y-4 shadow-xs">
            <p className="text-sm font-bold text-[#f42a41]">{error}</p>
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#006a4e] hover:bg-[#004d38] text-white text-xs font-extrabold transition-colors"
            >
              {isBn ? "ইউজার তালিকায় ফিরুন" : "Back to Users"}
            </Link>
          </div>
        ) : freshUser ? (
          <>
            {/* Profile Hero Card */}
            <section className="relative overflow-hidden rounded-3xl bg-white border border-emerald-100 shadow-sm">
              <div className="h-24 sm:h-28 bg-gradient-to-r from-[#004d38] via-[#006a4e] to-[#00a67e]" />

              <div className="px-5 sm:px-8 pb-6 sm:pb-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 min-w-0">
                    <div className="relative self-start">
                      <UserAvatar
                        src={freshUser.profileImage || freshUser.picture}
                        name={freshUser.fullName}
                        className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-white shadow-md bg-white"
                      />
                      <span
                        title={isBn ? statusMeta.labelBn : statusMeta.labelEn}
                        className={`absolute bottom-1 right-1 h-4 w-4 rounded-full ring-2 ring-white ${
                          isBlocked ? "bg-rose-500" : "bg-emerald-500"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 pt-1 sm:pb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl sm:text-2xl font-black text-[var(--text)] truncate">
                          {freshUser.fullName}
                        </h1>
                        {isAdminVerified(freshUser.adminVerified) && (
                          <VerifiedTick isBn={isBn} className="w-5 h-5" />
                        )}
                        {isSelf && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {isBn ? "আপনি" : "You"}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-2 flex-wrap text-xs sm:text-sm text-slate-600 font-medium">
                        <span className="truncate">{freshUser.email || "—"}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#006a4e] border border-emerald-200/80">
                          {isGoogleLogin ? "Google" : "Email (@)"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                        <RoleBadge role={freshUser.role} isBn={isBn} />
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${statusMeta.className}`}
                        >
                          {isBn ? statusMeta.labelBn : statusMeta.labelEn}
                        </span>
                        {membershipMeta && (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${membershipMeta.className}`}
                          >
                            {isBn ? membershipMeta.labelBn : membershipMeta.labelEn}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                    {!isAdminVerified(freshUser.adminVerified) && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleApprove()}
                        className="h-9 px-3.5 rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors disabled:opacity-45 cursor-pointer"
                      >
                        <span>{isBn ? "✓ অনুমোদন" : "✓ Approve"}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setShowEditModal(true)}
                      className="h-9 px-3.5 rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors disabled:opacity-45 cursor-pointer"
                    >
                      <EditActionIcon />
                      <span>{isBn ? "এডিট" : "Edit"}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSelf || busy}
                      onClick={() => void handleToggleSuspend()}
                      className={`h-9 px-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer ${
                        isBlocked
                          ? "bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] border border-emerald-200"
                          : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      <SuspendActionIcon suspended={isBlocked} />
                      <span>
                        {isBlocked
                          ? isBn ? "সক্রিয় করুন" : "Unsuspend"
                          : isBn ? "স্থগিত করুন" : "Suspend"}
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={isSelf || busy}
                      onClick={() => setShowDeleteModal(true)}
                      className="h-9 px-3.5 rounded-xl border border-[#f42a41]/30 bg-[#f42a41]/10 hover:bg-[#f42a41] hover:text-white text-[var(--accent)] text-xs font-bold inline-flex items-center gap-1.5 transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <DeleteActionIcon />
                      <span>{isBn ? "ডিলিট" : "Delete"}</span>
                    </button>
                  </div>
                </div>

                {/* Verification & Social Links */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400 mr-1">
                    ID: {freshUser.id}
                  </span>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                      freshUser.emailVerified
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    {freshUser.emailVerified
                      ? isBn ? "✓ ইমেইল ভেরিফায়েড" : "✓ Email Verified"
                      : isBn ? "✕ ইমেইল ভেরিফায়েড নয়" : "✕ Email Unverified"}
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
              </div>
            </section>

            {/* Detailed Member Information Grid */}
            <section className="rounded-3xl bg-white border border-emerald-100 p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#006a4e]">
                {isBn ? "সদস্যের বিস্তারিত তথ্য" : "Member Information"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {infoRows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-2xl bg-emerald-50/45 px-4 py-3 border border-emerald-200/60"
                  >
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {row.label}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1 break-words">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              {(freshUser.summary || freshUser.bio) && (
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {freshUser.summary && (
                    <div className="rounded-2xl bg-slate-50/90 p-4 border border-slate-100 text-xs sm:text-sm text-slate-700">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {isBn ? "সংক্ষিপ্ত পরিচিতি" : "Summary"}
                      </p>
                      <p className="mt-1 leading-relaxed">{freshUser.summary}</p>
                    </div>
                  )}
                  {freshUser.bio && (
                    <div className="rounded-2xl bg-slate-50/90 p-4 border border-slate-100 text-xs sm:text-sm text-slate-700">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {isBn ? "বিস্তারিত বায়ো" : "Bio"}
                      </p>
                      <p className="mt-1 leading-relaxed">{freshUser.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>

      <UserEditModal
        user={showEditModal ? freshUser : null}
        isBn={isBn}
        isSelf={isSelf}
        onClose={() => setShowEditModal(false)}
        onSaved={(updated, message) => {
          setFreshUser(updated);
          setShowEditModal(false);
          setFeedback({ type: "success", text: message });
        }}
      />

      <UserDeleteConfirmModal
        user={showDeleteModal ? freshUser : null}
        isBn={isBn}
        onClose={() => setShowDeleteModal(false)}
        onDeleted={() => {
          setShowDeleteModal(false);
          router.push(backHref);
        }}
      />
    </div>
  );
}

