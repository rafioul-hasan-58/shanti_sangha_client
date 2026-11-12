/**
 * Backend API Client, Session Storage, & Refresh Token Flow
 */

import type { AuthUser } from "@/types";
import {
  extractTokensFromAuthPayload,
  isJwtExpiringSoon,
  resolveAuthMeta,
  toViewRole,
} from "@/lib/authRole";

export const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  ""
).replace(/\/+$/, "");

export const AUTH_STORAGE_KEY = "shanti_auth_user";
export const ACCESS_TOKEN_KEY = "shanti_token";
export const REFRESH_TOKEN_KEY = "shanti_refresh_token";
export const ROLE_STORAGE_KEY = "role";

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errorMessages?: string[];
  timestamp?: string;
}

export interface AuthRequestInit extends RequestInit {
  skipAuth?: boolean;
}

type AuthSyncListener = (user: AuthUser | null) => void;
const authListeners = new Set<AuthSyncListener>();
let activeRefreshPromise: Promise<string | null> | null = null;

export function subscribeAuthState(listener: AuthSyncListener): () => void {
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
  };
}

function notifyAuthListeners(user: AuthUser | null): void {
  authListeners.forEach((listener) => listener(user));
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      localStorage.getItem(ACCESS_TOKEN_KEY) || getStoredUser()?.token || null
    );
  } catch {
    return null;
  }
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      localStorage.getItem(REFRESH_TOKEN_KEY) ||
      getStoredUser()?.refreshToken ||
      null
    );
  } catch {
    return null;
  }
}

export function persistStoredSession(
  authUser: AuthUser,
  accessToken?: string,
  refreshToken?: string
): void {
  if (typeof window === "undefined") return;
  try {
    const resolvedAccess = accessToken || authUser.token;
    const resolvedRefresh = refreshToken || authUser.refreshToken;
    const sessionUser: AuthUser = {
      ...authUser,
      ...(resolvedAccess ? { token: resolvedAccess } : {}),
      ...(resolvedRefresh ? { refreshToken: resolvedRefresh } : {}),
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    localStorage.setItem(ROLE_STORAGE_KEY, toViewRole(sessionUser.role));
    if (resolvedAccess) {
      localStorage.setItem(ACCESS_TOKEN_KEY, resolvedAccess);
    }
    if (resolvedRefresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, resolvedRefresh);
    }
  } catch {}
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ROLE_STORAGE_KEY);
  } catch {}
}

function buildApiUrl(endpoint: string): string {
  return endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
}

/**
 * Exchange the stored refreshToken at `POST /auth/refresh` for a fresh access token.
 * Deduplicates concurrent calls so token rotation cannot race.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (activeRefreshPromise) return activeRefreshPromise;

  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;

  activeRefreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const json = (await res.json().catch(() => null)) as Record<
        string,
        unknown
      > | null;

      if (!res.ok || json?.success === false) {
        if (res.status === 401 || res.status === 403) {
          clearStoredSession();
          notifyAuthListeners(null);
        }
        return null;
      }

      const data = (
        json?.data && typeof json.data === "object" ? json.data : json
      ) as Record<string, unknown> | null;

      const {
        accessToken: nextAccessToken,
        refreshToken: rotatedRefreshToken,
      } = extractTokensFromAuthPayload(json, data);

      if (!nextAccessToken) return null;

      const nextRefreshToken = rotatedRefreshToken || refreshToken;
      const currentUser = getStoredUser();
      const backendUser =
        data?.user && typeof data.user === "object"
          ? (data.user as Record<string, unknown>)
          : undefined;

      const resolved = resolveAuthMeta({
        user:
          backendUser ||
          (currentUser as unknown as Record<string, unknown> | null),
        data,
        token: nextAccessToken,
        preferTokenClaims: !backendUser,
      });

      const updatedPicture =
        (typeof backendUser?.avatar === "string" && backendUser.avatar.trim()
          ? backendUser.avatar
          : undefined) ||
        (typeof backendUser?.picture === "string" && backendUser.picture.trim()
          ? backendUser.picture
          : undefined) ||
        currentUser?.picture;

      const updatedUser: AuthUser | null = currentUser
        ? {
            ...currentUser,
            ...(backendUser || {}),
            id: resolved.id || currentUser.id,
            name: resolved.name || currentUser.name,
            email: resolved.email || currentUser.email,
            picture: updatedPicture,
            role: resolved.role,
            status: resolved.status ?? currentUser.status,
            token: nextAccessToken,
            refreshToken: nextRefreshToken,
          }
        : null;

      try {
        localStorage.setItem(ACCESS_TOKEN_KEY, nextAccessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, nextRefreshToken);
        if (updatedUser) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
          localStorage.setItem(
            ROLE_STORAGE_KEY,
            toViewRole(updatedUser.role)
          );
        }
      } catch {}

      if (updatedUser) {
        notifyAuthListeners(updatedUser);
      }

      return nextAccessToken;
    } catch {
      return null;
    } finally {
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

/**
 * Fetch wrapper that attaches the bearer access token, proactively refreshes
 * expiring JWTs, and retries once on HTTP 401 when a refresh token is stored.
 */
export async function fetchWithAuth(
  endpoint: string,
  options: AuthRequestInit = {}
): Promise<Response> {
  const { skipAuth = false, ...fetchOptions } = options;
  const url = buildApiUrl(endpoint);
  const headers = new Headers(fetchOptions.headers);

  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let didRefreshBeforeRequest = false;
  if (!skipAuth && !headers.has("Authorization")) {
    let token = getStoredAccessToken();
    const hasRefresh = Boolean(getStoredRefreshToken());

    if (hasRefresh && (!token || isJwtExpiringSoon(token))) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        token = refreshed;
        didRefreshBeforeRequest = true;
      }
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let res = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (
    res.status === 401 &&
    !skipAuth &&
    !didRefreshBeforeRequest &&
    getStoredRefreshToken()
  ) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(url, {
        ...fetchOptions,
        headers,
      });
    }
  }

  return res;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: AuthRequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetchWithAuth(endpoint, options);

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
