"use client";

import { useEffect, useRef, useState } from "react";
import UserAvatar from "@/components/layout/UserAvatar";
import RoleBadge from "@/components/layout/RoleBadge";
import VerifiedTick from "@/components/common/VerifiedTick";
import { isAdminVerified } from "@/lib/authRole";
import type { ManagedUser } from "@/lib/types/dashboard";
import type { UserStatus } from "@/types";
import { formatBloodGroupDisplay } from "@/lib/bloodGroup";

interface UserManagementCardsProps {
  users: ManagedUser[];
  isBn: boolean;
  currentUserId?: string;
  busyUserId?: string | null;
  isPendingView?: boolean;
  onApprove?: (user: ManagedUser) => void;
  onToggleBlock: (user: ManagedUser) => void;
  onView: (user: ManagedUser) => void;
  onEdit: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}

const CARD_PALETTES = [
  {
    card: "bg-gradient-to-br from-emerald-50/95 via-white to-[#eafaf2] border-emerald-200/90",
    bar: "from-[#006a4e] via-[#00a67e] to-emerald-400",
    ring: "ring-emerald-300/80",
    metaBox: "bg-emerald-100/45 border-emerald-200/70",
  },
  {
    card: "bg-gradient-to-br from-amber-50/95 via-white to-[#fff9e6] border-amber-200/90",
    bar: "from-[#f2b705] via-amber-500 to-orange-400",
    ring: "ring-amber-300/80",
    metaBox: "bg-amber-100/45 border-amber-200/70",
  },
  {
    card: "bg-gradient-to-br from-sky-50/95 via-white to-blue-50/80 border-sky-200/90",
    bar: "from-sky-500 via-blue-500 to-indigo-400",
    ring: "ring-sky-300/80",
    metaBox: "bg-sky-100/45 border-sky-200/70",
  },
  {
    card: "bg-gradient-to-br from-violet-50/90 via-white to-purple-50/80 border-violet-200/90",
    bar: "from-violet-500 via-purple-500 to-fuchsia-400",
    ring: "ring-violet-300/80",
    metaBox: "bg-violet-100/45 border-violet-200/70",
  },
  {
    card: "bg-gradient-to-br from-teal-50/95 via-white to-cyan-50/80 border-teal-200/90",
    bar: "from-teal-500 via-cyan-500 to-emerald-400",
    ring: "ring-teal-300/80",
    metaBox: "bg-teal-100/45 border-teal-200/70",
  },
  {
    card: "bg-gradient-to-br from-rose-50/90 via-white to-pink-50/80 border-rose-200/90",
    bar: "from-rose-500 via-pink-500 to-orange-400",
    ring: "ring-rose-300/80",
    metaBox: "bg-rose-100/45 border-rose-200/70",
  },
] as const;

const STATUS_DOT_MAP: Record<UserStatus, { dot: string; labelEn: string; labelBn: string }> = {
  ACTIVE: { dot: "bg-emerald-500", labelEn: "Active", labelBn: "সক্রিয়" },
  SUSPENDED: { dot: "bg-rose-500", labelEn: "Suspended", labelBn: "স্থগিত" },
};

/** Compact player icon badge shown only when `membershipType === "PLAYER_QUOTA"`. */
function PlayerQuotaBadgeIcon({ isBn }: { isBn: boolean }) {
  const label = isBn ? "খেলোয়াড় কোটা" : "Player Quota";
  return (
    <span
      title={label}
      aria-label={label}
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#006a4e] to-[#004d38] text-[#f2b705] border border-[#f2b705]/60 shadow-2xs shrink-0"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3.5 h-3.5"
        aria-hidden="true"
      >
        <circle cx="13" cy="5" r="2" />
        <path d="M10 21l2-6-3-3 3-4 4 2 3-2" />
        <path d="M6 17l3-2" />
      </svg>
    </span>
  );
}

/** Auth provider badge showing Google icon for Google sign-ins or `@` for email/password sign-ins. */
function AuthProviderIcon({ isGoogle, isBn }: { isGoogle: boolean; isBn: boolean }) {
  const label = isGoogle
    ? isBn
      ? "গুগল লগইন"
      : "Google Sign-In"
    : isBn
      ? "ইমেইল লগইন"
      : "Email Sign-In";

  if (isGoogle) {
    return (
      <span
        title={label}
        aria-label={label}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-slate-200/90 shadow-2xs shrink-0"
      >
        <svg viewBox="0 0 24 24" className="w-3 h-3" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.3 21.45 7.36 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.04.01 12s.45 3.8 1.26 5.42l4.01-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.3 2.55 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      title={label}
      aria-label={label}
      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-slate-200/90 text-slate-700 font-extrabold text-[11px] leading-none shadow-2xs shrink-0"
    >
      @
    </span>
  );
}

/** Mobile-only 2-column colorful card grid view for all managed users. */
export default function UserManagementCards({
  users,
  isBn,
  currentUserId,
  busyUserId,
  isPendingView = false,
  onApprove,
  onToggleBlock,
  onView,
  onEdit,
  onDelete,
}: UserManagementCardsProps) {
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenuUserId) return;

    function handleOutsideClick(e: MouseEvent | TouchEvent) {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setOpenMenuUserId(null);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenuUserId(null);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuUserId]);

  return (
    <div ref={gridRef} className="grid grid-cols-2 gap-2.5 sm:gap-3 md:hidden">
      {users.map((u, idx) => {
        const palette = CARD_PALETTES[idx % CARD_PALETTES.length];
        const isBlocked = u.status === "SUSPENDED";
        const statusInfo = isBlocked ? STATUS_DOT_MAP.SUSPENDED : STATUS_DOT_MAP.ACTIVE;
        const isSelf = Boolean(currentUserId && currentUserId === u.id);
        const isBusy = busyUserId === u.id;
        const isMenuOpen = openMenuUserId === u.id;
        const isPlayerQuota = u.membershipType === "PLAYER_QUOTA";
        const isGoogleLogin =
          Boolean(u.authProvider?.toUpperCase().includes("GOOGLE")) || Boolean(u.googleId);
        const formattedBlood = formatBloodGroupDisplay(u.bloodGroup);
        const bloodLabel =
          !formattedBlood || formattedBlood.trim().toUpperCase() === "UNKNOWN"
            ? "N/A"
            : formattedBlood;

        return (
          <div
            key={u.id}
            className={`relative rounded-2xl border p-2.5 pt-3.5 sm:p-3.5 sm:pt-4 shadow-sm flex flex-col justify-between gap-2.5 min-w-0 transition-shadow hover:shadow-md ${palette.card} ${isMenuOpen ? "z-20" : ""}`}
          >
            {/* Vivid Top Color Accent Strip clipped to card's inner curve without clipping dropdown */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[15px] overflow-hidden"
            >
              <span
                className={`block w-full h-1.5 bg-gradient-to-r ${palette.bar}`}
              />
            </div>

            {/* Top Corner Controls: Player Quota Icon (left) & 3-Dots Menu (right) */}
            <div className="flex items-center justify-between min-h-[24px]">
              <div>{isPlayerQuota && <PlayerQuotaBadgeIcon isBn={isBn} />}</div>

              <div className="relative">
                <button
                  type="button"
                  aria-label={isBn ? "অ্যাকশন মেনু" : "User actions"}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuUserId((prev) => (prev === u.id ? null : u.id));
                  }}
                  className="p-1.5 -mr-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="5.5" r="1.75" />
                    <circle cx="12" cy="12" r="1.75" />
                    <circle cx="12" cy="18.5" r="1.75" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-1 z-30 w-32 rounded-xl bg-white border border-slate-200 shadow-xl py-1 text-xs animate-in fade-in zoom-in-95 duration-100"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setOpenMenuUserId(null);
                        onView(u);
                      }}
                      className="w-full px-3 py-2 text-left font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      {isBn ? "দেখুন" : "View"}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setOpenMenuUserId(null);
                        onEdit(u);
                      }}
                      className="w-full px-3 py-2 text-left font-bold text-[#006a4e] hover:bg-[#006a4e]/10 cursor-pointer"
                    >
                      {isBn ? "এডিট" : "Edit"}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      disabled={isSelf || isBusy}
                      onClick={() => {
                        setOpenMenuUserId(null);
                        onToggleBlock(u);
                      }}
                      className="w-full px-3 py-2 text-left font-bold text-amber-800 hover:bg-amber-50 disabled:opacity-45 cursor-pointer"
                    >
                      {isBlocked
                        ? isBn
                          ? "আনব্লক"
                          : "Unblock"
                        : isBn
                          ? "ব্লক"
                          : "Block"}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      disabled={isSelf || isBusy}
                      onClick={() => {
                        setOpenMenuUserId(null);
                        onDelete(u);
                      }}
                      className="w-full px-3 py-2 text-left font-bold text-[#f42a41] hover:bg-[#f42a41]/10 disabled:opacity-45 cursor-pointer"
                    >
                      {isBn ? "মুছুন" : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Centered Profile Picture, Name, Verified Tick & Role */}
            <button
              type="button"
              onClick={() => {
                setOpenMenuUserId(null);
                onView(u);
              }}
              className="flex flex-col items-center text-center min-w-0 cursor-pointer -mt-2"
            >
              <div className="relative">
                <UserAvatar
                  src={u.profileImage || u.picture}
                  name={u.fullName}
                  className={`h-12 w-12 sm:h-14 sm:w-14 ring-2 ${palette.ring}`}
                />
                <span
                  title={isBn ? statusInfo.labelBn : statusInfo.labelEn}
                  aria-label={isBn ? statusInfo.labelBn : statusInfo.labelEn}
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${statusInfo.dot} ring-2 ring-white`}
                />
              </div>

              <div className="mt-2 flex items-center justify-center gap-1 min-w-0 max-w-full">
                <h4 className="font-bold text-xs sm:text-sm text-[var(--text)] truncate">
                  {u.fullName}
                </h4>
                {isAdminVerified(u.adminVerified) && (
                  <VerifiedTick isBn={isBn} className="w-3.5 h-3.5" />
                )}
              </div>

              <p
                title={u.email || undefined}
                className="mt-0.5 w-full text-[10px] sm:text-xs font-medium text-slate-600 truncate whitespace-nowrap text-center"
              >
                {u.email || "—"}
              </p>

              <div className="mt-1.5 flex items-center justify-center gap-1 flex-wrap">
                <RoleBadge role={u.role} isBn={isBn} />
                {isSelf && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-white/90 border border-slate-200 text-slate-700">
                    {isBn ? "আপনি" : "You"}
                  </span>
                )}
              </div>
            </button>

            {/* Footer Meta: Auth Provider & Blood Group */}
            <div
              className={`flex items-center justify-between gap-1.5 rounded-xl border px-2.5 py-1.5 text-[10px] sm:text-[11px] text-slate-600 min-w-0 ${palette.metaBox}`}
            >
              <AuthProviderIcon isGoogle={isGoogleLogin} isBn={isBn} />
              <span className="font-bold text-rose-700 shrink-0">
                🩸 {bloodLabel}
              </span>
            </div>

            {isPendingView && onApprove && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => onApprove(u)}
                className="w-full py-1.5 rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white text-[11px] font-bold transition-colors disabled:opacity-45 cursor-pointer shadow-2xs"
              >
                {isBn ? "✓ অনুমোদন" : "✓ Approve"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
