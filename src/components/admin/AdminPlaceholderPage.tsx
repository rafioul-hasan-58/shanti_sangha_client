import Link from "next/link";
import FeatureCooking from "@/components/common/FeatureCooking";
import {
  ADMIN_UI_COPY,
  findNavEntryByPath,
  withLocaleHref,
} from "@/lib/config/adminNav";

interface AdminPlaceholderPageProps {
  routeHref: string;
  locale: string;
}

/**
 * Config-driven admin route renderer:
 * - Renders `<FeatureCooking />` when `status === "cooking"`
 * - Renders a clean static placeholder card when `status === "ready"`
 */
export default function AdminPlaceholderPage({
  routeHref,
  locale,
}: AdminPlaceholderPageProps) {
  const isBn = locale === "bn";
  const entry = findNavEntryByPath(routeHref);

  const labelEn = entry?.labelEn ?? routeHref;
  const labelBn = entry?.labelBn ?? routeHref;
  const status = entry?.status ?? "cooking";

  if (status === "cooking") {
    return (
      <FeatureCooking
        featureNameEn={labelEn}
        featureNameBn={labelBn}
        locale={locale}
      />
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="rounded-2xl bg-white border border-[#006a4e]/15 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006a4e]/10 text-[#006a4e] text-xs font-extrabold leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a4e]" />
              <span>
                {isBn
                  ? ADMIN_UI_COPY.staticPageBadgeBn
                  : ADMIN_UI_COPY.staticPageBadgeEn}
              </span>
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#12231d] leading-relaxed">
              {isBn ? labelBn : labelEn}
            </h1>
            <p className="text-xs font-bold text-[#006a4e]">
              {isBn ? labelEn : labelBn}
            </p>
          </div>

          <Link
            href={withLocaleHref("/admin/dashboard", locale)}
            className="px-4 py-2 rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#f2b705] leading-relaxed"
          >
            {isBn
              ? ADMIN_UI_COPY.cooking.dashboardBtnBn
              : ADMIN_UI_COPY.cooking.dashboardBtnEn}
          </Link>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          {isBn
            ? ADMIN_UI_COPY.staticPageDescBn
            : ADMIN_UI_COPY.staticPageDescEn}
        </p>
      </div>
    </div>
  );
}

