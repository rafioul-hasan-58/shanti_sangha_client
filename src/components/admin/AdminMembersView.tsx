"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Building,
  Calendar,
  Phone,
} from "lucide-react";
import {
  fetchMembers,
  deleteMember,
  type Member,
} from "@/lib/api/members";
import MemberFormModal from "@/components/members/MemberFormModal";

interface AdminMembersViewProps {
  locale: string;
}

export default function AdminMembersView({ locale }: AdminMembersViewProps) {
  const isBn = locale === "bn";

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMembers();
      setMembers(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load members.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingMember(member);
    setModalOpen(true);
  };

  const handleDelete = async (member: Member) => {
    const confirmMessage = isBn
      ? `আপনি কি নিশ্চিতভাবে "${member.nameBn || member.nameEn}" সদস্যকে মুছে ফেলতে চান? ক্লাউডিনারি থেকে ছবি সহ তথ্য সম্পূর্ণ মুছে যাবে।`
      : `Are you sure you want to delete member "${member.nameEn}"? The profile photo on Cloudinary will also be deleted.`;

    if (!window.confirm(confirmMessage)) return;

    setDeletingId(member.id);
    try {
      await deleteMember(member.id);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    } catch {
      alert(
        isBn
          ? "সদস্য মুছে ফেলতে সমস্যা হয়েছে।"
          : "Failed to delete member. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSavedMember = (saved: Member) => {
    setMembers((prev) => {
      const exists = prev.some((m) => m.id === saved.id);
      if (exists) {
        return prev.map((m) => (m.id === saved.id ? saved : m));
      }
      return [saved, ...prev];
    });
  };

  // Filter members by search query
  const filteredMembers = members.filter((m) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      m.nameEn?.toLowerCase().includes(query) ||
      m.nameBn?.toLowerCase().includes(query) ||
      m.roleEn?.toLowerCase().includes(query) ||
      m.roleBn?.toLowerCase().includes(query) ||
      m.villageEn?.toLowerCase().includes(query) ||
      m.villageBn?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#12231d] flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#006a4e]" />
            <span>{isBn ? "সদস্য ব্যবস্থাপনা" : "Member Management"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isBn
              ? "ক্লাব সদস্য তালিকা, ক্লাউডিনারি প্রোফাইল ছবি এবং বিবরণ পরিচালনা করুন"
              : "Manage member profiles, upload and replace Cloudinary photos"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#004d38] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705]"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isBn ? "নতুন সদস্য যোগ করুন" : "Add Member"}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isBn ? "নাম বা পদবী দিয়ে খুঁজুন..." : "Search by name or role..."
            }
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] outline-none transition-all"
          />
        </div>

        <div className="text-xs font-bold text-slate-500">
          {isBn
            ? `মোট সদস্য: ${filteredMembers.length} জন`
            : `Total: ${filteredMembers.length} members`}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-[#006a4e] animate-spin" />
          <p className="text-xs font-bold text-slate-500">
            {isBn ? "সদস্যদের তথ্য লোড হচ্ছে..." : "Loading members..."}
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-[#f42a41] mx-auto" />
          <p className="text-sm font-bold text-[#f42a41]">{error}</p>
          <button
            type="button"
            onClick={loadMembers}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006a4e] text-white text-xs font-bold hover:bg-[#004d38] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isBn ? "পুনরায় চেষ্টা করুন" : "Retry"}</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredMembers.length === 0 && (
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3 p-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">
            {isBn
              ? "কোন সদস্য পাওয়া যায়নি"
              : "No members found in directory"}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006a4e] text-white text-xs font-bold hover:bg-[#004d38] transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isBn ? "প্রথম সদস্য যোগ করুন" : "Add First Member"}</span>
          </button>
        </div>
      )}

      {/* Members Grid */}
      {!loading && !error && filteredMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Photo and Badges */}
                <div className="flex items-start gap-3.5 mb-3.5">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-3 ring-[#006a4e]/20 bg-[#006a4e] shrink-0">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.nameEn}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-black text-xl">
                        {(member.nameEn || "M").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {isBn ? member.nameBn || member.nameEn : member.nameEn}
                    </h3>
                    <p className="text-xs text-[#006a4e] font-semibold truncate mt-0.5">
                      {isBn ? member.roleBn || member.roleEn : member.roleEn}
                    </p>

                    {member.imagePublicId && (
                      <span className="inline-block mt-1 px-2 py-0.2 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200/60 truncate max-w-[170px]">
                        ☁️ Cloudinary ID
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Fields */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {isBn ? member.villageBn : member.villageEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {isBn
                        ? `যোগদান: ${member.joiningYear}`
                        : `Joined: ${member.joiningYear}`}
                    </span>
                  </div>

                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Edit and Delete */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(member)}
                  disabled={deletingId === member.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isBn ? "সম্পাদনা" : "Edit"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(member)}
                  disabled={deletingId === member.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#f42a41] border border-red-200 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {deletingId === member.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>{isBn ? "মুছুন" : "Delete"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Create / Edit Modal Dialog with Cloudinary Image Uploader */}
      <MemberFormModal
        isOpen={modalOpen}
        member={editingMember}
        isBn={isBn}
        onClose={() => setModalOpen(false)}
        onSaved={handleSavedMember}
      />
    </div>
  );
}

