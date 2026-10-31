"use client";
/** Swaps /en/... <-> /bn/... while keeping the current page. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

const labels: Record<Locale, string> = { en: "EN", bn: "বাং" };

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex rounded-full bg-brand-800 p-0.5 text-sm">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-full px-3 py-1 ${l === locale ? "bg-lime text-pitch font-semibold" : "text-brand-100"}`}
        >
          {labels[l]}
        </Link>
      ))}
    </div>
  );
}
