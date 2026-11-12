"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { requestPasswordReset, verifyPasswordResetOtp } from "@/lib/api";
import AuthBrandHeader from "./AuthBrandHeader";
import OtpInput from "./OtpInput";

const OTP_LENGTH = 6;

export default function VerifyOtpForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const isBn = locale === "bn";
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams?.get("email")?.trim() || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [hasOtpError, setHasOtpError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const discardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (discardTimerRef.current) clearTimeout(discardTimerRef.current);
    };
  }, []);

  const triggerWrongOtp = (message: string) => {
    setError(message);
    setHasOtpError(true);
    setShakeKey((k) => k + 1);
    if (discardTimerRef.current) clearTimeout(discardTimerRef.current);
    discardTimerRef.current = setTimeout(() => {
      setOtp("");
    }, 380);
  };

  const labelClass = `block text-xs font-bold text-[#12231d] mb-2 leading-relaxed ${
    isBn ? "" : "uppercase tracking-wider"
  }`;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);

    const activeEmail = (emailFromUrl || email).trim();
    const activeOtp = otp.trim();
    if (!activeEmail) {
      setError(dict.auth.emailRequiredError);
      return;
    }
    if (activeOtp.length !== OTP_LENGTH) {
      triggerWrongOtp(dict.auth.otpRequiredError);
      return;
    }

    setLoading(true);
    try {
      const result = await verifyPasswordResetOtp({
        email: activeEmail,
        otp: activeOtp,
      });
      const query = new URLSearchParams({
        email: activeEmail,
        otp: activeOtp,
        ...(result.resetToken ? { token: result.resetToken } : {}),
      });
      router.push(`/${locale}/reset-password?${query.toString()}`);
    } catch (err: unknown) {
      triggerWrongOtp(
        err instanceof Error ? err.message : dict.auth.otpRequiredError
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setInfoMsg(null);
    setHasOtpError(false);
    const activeEmail = (emailFromUrl || email).trim();
    if (!activeEmail) {
      setError(dict.auth.emailRequiredError);
      return;
    }
    setResending(true);
    try {
      const apiMsg = await requestPasswordReset(activeEmail);
      setOtp("");
      setInfoMsg(apiMsg || dict.auth.otpResentMsg);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : dict.auth.otpRequiredError);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <AuthBrandHeader
        locale={locale}
        title={dict.auth.verifyOtpTitle}
        subtitle={
          emailFromUrl
            ? `${dict.auth.verifyOtpSubtitle} (${emailFromUrl})`
            : dict.auth.verifyOtpSubtitle
        }
      />

      <div className="w-full rounded-2xl bg-white shadow-md border border-gray-100 p-5 sm:p-6">
        {error && (
          <div className="mb-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold leading-relaxed text-center">
            {error}
          </div>
        )}
        {infoMsg && (
          <div className="mb-3.5 p-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold leading-relaxed text-center">
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          {!emailFromUrl && (
            <div>
              <label className={labelClass}>{dict.auth.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.auth.emailPlaceholder}
                required
                className="w-full h-11 md:h-12 px-4 rounded-xl border border-gray-200 bg-[#f7f4ea]/40 text-[#12231d] text-sm placeholder:text-gray-400 focus:bg-white focus:border-[#00a67e] focus:ring-2 focus:ring-[#00a67e] transition-all outline-none"
              />
            </div>
          )}

          <div>
            <label className={`${labelClass} text-center`}>
              {dict.auth.otpLabel}
            </label>
            <OtpInput
              length={OTP_LENGTH}
              value={otp}
              hasError={hasOtpError}
              shakeKey={shakeKey}
              disabled={loading}
              ariaLabelPrefix={dict.auth.otpLabel}
              onChange={(next) => {
                if (discardTimerRef.current) {
                  clearTimeout(discardTimerRef.current);
                  discardTimerRef.current = null;
                }
                setOtp(next);
                if (hasOtpError) setHasOtpError(false);
                if (error) setError(null);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-11 md:h-12 w-full rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white font-semibold text-sm mt-1 px-4 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{dict.auth.verifyingOtp}</span>
              </>
            ) : (
              <span>{dict.auth.verifyOtpBtn}</span>
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-xs sm:text-sm leading-relaxed text-gray-600 space-y-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-bold text-[#006a4e] hover:text-[#004d38] hover:underline disabled:opacity-60 cursor-pointer"
          >
            {resending ? dict.auth.resendingOtp : dict.auth.resendOtpBtn}
          </button>
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
