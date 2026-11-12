"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BLOOD_GROUP_OPTIONS, toPrismaBloodGroup } from "@/lib/bloodGroup";
import { updateUserById } from "@/lib/api/users";
import type {
  ManagedUser,
  UpdateManagedUserPayload,
} from "@/lib/types/dashboard";
import type { BloodGroup, MembershipType, Role, UserStatus } from "@/types";
import {
  MEMBERSHIP_OPTIONS,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
} from "./userManagementConfig";

interface UserEditModalProps {
  user: ManagedUser | null;
  isBn: boolean;
  isSelf: boolean;
  onClose: () => void;
  onSaved: (updated: ManagedUser, message: string) => void;
}

interface EditFormState {
  fullName: string;
  fatherName: string;
  motherName: string;
  phoneNumber: string;
  whatsappNumber: string;
  bloodGroup: BloodGroup;
  membershipType: MembershipType;
  profession: string;
  village: string;
  currentLocation: string;
  profileImage: string;
  facebookProfile: string;
  summary: string;
  bio: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  adminVerified: boolean;
}

function buildInitialState(u: ManagedUser): EditFormState {
  return {
    fullName: u.fullName || "",
    fatherName: u.fatherName || "",
    motherName: u.motherName || "",
    phoneNumber: u.phoneNumber || "",
    whatsappNumber: u.whatsappNumber || "",
    bloodGroup: toPrismaBloodGroup(u.bloodGroup),
    membershipType: u.membershipType ?? "PERMANENT",
    profession: u.profession || "",
    village: u.village || "",
    currentLocation: u.currentLocation || "",
    profileImage: u.profileImage || u.picture || "",
    facebookProfile: u.facebookProfile || "",
    summary: u.summary || "",
    bio: u.bio || "",
    role: u.role,
    status: u.status,
    emailVerified: Boolean(u.emailVerified),
    adminVerified: Boolean(u.adminVerified),
  };
}

const INPUT_CLASS =
  "w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-[var(--text)] focus:bg-white focus:border-[#006a4e] outline-none transition-colors";
const LABEL_CLASS =
  "block text-[11px] font-extrabold uppercase tracking-wide text-slate-500 mb-1";

/**
 * Full UpdateUserDto edit modal wired to `PATCH /api/v1/users/:id`.
 */
export default function UserEditModal({
  user,
  isBn,
  isSelf,
  onClose,
  onSaved,
}: UserEditModalProps) {
  const [form, setForm] = useState<EditFormState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm(buildInitialState(user));
      setError(null);
    } else {
      setForm(null);
    }
  }, [user]);

  if (!user || !form) return null;

  const setField = <K extends keyof EditFormState>(key: K, val: EditFormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: val } : prev));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const trimmedName = form.fullName.trim();
    if (trimmedName.length < 2) {
      setError(
        isBn
          ? "পুরো নাম কমপক্ষে ২ অক্ষরের হতে হবে।"
          : "Full name must be at least 2 characters."
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload: UpdateManagedUserPayload = {
        fullName: trimmedName,
        fatherName: form.fatherName,
        motherName: form.motherName,
        phoneNumber: form.phoneNumber,
        whatsappNumber: form.whatsappNumber,
        bloodGroup: form.bloodGroup,
        membershipType: form.membershipType,
        profession: form.profession,
        village: form.village,
        currentLocation: form.currentLocation,
        profileImage: form.profileImage,
        facebookProfile: form.facebookProfile,
        summary: form.summary,
        bio: form.bio,
        emailVerified: form.emailVerified,
        adminVerified: form.adminVerified,
      };

      if (!isSelf) {
        payload.role = form.role;
      }
      if (!(isSelf && form.status === "SUSPENDED")) {
        payload.status = form.status;
      }

      const result = await updateUserById(user.id, payload);
      onSaved(result.user, result.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isBn
            ? "ব্যবহারকারীর তথ্য আপডেট করা যায়নি।"
            : "Failed to update user."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-lg font-black text-[var(--text)]">
              {isBn ? "ব্যবহারকারীর তথ্য এডিট করুন" : "Edit User Profile & Controls"}
            </h4>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-[#f42a41]/10 border border-[#f42a41]/30 px-3.5 py-2.5 text-xs font-bold text-[var(--accent)]">
            {error}
          </div>
        )}

        {/* Admin Controls Section */}
        <div className="rounded-2xl bg-[#f7f4ea]/65 border border-[#006a4e]/15 p-3.5 space-y-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
            {isBn ? "অ্যাডমিন কন্ট্রোল" : "Administrative Controls"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={LABEL_CLASS}>{isBn ? "রোল" : "Role"}</label>
              <select
                disabled={isSelf}
                value={form.role}
                onChange={(e) => setField("role", e.target.value as Role)}
                className={`${INPUT_CLASS} disabled:opacity-60`}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {isSelf && (
                <p className="text-[10px] text-slate-400 mt-1">
                  {isBn ? "নিজের রোল পরিবর্তন করা যায় না" : "Cannot change your own role"}
                </p>
              )}
            </div>

            <div>
              <label className={LABEL_CLASS}>{isBn ? "স্ট্যাটাস" : "Status"}</label>
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value as UserStatus)}
                className={INPUT_CLASS}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} disabled={isSelf && s === "SUSPENDED"}>
                    {s}
                  </option>
                ))}
              </select>
              {isSelf && (
                <p className="text-[10px] text-slate-400 mt-1">
                  {isBn ? "নিজেকে সাসপেন্ড করা যায় না" : "Cannot suspend own account"}
                </p>
              )}
            </div>

            <div>
              <label className={LABEL_CLASS}>
                {isBn ? "মেম্বারশিপ ধরন" : "Membership Type"}
              </label>
              <select
                value={form.membershipType}
                onChange={(e) =>
                  setField("membershipType", e.target.value as MembershipType)
                }
                className={INPUT_CLASS}
              >
                {MEMBERSHIP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {isBn ? opt.labelBn : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 pt-1">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.emailVerified}
                onChange={(e) => setField("emailVerified", e.target.checked)}
                className="h-4 w-4 accent-[#006a4e] rounded"
              />
              <span>{isBn ? "ইমেইল ভেরিফায়েড" : "Email Verified"}</span>
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.adminVerified}
                onChange={(e) => setField("adminVerified", e.target.checked)}
                className="h-4 w-4 accent-[#006a4e] rounded"
              />
              <span>{isBn ? "অ্যাডমিন অনুমোদিত" : "Admin Verified"}</span>
            </label>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>{isBn ? "পুরো নাম *" : "Full Name *"}</label>
            <input
              type="text"
              required
              minLength={2}
              value={form.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>{isBn ? "রক্তের গ্রুপ" : "Blood Group"}</label>
            <select
              value={form.bloodGroup}
              onChange={(e) => setField("bloodGroup", e.target.value as BloodGroup)}
              className={INPUT_CLASS}
            >
              {BLOOD_GROUP_OPTIONS.map((bg) => (
                <option key={bg.value} value={bg.value}>
                  {isBn ? bg.labelBn : bg.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL_CLASS}>{isBn ? "ফোন নম্বর" : "Phone Number"}</label>
            <input
              type="text"
              value={form.phoneNumber}
              onChange={(e) => setField("phoneNumber", e.target.value)}
              placeholder="+88017..."
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>{isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp Number"}</label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) => setField("whatsappNumber", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>{isBn ? "পিতার নাম" : "Father's Name"}</label>
            <input
              type="text"
              value={form.fatherName}
              onChange={(e) => setField("fatherName", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>{isBn ? "মাতার নাম" : "Mother's Name"}</label>
            <input
              type="text"
              value={form.motherName}
              onChange={(e) => setField("motherName", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>{isBn ? "পেশা" : "Profession"}</label>
            <input
              type="text"
              value={form.profession}
              onChange={(e) => setField("profession", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>{isBn ? "গ্রাম" : "Village"}</label>
            <input
              type="text"
              value={form.village}
              onChange={(e) => setField("village", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>{isBn ? "বর্তমান ঠিকানা" : "Current Location"}</label>
            <input
              type="text"
              value={form.currentLocation}
              onChange={(e) => setField("currentLocation", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>{isBn ? "ফেসবুক প্রোফাইল" : "Facebook Profile URL"}</label>
            <input
              type="text"
              value={form.facebookProfile}
              onChange={(e) => setField("facebookProfile", e.target.value)}
              placeholder="https://facebook.com/..."
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label className={LABEL_CLASS}>{isBn ? "প্রোফাইল ছবির লিংক" : "Profile Image URL"}</label>
          <input
            type="text"
            value={form.profileImage}
            onChange={(e) => setField("profileImage", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>{isBn ? "সংক্ষিপ্ত পরিচিতি" : "Summary"}</label>
          <input
            type="text"
            value={form.summary}
            onChange={(e) => setField("summary", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>{isBn ? "বায়ো" : "Bio"}</label>
          <textarea
            rows={2}
            value={form.bio}
            onChange={(e) => setField("bio", e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-[var(--text)] focus:bg-white focus:border-[#006a4e] outline-none transition-colors"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
          >
            {isBn ? "বাতিল" : "Cancel"}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-[#006a4e] hover:bg-[#004d38] text-white text-xs font-bold transition-colors disabled:opacity-60 cursor-pointer"
          >
            {submitting
              ? isBn ? "সংরক্ষণ হচ্ছে..." : "Saving..."
              : isBn ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

