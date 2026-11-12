import type { ComponentType } from "react";

export type AdminNavIconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

export function LayoutDashboardIcon({
  className = "w-5 h-5",
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

export function UsersIcon({
  className = "w-5 h-5",
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      />
    </svg>
  );
}

export function AwardIcon({
  className = "w-5 h-5",
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="8" r="6" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"
      />
    </svg>
  );
}

export function ShieldCheckIcon({
  className = "w-5 h-5",
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function UserCheckIcon({
  className = "w-5 h-5",
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
      />
      <circle cx="8.5" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 11l2 2 4-4" />
    </svg>
  );
}

export function WalletIcon({
  className = "w-5 h-5",
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <svg
      className={className}
      aria-hidden={ariaHidden}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7V4a1 1 0 00-1-1H5a2 2 0 000 4h15a1 1 0 011 1v4h-3a2 2 0 000 4h3a1 1 0 001-1v-2a1 1 0 00-1-1"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5v14a2 2 0 002 2h15a1 1 0 001-1v-4"
      />
    </svg>
  );
}

