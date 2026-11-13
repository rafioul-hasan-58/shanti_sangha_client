"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Camera,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  Loader2,
} from "lucide-react";
import {
  uploadProfilePhoto,
  deleteProfilePhoto,
  validateMemberImageFile,
  UploadError,
  MAX_MEMBER_IMAGE_SIZE_BYTES,
} from "@/lib/api/upload";

export interface MemberImageUploaderProps {
  currentImageUrl?: string | null;
  currentPublicId?: string | null;
  onUploaded: (data: { url: string; publicId: string }) => void;
  onRemoved: () => void;
  isBn?: boolean;
  disabled?: boolean;
  className?: string;
  onUploadingStateChange?: (uploading: boolean) => void;
}

export default function MemberImageUploader({
  currentImageUrl,
  currentPublicId,
  onUploaded,
  onRemoved,
  isBn = false,
  disabled = false,
  className = "",
  onUploadingStateChange,
}: MemberImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<{
    en: string;
    bn: string;
    code?: number;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<{
    en: string;
    bn: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeBlobUrlRef = useRef<string | null>(null);
  const lastSelectedFileRef = useRef<File | null>(null);

  // Sync external currentImageUrl changes
  useEffect(() => {
    if (!isUploading) {
      setPreviewUrl(currentImageUrl || null);
    }
  }, [currentImageUrl, isUploading]);

  // Notify parent of upload state so parent form can disable submit button
  useEffect(() => {
    onUploadingStateChange?.(isUploading || isDeleting);
  }, [isUploading, isDeleting, onUploadingStateChange]);

  // Clean up object URLs
  const cleanupBlobUrl = useCallback(() => {
    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupBlobUrl();
    };
  }, [cleanupBlobUrl]);

  const executeUpload = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUploading(true);
    setProgressPercent(10);

    try {
      // Direct call to POST /api/v1/upload/profile with oldPublicId if replacing
      const result = await uploadProfilePhoto({
        file,
        oldPublicId: currentPublicId,
        onProgress: (percent) => {
          setProgressPercent(Math.max(10, percent));
        },
      });

      // Update state upon 200 OK
      setPreviewUrl(result.url);
      cleanupBlobUrl();
      onUploaded({ url: result.url, publicId: result.publicId });

      setSuccessMessage({
        en: "Profile photo uploaded to Cloudinary successfully!",
        bn: "ছবি সফলভাবে ক্লাউডিনারিতে আপলোড হয়েছে!",
      });

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      cleanupBlobUrl();
      // Revert preview on failure
      setPreviewUrl(currentImageUrl || null);

      if (err instanceof UploadError) {
        setErrorMessage({
          en: err.messageEn,
          bn: err.messageBn,
          code: err.statusCode,
        });
      } else {
        const fallbackMsg =
          err instanceof Error
            ? err.message
            : "Upload failed. Please check your network and try again.";
        setErrorMessage({
          en: fallbackMsg,
          bn: "ছবি আপলোড করতে ব্যর্থ হয়েছে। নেটওয়ার্ক পরীক্ষা করে পুনরায় চেষ্টা করুন।",
        });
      }
    } finally {
      setIsUploading(false);
      setProgressPercent(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Client-side Validation (File size <= 2MB & format check)
    const validation = validateMemberImageFile(file);
    if (!validation.valid && validation.errorEn && validation.errorBn) {
      setErrorMessage({
        en: validation.errorEn,
        bn: validation.errorBn,
        code: validation.statusCode,
      });
      return;
    }

    lastSelectedFileRef.current = file;

    // 2. Show immediate circular/rounded preview
    cleanupBlobUrl();
    const localUrl = URL.createObjectURL(file);
    activeBlobUrlRef.current = localUrl;
    setPreviewUrl(localUrl);

    // 3. Trigger upload
    executeUpload(file);
  };

  const handleRetry = () => {
    if (lastSelectedFileRef.current) {
      executeUpload(lastSelectedFileRef.current);
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemovePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isUploading || isDeleting) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // If already saved on Cloudinary, call DELETE /api/v1/upload/profile with { publicId }
    if (currentPublicId && currentPublicId.trim().length > 0) {
      setIsDeleting(true);
      try {
        await deleteProfilePhoto(currentPublicId);
        cleanupBlobUrl();
        setPreviewUrl(null);
        onRemoved();
        setSuccessMessage({
          en: "Photo deleted from Cloudinary.",
          bn: "ছবি ক্লাউডিনারি থেকে মুছে ফেলা হয়েছে।",
        });
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err: unknown) {
        if (err instanceof UploadError) {
          setErrorMessage({
            en: err.messageEn,
            bn: err.messageBn,
            code: err.statusCode,
          });
        } else {
          setErrorMessage({
            en: "Failed to delete photo from server.",
            bn: "সার্ভার থেকে ছবি মুছতে ব্যর্থ হয়েছে।",
          });
        }
      } finally {
        setIsDeleting(false);
      }
    } else {
      // Local removal only
      cleanupBlobUrl();
      setPreviewUrl(null);
      onRemoved();
    }
  };

  return (
    <div className={`w-full flex flex-col items-center sm:items-start ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading || isDeleting}
      />

      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 w-full">
        {/* Immediate circular / rounded preview container */}
        <div className="relative group shrink-0">
          <div
            role="button"
            tabIndex={disabled || isUploading || isDeleting ? -1 : 0}
            onClick={() => {
              if (!disabled && !isUploading && !isDeleting) {
                fileInputRef.current?.click();
              }
            }}
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                !disabled &&
                !isUploading &&
                !isDeleting
              ) {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md ring-4 ring-[#006a4e]/20 transition-all duration-200 select-none cursor-pointer flex items-center justify-center ${
              previewUrl
                ? "bg-slate-100"
                : "bg-[#f7f4ea] border-dashed border-[#006a4e]/30 hover:border-[#006a4e]"
            } ${
              disabled || isUploading || isDeleting
                ? "opacity-80 pointer-events-none"
                : "hover:scale-[1.02]"
            }`}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Member preview"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-3 text-center text-[#006a4e]">
                <Camera className="w-8 h-8 mb-1 opacity-80" />
                <span className="text-[11px] font-bold leading-tight">
                  {isBn ? "ছবি দিন" : "Add Photo"}
                </span>
              </div>
            )}

            {/* Loading Spinner & Progress Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-white z-20">
                <Loader2 className="w-7 h-7 text-[#f2b705] animate-spin mb-1.5" />
                <span className="text-[11px] font-mono font-bold text-[#f2b705]">
                  {progressPercent}%
                </span>
                <span className="text-[10px] text-neutral-300 font-medium">
                  {isBn ? "আপলোড হচ্ছে..." : "Uploading..."}
                </span>
              </div>
            )}

            {/* Deleting Spinner Overlay */}
            {isDeleting && (
              <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-white z-20">
                <Loader2 className="w-7 h-7 text-rose-400 animate-spin mb-1" />
                <span className="text-[10px] text-neutral-200 font-medium">
                  {isBn ? "মোছা হচ্ছে..." : "Deleting..."}
                </span>
              </div>
            )}
          </div>

          {/* Camera Trigger Button on Avatar */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading || isDeleting}
            aria-label={isBn ? "ছবি নির্বাচন করুন" : "Choose photo"}
            title={isBn ? "ছবি নির্বাচন করুন" : "Choose photo"}
            className="absolute bottom-0 right-0 p-2 sm:p-2.5 rounded-full bg-[#006a4e] hover:bg-[#004d38] active:scale-95 disabled:opacity-40 text-white ring-3 ring-white shadow-md transition-transform cursor-pointer z-10"
          >
            <Camera className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Action Controls & Format Guidelines */}
        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start mb-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading || isDeleting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006a4e] hover:bg-[#004d38] active:scale-95 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705]"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>
                {previewUrl
                  ? isBn
                    ? "ছবি পরিবর্তন করুন"
                    : "Change Photo"
                  : isBn
                  ? "ছবি আপলোড করুন"
                  : "Upload Photo"}
              </span>
            </button>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={disabled || isUploading || isDeleting}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#f42a41] border border-red-200 text-xs font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isBn ? "ছবি মুছুন" : "Remove Photo"}</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {isBn
              ? "গ্রহণযোগ্য ফরম্যাট: JPEG, PNG, WebP (সর্বোচ্চ ২ মেগাবাইট)"
              : "Allowed formats: JPEG, PNG, WebP (Max size: 2 MB)"}
          </p>
        </div>
      </div>

      {/* Uploading progress bar */}
      {isUploading && (
        <div className="w-full mt-3">
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#006a4e] to-[#f2b705] h-full transition-all duration-200 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="mt-3 w-full rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0" />
          <span>{isBn ? successMessage.bn : successMessage.en}</span>
        </div>
      )}

      {/* Error Alert Box with Status Code & Retry */}
      {errorMessage && (
        <div className="mt-3 w-full rounded-xl bg-red-50 border border-[#f42a41]/30 p-3 text-[#f42a41] text-xs font-medium animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#f42a41] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                {errorMessage.code && (
                  <span className="px-1.5 py-0.2 rounded-md bg-red-100 text-[#f42a41] font-mono font-bold text-[10px]">
                    HTTP {errorMessage.code}
                  </span>
                )}
                <span className="font-bold leading-relaxed">
                  {isBn ? errorMessage.bn : errorMessage.en}
                </span>
              </div>
              <p className="text-[11px] text-red-600/90 leading-tight">
                {isBn ? errorMessage.en : errorMessage.bn}
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-red-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleRetry}
              disabled={isUploading || isDeleting}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#f42a41] hover:bg-[#d61e33] text-white text-[11px] font-bold shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isBn ? "পুনরায় চেষ্টা করুন" : "Retry"}</span>
            </button>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-500 hover:text-red-800 font-semibold px-1.5 cursor-pointer"
            >
              {isBn ? "বাতিল" : "Dismiss"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

