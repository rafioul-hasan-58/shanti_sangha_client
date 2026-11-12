"use client";

import { useCallback, useEffect, useState } from "react";
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
import UserManagementTable from "./UserManagementTable";
import UserManagementCards from "./UserManagementCards";
import UserFilterBar, { type UserFiltersState } from "./UserFilterBar";
import UserDetailsModal from "./UserDetailsModal";
import UserEditModal from "./UserEditModal";
import UserDeleteConfirmModal from "./UserDeleteConfirmModal";

interface AdminUsersViewProps {
  locale?: string;
  currentUserId?: string;
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
}: AdminUsersViewProps) {
  const isBn = locale === "bn";
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

  const [viewingUser, setViewingUser] = useState<ManagedUser | null>(null);
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

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const params: UsersQueryParams = {
      page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (filters.status !== "ALL") params.status = filters.status;
    if (filters.role !== "ALL") params.role = filters.role;
    if (filters.membershipType !== "ALL") params.membershipType = filters.membershipType;
    if (filters.bloodGroup !== "ALL") params.bloodGroup = filters.bloodGroup;
    if (filters.emailVerified !== "ALL") {
      params.emailVerified = filters.emailVerified === "true";
    }

    try {
      const res = await fetchUsers(params);
      setUsers(res.users);
      setMeta(res.meta);
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
      if (viewingUser?.id === target.id) setViewingUser(result.user);
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

  const startIndex = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const endIndex = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xs space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)] bg-[#006a4e]/10 px-2.5 py-0.5 rounded-full mb-1">
            {isBn ? "অ্যাডমিন কন্ট্রোল" : "Admin Control"}
          </span>
          <h3 className="text-lg sm:text-xl font-black text-[var(--text)]">
            {isBn ? "ইউজার ম্যানেজমেন্ট" : "User Management"}
          </h3>
          <p className="text-xs text-slate-500">
            {isBn
              ? "সকল নিবন্ধিত ব্যবহারকারীর তালিকা, রোল, ভেরিফিকেশন ও স্ট্যাটাস পরিচালনা করুন"
              : "Search, filter, inspect, edit, block/unblock, and manage registered users"}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full bg-[#006a4e]/10 text-[var(--primary)] text-xs font-extrabold">
            {meta.total} {isBn ? "জন ব্যবহারকারী" : "Users"}
          </span>
          <button
            type="button"
            onClick={() => void loadUsers()}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? isBn ? "লোড হচ্ছে..." : "Loading..."
              : isBn ? "রিফ্রেশ" : "Refresh"}
          </button>
        </div>
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
        onChange={handleFilterChange}
        onReset={handleResetFilters}
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
            onRoleChange={handleRoleChange}
            onToggleBlock={handleToggleBlock}
            onView={(u) => setViewingUser(u)}
            onEdit={(u) => setEditingUser(u)}
            onDelete={(u) => setDeletingUser(u)}
          />
          <UserManagementCards
            users={users}
            isBn={isBn}
            currentUserId={currentUserId}
            busyUserId={busyUserId}
            onRoleChange={handleRoleChange}
            onToggleBlock={handleToggleBlock}
            onView={(u) => setViewingUser(u)}
            onEdit={(u) => setEditingUser(u)}
            onDelete={(u) => setDeletingUser(u)}
          />
        </>
      )}

      {/* Pagination Footer */}
      {meta.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <p className="font-semibold">
            {isBn
              ? `মোট ${meta.total} জনের মধ্যে ${startIndex}–${endIndex} দেখানো হচ্ছে`
              : `Showing ${startIndex}–${endIndex} of ${meta.total} users`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!meta.hasPreviousPage || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
            >
              {isBn ? "← পূর্ববর্তী" : "← Previous"}
            </button>
            <span className="px-2.5 font-extrabold text-[var(--text)]">
              {meta.page} / {meta.totalPages}
            </span>
            <button
              type="button"
              disabled={!meta.hasNextPage || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
            >
              {isBn ? "পরবর্তী →" : "Next →"}
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <UserDetailsModal
        user={viewingUser}
        isBn={isBn}
        isSelf={Boolean(currentUserId && viewingUser?.id === currentUserId)}
        onClose={() => setViewingUser(null)}
        onEdit={(u) => {
          setViewingUser(null);
          setEditingUser(u);
        }}
        onToggleBlock={(u) => void handleToggleBlock(u)}
        onDelete={(u) => {
          setViewingUser(null);
          setDeletingUser(u);
        }}
      />

      <UserEditModal
        user={editingUser}
        isBn={isBn}
        isSelf={Boolean(currentUserId && editingUser?.id === currentUserId)}
        onClose={() => setEditingUser(null)}
        onSaved={(updated, message) => {
          setUsers((prev) =>
            prev.map((u) => (u.id === updated.id ? updated : u))
          );
          if (viewingUser?.id === updated.id) setViewingUser(updated);
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
  );
}
