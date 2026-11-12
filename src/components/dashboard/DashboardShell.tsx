"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Dictionary } from "@/i18n/getDictionary";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import FeatureCooking from "@/components/common/FeatureCooking";
import VerifiedTick from "@/components/common/VerifiedTick";
import DashboardSidebar from "./DashboardSidebar";
import AdminOverviewView from "./AdminOverviewView";
import AdminUsersView from "./AdminUsersView";
import MembersDirectory from "@/components/members/MembersDirectory";
import type { BloodGroup } from "@/types";
import { BLOOD_GROUP_OPTIONS, formatBloodGroupDisplay } from "@/lib/bloodGroup";
import {
  getRoleDisplayMeta,
  hasDashboardAccess,
  isAdminVerified,
  normalizeRole,
} from "@/lib/authRole";
import { BRAND_NAME_EN } from "@/lib/constants/site";

interface Props {
  title?: string;
  stats?: string[];
  dict: Dictionary;
  locale?: string;
  embeddedInAdminLayout?: boolean;
}

type TabType =
  | "overview"
  | "profile"
  | "sports"
  | "members"
  | "notices"
  | "leadership_pioneers"
  | "leadership_committee"
  | "leadership_admins"
  | "admin_users"
  | "admin_users_all"
  | "admin_users_pending"
  | "admin_members"
  | "admin_live"
  | "admin_finance"
  | "admin_expenses";

/** Pixel-perfect IoIosArrowForward icon matching react-icons/io */
function IoIosArrowForward({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M186.3 110.5c-6.2 6.2-6.2 16.4 0 22.6l122.9 122.9-122.9 122.9c-6.2 6.2-6.2 16.4 0 22.6 6.2 6.2 16.4 6.2 22.6 0l134.2-134.2c6.2-6.2 6.2-16.4 0-22.6L208.9 110.5c-6.2-6.2-16.4-6.2-22.6 0z" />
    </svg>
  );
}

/** Pixel-perfect IoIosArrowBack icon matching react-icons/io */
function IoIosArrowBack({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M325.7 110.5c6.2 6.2 6.2 16.4 0 22.6L202.8 256l122.9 122.9c6.2 6.2 6.2 16.4 0 22.6-6.2 6.2-16.4 6.2-22.6 0L168.9 267.3c-6.2-6.2-6.2-16.4 0-22.6l134.2-134.2c6.2-6.2 16.4-6.2 22.6 0z" />
    </svg>
  );
}

export default function DashboardShell({
  dict,
  locale = "bn",
  embeddedInAdminLayout = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, updateProfile } = useAuth();
  const { role, setRole } = useRole();
  const isBn = locale === "bn";

  // Role & dashboard access logic:
  // USER sees member view; MODERATOR, ADMIN, and SUPER_ADMIN get management/dashboard access.
  const isAdminRoute = pathname?.includes("/admin");
  const resolvedRole = user
    ? normalizeRole(user.role)
    : isAdminRoute || role === "admin"
      ? "ADMIN"
      : "USER";
  const roleMeta = getRoleDisplayMeta(resolvedRole);
  const isAdmin = hasDashboardAccess(resolvedRole);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") as TabType | null;
      if (
        tab &&
        [
          "overview",
          "profile",
          "sports",
          "members",
          "notices",
          "leadership_pioneers",
          "leadership_committee",
          "leadership_admins",
          "admin_users",
          "admin_users_all",
          "admin_users_pending",
          "admin_members",
          "admin_live",
          "admin_finance",
          "admin_expenses",
        ].includes(tab)
      ) {
        return tab;
      }
      try {
        const stored = localStorage.getItem("auth_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.role && hasDashboardAccess(parsed.role)) {
            return "overview";
          }
        }
      } catch {
        // fallback
      }
    }
    return "members";
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const buildProfileForm = (u: typeof user) => ({
    name: u?.name || "",
    fatherName: u?.fatherName || "",
    motherName: u?.motherName || "",
    bloodGroup: u?.bloodGroup || "UNKNOWN",
    bio: u?.bio || "",
    summary: u?.summary || "",
    profession: u?.profession || "",
    village: u?.village || "সাভারচালা",
    currentLocation: u?.currentLocation || "সাভারচালা, সখিপুর, টাঙ্গাইল",
    whatsappNumber: u?.whatsappNumber || "",
    facebookProfile: u?.facebookProfile || "",
  });

  // Profile form state matching Prisma User model fields
  const [profileForm, setProfileForm] = useState(() => buildProfileForm(user));
  const [savedProfileForm, setSavedProfileForm] = useState(() => buildProfileForm(user));

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileSectionTab, setProfileSectionTab] = useState<
    "personal" | "profession" | "location"
  >("personal");

  const isProfileDirty = (
    Object.keys(profileForm) as Array<keyof typeof profileForm>
  ).some((key) => profileForm[key] !== savedProfileForm[key]);

  // Sync profile form & saved baseline when user updates or loads from storage
  useEffect(() => {
    if (user) {
      const next = buildProfileForm(user);
      setProfileForm(next);
      setSavedProfileForm(next);
    }
  }, [user]);

  // Support direct query param navigation e.g. /dashboard?tab=profile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (
        tab &&
        [
          "overview",
          "profile",
          "sports",
          "members",
          "notices",
          "leadership_pioneers",
          "leadership_committee",
          "leadership_admins",
          "admin_users",
          "admin_users_all",
          "admin_users_pending",
          "admin_members",
          "admin_live",
          "admin_finance",
          "admin_expenses",
        ].includes(tab)
      ) {
        if (tab === "overview" && !isAdmin) {
          setActiveTab("members");
        } else {
          setActiveTab(tab as TabType);
        }
      }
    }
  }, [isAdmin]);

  // Guard: Ensure non-admin users never stay on "overview" tab
  useEffect(() => {
    if (!isAdmin && activeTab === "overview") {
      setActiveTab("members");
    }
  }, [isAdmin, activeTab]);

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingProfile(true);
    setProfileSaveSuccess(false);

    try {
      await updateProfile({
        name: profileForm.name,
        fatherName: profileForm.fatherName || null,
        motherName: profileForm.motherName || null,
        bloodGroup: profileForm.bloodGroup,
        bio: profileForm.bio || null,
        summary: profileForm.summary || null,
        profession: profileForm.profession || null,
        village: profileForm.village || null,
        currentLocation: profileForm.currentLocation || null,
        whatsappNumber: profileForm.whatsappNumber || null,
        facebookProfile: profileForm.facebookProfile || null,
      });

      setSavedProfileForm(profileForm);
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Profile save error:", err);
      alert(isBn ? "প্রোফাইল সংরক্ষণ ব্যর্থ হয়েছে" : "Failed to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  

  const displayName = profileForm.name || user?.name || (isBn ? "রাফিউল হাসান" : "Rafioul Hasan");
  const displayEmail = user?.email || "rafioulhasan2@gmail.com";

  const isGoogleConnected =
    user?.provider === "google" ||
    Boolean(user?.authProvider?.toUpperCase().includes("GOOGLE")) ||
    Boolean(user?.googleId);

  // Mock pending members for Admin
  const [pendingMembers, setPendingMembers] = useState([
    { id: "1", name: "তানভীর আহমেদ", email: "tanvir.ahmed@example.com", phone: "+880 1712-345678", date: "Nov 9, 2026", status: "pending" },
    { id: "2", name: "মাহমুদুল হাসান", email: "mahmud.h@example.com", phone: "+880 1823-456789", date: "Nov 8, 2026", status: "pending" },
    { id: "3", name: "শাকিল হোসেন", email: "shakil.h@example.com", phone: "+880 1934-567890", date: "Nov 7, 2026", status: "pending" },
  ]);

  const handleApprove = (id: string) => {
    setPendingMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f7f4ea] flex flex-col md:flex-row font-sans text-slate-800">
      {/* MODULAR DASHBOARD SIDEBAR (Skipped when rendered inside AdminLayout) */}
      {!embeddedInAdminLayout && (
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          locale={locale}
          user={user}
          isAdmin={Boolean(isAdmin)}
          displayName={displayName}
          pendingCount={pendingMembers.length}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          onLogout={logout}
        />
      )}

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ======================================================== */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Top Header (Skipped when rendered inside AdminLayout) */}
        {!embeddedInAdminLayout && (
          <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between gap-4 shadow-2xs">
            {/* Left: Brand Logo + Club Name + Subtitle (Current Theme Green) */}
            <Link href={`/${locale}`} className="flex items-center gap-2.5 select-none">
              <div className="relative h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-tr from-[#006a4e] to-[#059669] p-1.5 flex items-center justify-center shadow-xs">
                <Image
                  src="/logo.png"
                  alt={BRAND_NAME_EN}
                  fill
                  className="object-contain p-0.5 drop-shadow-xs"
                />
              </div>
              <div className="text-left">
                <h2 className="font-black text-sm text-slate-900 tracking-tight leading-tight">
                  {isBn ? "সাভারচালা শান্তি সংঘ" : BRAND_NAME_EN}
                </h2>
                <p className="text-[10px] font-bold text-[#006a4e] leading-tight">
                  {isBn ? "ক্লাব পোর্টাল হাব" : "Club Portal Hub"}
                </p>
              </div>
            </Link>

            {/* Right: Language Switcher + Hamburger Drawer Button */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher locale={locale as any} variant="toggle" />

              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open navigation drawer"
                className="p-2 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </header>
        )}

        {/* Dashboard Main Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {embeddedInAdminLayout && (
            <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-[#006a4e]/15 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#006a4e] text-white shadow-xs"
                    : "text-[#12231d] hover:text-[#006a4e]"
                }`}
              >
                {isBn ? "ওভারভিউ" : "Overview"}
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setActiveTab("admin_users")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    activeTab === "admin_users" ||
                    activeTab === "admin_users_all" ||
                    activeTab === "admin_users_pending"
                      ? "bg-[#006a4e] text-white shadow-xs"
                      : "text-[#12231d] hover:text-[#006a4e]"
                  }`}
                >
                  {isBn ? "ইউজার ম্যানেজমেন্ট" : "User Management"}
                </button>
              )}
            </div>
          )}
          {/* ===================================================== */}
          {/* TAB 1: OVERVIEW (Admin Only)                          */}
          {/* ===================================================== */}
          {activeTab === "overview" && isAdmin && (
            <AdminOverviewView
              adminName={user?.name || "Admin"}
              adminVerified={isAdminVerified(user?.adminVerified)}
              locale={locale}
              onReviewPending={() => setActiveTab("admin_users_pending")}
            />
          )}

          {/* ===================================================== */}
          {/* TAB: MEMBERS DIRECTORY (Read-only for all members)    */}
          {/* ===================================================== */}
          {activeTab === "members" && (
            <MembersDirectory locale={locale as any} inDashboard />
          )}

          {/* ===================================================== */}
          {/* TAB 2: PROFILE & SETTINGS                             */}
          {/* ===================================================== */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Header Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
                <div
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    profileSaveSuccess ? "pb-6 border-b border-slate-100" : ""
                  }`}
                >
                  <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 sm:gap-5 w-full min-w-0">
                    <div className="relative shrink-0 mx-auto sm:mx-0">
                      {user?.picture ? (
                        <div className="relative h-20 w-20 sm:h-20 sm:w-20 rounded-full overflow-hidden ring-4 ring-[#006a4e]/20 shadow-md">
                          <Image src={user.picture} alt={displayName} fill unoptimized className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-20 w-20 sm:h-20 sm:w-20 rounded-full bg-[#006a4e] text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 h-5 w-5 rounded-full ring-2 ring-white ${
                          user?.status === "SUSPENDED" ? "bg-rose-500" : "bg-emerald-500"
                        }`}
                        title={user?.status === "SUSPENDED" ? "Suspended" : "Active Member"}
                      />
                    </div>

                    <div className="min-w-0 flex flex-col items-center sm:items-start w-full">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 truncate">{displayName}</h3>
                        {isAdminVerified(user?.adminVerified ?? user?.adminApproved) && (
                          <VerifiedTick isBn={isBn} className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{displayEmail}</p>

                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-2.5 flex-wrap text-xs">
                        {/* Role Badge */}
                        <span className="bg-[#006a4e]/10 text-[#006a4e] border border-[#006a4e]/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {isAdmin
                            ? `👑 ${isBn ? roleMeta.labelBn : roleMeta.labelEn}`
                            : isBn
                              ? "⭐ রেজিস্টার্ড মেম্বার"
                              : "⭐ Club Member"}
                        </span>

                        {/* Google or Email Icon/Badge */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs text-[11px] font-bold">
                          {isGoogleConnected ? (
                            <>
                              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z" />
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.3 21.45 7.36 24 12 24z" />
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.04.01 12s.45 3.8 1.26 5.42l4.01-3.15z" />
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.3 2.55 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                              </svg>
                              <span>Google</span>
                            </>
                          ) : (
                            <>
                              <span className="font-extrabold text-xs text-slate-700">@</span>
                              <span>{isBn ? "ইমেইল" : "Email"}</span>
                            </>
                          )}
                        </span>

                        {/* Blood Group Badge */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                          <span>🩸</span>
                          <span>
                            {(() => {
                              const formatted = formatBloodGroupDisplay(profileForm.bloodGroup);
                              return !formatted || formatted.trim().toUpperCase() === "UNKNOWN"
                                ? "N/A"
                                : formatted;
                            })()}
                          </span>
                        </span>

                        {/* Village Badge */}
                        {profileForm.village && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006a4e] border border-[#006a4e]/20 font-bold">
                            <span>🏡</span>
                            <span>{profileForm.village}</span>
                          </span>
                        )}

                        {/* Profession Badge */}
                        {profileForm.profession && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                            <span>💼</span>
                            <span>{profileForm.profession}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Banner */}
                {profileSaveSuccess && (
                  <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">✓</span>
                      <span>{isBn ? "প্রোফাইল তথ্য সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!" : "Profile updated and saved successfully!"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfileSaveSuccess(false)}
                      className="text-emerald-700 hover:text-emerald-900 font-extrabold text-sm px-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Main Profile Form */}
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Profile Sub-Section Tabs (Mobile & Desktop) */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 p-1.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 w-full select-none">
                  <button
                    type="button"
                    onClick={() => setProfileSectionTab("personal")}
                    className={`py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      profileSectionTab === "personal"
                        ? "bg-[#006a4e] text-white shadow-xs"
                        : "text-slate-700 hover:text-[#006a4e] hover:bg-emerald-100/60"
                    }`}
                  >
                    <span className="text-sm">👤</span>
                    <span className="truncate">
                      {isBn ? "ব্যক্তিগত তথ্য" : "Personal Info"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileSectionTab("profession")}
                    className={`py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      profileSectionTab === "profession"
                        ? "bg-[#006a4e] text-white shadow-xs"
                        : "text-slate-700 hover:text-[#006a4e] hover:bg-emerald-100/60"
                    }`}
                  >
                    <span className="text-sm">💼</span>
                    <span className="truncate">
                      {isBn ? "পেশা ও বায়ো" : "Profession & Bio"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileSectionTab("location")}
                    className={`py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      profileSectionTab === "location"
                        ? "bg-[#006a4e] text-white shadow-xs"
                        : "text-slate-700 hover:text-[#006a4e] hover:bg-emerald-100/60"
                    }`}
                  >
                    <span className="text-sm">📍</span>
                    <span className="truncate">
                      {isBn ? "ঠিকানা ও লিংক" : "Location & Links"}
                    </span>
                  </button>
                </div>

                {/* 1. Personal & Family Identity */}
                {profileSectionTab === "personal" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center text-lg shrink-0">
                        👤
                      </span>
                      <div>
                        <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                          {isBn ? "ব্যক্তিগত ও পারিবারিক তথ্য" : "Personal & Family Information"}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isBn ? "আপনার নাম, পিতামাতার নাম ও রক্তের গ্রুপ" : "Personal identity, parents' names and blood group"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                          {isBn ? "পুরো নাম" : "Full Name"} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          required
                          placeholder={isBn ? "আপনার পুরো নাম" : "Your full name"}
                          className="w-full h-12 px-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none shadow-2xs hover:bg-slate-50"
                        />
                      </div>

                      {/* Email (Read only) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs sm:text-sm font-bold text-slate-700">
                            {isBn ? "ইমেইল ঠিকানা" : "Email Address"}
                          </label>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                            {isBn ? "✓ যাচাইকৃত" : "✓ Verified"}
                          </span>
                        </div>
                        <input
                          type="email"
                          value={displayEmail}
                          disabled
                          className="w-full h-12 px-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-sm font-medium text-slate-500 cursor-not-allowed outline-none select-all"
                        />
                      </div>

                      {/* fatherName (String?) */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                          {isBn ? "বাবার নাম" : "Father's Name"}
                        </label>
                        <input
                          type="text"
                          value={profileForm.fatherName}
                          onChange={(e) => setProfileForm({ ...profileForm, fatherName: e.target.value })}
                          placeholder={isBn ? "বাবার পুরো নাম লিখুন" : "Enter father's name"}
                          className="w-full h-12 px-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none shadow-2xs hover:bg-slate-50"
                        />
                      </div>

                      {/* motherName (String?) */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                          {isBn ? "মায়ের নাম" : "Mother's Name"}
                        </label>
                        <input
                          type="text"
                          value={profileForm.motherName}
                          onChange={(e) => setProfileForm({ ...profileForm, motherName: e.target.value })}
                          placeholder={isBn ? "মায়ের পুরো নাম লিখুন" : "Enter mother's name"}
                          className="w-full h-12 px-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none shadow-2xs hover:bg-slate-50"
                        />
                      </div>

                      {/* bloodGroup (BloodGroup @default(UNKNOWN)) */}
                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs sm:text-sm font-bold text-slate-700">
                            {isBn ? "রক্তের গ্রুপ" : "Blood Group"}
                          </label>
                          <span className="text-[11px] text-rose-600 font-bold">
                            {isBn ? "জরুরি রক্তদানে ক্লাব সদস্যদের সহায়তায় ব্যবহৃত" : "Used for emergency blood donation"}
                          </span>
                        </div>
                        <div className="relative">
                          <select
                            value={profileForm.bloodGroup}
                            onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value as BloodGroup })}
                            className="w-full h-12 px-4 pr-11 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-sm font-bold text-slate-800 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none cursor-pointer appearance-none shadow-2xs hover:bg-slate-50"
                          >
                            {BLOOD_GROUP_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value} className="text-slate-800 font-medium">
                                🩸 {isBn ? opt.labelBn : opt.labelEn}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step Navigation to Next Tab */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setProfileSectionTab("profession")}
                        className="h-10 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
                      >
                        <span>{isBn ? "পরবর্তী: পেশা ও বায়ো" : "Next: Profession & Bio"}</span>
                        <IoIosArrowForward className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Profession, Summary & Bio */}
                {profileSectionTab === "profession" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center justify-center text-lg shrink-0">
                        💼
                      </span>
                      <div>
                        <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                          {isBn ? "পেশা, সারসংক্ষেপ ও জীবনবৃত্তান্ত" : "Profession, Summary & Biography"}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isBn ? "ক্লাবে আপনার পেশাগত পরিচিতি ও বায়ো" : "Your professional identity, short bio, and summary"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* profession (String?) */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                          {isBn ? "পেশা / বর্তমান পদবি" : "Profession / Designation"}
                        </label>
                        <input
                          type="text"
                          value={profileForm.profession}
                          onChange={(e) => setProfileForm({ ...profileForm, profession: e.target.value })}
                          placeholder={isBn ? "যেমন: সফটওয়্যার ইঞ্জিনিয়ার / ব্যবসায়ী / শিক্ষার্থী / শিক্ষক" : "e.g. Software Engineer, Business Owner, Student"}
                          className="w-full h-12 px-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none shadow-2xs hover:bg-slate-50"
                        />
                      </div>

                      {/* summary (String?) */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                          {isBn ? "সংক্ষিপ্ত সারসংক্ষেপ (এক লাইন)" : "Short Summary (One-liner)"}
                        </label>
                        <input
                          type="text"
                          value={profileForm.summary}
                          onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                          placeholder={isBn ? "শান্তি সংঘের নিবেদিত সমাজকর্মী ও ক্রীড়াপ্রেমী..." : "Dedicated community advocate and sports enthusiast..."}
                          className="w-full h-12 px-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none shadow-2xs hover:bg-slate-50"
                        />
                      </div>

                      {/* bio (String?) */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                          {isBn ? "বিস্তারিত বায়ো / পরিচিতি" : "Detailed Biography"}
                        </label>
                        <textarea
                          rows={4}
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          placeholder={isBn ? "আপনার সম্পর্কে বিস্তারিত লিখুন... ক্লাবের সাথে আপনার সম্পৃক্ততা ও লক্ষ্য।" : "Write about yourself, your contributions to the village club, and goals..."}
                          className="w-full p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none resize-y shadow-2xs hover:bg-slate-50 min-h-[110px] leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Step Navigation */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setProfileSectionTab("personal")}
                        className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
                      >
                        <IoIosArrowBack className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        <span>{isBn ? "ব্যক্তিগত তথ্য" : "Personal Info"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProfileSectionTab("location")}
                        className="h-10 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
                      >
                        <span>{isBn ? "পরবর্তী: ঠিকানা ও যোগাযোগ" : "Next: Location & Contact"}</span>
                        <IoIosArrowForward className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Address & Social Links */}
                {profileSectionTab === "location" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <span className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200/80 flex items-center justify-center text-lg shrink-0">
                        📍
                      </span>
                      <div>
                        <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                          {isBn ? "ঠিকানা ও সামাজিক যোগাযোগ" : "Location & Contact Channels"}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isBn ? "স্থায়ী গ্রাম, বর্তমান অবস্থান ও যোগাযোগ মাধ্যম" : "Village origin, current location and social links"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      {/* village (String?) */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                          {isBn ? "গ্রাম / স্থায়ী এলাকা" : "Village / Native Area"}
                        </label>
                        <input
                          type="text"
                          value={profileForm.village}
                          onChange={(e) => setProfileForm({ ...profileForm, village: e.target.value })}
                          placeholder={isBn ? "যেমন: সাভারচালা, বহেড়াতলী, সখিপুর" : "e.g. Shavarchala, Sakhipur"}
                          className="w-full h-12 px-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none shadow-2xs hover:bg-slate-50"
                        />
                      </div>

                      {/* currentLocation (String?) */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                          {isBn ? "বর্তমান বাসস্থান / ঠিকানা" : "Current Location"}
                        </label>
                        <input
                          type="text"
                          value={profileForm.currentLocation}
                          onChange={(e) => setProfileForm({ ...profileForm, currentLocation: e.target.value })}
                          placeholder={isBn ? "যেমন: ঢাকা, বাংলাদেশ" : "e.g. Dhaka, Bangladesh"}
                          className="w-full h-12 px-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none shadow-2xs hover:bg-slate-50"
                        />
                      </div>

                      {/* whatsappNumber (String?) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs sm:text-sm font-bold text-slate-700">
                            {isBn ? "হোয়াটসঅ্যাপ নম্বর" : "WhatsApp Number"}
                          </label>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                            WhatsApp
                          </span>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-600 font-bold text-base">
                            💬
                          </div>
                          <input
                            type="tel"
                            value={profileForm.whatsappNumber}
                            onChange={(e) => setProfileForm({ ...profileForm, whatsappNumber: e.target.value })}
                            placeholder="+8801700000000"
                            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none shadow-2xs hover:bg-slate-50"
                          />
                        </div>
                      </div>

                      {/* facebookProfile (String?) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs sm:text-sm font-bold text-slate-700">
                            {isBn ? "ফেসবুক প্রোফাইল লিংক" : "Facebook Profile"}
                          </label>
                          <span className="text-[10px] text-blue-700 font-bold bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-full">
                            Facebook
                          </span>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-blue-600 font-bold text-base">
                            🌐
                          </div>
                          <input
                            type="url"
                            value={profileForm.facebookProfile}
                            onChange={(e) => setProfileForm({ ...profileForm, facebookProfile: e.target.value })}
                            placeholder="https://facebook.com/username"
                            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 transition-all outline-none shadow-2xs hover:bg-slate-50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step Navigation */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-start">
                      <button
                        type="button"
                        onClick={() => setProfileSectionTab("profession")}
                        className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
                      >
                        <IoIosArrowBack className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        <span>{isBn ? "পেশা ও বায়ো" : "Profession & Bio"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Form Action Controls (shown only when data changes or saving/saved) */}
                {(isProfileDirty || isSavingProfile || profileSaveSuccess) && (
                  <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-200/80 shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="text-xs text-slate-500">
                      {profileSaveSuccess && !isProfileDirty ? (
                        <span className="text-emerald-700 font-bold">
                          ✓ {isBn ? "সকল তথ্য সংরক্ষিত হয়েছে" : "All changes saved"}
                        </span>
                      ) : (
                        <span className="font-medium">
                          {isBn
                            ? "পরিবর্তনগুলো সংরক্ষণ করতে বাটনে ক্লিক করুন"
                            : "Click Save to apply your updates"}
                        </span>
                      )}
                    </div>

                    {(isProfileDirty || isSavingProfile) && (
                      <div className="flex items-center gap-3 shrink-0 justify-end">
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className="px-6 py-2.5 rounded-2xl bg-[#006a4e] hover:bg-[#005a42] disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#006a4e]/20 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                        >
                          {isSavingProfile ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                              <span>{isBn ? "সংরক্ষণ করা হচ্ছে..." : "Saving..."}</span>
                            </>
                          ) : (
                            <>
                              <span>💾</span>
                              <span>{isBn ? "তথ্য সংরক্ষণ করুন" : "Save Changes"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ===================================================== */}
          {/* TAB 3: SPORTS & SPL (Cooking)                        */}
          {/* ===================================================== */}
          {activeTab === "sports" && (
            <FeatureCooking
              featureNameEn="Sports & SPL"
              featureNameBn="স্পোর্টস ও এসপিএল"
              locale={locale}
              onDashboardClick={() => setActiveTab(isAdmin ? "overview" : "members")}
            />
          )}

          {/* ===================================================== */}
          {/* TAB 4A: ADMIN: USER MANAGEMENT (All & Pending Sub-tabs) */}
          {/* ===================================================== */}
          {(activeTab === "admin_users" ||
            activeTab === "admin_users_all" ||
            activeTab === "admin_users_pending") &&
            isAdmin && (
              <AdminUsersView
                locale={locale}
                currentUserId={user?.id}
                subTab={activeTab === "admin_users_pending" ? "pending" : "all"}
                onSubTabChange={(next) =>
                  setActiveTab(
                    next === "pending" ? "admin_users_pending" : "admin_users"
                  )
                }
              />
            )}

          {/* ===================================================== */}
          {/* TAB 4: ADMIN: MEMBER APPROVALS (Admin Only)          */}
          {/* ===================================================== */}
          {activeTab === "admin_members" && isAdmin && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
                    <span>👑</span>
                    <span>{isBn ? "অ্যাডমিন ম্যানেজমেন্ট" : "Admin Management"}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {isBn ? "নতুন সদস্য রেজিস্ট্রেশন অনুমোদন" : "Pending Member Registrations"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isBn ? "আবেদনকারীদের যাচাই করে ক্লাবের সদস্য তালিকায় যুক্ত করুন" : "Review and approve new club membership registrations"}
                  </p>
                </div>

                <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full self-start sm:self-auto">
                  {pendingMembers.length} {isBn ? "টি আবেদন অপেক্ষমাণ" : "Pending Applications"}
                </span>
              </div>

              {pendingMembers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  <p className="text-3xl mb-2">🎉</p>
                  <p>{isBn ? "কোনো নতুন আবেদন অপেক্ষমাণ নেই!" : "No pending registration requests!"}</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingMembers.map((member) => (
                    <div key={member.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{member.name}</h4>
                        <p className="text-xs text-slate-500">{member.email} • {member.phone}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{isBn ? "আবেদনের তারিখ:" : "Date:"} {member.date}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(member.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                        >
                          {isBn ? "✓ অনুমোদন করুন" : "Approve"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(member.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {isBn ? "বাতিল" : "Decline"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================================================== */}
          {/* TAB 5: ADMIN: LIVE SCORE (Cooking)                   */}
          {/* ===================================================== */}
          {activeTab === "admin_live" && isAdmin && (
            <FeatureCooking
              featureNameEn="Live Score"
              featureNameBn="লাইভ স্কোর"
              locale={locale}
              onDashboardClick={() => setActiveTab(isAdmin ? "overview" : "members")}
            />
          )}

          {/* ===================================================== */}
          {/* TAB 6: ADMIN: CLUB FINANCE (Cooking)                  */}
          {/* ===================================================== */}
          {activeTab === "admin_finance" && isAdmin && (
            <FeatureCooking
              featureNameEn="Club Finance"
              featureNameBn="তহবিল ও হিসাব"
              locale={locale}
              onDashboardClick={() => setActiveTab(isAdmin ? "overview" : "members")}
            />
          )}

          {/* ===================================================== */}
          {/* COOKING FEATURE TABS (Leadership / Notices / Expenses) */}
          {/* ===================================================== */}
          {activeTab === "leadership_pioneers" && (
            <FeatureCooking
              featureNameEn="Pioneers"
              featureNameBn="অগ্রপথিক"
              locale={locale}
              onDashboardClick={() => setActiveTab(isAdmin ? "overview" : "members")}
            />
          )}

          {activeTab === "leadership_committee" && (
            <FeatureCooking
              featureNameEn="Committee"
              featureNameBn="কমিটি"
              locale={locale}
              onDashboardClick={() => setActiveTab(isAdmin ? "overview" : "members")}
            />
          )}

          {activeTab === "leadership_admins" && (
            <FeatureCooking
              featureNameEn="Admins"
              featureNameBn="অ্যাডমিন"
              locale={locale}
              onDashboardClick={() => setActiveTab(isAdmin ? "overview" : "members")}
            />
          )}

          {activeTab === "notices" && (
            <FeatureCooking
              featureNameEn="Notices & Welfare"
              featureNameBn="নোটিশ ও কল্যাণ"
              locale={locale}
              onDashboardClick={() => setActiveTab(isAdmin ? "overview" : "members")}
            />
          )}

          {activeTab === "admin_expenses" && isAdmin && (
            <FeatureCooking
              featureNameEn="Expenses"
              featureNameBn="ব্যয় হিসাব"
              locale={locale}
              onDashboardClick={() => setActiveTab(isAdmin ? "overview" : "members")}
            />
          )}
        </main>
      </div>
    </div>
  );
}
