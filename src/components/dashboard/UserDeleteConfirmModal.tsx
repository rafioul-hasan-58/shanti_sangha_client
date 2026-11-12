"use client";

import { useState } from "react";
import { deleteUserById } from "@/lib/api/users";
import type { ManagedUser } from "@/lib/types/dashboard";

interface UserDeleteConfirmModalProps {
  user: ManagedUser | null;
  isBn: boolean;
  onClose: () => void;
  onDeleted: (deletedUser: ManagedUser, message: string) => void;
}

/**
 * Confirmation modal before permanently deleting a user via `DELETE /api/v1/users/:id`.
 */
export default function UserDeleteConfirmModal({
  user,
  isBn,
  onClose,
  onDeleted,
}: UserDeleteConfirmModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await deleteUserById(user.id);
      onDeleted(result.user, result.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isBn
            ? "ব্যবহারকারী মুছে ফেলা যায়নি।"
            : "Failed to delete user."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#f42a41]/10 text-[var(--accent)] flex items-center justify-center shrink-0 font-black text-lg">
            !
          </div>
          <div>
            <h4 className="text-base font-black text-[var(--text)]">
              {isBn ? "ব্যবহারকারী স্থায়ীভাবে মুছবেন?" : "Delete User Permanently?"}
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              {isBn
                ? `আপনি কি নিশ্চিত যে আপনি "${user.fullName}" (${user.email}) কে স্থায়ীভাবে মুছে ফেলতে চান? এই কাজটি আর ফিরিয়ে নেওয়া যাবে না।`
                : `Are you sure you want to permanently delete "${user.fullName}" (${user.email})? This action cannot be undone.`}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-[#f42a41]/10 border border-[#f42a41]/30 px-3 py-2 text-xs font-bold text-[var(--accent)]">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
          >
            {isBn ? "বাতিল" : "Cancel"}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-[#f42a41] hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-60 cursor-pointer"
          >
            {submitting
              ? isBn ? "মুছে ফেলা হচ্ছে..." : "Deleting..."
              : isBn ? "স্থায়ীভাবে মুছুন" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

