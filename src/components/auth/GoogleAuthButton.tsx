"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AuthUser } from "@/types";
import type { Locale } from "@/i18n/config";
import {
  ensureGoogleScript,
  GOOGLE_CLIENT_ID,
  useAuth,
} from "@/context/AuthContext";

interface GoogleAuthButtonProps {
  locale: Locale;
  label: string;
  disabled?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  onSuccess: (user: AuthUser) => void;
  onError: (message: string) => void;
}

/** Official GIS ID-token ("eyJ..." credential JWT) Google sign-in button. */
export default function GoogleAuthButton({
  locale,
  label,
  disabled = false,
  onLoadingChange,
  onSuccess,
  onError,
}: GoogleAuthButtonProps) {
  const { loginWithGoogle } = useAuth();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonHostRef = useRef<HTMLDivElement>(null);

  const [gisReady, setGisReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loginWithGoogleRef = useRef(loginWithGoogle);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const lastWidthRef = useRef<number>(0);

  loginWithGoogleRef.current = loginWithGoogle;
  onLoadingChangeRef.current = onLoadingChange;
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  const isBn = locale === "bn";

  const renderGisButton = useCallback(() => {
    if (!buttonHostRef.current || !window.google?.accounts?.id) {
      return;
    }

    const containerWidth =
      wrapperRef.current?.clientWidth ||
      buttonHostRef.current.clientWidth ||
      360;
    const targetWidth = Math.max(200, Math.min(Math.floor(containerWidth), 400));

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        if (!response?.credential) {
          onErrorRef.current(
            isBn
              ? "গুগল টোকেন পাওয়া যায়নি।"
              : "Google ID token was not returned."
          );
          return;
        }

        setSubmitting(true);
        onLoadingChangeRef.current?.(true);
        try {
          const authUser = await loginWithGoogleRef.current(
            response.credential
          );
          onSuccessRef.current(authUser);
        } catch (err: unknown) {
          console.error("Google sign in error:", err);
          const msg = err instanceof Error ? err.message : null;
          onErrorRef.current(
            msg ||
              (isBn
                ? "গুগল সাইন-ইন সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
                : "Google sign-in could not be completed. Please try again.")
          );
        } finally {
          setSubmitting(false);
          onLoadingChangeRef.current?.(false);
        }
      },
    });

    lastWidthRef.current = targetWidth;
    buttonHostRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(buttonHostRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "rectangular",
      text: "continue_with",
      logo_alignment: "center",
      locale: isBn ? "bn" : "en",
      width: targetWidth,
    });

    setGisReady(true);
  }, [isBn]);

  useEffect(() => {
    let active = true;

    ensureGoogleScript()
      .then(() => {
        if (active) renderGisButton();
      })
      .catch(() => {
        if (active) setGisReady(false);
      });

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && wrapperRef.current) {
      observer = new ResizeObserver((entries) => {
        const w = entries[0]?.contentRect?.width;
        if (!w || !window.google?.accounts?.id) return;
        const nextWidth = Math.max(200, Math.min(Math.floor(w), 400));
        if (Math.abs(nextWidth - lastWidthRef.current) >= 4) {
          renderGisButton();
        }
      });
      observer.observe(wrapperRef.current);
    }

    return () => {
      active = false;
      observer?.disconnect();
    };
  }, [renderGisButton]);

  const handleFallbackClick = async () => {
    if (disabled || submitting) return;
    setSubmitting(true);
    onLoadingChangeRef.current?.(true);
    try {
      await ensureGoogleScript();
      if (!window.google?.accounts?.id) {
        throw new Error(
          isBn
            ? "গুগল সাইন-ইন স্ক্রিপ্ট লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।"
            : "Google Identity Services failed to load. Please check your internet connection."
        );
      }
      renderGisButton();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : null;
      onErrorRef.current(
        msg ||
          (isBn
            ? "গুগল সাইন-ইন চালু করা সম্ভব হয়নি।"
            : "Could not initialize Google Sign-In.")
      );
    } finally {
      setSubmitting(false);
      onLoadingChangeRef.current?.(false);
    }
  };

  const hideHostForBusyState = submitting || disabled;
  const showFallback = !gisReady || hideHostForBusyState;

  return (
    <div ref={wrapperRef} className="w-full mb-4">
      <div
        ref={buttonHostRef}
        className={
          hideHostForBusyState
            ? "hidden"
            : gisReady
              ? "w-full min-h-[44px] flex items-center justify-center overflow-hidden rounded-xl"
              : "w-full flex items-center justify-center overflow-hidden"
        }
      />

      {showFallback && (
        <button
          type="button"
          onClick={handleFallbackClick}
          disabled={disabled || submitting}
          className="w-full h-12 px-4 flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[#12231d] font-semibold text-sm leading-relaxed transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {submitting ? (
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
          <span>{label}</span>
        </button>
      )}
    </div>
  );
}
