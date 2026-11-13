/**
 * Image Compression Configuration and Utilities
 *
 * Compresses cropped image to WebP with width <= 800px and file size < 300KB.
 */

import imageCompression from "browser-image-compression";

// ==========================================
// Named Constants (Configure Ratio, Width, Quality)
// ==========================================
export const DEFAULT_ASPECT_RATIO = 4 / 5; // Fixed 4:5 portrait ratio
export const MAX_IMAGE_WIDTH_PX = 800; // Maximum image width in pixels (never upscaled)
export const TARGET_MAX_SIZE_KB = 300; // Target file size upper limit in KB
export const INITIAL_WEBP_QUALITY = 0.82; // Initial WebP compression quality (~82%)
export const MIN_WEBP_QUALITY = 0.6; // Quality floor (~60%)
export const QUALITY_STEP = 0.05; // Step-down interval if still above target
export const MAX_UPLOAD_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB rejection threshold before processing
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export interface FileValidationResult {
  valid: boolean;
  errorEn?: string;
  errorBn?: string;
}

export interface CompressionResult {
  file: File;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  reductionPercentage: number;
  formattedOriginalSize: string;
  formattedCompressedSize: string;
  width: number;
  height: number;
}

/**
 * Format bytes into human-readable string (e.g. "2.8 MB", "142 KB", "650 B").
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Validates file MIME type and maximum pre-compression size (10 MB).
 */
export function validateImageFile(file: File): FileValidationResult {
  const isTypeAllowed = (ALLOWED_MIME_TYPES as readonly string[]).includes(
    file.type
  );

  if (!isTypeAllowed) {
    return {
      valid: false,
      errorEn: "Invalid file type. Only JPG, PNG, and WebP images are allowed.",
      errorBn: "অননুমোদিত ফাইলের ধরন। শুধুমাত্র JPG, PNG এবং WebP ছবি গ্রহণযোগ্য।",
    };
  }

  if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
    return {
      valid: false,
      errorEn: "File size exceeds 10 MB. Please choose a smaller image.",
      errorBn: "ছবির আকার ১০ মেগাবাইটের বেশি। অনুগ্রহ করে ছোট ছবি নির্বাচন করুন।",
    };
  }

  return { valid: true };
}

/**
 * Compresses an image file to WebP format targeting under 300 KB.
 * Resizes width to at most MAX_IMAGE_WIDTH_PX (never upscaling),
 * starts at INITIAL_WEBP_QUALITY (82%), and steps down toward MIN_WEBP_QUALITY (60%) if needed.
 */
export async function compressAndOptimizeImage(
  inputFile: File,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  const originalSizeBytes = inputFile.size;
  let currentQuality = INITIAL_WEBP_QUALITY;

  const targetSizeBytes = TARGET_MAX_SIZE_KB * 1024;
  const targetSizeMB = TARGET_MAX_SIZE_KB / 1024;

  let compressedBlob: File;

  try {
    compressedBlob = await imageCompression(inputFile, {
      maxSizeMB: targetSizeMB,
      maxWidthOrHeight: MAX_IMAGE_WIDTH_PX,
      useWebWorker: typeof window !== "undefined",
      initialQuality: currentQuality,
      fileType: "image/webp",
      onProgress: (percent: number) => {
        if (onProgress) {
          onProgress(Math.min(90, Math.round(percent)));
        }
      },
    });
  } catch {
    // If web worker compression fails, fallback to main thread
    compressedBlob = await imageCompression(inputFile, {
      maxSizeMB: targetSizeMB,
      maxWidthOrHeight: MAX_IMAGE_WIDTH_PX,
      useWebWorker: false,
      initialQuality: currentQuality,
      fileType: "image/webp",
    });
  }

  // Step-down quality loop if the result is still larger than TARGET_MAX_SIZE_KB and quality > MIN_WEBP_QUALITY
  while (
    compressedBlob.size > targetSizeBytes &&
    currentQuality > MIN_WEBP_QUALITY
  ) {
    currentQuality = Math.max(
      MIN_WEBP_QUALITY,
      Number((currentQuality - QUALITY_STEP).toFixed(2))
    );

    try {
      compressedBlob = await imageCompression(compressedBlob, {
        maxSizeMB: targetSizeMB,
        maxWidthOrHeight: MAX_IMAGE_WIDTH_PX,
        useWebWorker: false,
        initialQuality: currentQuality,
        fileType: "image/webp",
      });
    } catch {
      break;
    }

    if (currentQuality <= MIN_WEBP_QUALITY) break;
  }

  if (onProgress) {
    onProgress(100);
  }

  // Ensure output file has proper webp name and type
  const baseName = inputFile.name.replace(/\.[^/.]+$/, "");
  const finalFile = new File([compressedBlob], `${baseName}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });

  const compressedSizeBytes = finalFile.size;
  const reductionPercentage = Math.max(
    0,
    Math.round(
      ((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100
    )
  );

  let width = MAX_IMAGE_WIDTH_PX;
  let height = Math.round(MAX_IMAGE_WIDTH_PX / DEFAULT_ASPECT_RATIO);

  if (typeof window !== "undefined") {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(finalFile);
      await new Promise<void>((resolve) => {
        img.onload = () => {
          width = img.naturalWidth || img.width;
          height = img.naturalHeight || img.height;
          URL.revokeObjectURL(objectUrl);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve();
        };
        img.src = objectUrl;
      });
    } catch {}
  }

  return {
    file: finalFile,
    originalSizeBytes,
    compressedSizeBytes,
    reductionPercentage,
    formattedOriginalSize: formatFileSize(originalSizeBytes),
    formattedCompressedSize: formatFileSize(compressedSizeBytes),
    width,
    height,
  };
}

