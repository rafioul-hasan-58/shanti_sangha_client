"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { getPostLoginRedirect } from "@/lib/authRole";
import {
  BRAND_NAME_EN,
  FULL_BRAND_NAME_UPPER_EN,
} from "@/lib/constants/site";
import GoogleAuthButton from "./GoogleAuthButton";

export default function RegisterForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const router = useRouter();
  const { setRole } = useRole();
  const { registerWithCredentials } = useAuth();
  const isBn = locale === "bn";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError(
        isBn
          ? "অনুগ্রহ করে আপনার পুরো নাম লিখুন।"
          : "Please enter your full name."
      );
      return;
    }

    if (!email.trim() || !password) {
      setError(
        isBn
          ? "অনুগ্রহ করে বৈধ ইমেইল ও পাসওয়ার্ড প্রদান করুন।"
          : "Please provide a valid email and password."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        isBn
          ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"
          : "Password must be at least 6 characters long."
      );
      return;
    }

    if (!agreeTerms) {
      setError(
        isBn
          ? "নিবন্ধন সম্পন্ন করতে আপনাকে ক্লাবের শর্তাবলীতে সম্মতি জানাতে হবে।"
          : "You must agree to club terms to complete registration."
      );
      return;
    }

    setLoading(true);
    try {
      await registerWithCredentials(fullName, email, password);
      router.push(`/${locale}/dashboard`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : null;
      setError(
        msg || (isBn ? "নিবন্ধন ব্যর্থ হয়েছে।" : "Registration failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-3 md:mb-5">
        <Link
          href={`/${locale}`}
          className="inline-flex flex-col items-center group focus:outline-none"
        >
          <div className="relative h-12 w-12 md:h-20 md:w-20 drop-shadow-md group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt={BRAND_NAME_EN}
              fill
              className="object-contain"
              priority
            />
          </div>
          <span
            className={`mt-1 md:mt-2 text-[11px] md:text-xs font-bold text-[#006a4e] text-center leading-snug md:leading-relaxed ${
              isBn ? "" : "uppercase tracking-widest"
            }`}
          >
            {isBn ? "সাভারচালা শান্তি সংঘ" : FULL_BRAND_NAME_UPPER_EN}
          </span>
        </Link>
        <h1 className="font-display text-lg md:text-2xl font-bold text-[#12231d] mt-1.5 md:mt-3 leading-snug md:leading-relaxed">
          {dict.auth.registerTitle}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 md:mt-1 leading-snug md:leading-relaxed">
          {dict.auth.registerSubtitle}
        </p>
      </div>

      {/* Card Form */}
      <div className="w-full rounded-2xl bg-white shadow-md border border-gray-100 p-4 sm:p-6">
        {/* Google Sign Up Button (returns GIS eyJ... ID Token) */}
        <GoogleAuthButton
          locale={locale}
          label={dict.auth.continueWithGoogle}
          disabled={loading}
          onLoadingChange={(isLoading) => {
            if (isLoading) setError(null);
            setGoogleLoading(isLoading);
          }}
          onSuccess={(loggedInUser) =>
            router.push(getPostLoginRedirect(loggedInUser.role, locale))
          }
          onError={(msg) => setError(msg)}
        />

        {/* Divider */}
        <div className="flex items-center gap-3 my-2.5 md:my-4">
          <div className="flex-1 min-w-4 border-t border-gray-200" />
          <span
            className={`text-xs text-gray-500 font-medium leading-relaxed text-center ${
              isBn ? "" : "uppercase tracking-wider"
            }`}
          >
            {dict.auth.orEmail}
          </span>
          <div className="flex-1 min-w-4 border-t border-gray-200" />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 leading-relaxed">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form: Full Name, Email, Password */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
          {/* Full Name field */}
          <div>
            <label
              className={`block text-xs font-bold text-[#12231d] mb-1 md:mb-1.5 leading-relaxed ${
                isBn ? "" : "uppercase tracking-wider"
              }`}
            >
              {dict.auth.fullName}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#006a4e]/70">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={dict.auth.fullNamePlaceholder}
                required
                className="w-full h-10 md:h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-[#f7f4ea]/40 text-[#12231d] text-sm placeholder:text-gray-400 focus:bg-white focus:border-[#00a67e] focus:ring-2 focus:ring-[#00a67e] transition-all outline-none"
              />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label
              className={`block text-xs font-bold text-[#12231d] mb-1 md:mb-1.5 leading-relaxed ${
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
                className="w-full h-10 md:h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-[#f7f4ea]/40 text-[#12231d] text-sm placeholder:text-gray-400 focus:bg-white focus:border-[#00a67e] focus:ring-2 focus:ring-[#00a67e] transition-all outline-none"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1 md:mb-1.5">
              <label
                className={`block text-xs font-bold text-[#12231d] leading-relaxed ${
                  isBn ? "" : "uppercase tracking-wider"
                }`}
              >
                {dict.auth.password}
              </label>
              <span className="text-xs text-gray-500 font-medium leading-relaxed">
                {isBn ? "কমপক্ষে ৬ অক্ষর" : "Min 6 chars"}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#006a4e]/70">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={dict.auth.passwordPlaceholder}
                required
                minLength={6}
                className="w-full h-10 md:h-12 pl-11 pr-11 rounded-xl border border-gray-200 bg-[#f7f4ea]/40 text-[#12231d] text-sm placeholder:text-gray-400 focus:bg-white focus:border-[#00a67e] focus:ring-2 focus:ring-[#00a67e] transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3.5 flex items-center text-gray-500 hover:text-[#12231d] cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-center gap-2.5 mt-0.5 md:mt-1">
            <input
              id="agree-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 shrink-0 rounded border-gray-300 text-[#006a4e] focus:ring-[#00a67e] accent-[#006a4e] cursor-pointer"
            />
            <label
              htmlFor="agree-terms"
              className="text-xs sm:text-sm text-gray-700 font-medium select-none cursor-pointer leading-snug sm:leading-relaxed"
            >
              {dict.auth.agreeTerms}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="h-11 md:h-12 w-full rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white font-semibold text-sm leading-relaxed mt-1 md:mt-2 px-4 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isBn ? "নিবন্ধন সম্পন্ন হচ্ছে..." : "Creating account..."}</span>
              </>
            ) : (
              <span>{dict.auth.signUpBtn}</span>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="mt-3 md:mt-4 text-center text-xs sm:text-sm leading-relaxed text-gray-600">
          <span>{dict.auth.haveAccount} </span>
          <Link
            href={`/${locale}/login`}
            className="font-bold text-[#006a4e] hover:text-[#004d38] hover:underline"
          >
            {dict.auth.loginLink}
          </Link>
        </div>
      </div>
    </div>
  );
}

