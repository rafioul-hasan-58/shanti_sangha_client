/**
 * Profile Photo Upload & Delete API Services
 *
 * Endpoint: POST {NEXT_PUBLIC_API_URL}/upload/profile
 * Delete:   DELETE {NEXT_PUBLIC_API_URL}/upload/profile
 */

import { getStoredAccessToken } from "@/lib/api";

export const UPLOAD_PROFILE_ENDPOINT = "/upload/profile";

export function getUploadApiBaseUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "";
  return envUrl.replace(/\/+$/, "");
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

function resolveErrorMessage(
  status: number,
  serverMessage?: string
): { en: string; bn: string } {
  if (status === 401 || status === 403) {
    return {
      en: "Session expired or unauthorized. Please log in again.",
      bn: "লগইন সেশনের মেয়াদ শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।",
    };
  }

  if (status === 413) {
    return {
      en: "The uploaded file is too large for the server.",
      bn: "ছবির আকার সার্ভার সীমা অতিক্রম করেছে।",
    };
  }

  if (status === 415) {
    return {
      en: "Unsupported image format. Please upload JPG, PNG, or WebP.",
      bn: "অননুমোদিত ফরম্যাট। শুধুমাত্র JPG, PNG অথবা WebP ছবি গ্রহণযোগ্য।",
    };
  }

  if (status >= 500) {
    return {
      en: "Server error occurred while uploading. Please try again later.",
      bn: "সার্ভারে ত্রুটি দেখা দিয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
    };
  }

  return {
    en:
      serverMessage ||
      "Failed to upload profile photo. Please try again.",
    bn:
      serverMessage ||
      "ছবি আপলোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
  };
}

/**
 * Upload profile photo to NestJS backend as multipart/form-data.
 * Tracks upload percentage via XMLHttpRequest and attaches JWT bearer token.
 */
export async function uploadProfilePhoto({
  file,
  oldPublicId,
  onProgress,
}: UploadProfilePhotoParams): Promise<UploadProfilePhotoResponse> {
  const baseUrl = getUploadApiBaseUrl();
  const endpoint = `${baseUrl}${UPLOAD_PROFILE_ENDPOINT}`;
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
        // Handle direct or wrapped response: { data: { url, publicId } } or { url, publicId }
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
 * Optional helper to delete a photo by its Cloudinary publicId.
 */
export async function deleteProfilePhoto(publicId: string): Promise<boolean> {
  if (!publicId || publicId.trim().length === 0) return true;

  try {
    const baseUrl = getUploadApiBaseUrl();
    const token = getStoredAccessToken();
    const response = await fetch(`${baseUrl}${UPLOAD_PROFILE_ENDPOINT}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ publicId: publicId.trim() }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

