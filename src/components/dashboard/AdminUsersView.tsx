"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getManagedUsers,
  updateManagedUserRole,
  updateManagedUserStatus,
} from "@/lib/api/dashboard";
import type { ManagedUser } from "@/lib/types/dashboard";
import type { Role, UserStatus } from "@/types";
import UserManagementTable from "./UserManagementTable";
import UserManagementCards from "./UserManagementCards";

interface AdminUsersViewProps {
  locale?: string;
}

const STATUS_FILTERS: Array<{ key: UserStatus | "ALL"; labelEn: string; labelBn: string }> = [
  { key: "ALL", labelEn: "All", labelBn: "সবাই" },
  { key: "ACTIVE", labelEn: "Active", labelBn: "সক্রিয়" },
  { key: "INACTIVE", labelEn: "Inactive", labelBn: "নিষ্ক্রিয়" },
  { key: "SUSPENDED", labelEn: "Suspended", labelBn: "স্থগিত" },
];

export default function AdminUsersView({ locale = "en" }: AdminUsersViewProps) {
  const isBn = locale === "bn";
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL");

  useEffect(() => {
    getManagedUsers()
      .then((list) => setUsers(list))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        (u.village && u.village.toLowerCase().includes(q))
      );
    });
  }, [users, search, statusFilter]);

  const handleRoleChange = async (userId: string, nextRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
    );
    await updateManagedUserRole(userId, nextRole);
  };

  const handleStatusToggle = async (target: ManagedUser) => {
    const nextStatus: UserStatus = target.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setUsers((prev) =>
      prev.map((u) => (u.id === target.id ? { ...u, status: nextStatus } : u))
    );
    await updateManagedUserStatus(target.id, nextStatus);
  };

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
              ? "সকল নিবন্ধিত ব্যবহারকারীর তালিকা, রোল এবং স্ট্যাটাস পরিচালনা করুন"
              : "View and manage all registered users, roles, and account statuses"}
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#006a4e]/10 text-[var(--primary)] text-xs font-extrabold">
          {filteredUsers.length} {isBn ? "জন ব্যবহারকারী" : "Users"}
        </span>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isBn ? "নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..." : "Search by name, email, or phone..."
            }
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-[var(--text)] placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => {
            const active = statusFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  active
                    ? "bg-[var(--primary)] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isBn ? f.labelBn : f.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Users List: Loading / Empty / Desktop Table + Mobile Cards */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-sm text-slate-500">
          {isBn ? "কোনো ব্যবহারকারী পাওয়া যায়নি।" : "No users match your search."}
        </div>
      ) : (
        <>
          <UserManagementTable
            users={filteredUsers}
            isBn={isBn}
            onRoleChange={handleRoleChange}
            onStatusToggle={handleStatusToggle}
          />
          <UserManagementCards
            users={filteredUsers}
            isBn={isBn}
            onRoleChange={handleRoleChange}
            onStatusToggle={handleStatusToggle}
          />
        </>
      )}
    </div>
  );
}

