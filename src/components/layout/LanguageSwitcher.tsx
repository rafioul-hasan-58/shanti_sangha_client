"use client";
/** Swaps /en/... <-> /bn/... while keeping the current page. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

const labels: Record<Locale, string> = { bn: "বাং", en: "EN" };

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center rounded-full bg-black/20 p-0.5 text-xs font-semibold border border-white/20">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            l === locale
              ? "bg-white text-[#006a4e] font-bold shadow-xs"
              : "text-white/80 hover:text-white"
          }`}
        >
          {labels[l]}
        </Link>
      ))}
    </div>
  );
}
