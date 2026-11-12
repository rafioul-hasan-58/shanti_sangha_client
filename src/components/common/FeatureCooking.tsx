"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ADMIN_UI_COPY, withLocaleHref } from "@/lib/config/adminNav";

interface FeatureCookingProps {
  featureNameEn: string;
  featureNameBn: string;
  locale?: string;
  onDashboardClick?: () => void;
}

/**
 * Animated placeholder for admin routes marked `status: "cooking"`.
 * Pure SVG + GPU-friendly CSS keyframes (`transform` & `opacity`), respects `prefers-reduced-motion`.
 */
export default function FeatureCooking({
  featureNameEn,
  featureNameBn,
  locale: localeProp,
  onDashboardClick,
}: FeatureCookingProps) {
  const params = useParams<{ locale?: string }>();
  const router = useRouter();
  const locale = localeProp || params?.locale || "bn";
  const isBn = locale === "bn";
  const copy = ADMIN_UI_COPY.cooking;

  const featurePill = isBn
    ? `${featureNameBn} / ${featureNameEn}`
    : `${featureNameEn} / ${featureNameBn}`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-2 sm:p-6">
      <div
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(247, 244, 234, 0.95) 0%, rgba(0, 166, 126, 0.05) 42%, #ffffff 78%)",
        }}
        className="w-full max-w-xl rounded-2xl bg-white border border-[#006a4e]/15 shadow-lg shadow-[#006a4e]/5 px-5 py-8 sm:p-10 text-center space-y-6"
      >
        {/* Pure SVG Animated Cooking Pot Scene */}
        <div className="mx-auto w-48 h-44 sm:w-56 sm:h-48 flex items-center justify-center">
          <svg
            viewBox="0 0 200 175"
            className="w-full h-full overflow-visible"
            role="img"
            aria-label={featureNameEn}
          >
            {/* Wavy Steam Lines */}
            <g fill="none" stroke="#00a67e" strokeWidth="2.6" strokeLinecap="round">
              <path
                className="cook-steam-1"
                d="M74 52 C68 42, 80 34, 73 22"
                opacity="0.7"
              />
              <path
                className="cook-steam-2"
                d="M100 46 C94 34, 108 26, 100 12"
                opacity="0.8"
              />
              <path
                className="cook-steam-3"
                d="M126 52 C120 42, 132 34, 125 22"
                opacity="0.65"
              />
            </g>

            {/* Wooden Spoon Stirring */}
            <g className="cook-spoon">
              <rect
                x="126"
                y="40"
                width="7"
                height="48"
                rx="3.5"
                transform="rotate(24 129 64)"
                fill="#c68b59"
                stroke="#8b5a2b"
                strokeWidth="1.5"
              />
            </g>

            {/* Floating Ingredients (onion ring, tomato, herb) */}
            <g className="cook-item-1">
              <circle cx="80" cy="68" r="5" fill="#f42a41" stroke="#fff" strokeWidth="1.2" />
            </g>
            <g className="cook-item-2">
              <circle cx="104" cy="63" r="4.5" fill="#f7f4ea" stroke="#c084fc" strokeWidth="2" />
            </g>
            <g className="cook-item-3">
              <ellipse cx="121" cy="70" rx="5.5" ry="3.2" fill="#00a67e" stroke="#004d38" strokeWidth="1" />
            </g>

            {/* Popping Bubbles at Rim */}
            <circle className="cook-bubble-1" cx="76" cy="84" r="3.2" fill="#f2b705" opacity="0.85" />
            <circle className="cook-bubble-2" cx="100" cy="82" r="4" fill="#00a67e" opacity="0.85" />
            <circle className="cook-bubble-3" cx="122" cy="84" r="3" fill="#f2b705" opacity="0.8" />

            {/* Rattling Pot Lid */}
            <g className="cook-lid">
              {/* Gold Lid Knob */}
              <circle cx="100" cy="66" r="5" fill="#f2b705" stroke="#004d38" strokeWidth="1.5" />
              {/* Dome */}
              <path
                d="M54 80 C56 68, 144 68, 146 80 Z"
                fill="#006a4e"
                stroke="#004d38"
                strokeWidth="2"
              />
              {/* Gold Trim on Lid */}
              <rect x="52" y="78.5" width="96" height="3.5" rx="1.75" fill="#f2b705" />
            </g>

            {/* Pot Left & Right Dark Green Handles */}
            <path
              d="M52 94 H41 C37 94, 37 104, 41 104 H52"
              fill="none"
              stroke="#004d38"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M148 94 H159 C163 94, 163 104, 159 104 H148"
              fill="none"
              stroke="#004d38"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Pot Main Body */}
            <path
              d="M52 86 H148 V122 C148 134, 138 140, 126 140 H74 C62 140, 52 134, 52 122 Z"
              fill="#006a4e"
              stroke="#004d38"
              strokeWidth="2"
            />
            {/* Subtle highlight stripe */}
            <path
              d="M64 96 V122 C64 127, 67 130, 72 131"
              fill="none"
              stroke="#00a67e"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.45"
            />
            {/* Gold Top Rim */}
            <rect x="49" y="84" width="102" height="5" rx="2.5" fill="#f2b705" />

            {/* Flickering Stove Flames (3 shapes) */}
            <path
              className="cook-flame-1"
              d="M86 158 C81 153, 82 146, 86 142 C90 146, 91 153, 86 158 Z"
              fill="#f42a41"
            />
            <path
              className="cook-flame-2"
              d="M100 159 C94 152, 95 144, 100 139 C105 144, 106 152, 100 159 Z"
              fill="#f2b705"
            />
            <path
              className="cook-flame-3"
              d="M114 158 C109 153, 110 146, 114 142 C118 146, 119 153, 114 158 Z"
              fill="#fb923c"
            />

            {/* Stove Stand */}
            <rect x="64" y="157" width="72" height="6" rx="3" fill="#12231d" />
            <rect x="74" y="163" width="8" height="6" rx="2" fill="#004d38" />
            <rect x="118" y="163" width="8" height="6" rx="2" fill="#004d38" />
          </svg>
        </div>

        {/* Gold Feature Name Pill */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f2b705]/20 border border-[#f2b705]/60 text-[#12231d] text-xs font-extrabold tracking-wide leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006a4e]" />
            <span>{featurePill}</span>
          </span>
        </div>

        {/* Bilingual Headline & Subtitle (Bangla primary, English below, locale-aware) */}
        <div className="space-y-2.5">
          <h1 className="text-xl sm:text-2xl font-black text-[#12231d] leading-relaxed">
            {isBn ? copy.titleBn : `${copy.titleBn}`}
          </h1>
          <p className="text-sm sm:text-base font-bold text-[#006a4e]">
            {copy.titleEn}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
            {copy.subtitleBn}
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {copy.subtitleEn}
          </p>
        </div>

        {/* Indeterminate Cooking Progress Bar */}
        <div className="max-w-xs mx-auto space-y-2 pt-1">
          <div className="h-2 w-full rounded-full bg-[#f7f4ea] border border-[#006a4e]/15 overflow-hidden">
            <div className="cook-progress-bar h-full w-2/5 rounded-full bg-gradient-to-r from-[#006a4e] via-[#00a67e] to-[#f2b705]" />
          </div>
          <p className="text-xs font-bold text-[#006a4e] leading-relaxed inline-flex items-center gap-1">
            <span>{isBn ? copy.progressBn : copy.progressEn}</span>
            <span className="cook-dot-1">•</span>
            <span className="cook-dot-2">•</span>
            <span className="cook-dot-3">•</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onDashboardClick ? (
            <button
              type="button"
              onClick={onDashboardClick}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white text-xs sm:text-sm font-extrabold shadow-sm shadow-[#006a4e]/20 transition-colors focus-visible:ring-2 focus-visible:ring-[#f2b705] cursor-pointer leading-relaxed"
            >
              {isBn ? copy.dashboardBtnBn : copy.dashboardBtnEn}
            </button>
          ) : (
            <Link
              href={withLocaleHref("/admin/dashboard", locale)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white text-xs sm:text-sm font-extrabold shadow-sm shadow-[#006a4e]/20 transition-colors focus-visible:ring-2 focus-visible:ring-[#f2b705] leading-relaxed"
            >
              {isBn ? copy.dashboardBtnBn : copy.dashboardBtnEn}
            </Link>
          )}

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#f7f4ea] hover:bg-[#006a4e]/10 border border-[#006a4e]/20 text-[#12231d] text-xs sm:text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#f2b705] cursor-pointer leading-relaxed"
          >
            {isBn ? copy.goBackBtnBn : copy.goBackBtnEn}
          </button>
        </div>
      </div>
    </div>
  );
}

