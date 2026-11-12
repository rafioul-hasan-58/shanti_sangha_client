import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { BRAND_NAME_EN, FULL_BRAND_NAME_UPPER_EN } from "@/lib/constants/site";

interface AuthBrandHeaderProps {
  locale: Locale;
  title: string;
  subtitle: string;
}

/** Shared brand crest, title, and subtitle header for auth pages. */
export default function AuthBrandHeader({
  locale,
  title,
  subtitle,
}: AuthBrandHeaderProps) {
  const isBn = locale === "bn";

  return (
    <div className="text-center mb-4 md:mb-5">
      <Link
        href={`/${locale}`}
        className="inline-flex flex-col items-center group focus:outline-none"
      >
        <div className="relative h-14 w-14 md:h-20 md:w-20 drop-shadow-md group-hover:scale-105 transition-transform">
          <Image
            src="/logo.png"
            alt={BRAND_NAME_EN}
            fill
            className="object-contain"
            priority
          />
        </div>
        <span
          className={`mt-1.5 md:mt-2 text-xs font-bold text-[#006a4e] text-center leading-relaxed ${
            isBn ? "" : "uppercase tracking-widest"
          }`}
        >
          {isBn ? "সাভারচালা শান্তি সংঘ" : FULL_BRAND_NAME_UPPER_EN}
        </span>
      </Link>
      <h1 className="font-display text-xl md:text-2xl font-bold text-[#12231d] mt-2 md:mt-3 leading-snug md:leading-relaxed">
        {title}
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

