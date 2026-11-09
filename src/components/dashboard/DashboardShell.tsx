"use client";

import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/getDictionary";
import RoleSwitcher from "./RoleSwitcher";
import { useAuth } from "@/context/AuthContext";

/** Shared frame for the member and admin dashboards. */
export default function DashboardShell({
  title,
  stats,
  dict,
  locale = "bn",
}: {
  title: string;
  stats: string[];
  dict: Dictionary;
  locale?: string;
}) {
  const { user, logout } = useAuth();
  const isBn = locale === "bn";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Authenticated User Profile Banner */}
      {user && (
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#006a4e]/10 via-[#006a4e]/5 to-transparent border border-[#006a4e]/20 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            {user.picture ? (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#006a4e] shadow-md shrink-0">
                <Image
                  src={user.picture}
                  alt={user.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#006a4e] text-white font-extrabold flex items-center justify-center text-2xl shadow-md shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-pitch">
                  {user.name}
                </h2>
                {user.provider === "google" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#1877F2]/20 px-3 py-0.5 text-xs font-bold text-slate-700 shadow-2xs">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Google Connected</span>
                  </span>
                ) : (
                  <span className="inline-block rounded-full bg-[#006a4e]/10 text-[#006a4e] px-2.5 py-0.5 text-xs font-bold">
                    {isBn ? "ক্লাব মেম্বার" : "Club Member"}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-brand-700 font-medium mt-1">
                {user.email}
              </p>
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{isBn ? "লগআউট করুন" : "Sign Out"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        <RoleSwitcher dict={dict.role} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((label) => (
          <div key={label} className="rounded-2xl border border-brand-200 bg-white p-5 shadow-xs">
            <p className="text-sm font-semibold text-brand-700">{label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-800">0</p>
          </div>
        ))}
      </div>
    </main>
  );
}
