/**
 * Backend API Client & Configuration
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.shantishangha.space/api/v1";

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errorMessages?: string[];
  timestamp?: string;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const json: ApiResponse<T> = await res.json().catch(() => ({
    success: false,
    statusCode: res.status,
    message: `Request failed with status ${res.status}`,
  }));

  if (!res.ok || json.success === false) {
    const errorMsg =
      json.message ||
      json.errorMessages?.[0] ||
      `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return json;
}

