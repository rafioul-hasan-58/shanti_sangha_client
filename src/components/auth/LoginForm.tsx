"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { useAuth } from "@/context/AuthContext";
import { getPostLoginRedirect } from "@/lib/authRole";

export default function LoginForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const router = useRouter();
  const { loginWithGoogle, loginWithCredentials } = useAuth();
  const isBn = locale === "bn";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(
        isBn
          ? "অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন।"
          : "Please enter your email and password."
      );
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await loginWithCredentials(email, password);
      router.push(getPostLoginRedirect(loggedInUser.role, locale));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : null;
      setError(
        msg || (isBn ? "লগইন ব্যর্থ হয়েছে।" : "Login failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const loggedInUser = await loginWithGoogle();
      router.push(getPostLoginRedirect(loggedInUser.role, locale));
    } catch (err: unknown) {
      console.error("Google sign in error:", err);
      setError(
        isBn
          ? "গুগল সাইন-ইন সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
          : "Google sign-in could not be completed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-5">
        <Link
          href={`/${locale}`}
          className="inline-flex flex-col items-center group focus:outline-none"
        >
          <div className="relative h-16 w-16 md:h-20 md:w-20 drop-shadow-md group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Shanti Sangha"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span
            className={`mt-2 text-xs font-bold text-[#006a4e] text-center leading-relaxed ${
              isBn ? "" : "uppercase tracking-widest"
            }`}
          >
            {isBn ? "সাভারচালা শান্তি সংঘ" : "SHAVARCHALA SHANTI SANGHA"}
          </span>
        </Link>
        <h1 className="font-display text-xl md:text-2xl font-bold text-[#12231d] mt-3 leading-relaxed">
          {dict.auth.loginTitle}
        </h1>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          {dict.auth.loginSubtitle}
        </p>
      </div>

      {/* Card Form */}
      <div className="w-full rounded-2xl bg-white shadow-md border border-gray-100 p-5 sm:p-6">
        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full h-12 px-4 mb-4 flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#12231d] font-semibold text-sm leading-relaxed transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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
        <div className="flex items-center gap-3 my-4">
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

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email field */}
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
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-[#f7f4ea]/40 text-[#12231d] text-sm placeholder:text-gray-400 focus:bg-white focus:border-[#00a67e] focus:ring-2 focus:ring-[#00a67e] transition-all outline-none"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                className={`block text-xs font-bold text-[#12231d] leading-relaxed ${
                  isBn ? "" : "uppercase tracking-wider"
                }`}
              >
                {dict.auth.password}
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    isBn
                      ? "পাসওয়ার্ড রিসেট লিঙ্ক আপনার নিবন্ধিত ইমেইলে পাঠানো হবে।"
                      : "Password reset link will be sent to your registered email."
                  );
                }}
                className="text-xs text-[#006a4e] hover:text-[#004d38] font-semibold hover:underline leading-relaxed"
              >
                {dict.auth.forgotPassword}
              </a>
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
                className="w-full h-12 pl-11 pr-11 rounded-xl border border-gray-200 bg-[#f7f4ea]/40 text-[#12231d] text-sm placeholder:text-gray-400 focus:bg-white focus:border-[#00a67e] focus:ring-2 focus:ring-[#00a67e] transition-all outline-none"
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

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2.5 mt-1">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 shrink-0 rounded border-gray-300 text-[#006a4e] focus:ring-[#00a67e] accent-[#006a4e] cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="text-sm text-gray-700 font-medium select-none cursor-pointer leading-relaxed"
            >
              {dict.auth.rememberMe}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="h-12 w-full rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white font-semibold text-sm leading-relaxed mt-2 px-4 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isBn ? "প্রবেশ করা হচ্ছে..." : "Signing in..."}</span>
              </>
            ) : (
              <span>{dict.auth.signInBtn}</span>
            )}
          </button>
        </form>

        {/* Link to Register */}
        <div className="mt-4 text-center text-sm leading-relaxed text-gray-600">
          <span>{dict.auth.noAccount} </span>
          <Link
            href={`/${locale}/register`}
            className="font-bold text-[#006a4e] hover:text-[#004d38] hover:underline"
          >
            {dict.auth.registerLink}
          </Link>
        </div>
      </div>

      {/* Return to home */}
      <div className="mt-4 md:mt-5 text-center">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-[#006a4e] transition-colors leading-relaxed"
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

