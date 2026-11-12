"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { confirmPasswordReset } from "@/lib/api";
import AuthBrandHeader from "./AuthBrandHeader";
import PasswordInputField from "./PasswordInputField";

export default function ResetPasswordForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const isBn = locale === "bn";
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams?.get("email")?.trim() || "";
  const otpFromUrl = searchParams?.get("otp")?.trim() || "";
  const tokenFromUrl = searchParams?.get("token")?.trim() || "";
  const hasVerification = Boolean(tokenFromUrl || (emailFromUrl && otpFromUrl));

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasVerification) {
      setError(dict.auth.resetSessionMissing);
      return;
    }
    if (newPassword.length < 6) {
      setError(dict.auth.passwordMinError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(dict.auth.passwordMismatchError);
      return;
    }

    setLoading(true);
    try {
      const apiMsg = await confirmPasswordReset({
        email: emailFromUrl,
        otp: otpFromUrl,
        token: tokenFromUrl,
        newPassword,
      });
      setSuccessMsg(apiMsg || dict.auth.passwordResetSuccess);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : dict.auth.resetSessionMissing
      );
    } finally {
      setLoading(false);
    }
  };

  const labelClass = `block text-xs font-bold text-[#12231d] leading-relaxed ${
    isBn ? "" : "uppercase tracking-wider"
  }`;

  return (
    <div className="w-full max-w-md">
      <AuthBrandHeader
        locale={locale}
        title={dict.auth.resetPasswordTitle}
        subtitle={dict.auth.resetPasswordSubtitle}
      />

      <div className="w-full rounded-2xl bg-white shadow-md border border-gray-100 p-5 sm:p-6">
        {error && (
          <div className="mb-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        {successMsg ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 text-xs sm:text-sm font-medium leading-relaxed">
              {successMsg}
            </div>
            <Link
              href={`/${locale}/login`}
              className="h-11 md:h-12 w-full rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white font-semibold text-sm flex items-center justify-center shadow-md transition-colors"
            >
              {dict.auth.goToLoginBtn}
            </Link>
          </div>
        ) : !hasVerification ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium leading-relaxed">
              {dict.auth.resetSessionMissing}
            </div>
            <Link
              href={`/${locale}/forgot-password`}
              className="h-11 md:h-12 w-full rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white font-semibold text-sm flex items-center justify-center shadow-md transition-colors"
            >
              {dict.auth.requestOtpAgainBtn}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 md:gap-4">
            <PasswordInputField
              label={dict.auth.newPassword}
              hint={dict.auth.minCharsHint}
              value={newPassword}
              onChange={setNewPassword}
              placeholder={dict.auth.newPasswordPlaceholder}
              showLabel={dict.auth.showPasswordLabel}
              hideLabel={dict.auth.hidePasswordLabel}
              labelClassName={labelClass}
            />

            <PasswordInputField
              label={dict.auth.confirmPassword}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder={dict.auth.confirmPasswordPlaceholder}
              showLabel={dict.auth.showPasswordLabel}
              hideLabel={dict.auth.hidePasswordLabel}
              labelClassName={labelClass}
            />

            <button
              type="submit"
              disabled={loading}
              className="h-11 md:h-12 w-full rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white font-semibold text-sm mt-1 px-4 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{dict.auth.resettingPassword}</span>
                </>
              ) : (
                <span>{dict.auth.resetPasswordBtn}</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-3.5 md:mt-4 text-center text-xs sm:text-sm leading-relaxed text-gray-600">
          <Link
            href={`/${locale}/login`}
            className="font-bold text-[#006a4e] hover:text-[#004d38] hover:underline"
          >
            {dict.auth.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}
