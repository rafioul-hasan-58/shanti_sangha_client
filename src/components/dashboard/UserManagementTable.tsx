"use client";

import UserAvatar from "@/components/layout/UserAvatar";
import RoleBadge from "@/components/layout/RoleBadge";
import type { ManagedUser } from "@/lib/types/dashboard";
import type { Role, UserStatus } from "@/types";
import { formatBloodGroupDisplay } from "@/lib/bloodGroup";

const ROLE_OPTIONS: Role[] = ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"];

export const STATUS_BADGE_MAP: Record<
  UserStatus,
  { labelEn: string; labelBn: string; className: string }
> = {
  ACTIVE: {
    labelEn: "Active",
    labelBn: "সক্রিয়",
    className: "bg-[#006a4e]/10 text-[var(--primary)] border-[#006a4e]/25",
  },
  INACTIVE: {
    labelEn: "Inactive",
    labelBn: "নিষ্ক্রিয়",
    className: "bg-[#f2b705]/20 text-[#9c7200] border-[#f2b705]/40",
  },
  SUSPENDED: {
    labelEn: "Suspended",
    labelBn: "স্থগিত",
    className: "bg-[#f42a41]/10 text-[var(--accent)] border-[#f42a41]/30",
  },
};

interface UserManagementTableProps {
  users: ManagedUser[];
  isBn: boolean;
  onRoleChange: (userId: string, role: Role) => void;
  onStatusToggle: (user: ManagedUser) => void;
}

/** Desktop-only responsive table view for all managed users. */
export default function UserManagementTable({
  users,
  isBn,
  onRoleChange,
  onStatusToggle,
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
            <th className="py-3.5 px-4 text-right">{isBn ? "অ্যাকশন" : "Action"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {users.map((u) => {
            const statusMeta = STATUS_BADGE_MAP[u.status] ?? STATUS_BADGE_MAP.ACTIVE;
            const nextStatusActive = u.status !== "ACTIVE";

            return (
              <tr
                key={u.id}
                className="hover:bg-[#f7f4ea]/45 transition-colors"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <UserAvatar
                      src={u.picture}
                      name={u.name}
                      className="h-10 w-10 border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--text)] truncate">{u.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {u.joinedAt ? `${isBn ? "যোগদান:" : "Joined"} ${u.joinedAt}` : u.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <p className="text-xs font-semibold text-slate-700">{u.email}</p>
                  {u.phone && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{u.phone}</p>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <RoleBadge role={u.role} isBn={isBn} />
                    <select
                      aria-label={`${isBn ? "রোল পরিবর্তন" : "Change role for"} ${u.name}`}
                      value={u.role}
                      onChange={(e) => onRoleChange(u.id, e.target.value as Role)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-700 hover:border-[#006a4e]/40 focus:border-[#006a4e] outline-none cursor-pointer"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${statusMeta.className}`}
                  >
                    {isBn ? statusMeta.labelBn : statusMeta.labelEn}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-xs text-slate-600">
                  <span className="font-bold text-slate-800">
                    {formatBloodGroupDisplay(u.bloodGroup)}
                  </span>
                  {u.village && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{u.village}</p>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onStatusToggle(u)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      nextStatusActive
                        ? "bg-[#006a4e] hover:bg-[#004d38] text-white"
                        : "bg-slate-100 hover:bg-[#f42a41]/10 text-slate-700 hover:text-[var(--accent)]"
                    }`}
                  >
                    {nextStatusActive
                      ? isBn
                        ? "সক্রিয় করুন"
                        : "Activate"
                      : isBn
                        ? "স্থগিত করুন"
                        : "Suspend"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

