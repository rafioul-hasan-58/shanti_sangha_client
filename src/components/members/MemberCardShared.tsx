"use client";

import { formatBloodGroupDisplay } from "@/lib/bloodGroup";
import type { ManagedUser } from "@/lib/types/dashboard";

export const MEMBER_CARD_PALETTES = [
  {
    card: "bg-gradient-to-br from-emerald-50/95 via-white to-[#eafaf2] border-emerald-200/90",
    bar: "from-[#006a4e] via-[#00a67e] to-emerald-400",
    ring: "ring-emerald-300/80",
    metaBox: "bg-emerald-100/45 border-emerald-200/70",
    softBox: "bg-emerald-50/75 border-emerald-200/70",
  },
  {
    card: "bg-gradient-to-br from-amber-50/95 via-white to-[#fff9e6] border-amber-200/90",
    bar: "from-[#f2b705] via-amber-500 to-orange-400",
    ring: "ring-amber-300/80",
    metaBox: "bg-amber-100/45 border-amber-200/70",
    softBox: "bg-amber-50/75 border-amber-200/70",
  },
  {
    card: "bg-gradient-to-br from-sky-50/95 via-white to-blue-50/80 border-sky-200/90",
    bar: "from-sky-500 via-blue-500 to-indigo-400",
    ring: "ring-sky-300/80",
    metaBox: "bg-sky-100/45 border-sky-200/70",
    softBox: "bg-sky-50/75 border-sky-200/70",
  },
  {
    card: "bg-gradient-to-br from-violet-50/90 via-white to-purple-50/80 border-violet-200/90",
    bar: "from-violet-500 via-purple-500 to-fuchsia-400",
    ring: "ring-violet-300/80",
    metaBox: "bg-violet-100/45 border-violet-200/70",
    softBox: "bg-violet-50/75 border-violet-200/70",
  },
  {
    card: "bg-gradient-to-br from-teal-50/95 via-white to-cyan-50/80 border-teal-200/90",
    bar: "from-teal-500 via-cyan-500 to-emerald-400",
    ring: "ring-teal-300/80",
    metaBox: "bg-teal-100/45 border-teal-200/70",
    softBox: "bg-teal-50/75 border-teal-200/70",
  },
  {
    card: "bg-gradient-to-br from-rose-50/90 via-white to-pink-50/80 border-rose-200/90",
    bar: "from-rose-500 via-pink-500 to-orange-400",
    ring: "ring-rose-300/80",
    metaBox: "bg-rose-100/45 border-rose-200/70",
    softBox: "bg-rose-50/75 border-rose-200/70",
  },
] as const;

export function getMemberBloodLabel(bloodGroup?: string | null): string {
  const formatted = formatBloodGroupDisplay(bloodGroup);
  if (!formatted || formatted.trim().toUpperCase() === "UNKNOWN") {
    return "N/A";
  }
  return formatted;
}

export function isMemberGoogleLogin(user: ManagedUser): boolean {
  return Boolean(
    user.authProvider?.toUpperCase().includes("GOOGLE") || user.googleId
  );
}

export function formatMemberJoinDate(
  user: ManagedUser,
  isBn: boolean
): string {
  const raw = user.joinedAt || user.createdAt;
  if (!raw) return "—";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Compact player icon badge shown when `membershipType === "PLAYER_QUOTA"`. */
export function PlayerQuotaBadgeIcon({
  isBn,
  withLabel = false,
}: {
  isBn: boolean;
  withLabel?: boolean;
}) {
  const label = isBn ? "খেলোয়াড় কোটা" : "Player Quota";

  if (withLabel) {
    return (
      <span
        title={label}
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#006a4e] to-[#004d38] text-[#f2b705] border border-[#f2b705]/60 text-[10px] font-extrabold shadow-2xs shrink-0"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3 h-3 shrink-0"
          aria-hidden="true"
        >
          <circle cx="13" cy="5" r="2" />
          <path d="M10 21l2-6-3-3 3-4 4 2 3-2" />
          <path d="M6 17l3-2" />
        </svg>
        <span className="text-white">{label}</span>
      </span>
    );
  }

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
export function MemberAuthProviderIcon({
  isGoogle,
  isBn,
}: {
  isGoogle: boolean;
  isBn: boolean;
}) {
  const label = isGoogle
    ? isBn
      ? "গুগল সংযুক্ত"
      : "Google Connected"
    : isBn
      ? "ইমেইল অ্যাকাউন্ট"
      : "Email Account";

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

