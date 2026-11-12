"use client";

import UserAvatar from "@/components/layout/UserAvatar";
import RoleBadge from "@/components/layout/RoleBadge";
import type { ManagedUser } from "@/lib/types/dashboard";
import type { Role } from "@/types";
import { formatBloodGroupDisplay } from "@/lib/bloodGroup";
import { STATUS_BADGE_MAP } from "./UserManagementTable";

const ROLE_OPTIONS: Role[] = ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"];

interface UserManagementCardsProps {
  users: ManagedUser[];
  isBn: boolean;
  onRoleChange: (userId: string, role: Role) => void;
  onStatusToggle: (user: ManagedUser) => void;
}

/** Mobile-only card list view for all managed users. */
export default function UserManagementCards({
  users,
  isBn,
  onRoleChange,
  onStatusToggle,
}: UserManagementCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
      {users.map((u) => {
        const statusMeta = STATUS_BADGE_MAP[u.status] ?? STATUS_BADGE_MAP.ACTIVE;
        const nextStatusActive = u.status !== "ACTIVE";

        return (
          <div
            key={u.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3"
          >
            {/* Card Header: Avatar, Name & Status */}
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <UserAvatar
                  src={u.picture}
                  name={u.name}
                  className="h-10 w-10 border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[var(--text)] truncate">
                    {u.name}
                  </h4>
                  <div className="mt-0.5">
                    <RoleBadge role={u.role} isBn={isBn} />
                  </div>
                </div>
              </div>

              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusMeta.className}`}
              >
                {isBn ? statusMeta.labelBn : statusMeta.labelEn}
              </span>
            </div>

            {/* Contact & Meta */}
            <div className="space-y-1 rounded-xl bg-[#f7f4ea]/60 p-2.5 text-xs text-slate-600">
              <p className="font-semibold text-slate-800 truncate">{u.email}</p>
              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>{u.phone || (u.village ? `📍 ${u.village}` : "—")}</span>
                <span className="font-bold text-slate-700">
                  🩸 {formatBloodGroupDisplay(u.bloodGroup)}
                </span>
              </div>
            </div>

            {/* Card Footer: Role Selector & Status Toggle */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <select
                aria-label={`${isBn ? "রোল পরিবর্তন" : "Change role for"} ${u.name}`}
                value={u.role}
                onChange={(e) => onRoleChange(u.id, e.target.value as Role)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:border-[#006a4e] outline-none"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

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
            </div>
          </div>
        );
      })}
    </div>
  );
}

