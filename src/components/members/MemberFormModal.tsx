"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Save, UserPlus } from "lucide-react";
import MemberImageUploader from "./MemberImageUploader";
import { createMember, updateMember, type Member } from "@/lib/api/members";
import { BLOOD_GROUP_OPTIONS } from "@/lib/bloodGroup";

export interface MemberFormModalProps {
  isOpen: boolean;
  member?: Member | null;
  isBn?: boolean;
  onClose: () => void;
  onSaved: (saved: Member) => void;
}

interface MemberFormData {
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  villageEn: string;
  villageBn: string;
  joiningYear: string;
  phone: string;
  bloodGroup: string;
  category: string;
  image: string;
  imagePublicId: string;
}

const DEFAULT_FORM: MemberFormData = {
  nameEn: "",
  nameBn: "",
  roleEn: "",
  roleBn: "",
  villageEn: "Shavarchala",
  villageBn: "সাভারচালা",
  joiningYear: String(new Date().getFullYear()),
  phone: "",
  bloodGroup: "",
  category: "general",
  image: "",
  imagePublicId: "",
};

export default function MemberFormModal({
  isOpen,
  member,
  isBn = false,
  onClose,
  onSaved,
}: MemberFormModalProps) {
  const isEditing = Boolean(member?.id);

  const [formData, setFormData] = useState<MemberFormData>(DEFAULT_FORM);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form state when opening modal
  useEffect(() => {
    if (isOpen) {
      setFormError(null);
      if (member) {
        setFormData({
          nameEn: member.nameEn || "",
          nameBn: member.nameBn || "",
          roleEn: member.roleEn || "",
          roleBn: member.roleBn || "",
          villageEn: member.villageEn || "Shavarchala",
          villageBn: member.villageBn || "সাভারচালা",
          joiningYear: member.joiningYear || String(new Date().getFullYear()),
          phone: member.phone || "",
          bloodGroup: member.bloodGroup || "",
          category: member.category || "general",
          image: member.image || "",
          imagePublicId: member.imagePublicId || "",
        });
      } else {
        setFormData(DEFAULT_FORM);
      }
    }
  }, [isOpen, member]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting && !isUploadingPhoto) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, isUploadingPhoto, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isUploadingPhoto) return;
    setFormError(null);

    // Validation
    if (!formData.nameEn.trim() || !formData.nameBn.trim()) {
      setFormError(
        isBn
          ? "অনুগ্রহ করে ইংরেজি ও বাংলায় নাম পূরণ করুন।"
          : "Please provide member name in both English and Bengali."
      );
      return;
    }

    if (!formData.roleEn.trim() || !formData.roleBn.trim()) {
      setFormError(
        isBn
          ? "অনুগ্রহ করে পদবী/পদ পূরণ করুন।"
          : "Please provide member role in both English and Bengali."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        nameEn: formData.nameEn.trim(),
        nameBn: formData.nameBn.trim(),
        roleEn: formData.roleEn.trim(),
        roleBn: formData.roleBn.trim(),
        villageEn: formData.villageEn.trim() || "Shavarchala",
        villageBn: formData.villageBn.trim() || "সাভারচালা",
        joiningYear: formData.joiningYear.trim() || "2024",
        image: formData.image || null,
        imagePublicId: formData.imagePublicId || null,
        phone: formData.phone.trim() || null,
        bloodGroup: formData.bloodGroup.trim() || null,
        category: formData.category || "general",
      };

      let result: Member;
      if (isEditing && member?.id) {
        result = await updateMember(member.id, payload);
      } else {
        result = await createMember(payload);
      }

      onSaved(result);
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to save member. Please try again.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#006a4e]/10 text-[#006a4e] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="member-modal-title"
                className="text-base sm:text-lg font-black text-slate-900 leading-tight"
              >
                {isEditing
                  ? isBn
                    ? "সদস্য তথ্য সম্পাদনা"
                    : "Edit Member"
                  : isBn
                  ? "নতুন সদস্য যোগ করুন"
                  : "Add New Member"}
              </h3>
              <p className="text-xs text-slate-400">
                {isBn
                  ? "সদস্যের তথ্য ও ক্লাউডিনারি প্রোফাইল ছবি ব্যবস্থাপনা"
                  : "Member details & Cloudinary profile photo management"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting || isUploadingPhoto}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error Banner */}
          {formError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fadeIn">
              {formError}
            </div>
          )}

          {/* 1. Member Profile Photo (Cloudinary Image Upload Component) */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
            <span className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">
              {isBn ? "প্রোফাইল ছবি / Profile Photo" : "Profile Photo"}
            </span>

            <MemberImageUploader
              currentImageUrl={formData.image}
              currentPublicId={formData.imagePublicId}
              onUploaded={({ url, publicId }) => {
                setFormData((prev) => ({
                  ...prev,
                  image: url,
                  imagePublicId: publicId,
                }));
              }}
              onRemoved={() => {
                setFormData((prev) => ({
                  ...prev,
                  image: "",
                  imagePublicId: "",
                }));
              }}
              isBn={isBn}
              disabled={isSubmitting}
              onUploadingStateChange={setIsUploadingPhoto}
            />
          </div>

          {/* 2. Member Name (English & Bengali) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name (English) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nameEn}
                onChange={(e) =>
                  setFormData({ ...formData, nameEn: e.target.value })
                }
                placeholder="e.g. John Doe"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                পূর্ণ নাম (বাংলা) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nameBn}
                onChange={(e) =>
                  setFormData({ ...formData, nameBn: e.target.value })
                }
                placeholder="যেমন: জন ডো"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* 3. Role / Designation (English & Bengali) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Role / Designation (English) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.roleEn}
                onChange={(e) =>
                  setFormData({ ...formData, roleEn: e.target.value })
                }
                placeholder="e.g. President / Executive Member"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                পদবী (বাংলা) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.roleBn}
                onChange={(e) =>
                  setFormData({ ...formData, roleBn: e.target.value })
                }
                placeholder="যেমন: সভাপতি / সদস্য"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* 4. Village (English & Bengali) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Village (English) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.villageEn}
                onChange={(e) =>
                  setFormData({ ...formData, villageEn: e.target.value })
                }
                placeholder="e.g. Shavarchala"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                গ্রাম (বাংলা) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.villageBn}
                onChange={(e) =>
                  setFormData({ ...formData, villageBn: e.target.value })
                }
                placeholder="যেমন: সাভারচালা"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* 5. Joining Year & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isBn ? "যোগদানের বছর" : "Joining Year"}{" "}
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.joiningYear}
                onChange={(e) =>
                  setFormData({ ...formData, joiningYear: e.target.value })
                }
                placeholder="2020"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isBn ? "ক্যাটাগরি" : "Category"}
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 outline-none transition-all"
              >
                <option value="executive">
                  {isBn ? "কার্যনির্বাহী (Executive)" : "Executive"}
                </option>
                <option value="general">
                  {isBn ? "সাধারণ সদস্য (General)" : "General Member"}
                </option>
                <option value="advisor">
                  {isBn ? "উপদেষ্টা (Advisor)" : "Advisor"}
                </option>
                <option value="player">
                  {isBn ? "খেলোয়াড় (Player)" : "Player"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isBn ? "রক্তের গ্রুপ" : "Blood Group"}
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData({ ...formData, bloodGroup: e.target.value })
                }
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 outline-none transition-all"
              >
                <option value="">{isBn ? "নির্বাচন করুন" : "Select"}</option>
                {BLOOD_GROUP_OPTIONS.map((bg) => (
                  <option key={bg.value} value={bg.value}>
                    {isBn ? bg.labelBn : bg.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isBn ? "মোবাইল নম্বর" : "Phone Number"}
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+880 1..."
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#006a4e] focus:ring-4 focus:ring-[#006a4e]/10 outline-none transition-all"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isUploadingPhoto}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              {isBn ? "বাতিল" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isUploadingPhoto}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#004d38] active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isBn ? "সংরক্ষণ হচ্ছে..." : "Saving..."}</span>
                </>
              ) : isUploadingPhoto ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#f2b705]" />
                  <span>{isBn ? "ছবি আপলোড হচ্ছে..." : "Uploading photo..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>
                    {isEditing
                      ? isBn
                        ? "আপডেট করুন"
                        : "Update Member"
                      : isBn
                      ? "সদস্য যোগ করুন"
                      : "Create Member"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
