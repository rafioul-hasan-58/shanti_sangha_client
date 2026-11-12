"use client";

import UserAvatar from "@/components/layout/UserAvatar";
import RoleBadge from "@/components/layout/RoleBadge";
import ThemedSelect from "@/components/common/ThemedSelect";
import type { ManagedUser } from "@/lib/types/dashboard";
import type { Role } from "@/types";
import { formatBloodGroupDisplay } from "@/lib/bloodGroup";
import {
  MEMBERSHIP_BADGE_MAP,
  ROLE_OPTIONS,
  STATUS_BADGE_MAP,
} from "./userManagementConfig";

interface UserManagementTableProps {
  users: ManagedUser[];
  isBn: boolean;
  currentUserId?: string;
  busyUserId?: string | null;
  onRoleChange: (userId: string, role: Role) => void;
  onToggleBlock: (user: ManagedUser) => void;
  onView: (user: ManagedUser) => void;
  onEdit: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}

/** Desktop-only responsive table view for all managed users. */
export default function UserManagementTable({
  users,
  isBn,
  currentUserId,
  busyUserId,
  onRoleChange,
  onToggleBlock,
  onView,
  onEdit,
  onDelete,
}: UserManagementTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            <th className="py-3.5 px-4">{isBn ? "সদস্য" : "User"}</th>
            <th className="py-3.5 px-4">{isBn ? "যোগাযোগ" : "Contact"}</th>
            <th className="py-3.5 px-4">{isBn ? "রোল" : "Role"}</th>
            <th className="py-3.5 px-4">{isBn ? "স্ট্যাটাস" : "Status"}</th>
            <th className="py-3.5 px-4">{isBn ? "রক্ত ও ঠিকানা" : "Blood & Area"}</th>
            <th className="py-3.5 px-4 text-right">{isBn ? "অ্যাকশন" : "Actions"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {users.map((u) => {
            const statusMeta = STATUS_BADGE_MAP[u.status] ?? STATUS_BADGE_MAP.ACTIVE;
            const membershipMeta = u.membershipType
              ? MEMBERSHIP_BADGE_MAP[u.membershipType]
              : null;
            const isBlocked = u.status === "SUSPENDED";
            const isSelf = Boolean(currentUserId && currentUserId === u.id);
            const isBusy = busyUserId === u.id;

            return (
              <tr key={u.id} className="hover:bg-[#f7f4ea]/45 transition-colors">
                <td className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => onView(u)}
                    className="flex items-center gap-3 min-w-[190px] text-left group cursor-pointer"
                  >
                    <UserAvatar
                      src={u.profileImage || u.picture}
                      name={u.fullName}
                      className="h-10 w-10 border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-[var(--text)] truncate group-hover:text-[var(--primary)]">
                          {u.fullName}
                        </p>
                        {isSelf && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {isBn ? "আপনি" : "You"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        {membershipMeta && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${membershipMeta.className}`}>
                            {isBn ? membershipMeta.labelBn : membershipMeta.labelEn}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-medium">
                          {u.joinedAt ? u.joinedAt : u.id}
                        </span>
                      </div>
                    </div>
                  </button>
                </td>

                <td className="py-3.5 px-4">
                  <p className="text-xs font-semibold text-slate-700">{u.email}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                    {u.phoneNumber && <span>{u.phoneNumber}</span>}
                    {u.profession && <span>• {u.profession}</span>}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <RoleBadge role={u.role} isBn={isBn} />
                    <ThemedSelect
                      ariaLabel={`${isBn ? "রোল পরিবর্তন" : "Change role for"} ${u.fullName}`}
                      value={u.role}
                      disabled={isSelf || isBusy}
                      size="xs"
                      onChange={(nextRole) => onRoleChange(u.id, nextRole as Role)}
                      options={ROLE_OPTIONS.map((r) => ({ value: r, label: r }))}
                    />
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex flex-col items-start gap-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${statusMeta.className}`}
                    >
                      {isBn ? statusMeta.labelBn : statusMeta.labelEn}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                      <span>{u.emailVerified ? "✓ Email" : "✕ Email"}</span>
                      {u.adminVerified && <span className="text-[#006a4e]">• ✓ Admin</span>}
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-xs text-slate-600">
                  <span className="font-bold text-slate-800">
                    {formatBloodGroupDisplay(u.bloodGroup)}
                  </span>
                  {(u.village || u.currentLocation) && (
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[160px]">
                      {[u.village, u.currentLocation].filter(Boolean).join(", ")}
                    </p>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onView(u)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isBn ? "দেখুন" : "View"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(u)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#006a4e]/10 hover:bg-[#006a4e] text-[var(--primary)] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isBn ? "এডিট" : "Edit"}
                    </button>
                    <button
                      type="button"
                      disabled={isSelf || isBusy}
                      onClick={() => onToggleBlock(u)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer ${
                        isBlocked
                          ? "bg-[#006a4e] hover:bg-[#004d38] text-white"
                          : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {isBlocked
                        ? isBn ? "আনব্লক" : "Unblock"
                        : isBn ? "ব্লক" : "Block"}
                    </button>
                    <button
                      type="button"
                      disabled={isSelf || isBusy}
                      onClick={() => onDelete(u)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#f42a41]/10 hover:bg-[#f42a41] text-[var(--accent)] hover:text-white text-xs font-bold transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isBn ? "মুছুন" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
