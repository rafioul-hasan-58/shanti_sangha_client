"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Camera,
  UploadCloud,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { Area } from "react-easy-crop";
import { ImageCropModal } from "./ImageCropModal";
import { getCroppedFile } from "@/lib/image/cropImage";
import {
  DEFAULT_ASPECT_RATIO,
  validateImageFile,
  compressAndOptimizeImage,
  type CompressionResult,
} from "@/lib/image/compress";
import {
  uploadProfilePhoto,
  deleteProfilePhoto,
  UploadError,
} from "@/lib/api/upload";

export interface ImageUploaderProps {
  /** Current image URL */
  imageUrl?: string | null;
  /** Cloudinary publicId if image is already saved */
  publicId?: string | null;
  /** Triggered upon successful crop, compress, and upload */
  onChange: (data: { url: string; publicId: string }) => void;
  /** Triggered when user removes current photo */
  onRemove?: () => void;
  /** Aspect ratio for the portrait crop box (default 4/5) */
  aspectRatio?: number;
  /** Optional form field label */
  label?: string;
  /** Disable interactions (e.g. form is submitting) */
  disabled?: boolean;
  /** Notifies parent form when an upload is in progress (to disable form Save) */
  onUploadingChange?: (uploading: boolean) => void;
  /** Optional container CSS class */
  className?: string;
}

interface UploadStatusState {
  stage: "idle" | "cropping" | "compressing" | "uploading" | "success" | "error";
  progressPercent: number;
  messageEn: string;
  messageBn: string;
}

export function ImageUploader({
  imageUrl,
  publicId,
  onChange,
  onRemove,
  aspectRatio = DEFAULT_ASPECT_RATIO,
  label = "প্রোফাইল ছবি / Profile Photo",
  disabled = false,
  onUploadingChange,
  className = "",
}: ImageUploaderProps) {
  // Modal & File state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [selectedRawFile, setSelectedRawFile] = useState<File | null>(null);
  const [lastOptimizedFile, setLastOptimizedFile] = useState<File | null>(null);

  // Drag and drop highlight
  const [isDragging, setIsDragging] = useState(false);

  // Status & Progress feedback
  const [status, setStatus] = useState<UploadStatusState>({
    stage: "idle",
    progressPercent: 0,
    messageEn: "",
    messageBn: "",
  });

  // Size optimization badge feedback (e.g. "2.8 MB → 142 KB")
  const [optimizationSummary, setOptimizationSummary] = useState<string | null>(null);

  // Error feedback
  const [errorMessage, setErrorMessage] = useState<{ en: string; bn: string } | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rawObjectUrlRef = useRef<string | null>(null);

  const isBusy =
    status.stage === "cropping" ||
    status.stage === "compressing" ||
    status.stage === "uploading";

  // Notify parent component about upload state
  useEffect(() => {
    onUploadingChange?.(isBusy);
  }, [isBusy, onUploadingChange]);

  // Clean up Object URL from memory
  const cleanupObjectUrl = useCallback(() => {
    if (rawObjectUrlRef.current) {
      URL.revokeObjectURL(rawObjectUrlRef.current);
      rawObjectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupObjectUrl();
    };
  }, [cleanupObjectUrl]);

  // Process selected file
  const handleFileSelection = useCallback(
    (file: File) => {
      setErrorMessage(null);
      setOptimizationSummary(null);

      // Instant pre-validation (format and 10MB limit)
      const validation = validateImageFile(file);
      if (!validation.valid && validation.errorEn && validation.errorBn) {
        setErrorMessage({
          en: validation.errorEn,
          bn: validation.errorBn,
        });
        setStatus({
          stage: "error",
          progressPercent: 0,
          messageEn: validation.errorEn,
          messageBn: validation.errorBn,
        });
        return;
      }

      cleanupObjectUrl();
      const objectUrl = URL.createObjectURL(file);
      rawObjectUrlRef.current = objectUrl;

      setSelectedRawFile(file);
      setRawImageSrc(objectUrl);
      setCropModalOpen(true);
    },
    [cleanupObjectUrl]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
    // Reset input so same file can be re-selected if needed
    e.target.value = "";
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isBusy) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || isBusy) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  // Close crop modal
  const handleCloseCropModal = () => {
    setCropModalOpen(false);
    setRawImageSrc(null);
    setSelectedRawFile(null);
    cleanupObjectUrl();
  };

  // Crop -> Compress -> Upload pipeline
  const processAndUploadFile = useCallback(
    async (fileToUpload: File, rawOriginalSize?: number) => {
      setErrorMessage(null);

      // Step 2 & 3: Compress to WebP targeting < 300 KB
      setStatus({
        stage: "compressing",
        progressPercent: 20,
        messageEn: "Compressing & optimizing photo...",
        messageBn: "ছবি সংকুচিত ও অপ্টিমাইজ করা হচ্ছে...",
      });

      let compressionResult: CompressionResult;
      try {
        compressionResult = await compressAndOptimizeImage(
          fileToUpload,
          (progress) => {
            setStatus((prev) => ({
              ...prev,
              progressPercent: Math.min(45, Math.round(15 + progress * 0.3)),
            }));
          }
        );
      } catch {
        const err = {
          en: "Failed to compress image. Please try another photo.",
          bn: "ছবিটি প্রসেস করতে ব্যর্থ হয়েছে। অন্য একটি ছবি চেষ্টা করুন।",
        };
        setErrorMessage(err);
        setStatus({
          stage: "error",
          progressPercent: 0,
          messageEn: err.en,
          messageBn: err.bn,
        });
        return;
      }

      setLastOptimizedFile(compressionResult.file);

      // Size comparison badge (e.g. "Optimized: 2.8 MB → 142 KB")
      const displayOriginal = rawOriginalSize
        ? `${(rawOriginalSize / (1024 * 1024)).toFixed(1)} MB`
        : compressionResult.formattedOriginalSize;
      const displaySummary = `Optimized: ${displayOriginal} → ${compressionResult.formattedCompressedSize}`;
      setOptimizationSummary(displaySummary);

      // Step 4: Upload to POST {NEXT_PUBLIC_API_URL}/upload/profile
      setStatus({
        stage: "uploading",
        progressPercent: 50,
        messageEn: "Uploading to cloud server...",
        messageBn: "ক্লাউড সার্ভারে আপলোড করা হচ্ছে...",
      });

      try {
        const uploadResult = await uploadProfilePhoto({
          file: compressionResult.file,
          oldPublicId: publicId,
          onProgress: (percent) => {
            const mappedPercent = Math.min(
              99,
              Math.round(50 + percent * 0.49)
            );
            setStatus((prev) => ({
              ...prev,
              progressPercent: mappedPercent,
            }));
          },
        });

        // Step 5: Success!
        setStatus({
          stage: "success",
          progressPercent: 100,
          messageEn: "Profile photo uploaded successfully!",
          messageBn: "প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে!",
        });

        onChange({
          url: uploadResult.url,
          publicId: uploadResult.publicId,
        });

        // Clear modal state
        handleCloseCropModal();
      } catch (err: unknown) {
        let errEn = "Network error. Failed to upload photo.";
        let errBn = "নেটওয়ার্ক ত্রুটি। ছবি আপলোড করা সম্ভব হয়নি।";

        if (err instanceof UploadError) {
          errEn = err.messageEn;
          errBn = err.messageBn;
        } else if (err instanceof Error) {
          errEn = err.message;
        }

        const errorPayload = { en: errEn, bn: errBn };
        setErrorMessage(errorPayload);
        setStatus({
          stage: "error",
          progressPercent: 0,
          messageEn: errEn,
          messageBn: errBn,
        });
      }
    },
    [publicId, onChange]
  );

  // Confirm crop from modal
  const handleCropConfirm = async (pixelCrop: Area) => {
    if (!rawImageSrc) return;

    setStatus({
      stage: "cropping",
      progressPercent: 10,
      messageEn: "Cropping image...",
      messageBn: "ছবি ক্রপ করা হচ্ছে...",
    });

    try {
      const croppedFile = await getCroppedFile(
        rawImageSrc,
        pixelCrop,
        "profile-photo.webp"
      );

      const originalSize = selectedRawFile?.size;
      setCropModalOpen(false);

      await processAndUploadFile(croppedFile, originalSize);
    } catch {
      const err = {
        en: "Failed to crop image properly. Please try again.",
        bn: "ছবি ক্রপ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      };
      setErrorMessage(err);
      setStatus({
        stage: "error",
        progressPercent: 0,
        messageEn: err.en,
        messageBn: err.bn,
      });
      setCropModalOpen(false);
    }
  };

  // Retry upload if failed
  const handleRetry = () => {
    if (lastOptimizedFile) {
      processAndUploadFile(lastOptimizedFile);
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove photo handler
  const handleRemovePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isBusy) return;

    if (publicId) {
      deleteProfilePhoto(publicId);
    }

    onRemove?.();
    setOptimizationSummary(null);
    setErrorMessage(null);
    setStatus({
      stage: "idle",
      progressPercent: 0,
      messageEn: "",
      messageBn: "",
    });
  };

  return (
    <div className={`w-full flex flex-col items-center sm:items-start ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || isBusy}
      />

      {/* Label */}
      {label && (
        <span className="block text-xs sm:text-sm font-semibold text-[#12231d] mb-2 leading-relaxed">
          {label}
        </span>
      )}

      {/* 4:5 Portrait Trigger Box */}
      <div
        role="button"
        tabIndex={disabled || isBusy ? -1 : 0}
        aria-label="Upload profile photo / ছবি আপলোড করুন"
        onClick={() => {
          if (!disabled && !isBusy) {
            fileInputRef.current?.click();
          }
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled && !isBusy) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative w-48 sm:w-56 aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer select-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705] ${
          isDragging
            ? "border-2 border-[#006a4e] bg-[#006a4e]/10 ring-4 ring-[#006a4e]/20 scale-[1.02]"
            : imageUrl
            ? "border-2 border-stone-200/90 shadow-md bg-stone-100 hover:border-[#006a4e]/60"
            : "border-2 border-dashed border-[#006a4e]/40 bg-[#f7f4ea] hover:border-[#006a4e] hover:bg-[#006a4e]/5 shadow-sm"
        } ${disabled || isBusy ? "opacity-75 cursor-not-allowed pointer-events-none" : ""}`}
      >
        {/* State A: Current Image Loaded */}
        {imageUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt="Profile photo preview"
              fill
              sizes="(max-width: 640px) 192px, 224px"
              className="object-cover"
              unoptimized
            />

            {/* Hover overlay on desktop + visible action bar on mobile */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={disabled || isBusy}
                className="w-full py-1.5 px-3 bg-white/95 hover:bg-white text-[#12231d] text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705]"
              >
                <Camera className="w-3.5 h-3.5 text-[#006a4e]" />
                <span>পরিবর্তন / Change</span>
              </button>

              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={disabled || isBusy}
                className="w-full py-1.5 px-3 bg-[#f42a41] hover:bg-[#d61e33] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>মুছুন / Remove</span>
              </button>
            </div>
          </div>
        ) : (
          /* State B: Empty State (Upload Box) */
          <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#006a4e]/10 group-hover:bg-[#006a4e]/20 flex items-center justify-center text-[#006a4e] mb-3 transition-colors duration-150">
              <Camera className="w-7 h-7" />
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[#12231d] leading-relaxed mb-1">
              ছবি আপলোড করুন
            </p>
            <p className="text-[11px] sm:text-xs text-neutral-500 mb-2">
              Upload photo
            </p>

            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-neutral-400 font-medium">
              <UploadCloud className="w-3 h-3 text-[#00a67e]" />
              JPG, PNG, WebP (Max 10MB)
            </span>
          </div>
        )}

        {/* Processing / Progress Overlay */}
        {isBusy && (
          <div className="absolute inset-0 bg-neutral-900/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-white z-30">
            <div className="w-10 h-10 rounded-full border-2 border-[#f2b705] border-t-transparent animate-spin mb-3" />

            <p className="text-xs font-semibold text-center leading-relaxed mb-0.5 text-[#f7f4ea]">
              {status.messageBn}
            </p>
            <p className="text-[10px] text-neutral-300 text-center mb-3">
              {status.messageEn}
            </p>

            {/* Visual Progress Bar */}
            <div className="w-full bg-neutral-700/80 rounded-full h-1.5 overflow-hidden mb-1.5">
              <div
                className="bg-gradient-to-r from-[#00a67e] via-[#f2b705] to-[#00a67e] h-1.5 transition-all duration-300 ease-out"
                style={{ width: `${Math.max(8, status.progressPercent)}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-[#f2b705]">
              {status.progressPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Mobile action buttons when image is present (always accessible without hover) */}
      {imageUrl && !isBusy && (
        <div className="flex sm:hidden items-center gap-2 mt-2.5 w-48">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="flex-1 py-1.5 px-2 bg-stone-100 border border-stone-300 hover:bg-stone-200 text-[#12231d] text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors leading-relaxed"
          >
            <Camera className="w-3.5 h-3.5 text-[#006a4e]" />
            <span>পরিবর্তন</span>
          </button>
          <button
            type="button"
            onClick={handleRemovePhoto}
            disabled={disabled}
            className="py-1.5 px-2.5 bg-red-50 border border-red-200 hover:bg-red-100 text-[#f42a41] text-xs font-medium rounded-lg flex items-center justify-center transition-colors leading-relaxed"
            aria-label="Remove photo / ছবি মুছুন"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Optimization Size Badge ("Optimized: 2.8 MB → 142 KB") */}
      {optimizationSummary && (
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-[#006a4e]" />
          <span>{optimizationSummary}</span>
          <CheckCircle2 className="w-3 h-3 text-[#00a67e]" />
        </div>
      )}

      {/* Error State with Friendly Messages & Retry Button */}
      {errorMessage && (
        <div className="mt-3 w-full max-w-sm rounded-xl bg-red-50/95 border border-[#f42a41]/40 p-3 text-[#f42a41] shadow-sm animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#f42a41]" />
            <div className="flex-1">
              <p className="text-xs font-semibold leading-relaxed">
                {errorMessage.bn}
              </p>
              <p className="text-[11px] text-red-600/90 mt-0.5 leading-normal">
                {errorMessage.en}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-end gap-2 pt-2 border-t border-red-100">
            <button
              type="button"
              onClick={handleRetry}
              disabled={isBusy}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[#f42a41] hover:bg-[#d61e33] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2b705]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>পুনরায় চেষ্টা করুন / Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={rawImageSrc}
        aspectRatio={aspectRatio}
        onClose={handleCloseCropModal}
        onConfirm={handleCropConfirm}
        isProcessing={isBusy}
      />
    </div>
  );
}

