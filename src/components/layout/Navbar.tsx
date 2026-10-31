import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}#sports`, label: dict.nav.sports },
    { href: `/${locale}/dashboard`, label: dict.nav.dashboard },
    { href: `/${locale}/admin`, label: dict.nav.admin },
  ];

  return (
    <header className="bg-pitch text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href={`/${locale}`} className="font-display text-xl font-bold">
          {dict.brand}
        </Link>
        <nav className="flex flex-wrap items-center gap-5 text-sm text-brand-100">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-lime">
              {l.label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
