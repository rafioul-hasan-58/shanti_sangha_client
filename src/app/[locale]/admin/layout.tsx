import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import MobileBottomNav from "@/components/admin/MobileBottomNav";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { isLocale, type Locale } from "@/i18n/config";
import {
  ADMIN_NAV_ITEMS,
  ADMIN_UI_COPY,
  MOBILE_BOTTOM_TAB_IDS,
  withLocaleHref,
} from "@/lib/config/adminNav";

export default async function AdminLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const isBn = locale === "bn";
  const extraMobileItems = ADMIN_NAV_ITEMS.filter(
    (item) =>
      !MOBILE_BOTTOM_TAB_IDS.includes(
        item.id as (typeof MOBILE_BOTTOM_TAB_IDS)[number]
      ) && Boolean(item.href)
  );

  return (
    <div className="min-h-screen bg-[#f7f4ea] flex flex-col md:flex-row text-[#12231d] overflow-x-hidden">
      {/* Desktop Collapsible Left Sidebar */}
      <AdminSidebar locale={locale} />

      {/* Main Content Wrapper (pb-20 keeps content clear of fixed mobile bottom bar) */}
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-6">
        {/* Compact Mobile Top Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#006a4e]/15 px-3 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <Link
            href={withLocaleHref("/admin/dashboard", locale)}
            className="flex items-center gap-2 min-w-0 focus-visible:ring-2 focus-visible:ring-[#f2b705] rounded-xl"
          >
            <div className="relative h-8 w-8 shrink-0 rounded-xl bg-[#006a4e] p-1 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt={ADMIN_UI_COPY.brandEn}
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-[#12231d] truncate leading-tight">
                {isBn ? ADMIN_UI_COPY.brandBn : ADMIN_UI_COPY.brandEn}
              </p>
              <p className="text-[10px] font-bold text-[#006a4e] leading-tight">
                {isBn ? ADMIN_UI_COPY.portalBn : ADMIN_UI_COPY.portalEn}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 shrink-0">
            {extraMobileItems.map((extra) => (
              <Link
                key={extra.id}
                href={withLocaleHref(extra.href!, locale)}
                className="px-2 py-1 rounded-lg bg-[#f7f4ea] border border-[#006a4e]/15 text-[11px] font-bold text-[#006a4e] hover:bg-[#006a4e]/10 focus-visible:ring-2 focus-visible:ring-[#f2b705]"
              >
                {isBn ? extra.labelBn : extra.labelEn}
              </Link>
            ))}
            <LanguageSwitcher locale={locale as Locale} variant="toggle" />
          </div>
        </header>

        <div className="flex-1 min-w-0">{children}</div>
      </div>

      {/* Mobile Fixed Bottom Navigation + One-Tap Slide-Up Sheet */}
      <MobileBottomNav locale={locale} />
    </div>
  );
}

