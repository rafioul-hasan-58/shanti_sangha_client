"use client";

interface VerifiedTickProps {
  isBn?: boolean;
  className?: string;
}

/**
 * Facebook-style scalloped blue verified checkmark badge shown beside admin-verified user names.
 */
export default function VerifiedTick({
  isBn = false,
  className = "w-4 h-4",
}: VerifiedTickProps) {
  const label = isBn ? "অ্যাডমিন যাচাইকৃত" : "Admin Verified";

  return (
    <span
      title={label}
      aria-label={label}
      className="inline-flex items-center justify-center shrink-0"
    >
      <svg
        viewBox="0 0 26 26"
        fill="none"
        className={className}
        role="img"
        aria-hidden="true"
      >
        <path
          d="M21.04 9.67 Q26 13 21.04 16.33 Q22.19 22.19 16.33 21.04 Q13 26 9.67 21.04 Q3.81 22.19 4.96 16.33 Q0 13 4.96 9.67 Q3.81 3.81 9.67 4.96 Q13 0 16.33 4.96 Q22.19 3.81 21.04 9.67 Z"
          fill="#1877F2"
        />
        <path
          d="M9.1 13.3l2.65 2.65 5.25-5.75"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
