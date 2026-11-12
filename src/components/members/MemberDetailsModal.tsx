"use client";

import { useEffect } from "react";
import UserAvatar from "@/components/layout/UserAvatar";
import RoleBadge from "@/components/layout/RoleBadge";
import VerifiedTick from "@/components/common/VerifiedTick";
import { isAdminVerified } from "@/lib/authRole";
import type { ManagedUser } from "@/lib/types/dashboard";
import {
  MEMBER_CARD_PALETTES,
  MemberAuthProviderIcon,
  PlayerQuotaBadgeIcon,
  formatMemberJoinDate,
  getMemberBloodLabel,
  isMemberGoogleLogin,
} from "./MemberCardShared";

interface MemberDetailsModalProps {
  member: ManagedUser | null;
  paletteIndex?: number;
  isBn: boolean;
  onClose: () => void;
}

export default function MemberDetailsModal({
  member,
  paletteIndex = 0,
  isBn,
  onClose,
}: MemberDetailsModalProps) {
  useEffect(() => {
    if (!member) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [member, onClose]);

  if (!member) return null;

  const palette =
    MEMBER_CARD_PALETTES[paletteIndex % MEMBER_CARD_PALETTES.length];
  const bloodLabel = getMemberBloodLabel(member.bloodGroup);
  const isGoogle = isMemberGoogleLogin(member);
  const isPlayerQuota = member.membershipType === "PLAYER_QUOTA";
  const joinedDate = formatMemberJoinDate(member, isBn);
  const phoneDisplay = member.whatsappNumber || member.phoneNumber;

  const details: Array<{ label: string; value: string; icon: string }> = [
    {
      label: isBn ? "রক্তের গ্রুপ" : "Blood Group",
      value: bloodLabel,
      icon: "🩸",
    },
    {
      label: isBn ? "পেশা" : "Profession",
      value: member.profession || (isBn ? "সদস্য" : "Club Member"),
      icon: "💼",
    },
    {
      label: isBn ? "গ্রাম" : "Village",
      value: member.village || (isBn ? "সাভারচালা" : "Shavarchala"),
      icon: "🏡",
    },
    {
      label: isBn ? "বর্তমান ঠিকানা" : "Current Location",
      value: member.currentLocation || "—",
      icon: "📍",
    },
    {
      label: isBn ? "ইমেইল" : "Email",
      value: member.email || "—",
      icon: "✉️",
    },
    {
      label: isBn ? "ফোন / হোয়াটসঅ্যাপ" : "Phone / WhatsApp",
      value: phoneDisplay || "—",
      icon: "📞",
    },
    ...(member.fatherName
      ? [
          {
            label: isBn ? "পিতার নাম" : "Father's Name",
            value: member.fatherName,
            icon: "👤",
          },
        ]
      : []),
    {
      label: isBn ? "যোগদানের তারিখ" : "Joined",
      value: joinedDate,
      icon: "📅",
    },
  ];

  const whatsappClean = member.whatsappNumber?.replace(/[^\d+]/g, "");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={member.fullName}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-emerald-200/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Banner */}
        <div
          className={`relative h-24 sm:h-28 bg-gradient-to-r ${palette.bar}`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={isBn ? "বন্ধ করুন" : "Close"}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Profile Header */}
        <div className="px-5 sm:px-7 pb-6 sm:pb-7">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 min-w-0">
              <div className="relative self-start">
                <UserAvatar
                  src={member.profileImage || member.picture}
                  name={member.fullName}
                  className={`h-24 w-24 sm:h-28 sm:w-28 ring-4 ring-white shadow-lg bg-white`}
                />
                <span
                  title={isBn ? "সক্রিয় সদস্য" : "Active Member"}
                  className="absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white"
                />
              </div>

              <div className="min-w-0 sm:pb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="font-display text-xl sm:text-2xl font-black text-[var(--text)] truncate">
                    {member.fullName}
                  </h2>
                  {isAdminVerified(member.adminVerified) && (
                    <VerifiedTick isBn={isBn} className="w-5 h-5" />
                  )}
                </div>

                {member.name && member.name !== member.fullName && (
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {member.name}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <RoleBadge role={member.role} isBn={isBn} />
                  {isPlayerQuota ? (
                    <PlayerQuotaBadgeIcon isBn={isBn} withLabel />
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border bg-emerald-50 text-[#006a4e] border-emerald-200">
                      {isBn ? "স্থায়ী সদস্য" : "Permanent"}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600">
                    <MemberAuthProviderIcon isGoogle={isGoogle} isBn={isBn} />
                    <span>
                      {isGoogle
                        ? isBn
                          ? "গুগল"
                          : "Google"
                        : isBn
                          ? "ইমেইল"
                          : "Email"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio / Summary */}
          {(member.summary || member.bio) && (
            <div className="mt-5 rounded-2xl bg-emerald-50/55 border border-emerald-200/70 p-4 space-y-2">
              {member.summary && (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  “{member.summary}”
                </p>
              )}
              {member.bio && member.bio !== member.summary && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {member.bio}
                </p>
              )}
            </div>
          )}

          {/* Structured Info Grid */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {details.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-slate-50/90 border border-slate-200/75 px-3.5 py-2.5 flex items-start gap-2.5"
              >
                <span className="text-base leading-none mt-0.5" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 break-words">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Social & Quick Contact Actions */}
          {(member.facebookProfile || whatsappClean || member.email) && (
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] border border-emerald-200 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>✉️</span>
                  <span>{isBn ? "ইমেইল পাঠান" : "Send Email"}</span>
                </a>
              )}
              {whatsappClean && (
                <a
                  href={`https://wa.me/${whatsappClean.replace(/^\+/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] border border-[#25D366]/35 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>
              )}
              {member.facebookProfile && (
                <a
                  href={member.facebookProfile}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Facebook ↗</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

