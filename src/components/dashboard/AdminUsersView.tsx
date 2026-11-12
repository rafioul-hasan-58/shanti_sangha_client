"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchUsers,
  toggleBlockUserById,
  updateUserById,
} from "@/lib/api/users";
import type {
  ManagedUser,
  UsersPaginationMeta,
  UsersQueryParams,
} from "@/lib/types/dashboard";
import type { Role } from "@/types";
import { FULL_BRAND_NAME_EN } from "@/lib/constants/site";
import WelcomeCard from "./WelcomeCard";
import UserManagementTable from "./UserManagementTable";
import UserManagementCards from "./UserManagementCards";
import UserFilterBar, { type UserFiltersState } from "./UserFilterBar";
import UserPaginationBar from "./UserPaginationBar";
import UserEditModal from "./UserEditModal";
import UserDeleteConfirmModal from "./UserDeleteConfirmModal";

export type UserManagementSubTab = "all" | "pending";

interface AdminUsersViewProps {
  locale?: string;
  currentUserId?: string;
  subTab?: UserManagementSubTab;
  onSubTabChange?: (next: UserManagementSubTab) => void;
}

const DEFAULT_FILTERS: UserFiltersState = {
  search: "",
  status: "ALL",
  role: "ALL",
  membershipType: "ALL",
  bloodGroup: "ALL",
  emailVerified: "ALL",
  sortBy: "createdAt",
  sortOrder: "desc",
  limit: 10,
};

const DEFAULT_META: UsersPaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export default function AdminUsersView({
  locale = "en",
  currentUserId,
  subTab: controlledSubTab,
  onSubTabChange,
}: AdminUsersViewProps) {
  const router = useRouter();
  const isBn = locale === "bn";
  const [internalSubTab, setInternalSubTab] =
    useState<UserManagementSubTab>("all");
  const activeSubTab = controlledSubTab ?? internalSubTab;

  const switchSubTab = (next: UserManagementSubTab) => {
    setInternalSubTab(next);
    setPage(1);
    onSubTabChange?.(next);
  };
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [meta, setMeta] = useState<UsersPaginationMeta>(DEFAULT_META);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFiltersState>(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMockFallback, setIsMockFallback] = useState(false);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);

  // Debounce free-text search so typing doesn't spam GET /users
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const isPendingView = activeSubTab === "pending";

  const handleViewUser = useCallback(
    (target: ManagedUser) => {
      const suffix = isPendingView ? "?from=pending" : "";
      router.push(`/${locale}/dashboard/users/${encodeURIComponent(target.id)}${suffix}`);
    },
    [router, locale, isPendingView]
  );

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const params: UsersQueryParams = {
      page: isPendingView ? 1 : page,
      limit: isPendingView ? 50 : filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (!isPendingView && filters.status !== "ALL") {
      params.status = filters.status;
    }
    if (filters.role !== "ALL") params.role = filters.role;
    if (filters.membershipType !== "ALL") params.membershipType = filters.membershipType;
    if (filters.bloodGroup !== "ALL") params.bloodGroup = filters.bloodGroup;
    if (filters.emailVerified !== "ALL") {
      params.emailVerified = filters.emailVerified === "true";
    }

    try {
      const res = await fetchUsers(params);
      if (isPendingView) {
        const pendingAll = res.users.filter((u) => !u.adminVerified);
        const total = pendingAll.length;
        const limit = filters.limit;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const safePage = Math.min(page, totalPages);
        const sliceStart = (safePage - 1) * limit;

        setUsers(pendingAll.slice(sliceStart, sliceStart + limit));
        setMeta({
          total,
          page: safePage,
          limit,
          totalPages,
          hasNextPage: safePage < totalPages,
          hasPreviousPage: safePage > 1,
        });
      } else {
        setUsers(res.users);
        setMeta(res.meta);
      }
      setIsMockFallback(Boolean(res.isMockFallback));
      setFeedback((prev) => (prev?.type === "error" ? null : prev));
    } catch (err) {
      setUsers([]);
      setMeta(DEFAULT_META);
      setFeedback({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : isBn
              ? "ব্যবহারকারীর তালিকা লোড করা যায়নি।"
              : "Failed to load users.",
      });
    } finally {
      setLoading(false);
    }
  }, [
    isPendingView,
    page,
    filters.limit,
    filters.sortBy,
    filters.sortOrder,
    filters.status,
    filters.role,
    filters.membershipType,
    filters.bloodGroup,
    filters.emailVerified,
    debouncedSearch,
    isBn,
  ]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleFilterChange = <K extends keyof UserFiltersState>(
    key: K,
    value: UserFiltersState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key !== "search") setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDebouncedSearch("");
    setPage(1);
  };

  const handleRoleChange = async (userId: string, nextRole: Role) => {
    const previous = users;
    setBusyUserId(userId);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
    );

    try {
      const result = await updateUserById(userId, { role: nextRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? result.user : u))
      );
      setFeedback({ type: "success", text: result.message });
    } catch (err) {
      setUsers(previous);
      setFeedback({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : isBn
              ? "রোল পরিবর্তন করা যায়নি।"
              : "Failed to update user role.",
      });
    } finally {
      setBusyUserId(null);
    }
  };

  const handleToggleBlock = async (target: ManagedUser) => {
    const previous = users;
    const optimisticStatus =
      target.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    setBusyUserId(target.id);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === target.id ? { ...u, status: optimisticStatus } : u
      )
    );

    try {
      const result = await toggleBlockUserById(target.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === target.id ? result.user : u))
      );
      setFeedback({ type: "success", text: result.message });
    } catch (err) {
      setUsers(previous);
      setFeedback({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : isBn
              ? "স্ট্যাটাস পরিবর্তন করা যায়নি।"
              : "Failed to toggle block status.",
      });
    } finally {
      setBusyUserId(null);
    }
  };

  const handleApproveUser = async (target: ManagedUser) => {
    const previous = users;
    setBusyUserId(target.id);
    setUsers((prev) => prev.filter((u) => u.id !== target.id));

    try {
      const result = await updateUserById(target.id, {
        adminVerified: true,
        status: "ACTIVE",
      });
      setFeedback({
        type: "success",
        text: isBn
          ? `${result.user.fullName} অনুমোদিত ও সক্রিয় করা হয়েছে`
          : `${result.user.fullName} approved & activated`,
      });
    } catch (err) {
      setUsers(previous);
      setFeedback({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : isBn
              ? "ব্যবহারকারী অনুমোদন করা যায়নি।"
              : "Failed to approve user.",
      });
    } finally {
      setBusyUserId(null);
    }
  };

  const handleLimitChange = (nextLimit: number) => {
    setFilters((prev) => ({ ...prev, limit: nextLimit }));
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Themed Banner Header matching Overview */}
      <WelcomeCard
        locale={locale}
        badgeText={
          isBn ? "ইউজার ম্যানেজমেন্ট ও অ্যাক্সেস কন্ট্রোল" : "USER MANAGEMENT SUITE"
        }
        title={isBn ? "ইউজার ম্যানেজমেন্ট" : "User Management"}
        subtitle={
          isBn
            ? "সাভারচালা শান্তি সংঘের নিবন্ধিত সদস্য, অপেক্ষমাণ অনুমোদন, রোল ও অ্যাকাউন্ট স্ট্যাটাস পরিচালনা করুন।"
            : `${FULL_BRAND_NAME_EN} member directory, pending registration approvals, roles & access control.`
        }
        rightContent={
          <div className="flex items-stretch gap-2.5">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-left sm:text-right flex flex-col justify-center">
              <p className="text-[10px] font-bold text-[#f2b705] uppercase tracking-wider">
                {isPendingView
                  ? isBn ? "অপেক্ষমাণ" : "PENDING"
                  : isBn ? "মোট ব্যবহারকারী" : "TOTAL USERS"}
              </p>
              <p className="text-base font-extrabold text-white">
                {meta.total}{" "}
                <span className="text-xs font-semibold text-emerald-100">
                  {isPendingView
                    ? isBn ? "জন" : "Pending"
                    : isBn ? "জন" : "Users"}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadUsers()}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-4 h-4 shrink-0 ${loading ? "animate-spin" : ""}`}
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <polyline points="21 3 21 9 15 9" />
              </svg>
              <span>
                {loading
                  ? isBn ? "লোড হচ্ছে..." : "Loading..."
                  : isBn ? "রিফ্রেশ" : "Refresh"}
              </span>
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xs space-y-5">
        {/* Sub-Tabs Switcher: All Users | Pending Users */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="grid grid-cols-2 sm:inline-flex items-center gap-1.5 p-1 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => switchSubTab("all")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                !isPendingView
                  ? "bg-[#006a4e] text-white shadow-xs"
                  : "text-[var(--text)] hover:text-[#006a4e]"
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{isBn ? "সকল ব্যবহারকারী" : "All Users"}</span>
            </button>
            <button
              type="button"
              onClick={() => switchSubTab("pending")}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPendingView
                  ? "bg-[#006a4e] text-white shadow-xs"
                  : "text-[var(--text)] hover:text-[#006a4e]"
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">{isBn ? "অপেক্ষমাণ ব্যবহারকারী" : "Pending Users"}</span>
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            {isPendingView
              ? isBn ? "অনুমোদনের অপেক্ষায় থাকা সদস্য যাচাই করুন" : "Review and approve awaiting registrations"
              : isBn ? "সকল নিবন্ধিত ব্যবহারকারীর তালিকা পরিচালনা করুন" : "Browse, filter, edit and control user accounts"}
          </span>
        </div>

      {isMockFallback && (
        <div className="rounded-2xl bg-[#f2b705]/15 border border-[#f2b705]/40 px-4 py-2.5 text-xs font-semibold text-[#876200]">
          {isBn
            ? "ব্যাকএন্ড সার্ভারের সাথে সংযোগ পাওয়া যায়নি—নমুনা তালিকা দেখানো হচ্ছে।"
            : "Backend API unreachable — displaying sample preview data."}
        </div>
      )}

      {feedback && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-xs font-bold border ${
            feedback.type === "error"
              ? "bg-[#f42a41]/10 border-[#f42a41]/30 text-[var(--accent)]"
              : "bg-[#006a4e]/10 border-[#006a4e]/25 text-[var(--primary)]"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="opacity-70 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search, Status, Role, Membership, Blood Group, Email Verified, Sort & Limit */}
      <UserFilterBar
        filters={filters}
        isBn={isBn}
        hideStatusFilter={isPendingView}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Top Pagination Bar */}
      <UserPaginationBar
        meta={meta}
        limit={filters.limit}
        loading={loading}
        isBn={isBn}
        isPendingView={isPendingView}
        onPageChange={(nextPage) => setPage(nextPage)}
        onLimitChange={handleLimitChange}
      />

      {/* Users List: Loading / Empty / Desktop Table + Mobile Cards */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-sm text-slate-500">
          {isBn ? "কোনো ব্যবহারকারী পাওয়া যায়নি।" : "No users match your filters."}
        </div>
      ) : (
        <>
          <UserManagementTable
            users={users}
            isBn={isBn}
            currentUserId={currentUserId}
            busyUserId={busyUserId}
            isPendingView={isPendingView}
            onApprove={handleApproveUser}
            onRoleChange={handleRoleChange}
            onToggleBlock={handleToggleBlock}
            onView={handleViewUser}
            onEdit={(u) => setEditingUser(u)}
            onDelete={(u) => setDeletingUser(u)}
          />
          <UserManagementCards
            users={users}
            isBn={isBn}
            currentUserId={currentUserId}
            busyUserId={busyUserId}
            isPendingView={isPendingView}
            onApprove={handleApproveUser}
            onToggleBlock={handleToggleBlock}
            onView={handleViewUser}
            onEdit={(u) => setEditingUser(u)}
            onDelete={(u) => setDeletingUser(u)}
          />
        </>
      )}

      {/* Bottom Pagination Bar */}
      <UserPaginationBar
        meta={meta}
        limit={filters.limit}
        loading={loading}
        isBn={isBn}
        isPendingView={isPendingView}
        onPageChange={(nextPage) => setPage(nextPage)}
        onLimitChange={handleLimitChange}
      />

      {/* Modals */}
      <UserEditModal
        user={editingUser}
        isBn={isBn}
        isSelf={Boolean(currentUserId && editingUser?.id === currentUserId)}
        onClose={() => setEditingUser(null)}
        onSaved={(updated, message) => {
          setUsers((prev) =>
            prev.map((u) => (u.id === updated.id ? updated : u))
          );
          setEditingUser(null);
          setFeedback({ type: "success", text: message });
        }}
      />

      <UserDeleteConfirmModal
        user={deletingUser}
        isBn={isBn}
        onClose={() => setDeletingUser(null)}
        onDeleted={(deleted, message) => {
          setDeletingUser(null);
          setFeedback({ type: "success", text: message });
          if (users.length === 1 && page > 1) {
            setPage((p) => p - 1);
          } else {
            setUsers((prev) => prev.filter((u) => u.id !== deleted.id));
            void loadUsers();
          }
        }}
      />
      </div>
    </div>
  );
}
