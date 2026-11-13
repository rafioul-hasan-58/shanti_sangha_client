/**
 * Profile Photo Upload & Delete API Services
 *
 * Endpoints:
 * - POST   /api/v1/upload/profile (multipart/form-data: file, oldPublicId)
 * - DELETE /api/v1/upload/profile (application/json: { publicId })
 */

import { getStoredAccessToken } from "@/lib/api";

export const UPLOAD_PROFILE_ENDPOINT = "/upload/profile";
export const MAX_MEMBER_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB strict limit
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function resolveUploadApiUrl(): string {
  const base = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    ""
  ).replace(/\/+$/, "");

  if (base.endsWith("/api/v1")) {
    return `${base}/upload/profile`;
  }
  return `${base}/api/v1/upload/profile`;
}

export interface UploadProfilePhotoResponse {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
}

export interface UploadProfilePhotoParams {
  file: File;
  oldPublicId?: string | null;
  onProgress?: (progressPercent: number) => void;
}

export interface DeleteProfilePhotoResponse {
  success: boolean;
  message?: string;
  deleted?: boolean;
}

export class UploadError extends Error {
  statusCode?: number;
  messageBn: string;
  messageEn: string;

  constructor(messageEn: string, messageBn: string, statusCode?: number) {
    super(messageEn);
    this.name = "UploadError";
    this.messageEn = messageEn;
    this.messageBn = messageBn;
    this.statusCode = statusCode;
  }
}

export function resolveErrorMessage(
  status: number,
  serverMessage?: string
): { en: string; bn: string } {
  if (status === 400) {
    return {
      en:
        serverMessage ||
        "Bad Request: Invalid upload request or unsupported file format.",
      bn:
        serverMessage ||
        "অনুরোধটি সঠিক নয় অথবা অগ্রহণযোগ্য ফাইল ফরম্যাট। শুধুমাত্র JPEG, PNG এবং WebP ছবি গ্রহণযোগ্য।",
    };
  }

  if (status === 401) {
    return {
      en: "Unauthorized: Please sign in with an admin account.",
      bn: "অননুমোদিত। অনুগ্রহ করে অ্যাডমিন অ্যাকাউন্ট দিয়ে পুনরায় লগইন করুন।",
    };
  }

  if (status === 403) {
    return {
      en: "Forbidden: Admin access is required to manage profile images.",
      bn: "অ্যাডমিন অনুমতি প্রয়োজন। আপনার ছবি আপলোড বা মুছে ফেলার অনুমতি নেই।",
    };
  }

  if (status === 413) {
    return {
      en: "Payload Too Large: Image size exceeds the 2 MB limit.",
      bn: "ছবির আকার অনেক বড়। সর্বোচ্চ ২ মেগাবাইট গ্রহণযোগ্য।",
    };
  }

  if (status === 415) {
    return {
      en: "Unsupported Media Type: Only JPEG, PNG, and WebP images are allowed.",
      bn: "অননুমোদিত ফরম্যাট। শুধুমাত্র JPEG, PNG অথবা WebP ছবি গ্রহণযোগ্য।",
    };
  }

  if (status === 429) {
    return {
      en: "Too Many Requests: Please slow down and wait a moment before trying again.",
      bn: "অতিরিক্ত অনুরোধ করা হয়েছে। কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।",
    };
  }

  if (status === 502) {
    return {
      en: "Bad Gateway: The upload server is temporarily unavailable.",
      bn: "সার্ভার গেটওয়ে ত্রুটি। সার্ভার বা ক্লাউডিনারি গেটওয়ে সাময়িকভাবে অনুপলব্ধ।",
    };
  }

  if (status >= 500) {
    return {
      en: "Server error occurred while processing image. Please try again later.",
      bn: "সার্ভারে ত্রুটি দেখা দিয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
    };
  }

  return {
    en: serverMessage || "Failed to process profile image. Please try again.",
    bn:
      serverMessage ||
      "ছবি প্রসেস করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
  };
}

/**
 * Validates file size (<= 2MB) and MIME type client-side before sending.
 */
export function validateMemberImageFile(file: File): {
  valid: boolean;
  errorEn?: string;
  errorBn?: string;
  statusCode?: number;
} {
  const isTypeAllowed = (ALLOWED_IMAGE_TYPES as readonly string[]).includes(
    file.type
  );

  if (!isTypeAllowed) {
    return {
      valid: false,
      statusCode: 415,
      errorEn: "Invalid file format. Only JPEG, PNG, and WebP images are allowed.",
      errorBn: "অননুমোদিত ফাইলের ধরন। শুধুমাত্র JPEG, PNG এবং WebP ছবি গ্রহণযোগ্য।",
    };
  }

  if (file.size > MAX_MEMBER_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      statusCode: 413,
      errorEn: "File size exceeds the 2 MB limit. Please select a smaller photo.",
      errorBn: "ফাইলের আকার ২ মেগাবাইটের বেশি। অনুগ্রহ করে ২ MB এর কম আকারের ছবি নির্বাচন করুন।",
    };
  }

  return { valid: true };
}

/**
 * Upload profile photo to Cloudinary via backend POST /api/v1/upload/profile.
 * Sends FormData with 'file' and optional 'oldPublicId' for safe replacement.
 * Attaches Authorization: Bearer <token>.
 */
export async function uploadProfilePhoto({
  file,
  oldPublicId,
  onProgress,
}: UploadProfilePhotoParams): Promise<UploadProfilePhotoResponse> {
  // Pre-validate before opening connection
  const validation = validateMemberImageFile(file);
  if (!validation.valid && validation.errorEn && validation.errorBn) {
    throw new UploadError(
      validation.errorEn,
      validation.errorBn,
      validation.statusCode || 400
    );
  }

  const endpoint = resolveUploadApiUrl();
  const token = getStoredAccessToken();

  const formData = new FormData();
  formData.append("file", file, file.name);

  if (oldPublicId && oldPublicId.trim().length > 0) {
    formData.append("oldPublicId", oldPublicId.trim());
  }

  return new Promise<UploadProfilePhotoResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", endpoint, true);

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      const status = xhr.status;
      let responseBody: Record<string, unknown> = {};

      try {
        responseBody = JSON.parse(xhr.responseText || "{}") as Record<string, unknown>;
      } catch {
        // Non-JSON response
      }

      if (status >= 200 && status < 300) {
        // Handle { success: true, data: { url, publicId, width, height, bytes, format } }
        const payload =
          (responseBody.data as Record<string, unknown> | undefined) || responseBody;

        const url = String(payload.url || payload.secure_url || "");
        const publicId = String(payload.publicId || payload.public_id || "");

        if (!url) {
          reject(
            new UploadError(
              "Server did not return a valid photo URL.",
              "সার্ভার থেকে সঠিক ছবির লিংক পাওয়া যায়নি।",
              status
            )
          );
          return;
        }

        resolve({
          url,
          publicId,
          width: typeof payload.width === "number" ? payload.width : undefined,
          height: typeof payload.height === "number" ? payload.height : undefined,
          bytes: typeof payload.bytes === "number" ? payload.bytes : undefined,
          format: typeof payload.format === "string" ? payload.format : undefined,
        });
      } else {
        const serverMsg =
          typeof responseBody.message === "string"
            ? responseBody.message
            : Array.isArray(responseBody.message)
            ? responseBody.message.join(", ")
            : undefined;

        const errMsgs = resolveErrorMessage(status, serverMsg);
        reject(new UploadError(errMsgs.en, errMsgs.bn, status));
      }
    };

    xhr.onerror = () => {
      reject(
        new UploadError(
          "Network failure or server is unreachable. Please check your connection.",
          "নেটওয়ার্ক সংযোগ বিচ্ছিন্ন অথবা সার্ভারে যোগাযোগ সম্ভব হচ্ছে না। সংযোগ পরীক্ষা করুন।",
          0
        )
      );
    };

    xhr.ontimeout = () => {
      reject(
        new UploadError(
          "Upload timed out. Please check your internet connection.",
          "আপলোড সময়সীমা অতিক্রম করেছে। সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।",
          408
        )
      );
    };

    xhr.send(formData);
  });
}

/**
 * Delete profile photo from Cloudinary via DELETE /api/v1/upload/profile.
 * Sends JSON body with { publicId }.
 */
export async function deleteProfilePhoto(
  publicId: string
): Promise<DeleteProfilePhotoResponse> {
  if (!publicId || publicId.trim().length === 0) {
    return { success: true, deleted: true };
  }

  const endpoint = resolveUploadApiUrl();
  const token = getStoredAccessToken();

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ publicId: publicId.trim() }),
    });

    let data: Record<string, unknown> = {};
    try {
      data = (await response.json()) as Record<string, unknown>;
    } catch {}

    if (response.ok) {
      return {
        success: true,
        message: typeof data.message === "string" ? data.message : "Profile image deleted successfully",
        deleted: true,
      };
    }

    const serverMsg = typeof data.message === "string" ? data.message : undefined;
    const errMsgs = resolveErrorMessage(response.status, serverMsg);
    throw new UploadError(errMsgs.en, errMsgs.bn, response.status);
  } catch (err) {
    if (err instanceof UploadError) {
      throw err;
    }
    throw new UploadError(
      "Network error occurred while deleting image.",
      "ছবি মোছার সময় নেটওয়ার্ক ত্রুটি দেখা দিয়েছে।",
      0
    );
  }
}
