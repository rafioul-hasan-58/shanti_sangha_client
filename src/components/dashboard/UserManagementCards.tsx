"use client";

import UserAvatar from "@/components/layout/UserAvatar";
import RoleBadge from "@/components/layout/RoleBadge";
import ThemedSelect from "@/components/common/ThemedSelect";
import VerifiedTick from "@/components/common/VerifiedTick";
import { isAdminVerified } from "@/lib/authRole";
import type { ManagedUser } from "@/lib/types/dashboard";
import type { Role } from "@/types";
import { formatBloodGroupDisplay } from "@/lib/bloodGroup";
import {
  MEMBERSHIP_BADGE_MAP,
  ROLE_OPTIONS,
  STATUS_BADGE_MAP,
} from "./userManagementConfig";

interface UserManagementCardsProps {
  users: ManagedUser[];
  isBn: boolean;
  currentUserId?: string;
  busyUserId?: string | null;
  isPendingView?: boolean;
  onApprove?: (user: ManagedUser) => void;
  onRoleChange: (userId: string, role: Role) => void;
  onToggleBlock: (user: ManagedUser) => void;
  onView: (user: ManagedUser) => void;
  onEdit: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}

/** Mobile-only card list view for all managed users. */
export default function UserManagementCards({
  users,
  isBn,
  currentUserId,
  busyUserId,
  isPendingView = false,
  onApprove,
  onRoleChange,
  onToggleBlock,
  onView,
  onEdit,
  onDelete,
}: UserManagementCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
      {users.map((u) => {
        const statusMeta = STATUS_BADGE_MAP[u.status] ?? STATUS_BADGE_MAP.ACTIVE;
        const membershipMeta = u.membershipType
          ? MEMBERSHIP_BADGE_MAP[u.membershipType]
          : null;
        const isBlocked = u.status === "SUSPENDED";
        const isSelf = Boolean(currentUserId && currentUserId === u.id);
        const isBusy = busyUserId === u.id;

        return (
          <div
            key={u.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3"
          >
            {/* Card Header: Avatar, Name & Status */}
            <div className="flex items-start justify-between gap-2.5">
              <button
                type="button"
                onClick={() => onView(u)}
                className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
              >
                <UserAvatar
                  src={u.profileImage || u.picture}
                  name={u.fullName}
                  className="h-10 w-10 border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h4 className="font-bold text-sm text-[var(--text)] truncate">
                      {u.fullName}
                    </h4>
                    {isAdminVerified(u.adminVerified) && (
                      <VerifiedTick isBn={isBn} className="w-3.5 h-3.5" />
                    )}
                    {isSelf && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0">
                        {isBn ? "আপনি" : "You"}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 flex-wrap">
                    <RoleBadge role={u.role} isBn={isBn} />
                    {membershipMeta && (
                      <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold ${membershipMeta.className}`}>
                        {isBn ? membershipMeta.labelBn : membershipMeta.labelEn}
                      </span>
                    )}
                  </div>
                </div>
              </button>

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
                <span className="truncate">
                  {u.phoneNumber || (u.village ? `📍 ${u.village}` : "—")}
                </span>
                <span className="font-bold text-slate-700 shrink-0">
                  🩸 {formatBloodGroupDisplay(u.bloodGroup)}
                </span>
              </div>
            </div>

            {/* Role Selector */}
            <div className="flex items-center gap-2">
              <ThemedSelect
                ariaLabel={`${isBn ? "রোল পরিবর্তন" : "Change role for"} ${u.fullName}`}
                value={u.role}
                disabled={isSelf || isBusy}
                className="flex-1"
                onChange={(nextRole) => onRoleChange(u.id, nextRole as Role)}
                options={ROLE_OPTIONS.map((r) => ({ value: r, label: r }))}
              />

              <button
                type="button"
                disabled={isSelf || isBusy}
                onClick={() => onToggleBlock(u)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-45 cursor-pointer ${
                  isBlocked
                    ? "bg-[#006a4e] hover:bg-[#004d38] text-white"
                    : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                {isBlocked
                  ? isBn ? "আনব্লক" : "Unblock"
                  : isBn ? "ব্লক" : "Block"}
              </button>
            </div>

            {/* Card Action Row */}
            {isPendingView && onApprove && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => onApprove(u)}
                className="w-full py-2 rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white text-xs font-bold transition-colors disabled:opacity-45 cursor-pointer"
              >
                {isBn ? "✓ অনুমোদন করুন (Approve)" : "✓ Approve User"}
              </button>
            )}

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onView(u)}
                className="py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                {isBn ? "দেখুন" : "View"}
              </button>
              <button
                type="button"
                onClick={() => onEdit(u)}
                className="py-1.5 rounded-xl bg-[#006a4e]/10 hover:bg-[#006a4e] text-[var(--primary)] hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {isBn ? "এডিট" : "Edit"}
              </button>
              <button
                type="button"
                disabled={isSelf || isBusy}
                onClick={() => onDelete(u)}
                className="py-1.5 rounded-xl bg-[#f42a41]/10 hover:bg-[#f42a41] text-[var(--accent)] hover:text-white text-xs font-bold transition-colors disabled:opacity-45 cursor-pointer"
              >
                {isBn ? "মুছুন" : "Delete"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
