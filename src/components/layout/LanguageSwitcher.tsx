"use client";
/** Swaps /en/... <-> /bn/... while keeping the current page. */
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

const labels: Record<Locale, string> = { bn: "বাং", en: "EN" };

interface LanguageSwitcherProps {
  locale: Locale;
  variant?: "dark" | "light" | "toggle";
  className?: string;
}

export default function LanguageSwitcher({
  locale,
  variant = "dark",
  className = "",
}: LanguageSwitcherProps) {
  const pathname = usePathname() || `/${locale}`;
  const rest = pathname.split("/").slice(2).join("/");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search) {
      setSearch(window.location.search);
    }
  }, [pathname]);

  // 1. One-click Toggle Button (Perfect for mobile headers & compact spots)
  if (variant === "toggle") {
    const targetLocale: Locale = locale === "bn" ? "en" : "bn";
    return (
      <Link
        href={`/${targetLocale}${rest ? `/${rest}` : ""}${search}`}
        title={locale === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
        className={`px-2.5 py-1.5 rounded-2xl bg-slate-100/90 hover:bg-slate-200 text-slate-800 text-xs font-extrabold flex items-center gap-1.5 transition-colors border border-slate-200/80 cursor-pointer ${className}`}
      >
        <span className="text-[13px] leading-none">🌐</span>
        <span className="leading-none">{locale === "bn" ? "EN" : "বাং"}</span>
      </Link>
    );
  }

  // 2. Light Segmented Switcher (For light dashboard backgrounds)
  if (variant === "light") {
    return (
      <div
        className={`flex items-center rounded-2xl bg-slate-100 p-0.5 text-xs font-semibold border border-slate-200/80 ${className}`}
      >
        {locales.map((l) => (
          <Link
            key={l}
            href={`/${l}${rest ? `/${rest}` : ""}${search}`}
            aria-current={l === locale ? "true" : undefined}
            className={`rounded-xl px-2.5 py-1 transition-all ${
              l === locale
                ? "bg-[#006a4e] text-white font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {labels[l]}
          </Link>
        ))}
      </div>
    );
  }

  // 3. Dark Variant (Default for dark green navbar/footer)
  return (
    <div
      className={`flex items-center rounded-full bg-black/20 p-0.5 text-xs font-semibold border border-white/20 ${className}`}
    >
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}${search}`}
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
