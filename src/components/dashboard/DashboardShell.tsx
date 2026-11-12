"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Dictionary } from "@/i18n/getDictionary";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/context/RoleContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import DashboardSidebar from "./DashboardSidebar";
import AdminOverviewView from "./AdminOverviewView";
import type { BloodGroup } from "@/types";
import { BLOOD_GROUP_OPTIONS, formatBloodGroupDisplay } from "@/lib/bloodGroup";
import {
  getRoleDisplayMeta,
  hasDashboardAccess,
  normalizeRole,
} from "@/lib/authRole";

interface Props {
  title?: string;
  stats?: string[];
  dict: Dictionary;
  locale?: string;
}

type TabType =
  | "overview"
  | "profile"
  | "sports"
  | "members"
  | "notices"
  | "admin_members"
  | "admin_live"
  | "admin_finance";

export default function DashboardShell({
  dict,
  locale = "bn",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, updateProfile } = useAuth();
  const { role, setRole } = useRole();
  const isBn = locale === "bn";

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [historyCategory, setHistoryCategory] = useState<"all" | "spl" | "football" | "community">("all");
  const [showMemberIdModal, setShowMemberIdModal] = useState(false);

  // Profile form state matching Prisma User model fields
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    fatherName: user?.fatherName || "",
    motherName: user?.motherName || "",
    bloodGroup: user?.bloodGroup || "UNKNOWN",
    bio: user?.bio || "",
    summary: user?.summary || "",
    profession: user?.profession || "",
    village: user?.village || "সাভারচালা",
    currentLocation: user?.currentLocation || "সাভারচালা, সখিপুর, টাঙ্গাইল",
    whatsappNumber: user?.whatsappNumber || "",
    facebookProfile: user?.facebookProfile || "",
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Sync profile form when user updates or loads from storage
  useEffect(() => {
    if (user) {
      setProfileForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        fatherName: user.fatherName ?? prev.fatherName,
        motherName: user.motherName ?? prev.motherName,
        bloodGroup: user.bloodGroup ?? prev.bloodGroup,
        bio: user.bio ?? prev.bio,
        summary: user.summary ?? prev.summary,
        profession: user.profession ?? prev.profession,
        village: user.village ?? prev.village,
        currentLocation: user.currentLocation ?? prev.currentLocation,
        whatsappNumber: user.whatsappNumber ?? prev.whatsappNumber,
        facebookProfile: user.facebookProfile ?? prev.facebookProfile,
      }));
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
          "admin_members",
          "admin_live",
          "admin_finance",
        ].includes(tab)
      ) {
        setActiveTab(tab as TabType);
      }
    }
  }, []);

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

      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Profile save error:", err);
      alert(isBn ? "প্রোফাইল সংরক্ষণ ব্যর্থ হয়েছে" : "Failed to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

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

  const displayName = profileForm.name || user?.name || (isBn ? "রাফিউল হাসান" : "Rafioul Hasan");
  const displayEmail = user?.email || "rafioulhasan2@gmail.com";

  // Mock pending members for Admin
  const [pendingMembers, setPendingMembers] = useState([
    { id: "1", name: "তানভীর আহমেদ", email: "tanvir.ahmed@example.com", phone: "+880 1712-345678", date: "Nov 9, 2026", status: "pending" },
    { id: "2", name: "মাহমুদুল হাসান", email: "mahmud.h@example.com", phone: "+880 1823-456789", date: "Nov 8, 2026", status: "pending" },
    { id: "3", name: "শাকিল হোসেন", email: "shakil.h@example.com", phone: "+880 1934-567890", date: "Nov 7, 2026", status: "pending" },
  ]);

  const handleApprove = (id: string) => {
    setPendingMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Mock live score for admin
  const [liveScore, setLiveScore] = useState({
    teamA: "সাভারচালা রয়্যালস",
    teamB: "সাভারচালা ভাইকিংস",
    score: "142/4",
    overs: "16.2",
    target: "165",
    striker: "রাকিবুল ইসলাম (45*)",
    bowler: "শামীম রেজা (2/28)",
  });

  return (
    <div className="min-h-screen bg-[#f7f4ea] flex flex-col md:flex-row font-sans text-slate-800">
      {/* MODULAR DASHBOARD SIDEBAR (Tabs loaded dynamically from src/data/dashboardNav.json) */}
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

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ======================================================== */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Top Header (Visible only on screens < md; hidden on desktop matching Fluentia reference design) */}
        <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between gap-4 shadow-2xs">
          {/* Left: Brand Logo + Club Name + Subtitle (Current Theme Green) */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 select-none">
            <div className="relative h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-tr from-[#006a4e] to-[#059669] p-1.5 flex items-center justify-center shadow-xs">
              <Image
                src="/logo.png"
                alt="Shanti Sangha"
                fill
                className="object-contain p-0.5 drop-shadow-xs"
              />
            </div>
            <div className="text-left">
              <h2 className="font-black text-sm text-slate-900 tracking-tight leading-tight">
                {isBn ? "সাভারচালা শান্তি সংঘ" : "Shanti Sangha"}
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

        {/* Dashboard Main Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* ===================================================== */}
          {/* TAB 1: OVERVIEW                                       */}
          {/* ===================================================== */}
          {activeTab === "overview" && (
            isAdmin ? (
              <AdminOverviewView
                adminName={user?.name || "Admin"}
                locale={locale}
                onReviewPending={() => setActiveTab("admin_members")}
              />
            ) : (
              <div className="space-y-6">
              {/* TOP STATS CARDS (4 Cards matching the reference layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat 1: Total Matches & Events */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {isBn ? "মোট ম্যাচ ও সেশন" : "TOTAL CLUB MATCHES"}
                    </span>
                    <span className="text-[#006a4e] bg-[#006a4e]/10 p-1.5 rounded-xl text-xs">🎤</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    24 {isBn ? "টি" : "Sessions"}
                  </h3>
                  <p className="text-xs text-[#006a4e] font-semibold mt-1">
                    {isBn ? "এসপিএল ও প্রীতি ম্যাচ" : "Matches & Tournaments"}
                  </p>
                </div>

                {/* Stat 2: Membership Status */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {isBn ? "সদস্য স্ট্যাটাস" : "MEMBERSHIP STATUS"}
                    </span>
                    <span className="text-emerald-600 bg-emerald-50 p-1.5 rounded-xl text-xs">📖</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">
                    {isBn ? "সক্রিয়" : "Active"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {isBn ? "ভেরিফাইড ক্লাব সদস্য" : "Verified Member"}
                  </p>
                </div>

                {/* Stat 3: Club Sessions & Attendance */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {isBn ? "উপস্থিতির হার" : "ATTENDANCE RATE"}
                    </span>
                    <span className="text-blue-600 bg-blue-50 p-1.5 rounded-xl text-xs">⚡</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    92%
                  </h3>
                  <p className="text-xs text-blue-600 font-semibold mt-1">
                    {isBn ? "নিয়মিত অংশগ্রহণকারী" : "Regular Participation"}
                  </p>
                </div>

                {/* Stat 4: Overall Performance / Accuracy */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {isBn ? "পারফরম্যান্স স্কোর" : "OVERALL CLUB SCORE"}
                    </span>
                    <span className="text-amber-600 bg-amber-50 p-1.5 rounded-xl text-xs">🎯</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    88%
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {isBn ? "শীর্ষ ১০% সদস্য তালিকায়" : "Top 10% Member"}
                  </p>
                </div>
              </div>

              {/* ADMIN SPECIAL KPI ROW (Only visible to Admin) */}
              {isAdmin && (
                <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/40 rounded-3xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 uppercase tracking-wider">
                      <span>👑</span>
                      <span>{isBn ? "অ্যাডমিন এক্সক্লুসিভ স্ট্যাটাস" : "Admin Executive Insights"}</span>
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                      {isBn ? "সিস্টেম রানিং" : "System Live"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
                    <div className="bg-white/80 rounded-2xl p-3 border border-amber-200/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{isBn ? "মোট সদস্য" : "Total Members"}</p>
                      <p className="text-xl font-black text-slate-900">128 {isBn ? "জন" : ""}</p>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-3 border border-amber-200/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{isBn ? "অপেক্ষমাণ অনুমোদন" : "Pending Approvals"}</p>
                      <p className="text-xl font-black text-amber-600">{pendingMembers.length} {isBn ? "জন" : ""}</p>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-3 border border-amber-200/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{isBn ? "তহবিল স্থিতি" : "Fund Balance"}</p>
                      <p className="text-xl font-black text-emerald-600">৳ ৪৮,৫০০</p>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-3 border border-amber-200/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{isBn ? "লাইভ ম্যাচ" : "Live Matches"}</p>
                      <p className="text-xl font-black text-blue-600">১ {isBn ? "টি রানিং" : "Active"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* LATEST MATCH RESULT & EVALUATION */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{isBn ? "সর্বশেষ ম্যাচ ফলাফল • Nov 8, 2026" : "Latest SPL Match • Nov 8, 2026"}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {isBn ? "সাভারচালা রয়্যালস বনাম ভাইকিংস একাদশ (এসপিএল সিজন ৫)" : "Shavarchala Royals vs Vikings XI (SPL Season 5)"}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab("sports")}
                        className="px-3.5 py-1.5 rounded-full bg-[#006a4e]/10 text-[#006a4e] hover:bg-[#006a4e]/20 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {isBn ? "পূর্ণ রিপোর্ট" : "Full Report"}
                      </button>
                    </div>
                  </div>

                  {/* Chips Row (Accuracy, Time, Level equivalent) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                    <div className="p-3.5 rounded-2xl bg-[#006a4e]/10 border border-[#006a4e]/20 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#006a4e] text-white font-black flex items-center justify-center text-xs">
                        WIN
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-[#006a4e]">{isBn ? "ম্যাচ রেজাল্ট" : "Result"}</p>
                        <p className="text-sm font-extrabold text-slate-900">{isBn ? "৬ উইকেটে জয়ী" : "Won by 6 Wkts"}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                        MOM
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-blue-600">{isBn ? "সেরা পারফরমার" : "Top Performer"}</p>
                        <p className="text-xs font-extrabold text-slate-900 truncate">{isBn ? "রাকিবুল ইসলাম" : "Rakibul Islam"}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                        #1
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-emerald-600">{isBn ? "পয়েন্ট টেবিল" : "Table Rank"}</p>
                        <p className="text-xs font-extrabold text-slate-900">{isBn ? "শীর্ষস্থান (১০ পয়েন্ট)" : "1st Place (10 pts)"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation / Directive Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <span>📢</span>
                      <span>{isBn ? "কমিটি ও কোচিং স্টাফদের নির্দেশনা:" : "Club Committee Directive:"}</span>
                    </p>
                    <p>
                      {isBn
                        ? "আগামী শুক্রবার সকাল ৮:৩০ মিনিটে সাভারচালা হাই স্কুল মাঠে এসপিএল টুর্নামেন্টের সেমিফাইনাল ম্যাচ অনুষ্ঠিত হবে। সকল খেলোয়াড় ও শুভানুধ্যায়ী সদস্যদের নির্ধারিত সময়ের পূর্বেই মাঠে উপস্থিত হওয়ার আহ্বান জানানো হচ্ছে।"
                        : "Semi-final match scheduled for this Friday at 8:30 AM at Shavarchala High School Ground. All members and supporters are requested to be present on time."}
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION: ACTIVITY HISTORY & ATTEMPTS (Matching table in reference image) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {isBn ? "ক্লাবের সাম্প্রতিক ইভেন্ট ও কার্যক্রম রেকর্ড" : "Recent Events & Activity History"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isBn ? "টুর্নামেন্ট, ম্যাচ ও সামাজিক উন্নয়নমূলক কাজের বিবরণী" : "Track match records, tournament updates, and club milestones"}
                    </p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setHistoryCategory("all")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                        historyCategory === "all"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isBn ? "সকল (৪)" : "All (4)"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryCategory("spl")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                        historyCategory === "spl"
                          ? "bg-[#006a4e] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isBn ? "এসপিএল ক্রিকেট" : "SPL Cricket"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistoryCategory("football")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                        historyCategory === "football"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isBn ? "ফুটবল" : "Football"}
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("admin_members")}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition-colors cursor-pointer"
                      >
                        {isBn ? "+ অ্যাডমিন টুলস" : "+ Admin Tools"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                        <th className="py-3 px-3">{isBn ? "ইভেন্ট / ম্যাচ" : "Event / Match"}</th>
                        <th className="py-3 px-3">{isBn ? "ক্যাটাগরি" : "Category"}</th>
                        <th className="py-3 px-3">{isBn ? "তারিখ" : "Date"}</th>
                        <th className="py-3 px-3">{isBn ? "ফলাফল / অবস্থা" : "Status / Result"}</th>
                        <th className="py-3 px-3 text-right">{isBn ? "অ্যাকশন" : "Action"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-slate-900">{isBn ? "এসপিএল সিজন ৫ - গ্রুপ ম্যাচ ৪" : "SPL Season 5 - Group Match 4"}</p>
                          <p className="text-[11px] text-slate-400">সাভারচালা রয়্যালস বনাম ভাইকিংস একাদশ</p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-block bg-[#006a4e]/10 text-[#006a4e] px-2 py-0.5 rounded-md text-xs font-bold">
                            Cricket
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">Nov 8, 2026</td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {isBn ? "জয়ী (৬ উইকেটে)" : "Won by 6 wkts"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTab("sports")}
                            className="text-[#006a4e] hover:text-[#005a42] font-bold text-xs"
                          >
                            {isBn ? "বিস্তারিত দেখুন →" : "View →"}
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-slate-900">{isBn ? "বিজয় দিবস প্রীতি ফুটবল ম্যাচ" : "Victory Day Football Match"}</p>
                          <p className="text-[11px] text-slate-400">সাভারচালা একাদশ বনাম সখিপুর একাদশ</p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-block bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-bold">
                            Football
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">Nov 1, 2026</td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 text-blue-600 font-bold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {isBn ? "ড্র (১ - ১)" : "Draw (1 - 1)"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTab("sports")}
                            className="text-[#006a4e] hover:text-[#005a42] font-bold text-xs"
                          >
                            {isBn ? "বিস্তারিত দেখুন →" : "View →"}
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-slate-900">{isBn ? "ক্লাবের বার্ষিক সাধারণ সভা ও রক্তদান কর্মসূচি" : "Annual General Meeting & Blood Drive"}</p>
                          <p className="text-[11px] text-slate-400">সাভারচালা শান্তি সংঘ প্রাঙ্গণ</p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold">
                            Community
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">Oct 25, 2026</td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1 text-slate-600 font-bold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            {isBn ? "সম্পন্ন" : "Completed"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTab("sports")}
                            className="text-[#006a4e] hover:text-[#005a42] font-bold text-xs"
                          >
                            {isBn ? "বিস্তারিত দেখুন →" : "View →"}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )
          )}

          {/* ===================================================== */}
          {/* TAB 2: PROFILE & SETTINGS                             */}
          {/* ===================================================== */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Header Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="relative shrink-0">
                      {user?.picture ? (
                        <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-full overflow-hidden ring-4 ring-[#006a4e]/20 shadow-md">
                          <Image src={user.picture} alt={displayName} fill unoptimized className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-full bg-[#006a4e] text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-white" title="Active Member" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 truncate">{displayName}</h3>
                        <span className="bg-[#006a4e]/10 text-[#006a4e] border border-[#006a4e]/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {isAdmin
                            ? `👑 ${isBn ? roleMeta.labelBn : roleMeta.labelEn}`
                            : isBn
                              ? "⭐ রেজিস্টার্ড মেম্বার"
                              : "⭐ Club Member"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">{displayEmail}</p>

                      <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                        {/* Blood Group Badge */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                          <span>🩸</span>
                          <span>{formatBloodGroupDisplay(profileForm.bloodGroup)}</span>
                        </span>

                        {/* Village Badge */}
                        {profileForm.village && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#006a4e] border border-[#006a4e]/20 font-bold">
                            <span>🏡</span>
                            <span>{profileForm.village}</span>
                          </span>
                        )}

                        {/* Profession Badge */}
                        {profileForm.profession && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                            <span>💼</span>
                            <span>{profileForm.profession}</span>
                          </span>
                        )}

                        {user?.provider === "google" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 font-semibold text-[11px]">
                            <span>✓ Google Connected</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      type="button"
                      onClick={() => setShowMemberIdModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#006a4e] hover:bg-[#005a42] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#006a4e]/20 transition-all cursor-pointer"
                    >
                      <span>🪪</span>
                      <span>{isBn ? "সদস্য আইডি কার্ড" : "Member ID Card"}</span>
                    </button>
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
                {/* 1. Personal & Family Identity */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <span className="text-lg">👤</span>
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">
                        {isBn ? "ব্যক্তিগত ও পারিবারিক তথ্য" : "Personal & Family Information"}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isBn ? "আপনার নাম, পিতামাতার নাম ও রক্তের গ্রুপ" : "Personal identity, parents' names and blood group"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isBn ? "পুরো নাম" : "Full Name"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                        placeholder={isBn ? "আপনার পুরো নাম" : "Your full name"}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
                      />
                    </div>

                    {/* Email (Read only) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          {isBn ? "ইমেইল ঠিকানা" : "Email Address"}
                        </label>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded">
                          {isBn ? "যাচাইকৃত" : "Verified"}
                        </span>
                      </div>
                      <input
                        type="email"
                        value={displayEmail}
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
                      />
                    </div>

                    {/* fatherName (String?) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isBn ? "বাবার নাম" : "Father's Name"}
                      </label>
                      <input
                        type="text"
                        value={profileForm.fatherName}
                        onChange={(e) => setProfileForm({ ...profileForm, fatherName: e.target.value })}
                        placeholder={isBn ? "বাবার পুরো নাম লিখুন" : "Enter father's name"}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
                      />
                    </div>

                    {/* motherName (String?) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isBn ? "মায়ের নাম" : "Mother's Name"}
                      </label>
                      <input
                        type="text"
                        value={profileForm.motherName}
                        onChange={(e) => setProfileForm({ ...profileForm, motherName: e.target.value })}
                        placeholder={isBn ? "মায়ের পুরো নাম লিখুন" : "Enter mother's name"}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
                      />
                    </div>

                    {/* bloodGroup (BloodGroup @default(UNKNOWN)) */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
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
                          className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none cursor-pointer appearance-none"
                        >
                          {BLOOD_GROUP_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="text-slate-800 font-medium">
                              🩸 {isBn ? opt.labelBn : opt.labelEn}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Profession, Summary & Bio */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <span className="text-lg">💼</span>
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">
                        {isBn ? "পেশা, সারসংক্ষেপ ও জীবনবৃত্তান্ত" : "Profession, Summary & Biography"}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isBn ? "ক্লাবে আপনার পেশাগত পরিচিতি ও বায়ো" : "Your professional identity, short bio, and summary"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* profession (String?) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isBn ? "পেশা / বর্তমান পদবি" : "Profession / Designation"}
                      </label>
                      <input
                        type="text"
                        value={profileForm.profession}
                        onChange={(e) => setProfileForm({ ...profileForm, profession: e.target.value })}
                        placeholder={isBn ? "যেমন: সফটওয়্যার ইঞ্জিনিয়ার / ব্যবসায়ী / শিক্ষার্থী / শিক্ষক" : "e.g. Software Engineer, Business Owner, Student"}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
                      />
                    </div>

                    {/* summary (String?) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isBn ? "সংক্ষিপ্ত সারসংক্ষেপ (এক লাইন)" : "Short Summary (One-liner)"}
                      </label>
                      <input
                        type="text"
                        value={profileForm.summary}
                        onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                        placeholder={isBn ? "শান্তি সংঘের নিবেদিত সমাজকর্মী ও ক্রীড়াপ্রেমী..." : "Dedicated community advocate and sports enthusiast..."}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
                      />
                    </div>

                    {/* bio (String?) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isBn ? "বিস্তারিত বায়ো / পরিচিতি" : "Detailed Biography"}
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        placeholder={isBn ? "আপনার সম্পর্কে বিস্তারিত লিখুন... ক্লাবের সাথে আপনার সম্পৃক্ততা ও লক্ষ্য।" : "Write about yourself, your contributions to the village club, and goals..."}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none resize-y"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Address & Social Links */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <span className="text-lg">📍</span>
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">
                        {isBn ? "ঠিকানা ও সামাজিক যোগাযোগ" : "Location & Contact Channels"}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isBn ? "স্থায়ী গ্রাম, বর্তমান অবস্থান ও যোগাযোগ মাধ্যম" : "Village origin, current location and social links"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                    {/* village (String?) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isBn ? "গ্রাম / স্থায়ী এলাকা" : "Village / Native Area"}
                      </label>
                      <input
                        type="text"
                        value={profileForm.village}
                        onChange={(e) => setProfileForm({ ...profileForm, village: e.target.value })}
                        placeholder={isBn ? "যেমন: সাভারচালা, বহেড়াতলী, সখিপুর" : "e.g. Shavarchala, Sakhipur"}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
                      />
                    </div>

                    {/* currentLocation (String?) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isBn ? "বর্তমান বাসস্থান / ঠিকানা" : "Current Location"}
                      </label>
                      <input
                        type="text"
                        value={profileForm.currentLocation}
                        onChange={(e) => setProfileForm({ ...profileForm, currentLocation: e.target.value })}
                        placeholder={isBn ? "যেমন: ঢাকা, বাংলাদেশ" : "e.g. Dhaka, Bangladesh"}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
                      />
                    </div>

                    {/* whatsappNumber (String?) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          {isBn ? "হোয়াটসঅ্যাপ নম্বর" : "WhatsApp Number"}
                        </label>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded">
                          WhatsApp
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-emerald-600 font-bold text-sm">
                          💬
                        </div>
                        <input
                          type="tel"
                          value={profileForm.whatsappNumber}
                          onChange={(e) => setProfileForm({ ...profileForm, whatsappNumber: e.target.value })}
                          placeholder="+8801700000000"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* facebookProfile (String?) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          {isBn ? "ফেসবুক প্রোফাইল লিংক" : "Facebook Profile"}
                        </label>
                        <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.2 rounded">
                          Facebook
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-blue-600 font-bold text-sm">
                          🌐
                        </div>
                        <input
                          type="url"
                          value={profileForm.facebookProfile}
                          onChange={(e) => setProfileForm({ ...profileForm, facebookProfile: e.target.value })}
                          placeholder="https://facebook.com/username"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Member Card Preview */}
                <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      {isBn ? "লাইভ কার্ড প্রিভিউ" : "LIVE MEMBER CARD PREVIEW"}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      {isBn ? "সদস্য ডিরেক্টরিতে যেমন দেখাবে" : "Public Member Preview"}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#006a4e] text-white font-black text-lg flex items-center justify-center shrink-0 ring-2 ring-[#006a4e]/20 overflow-hidden relative">
                        {user?.picture ? (
                          <Image src={user.picture} alt={displayName} fill unoptimized className="object-cover" />
                        ) : (
                          displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-extrabold text-sm sm:text-base text-slate-900">{displayName}</h5>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            🩸 {formatBloodGroupDisplay(profileForm.bloodGroup)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {profileForm.profession || (isBn ? "ক্লাব মেম্বার" : "Club Member")} • 📍 {profileForm.village || "সাভারচালা"}
                        </p>
                        {profileForm.summary && (
                          <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-1">
                            &quot;{profileForm.summary}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {profileForm.whatsappNumber && (
                        <a
                          href={`https://wa.me/${profileForm.whatsappNumber.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>💬</span>
                          <span>WhatsApp</span>
                        </a>
                      )}
                      {profileForm.facebookProfile && (
                        <a
                          href={profileForm.facebookProfile}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>🌐</span>
                          <span>Facebook</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Action Controls */}
                <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 hidden sm:block">
                    {profileSaveSuccess ? (
                      <span className="text-emerald-700 font-bold">✓ {isBn ? "সকল তথ্য সংরক্ষিত আছে" : "All changes saved"}</span>
                    ) : (
                      <span>{isBn ? "পরিবর্তনগুলো সংরক্ষণ করতে বাটনে ক্লিক করুন" : "Click Save to apply your updates"}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="w-full sm:w-auto px-7 py-2.5 rounded-2xl bg-[#006a4e] hover:bg-[#005a42] disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#006a4e]/20 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
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
                </div>
              </form>
            </div>
          )}

          {/* ===================================================== */}
          {/* TAB 3: SPORTS & SPL                                  */}
          {/* ===================================================== */}
          {activeTab === "sports" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#005a42] via-[#006a4e] to-[#0A3123] text-white rounded-3xl p-6 sm:p-8 shadow-md">
                <span className="bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-white/25">
                  SPL SEASON 5 • 2026
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2">
                  {isBn ? "সাভারচালা প্রিমিয়ার লিগ (এসপিএল)" : "Shavarchala Premier League (SPL)"}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
                  {isBn
                    ? "শান্তি সংঘ আয়োজিত ঐতিহাসিক গ্রামীণ ক্রিকেট উৎসব। আগামী ম্যাচ ও দলগুলোর অবস্থান।"
                    : "Official village cricket championship organized by Shanti Sangha. Track schedules and team rosters."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
                  <h4 className="font-extrabold text-base text-slate-900 mb-3">
                    {isBn ? "আগামী সেমিফাইনাল ফিক্সচার" : "Upcoming Semi-Final Fixture"}
                  </h4>
                  <div className="p-4 rounded-2xl bg-[#006a4e]/5 border border-[#006a4e]/15 text-center space-y-2">
                    <p className="text-xs text-[#006a4e] font-bold uppercase">{isBn ? "শুক্রবার • সকাল ৮:৩০" : "Friday • 8:30 AM"}</p>
                    <div className="flex items-center justify-center gap-4 text-sm sm:text-base font-black text-slate-900">
                      <span>সাভারচালা রয়্যালস</span>
                      <span className="text-red-500 font-extrabold">VS</span>
                      <span>সাভারচালা কিংস</span>
                    </div>
                    <p className="text-xs text-slate-500">{isBn ? "ভেন্যু: সাভারচালা হাই স্কুল মাঠ" : "Venue: High School Ground"}</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
                  <h4 className="font-extrabold text-base text-slate-900 mb-3">
                    {isBn ? "টুর্নামেন্ট লিডারবোর্ড" : "Tournament Leaderboard"}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 font-bold text-slate-800">
                      <span>১. সাভারচালা রয়্যালস</span>
                      <span className="text-emerald-600">১০ পয়েন্ট (NRR +1.42)</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 font-bold text-slate-800">
                      <span>২. সাভারচালা কিংস</span>
                      <span className="text-emerald-600">৮ পয়েন্ট (NRR +0.85)</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-50 font-bold text-slate-800">
                      <span>৩. ভাইকিংস একাদশ</span>
                      <span className="text-slate-600">৬ পয়েন্ট (NRR -0.21)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          {/* TAB 5: ADMIN: LIVE SCORE CONTROLLER (Admin Only)     */}
          {/* ===================================================== */}
          {activeTab === "admin_live" && isAdmin && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5">
              <div className="pb-4 border-b border-slate-100">
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  LIVE SCOREBOARD CONTROLLER
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {isBn ? "চলমান এসপিএল ম্যাচের লাইভ স্কোরবোর্ড আপডেট" : "Live Match Scoreboard Updater"}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{isBn ? "দল ১" : "Team 1"}</label>
                  <input
                    type="text"
                    value={liveScore.teamA}
                    onChange={(e) => setLiveScore({ ...liveScore, teamA: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{isBn ? "দল ২" : "Team 2"}</label>
                  <input
                    type="text"
                    value={liveScore.teamB}
                    onChange={(e) => setLiveScore({ ...liveScore, teamB: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{isBn ? "বর্তমান রান / উইকেট" : "Current Score"}</label>
                  <input
                    type="text"
                    value={liveScore.score}
                    onChange={(e) => setLiveScore({ ...liveScore, score: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#006a4e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{isBn ? "ওভার" : "Overs"}</label>
                  <input
                    type="text"
                    value={liveScore.overs}
                    onChange={(e) => setLiveScore({ ...liveScore, overs: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => alert(isBn ? "লাইভ স্কোর আপডেট সফল হয়েছে!" : "Live score updated!")}
                  className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
                >
                  {isBn ? "স্কোরবোর্ড ব্রডকাস্ট করুন" : "Broadcast Live Score"}
                </button>
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* TAB 6: ADMIN: CLUB FINANCE & ACCOUNTS (Admin Only)   */}
          {/* ===================================================== */}
          {activeTab === "admin_finance" && isAdmin && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  FINANCIAL LEDGER
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {isBn ? "ক্লাব ফান্ড, ডোনেশন ও টুর্নামেন্ট বাজেট" : "Club Funds, Donations & Budget"}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-800 uppercase">{isBn ? "মোট তহবিল ব্যালেন্স" : "Current Fund Balance"}</p>
                  <p className="text-2xl font-black text-emerald-700 mt-1">৳ ৪৮,৫০০</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-xs font-bold text-blue-800 uppercase">{isBn ? "এসপিএল স্পন্সরশিপ সংগ্রহ" : "SPL Sponsorship Collected"}</p>
                  <p className="text-2xl font-black text-blue-700 mt-1">৳ ৩২,০০০</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <p className="text-xs font-bold text-amber-800 uppercase">{isBn ? "চলতি মাসের খরচ" : "Monthly Expenses"}</p>
                  <p className="text-2xl font-black text-amber-700 mt-1">৳ ১৪,২০০</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================== */}
      {/* DIGITAL MEMBER ID CARD MODAL                          */}
      {/* ===================================================== */}
      {showMemberIdModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              type="button"
              onClick={() => setShowMemberIdModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* ID Card Front */}
            <div className="bg-gradient-to-tr from-[#006a4e] via-[#059669] to-[#1877F2] text-white p-6 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="relative h-7 w-7">
                    <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                  </div>
                  <div>
                    <h5 className="font-black text-xs uppercase tracking-wider">সাভারচালা শান্তি সংঘ</h5>
                    <p className="text-[9px] text-emerald-200">OFFICIAL MEMBER CARD</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded">2026</span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="relative h-14 w-14 rounded-xl overflow-hidden ring-2 ring-white/60 shrink-0 bg-white">
                  {user?.picture ? (
                    <Image src={user.picture} alt={displayName} fill unoptimized className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-black text-lg text-[#006a4e]">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm truncate">{displayName}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-emerald-200">
                    <span className="font-mono">ID: SS-2026-089</span>
                    <span>•</span>
                    <span className="font-bold">🩸 {formatBloodGroupDisplay(profileForm.bloodGroup)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">
                      {isAdmin ? `👑 ${roleMeta.shortEn}` : "⭐ GENERAL MEMBER"}
                    </span>
                    {profileForm.village && (
                      <span className="text-[9px] bg-white/15 px-1.5 py-0.5 rounded font-semibold truncate max-w-[120px]">
                        📍 {profileForm.village}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-2 flex items-center justify-between text-[9px] text-emerald-100">
                <span>ESTD: 2007 • SHAVARCHALA</span>
                <span>STATUS: {user?.status || "VERIFIED"}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-[#006a4e] hover:bg-[#005a42] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {isBn ? "প্রিন্ট / ডাউনলোড করুন" : "Print ID Card"}
              </button>
              <button
                type="button"
                onClick={() => setShowMemberIdModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                {isBn ? "বন্ধ করুন" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
