"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { requestPasswordReset } from "@/lib/api";
import AuthBrandHeader from "./AuthBrandHeader";

export default function ForgotPasswordForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const isBn = locale === "bn";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError(dict.auth.emailRequiredError);
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(trimmed);
      router.push(`/${locale}/verify-otp?email=${encodeURIComponent(trimmed)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : dict.auth.resetLinkSent);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <AuthBrandHeader
        locale={locale}
        title={dict.auth.forgotPasswordTitle}
        subtitle={dict.auth.forgotPasswordSubtitle}
      />

      <div className="w-full rounded-2xl bg-white shadow-md border border-gray-100 p-5 sm:p-6">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 md:gap-4">
          <div>
            <label
              className={`block text-xs font-bold text-[#12231d] mb-1.5 leading-relaxed ${
                isBn ? "" : "uppercase tracking-wider"
              }`}
            >
              {dict.auth.email}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#006a4e]/70">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.auth.emailPlaceholder}
                required
                className="w-full h-11 md:h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-[#f7f4ea]/40 text-[#12231d] text-sm placeholder:text-gray-400 focus:bg-white focus:border-[#00a67e] focus:ring-2 focus:ring-[#00a67e] transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-11 md:h-12 w-full rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white font-semibold text-sm mt-1 px-4 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{dict.auth.sendingResetLink}</span>
              </>
            ) : (
              <span>{dict.auth.sendResetLinkBtn}</span>
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-xs sm:text-sm leading-relaxed text-gray-600 space-y-1.5">
          <div>
            <span>{dict.auth.haveResetToken} </span>
            <Link
              href={`/${locale}/verify-otp`}
              className="font-bold text-[#006a4e] hover:text-[#004d38] hover:underline"
            >
              {dict.auth.enterTokenLink}
            </Link>
          </div>
          <div>
            <Link
              href={`/${locale}/login`}
              className="font-bold text-[#006a4e] hover:text-[#004d38] hover:underline"
            >
              {dict.auth.backToLogin}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
