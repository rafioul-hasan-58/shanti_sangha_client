import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

// Sends "/" to "/en" (or the default locale) so every URL has a language.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;
  req.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(req.nextUrl);
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
