"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const router = useRouter();
  const { setRole } = useRole();
  const { loginWithGoogle, registerWithCredentials } = useAuth();
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

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push(`/${locale}/dashboard`);
    } catch (err: unknown) {
      console.error("Google sign up error:", err);
      setError(
        isBn
          ? "গুগল সাইন-আপ সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
          : "Google sign-up could not be completed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex flex-col items-center group focus:outline-none"
        >
          <div className="relative h-20 w-20 mb-3 drop-shadow-md group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Shanti Sangha"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#006a4e]">
            {isBn ? "সাভারচালা শান্তি সংঘ" : "SHAVARCHALA SHANTI SANGHA"}
          </span>
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-pitch mt-2">
          {dict.auth.registerTitle}
        </h1>
        <p className="text-xs sm:text-sm text-brand-700 mt-1">
          {dict.auth.registerSubtitle}
        </p>
      </div>

      {/* Card Form */}
      <div className="rounded-3xl bg-white border border-brand-200/90 p-6 sm:p-8 shadow-md">
        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-brand-300 bg-white hover:bg-brand-50/60 text-pitch font-semibold text-sm transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-[#006a4e] border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.3 21.45 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.04.01 12s.45 3.8 1.26 5.42l4.01-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.3 2.55 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span>{dict.auth.continueWithGoogle}</span>
        </button>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-200" />
          </div>
          <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-brand-600 font-medium">
            {dict.auth.orEmail}
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pitch mb-1.5">
              {dict.auth.fullName}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-500">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50/30 text-pitch text-sm focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pitch mb-1.5">
              {dict.auth.email}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-500">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50/30 text-pitch text-sm focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-pitch mb-1.5">
              {dict.auth.password}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-500">
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
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-200 bg-brand-50/30 text-pitch text-sm focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-500 hover:text-pitch"
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
            <p className="mt-1 text-[11px] text-brand-500">
              {isBn ? "কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড ব্যবহার করুন।" : "Use at least 6 characters."}
            </p>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-start pt-1">
            <input
              id="agree-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-brand-300 text-[#006a4e] focus:ring-[#006a4e] accent-[#006a4e]"
            />
            <label htmlFor="agree-terms" className="ml-2 text-xs text-brand-700 font-medium select-none cursor-pointer leading-tight">
              {dict.auth.agreeTerms}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#006a4e] hover:bg-[#005a42] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
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
        <div className="mt-6 pt-6 border-t border-brand-100 text-center text-xs text-brand-700">
          <span>{dict.auth.haveAccount} </span>
          <Link
            href={`/${locale}/login`}
            className="font-bold text-[#006a4e] hover:underline"
          >
            {dict.auth.loginLink}
          </Link>
        </div>
      </div>

      {/* Return to home */}
      <div className="mt-6 text-center">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-[#006a4e] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{dict.auth.backToHome}</span>
        </Link>
      </div>
    </div>
  );
}

