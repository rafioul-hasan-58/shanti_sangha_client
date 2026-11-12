"use client";

interface RoleBadgeProps {
  isAdmin: boolean;
  isBn?: boolean;
  className?: string;
}

/** Renders an emerald/gold Admin tag or soft mint Member tag. */
export default function RoleBadge({
  isAdmin,
  isBn = false,
  className = "",
}: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold leading-relaxed ${
        isAdmin
          ? "bg-gradient-to-r from-[#006a4e] to-[#004d38] text-white border border-[#f2b705]/45 shadow-2xs"
          : "bg-[#EEF8F1] text-[#006a4e] border border-[#A9DCBB]"
      } ${isBn ? "" : "uppercase tracking-wider"} ${className}`}
    >
      {isAdmin ? (
        <svg
          className="w-3 h-3 text-[#f2b705] shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#00a67e] shrink-0"
          aria-hidden="true"
        />
      )}
      <span>
        {isAdmin ? (isBn ? "অ্যাডমিন" : "Admin") : isBn ? "সদস্য" : "Member"}
      </span>
    </span>
  );
}
