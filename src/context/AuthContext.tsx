"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/types";
import { useRole } from "./RoleContext";
import {
  API_BASE_URL,
  clearStoredSession,
  fetchWithAuth,
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredUser,
  persistStoredSession,
  refreshAccessToken,
  subscribeAuthState,
} from "@/lib/api";
import {
  decodeJwtPayload,
  extractTokensFromAuthPayload,
  isJwtExpiringSoon,
  normalizeRole,
  normalizeUserStatus,
  resolveAuthMeta,
  toViewRole,
} from "@/lib/authRole";

export const GOOGLE_CLIENT_ID =
  process.env.OAUTH_CLIENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  loginWithGoogle: (credential: string) => Promise<AuthUser>;
  loginWithCredentials: (email: string, password?: string) => Promise<AuthUser>;
  registerWithCredentials: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<AuthUser>;
  updateProfile: (profileData: Partial<AuthUser>) => Promise<AuthUser>;
  refreshSession: () => Promise<string | null>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  loginWithGoogle: async () => {
    throw new Error("AuthContext not initialized");
  },
  loginWithCredentials: async () => {
    throw new Error("AuthContext not initialized");
  },
  registerWithCredentials: async () => {
    throw new Error("AuthContext not initialized");
  },
  updateProfile: async () => {
    throw new Error("AuthContext not initialized");
  },
  refreshSession: async () => null,
  logout: () => {},
  clearError: () => {},
});

/** Helper to decode JWT token payload */
export function decodeJwt(token: string) {
  return decodeJwtPayload(token);
}

/** Helper to ensure Google GSI script is loaded */
export function ensureGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.google?.accounts?.id) return resolve();

    const existing = document.getElementById("google-gsi-client") as HTMLScriptElement | null;
    if (existing) {
      if (window.google?.accounts?.id) return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-gsi-client";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function extractApiErrorMessage(
  apiJson: Record<string, unknown> | null | undefined,
  fallback: string
): string {
  const rawMessage = apiJson?.message;
  if (typeof rawMessage === "string" && rawMessage.trim()) return rawMessage;
  if (Array.isArray(rawMessage) && typeof rawMessage[0] === "string") {
    return rawMessage.join(", ");
  }

  const errList = apiJson?.errorMessages;
  if (Array.isArray(errList) && errList.length > 0) {
    const first = errList[0];
    if (typeof first === "string" && first.trim()) return first;
    if (
      first &&
      typeof first === "object" &&
      "message" in first &&
      typeof (first as { message?: unknown }).message === "string"
    ) {
      return (first as { message: string }).message;
    }
  }

  return fallback;
}

function buildAuthUser(params: {
  provider: "google" | "credentials";
  backendUser?: Record<string, unknown> | null;
  data?: Record<string, unknown> | null;
  token?: string;
  refreshToken?: string;
  accessToken?: string;
  fallbackId?: string;
  fallbackName?: string;
  fallbackEmail?: string;
  fallbackPicture?: string;
}): AuthUser {
  const {
    provider,
    backendUser,
    data,
    token,
    refreshToken,
    accessToken,
    fallbackId,
    fallbackName,
    fallbackEmail,
    fallbackPicture,
  } = params;
  const meta = resolveAuthMeta({ user: backendUser, data, token });

  return {
    id: meta.id || fallbackId || String(Date.now()),
    name: meta.name || fallbackName || "Club Member",
    email: meta.email || fallbackEmail || "",
    picture:
      asString(backendUser?.avatar) ||
      asString(backendUser?.picture) ||
      fallbackPicture,
    accessToken,
    token,
    refreshToken,
    provider,
    role: meta.role,
    status: meta.status,
    fatherName: asString(backendUser?.fatherName),
    motherName: asString(backendUser?.motherName),
    bloodGroup: asString(backendUser?.bloodGroup),
    bio: asString(backendUser?.bio),
    summary: asString(backendUser?.summary),
    profession: asString(backendUser?.profession),
    village: asString(backendUser?.village),
    currentLocation: asString(backendUser?.currentLocation),
    whatsappNumber: asString(backendUser?.whatsappNumber),
    facebookProfile: asString(backendUser?.facebookProfile),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setRole } = useRole();

  const persistSession = useCallback(
    (authUser: AuthUser, token?: string, refreshToken?: string) => {
      const resolvedAccess = token || authUser.token;
      const resolvedRefresh = refreshToken || authUser.refreshToken;
      const nextUser: AuthUser = {
        ...authUser,
        ...(resolvedAccess ? { token: resolvedAccess } : {}),
        ...(resolvedRefresh ? { refreshToken: resolvedRefresh } : {}),
      };
      setUser(nextUser);
      setRole(toViewRole(nextUser.role));
      persistStoredSession(nextUser, resolvedAccess, resolvedRefresh);
    },
    [setRole]
  );

  // Load saved user session on mount and subscribe to token refresh/expiration events
  useEffect(() => {
    try {
      const parsed = getStoredUser();
      if (parsed) {
        const storedToken = parsed.token || getStoredAccessToken();
        const storedRefresh = parsed.refreshToken || getStoredRefreshToken();
        const restored = resolveAuthMeta({
          user: parsed as unknown as Record<string, unknown>,
          token: storedToken,
          preferTokenClaims: true,
        });
        parsed.role = restored.role;
        if (restored.status) parsed.status = restored.status;
        if (storedToken) parsed.token = storedToken;
        if (storedRefresh) parsed.refreshToken = storedRefresh;

        setUser(parsed);
        setRole(toViewRole(parsed.role));

        if (storedRefresh && (!storedToken || isJwtExpiringSoon(storedToken))) {
          void refreshAccessToken();
        }
      }
    } catch (err) {
      console.error("Failed to restore auth session:", err);
    } finally {
      setLoading(false);
    }

    const unsubscribe = subscribeAuthState((syncedUser) => {
      setUser(syncedUser);
      setRole(syncedUser ? toViewRole(syncedUser.role) : "user");
    });

    // Preload GSI script in background for fast response
    ensureGoogleScript().catch(() => {});

    return unsubscribe;
  }, [setRole]);

  const clearError = useCallback(() => setError(null), []);

  /** Google ID token (credential JWT) sign-in flow */
  const loginWithGoogle = useCallback(
    async (credential: string): Promise<AuthUser> => {
      setError(null);

      if (!credential || !credential.trim()) {
        const msg = "Google ID token is required";
        setError(msg);
        throw new Error(msg);
      }

      try {
        const apiRes = await fetch(`${API_BASE_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credential }),
        });

        const apiJson = await apiRes.json().catch(() => null);

        if (!apiRes.ok || !apiJson?.success) {
          throw new Error(
            extractApiErrorMessage(apiJson, "Google login failed")
          );
        }

        const backendData = (apiJson.data || apiJson) as Record<
          string,
          unknown
        >;
        const {
          accessToken: backendToken,
          refreshToken: backendRefreshToken,
        } = extractTokensFromAuthPayload(apiJson, backendData);
        const backendUser =
          backendData.user && typeof backendData.user === "object"
            ? (backendData.user as Record<string, unknown>)
            : {};

        // Decode Google ID token JWT only as fallback profile metadata after backend succeeds
        const googleClaims = decodeJwtPayload(credential);

        const authUser = buildAuthUser({
          provider: "google",
          backendUser,
          data: backendData,
          token: backendToken,
          refreshToken: backendRefreshToken,
          fallbackId: asString(googleClaims?.sub),
          fallbackName:
            asString(googleClaims?.name) ||
            asString(googleClaims?.email)?.split("@")[0] ||
            "Google Member",
          fallbackEmail: asString(googleClaims?.email) || "",
          fallbackPicture: asString(googleClaims?.picture),
        });

        persistSession(authUser, backendToken, backendRefreshToken);
        return authUser;
      } catch (fetchErr: unknown) {
        const msg =
          fetchErr instanceof Error ? fetchErr.message : "Google login failed";
        setError(msg);
        throw fetchErr instanceof Error ? fetchErr : new Error(msg);
      }
    },
    [persistSession]
  );

  /** Email & password login (communicates with backend API) */
  const loginWithCredentials = useCallback(
    async (email: string, password?: string): Promise<AuthUser> => {
      setError(null);

      if (password) {
        try {
          const apiRes = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const apiJson = await apiRes.json().catch(() => null);

          if (apiRes.ok && apiJson?.success) {
            const data = (apiJson.data || apiJson) as Record<string, unknown>;
            const backendUser =
              data.user && typeof data.user === "object"
                ? (data.user as Record<string, unknown>)
                : undefined;
            const {
              accessToken: backendToken,
              refreshToken: backendRefreshToken,
            } = extractTokensFromAuthPayload(apiJson, data);

            const authUser = buildAuthUser({
              provider: "credentials",
              backendUser,
              data,
              token: backendToken,
              refreshToken: backendRefreshToken,
              fallbackName: email.split("@")[0],
              fallbackEmail: email,
            });

            persistSession(authUser, backendToken, backendRefreshToken);
            return authUser;
          } else {
            const msg = extractApiErrorMessage(
              apiJson,
              "Invalid email or password"
            );
            setError(msg);
            throw new Error(msg);
          }
        } catch (fetchErr: unknown) {
          if (fetchErr instanceof Error) {
            setError(fetchErr.message);
            throw fetchErr;
          }
        }
      }

      // Simulated local fallback
      const authUser = buildAuthUser({
        provider: "credentials",
        fallbackName: email.split("@")[0] || "Club Member",
        fallbackEmail: email,
      });

      persistSession(authUser);
      return authUser;
    },
    [persistSession]
  );

  /** Registration (communicates with backend API) */
  const registerWithCredentials = useCallback(
    async (
      fullName: string,
      email: string,
      password: string
    ): Promise<AuthUser> => {
      setError(null);

      try {
        const apiRes = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password }),
        });

        const apiJson = await apiRes.json().catch(() => null);

        if (apiRes.ok && apiJson?.success) {
          const data = (apiJson.data || apiJson) as Record<string, unknown>;
          const backendUser =
            data.user && typeof data.user === "object"
              ? (data.user as Record<string, unknown>)
              : undefined;
          const {
            accessToken: backendToken,
            refreshToken: backendRefreshToken,
          } = extractTokensFromAuthPayload(apiJson, data);

          const authUser = buildAuthUser({
            provider: "credentials",
            backendUser,
            data,
            token: backendToken,
            refreshToken: backendRefreshToken,
            fallbackName: fullName,
            fallbackEmail: email,
          });

          persistSession(authUser, backendToken, backendRefreshToken);
          return authUser;
        } else {
          const msg = extractApiErrorMessage(apiJson, "Registration failed");
          setError(msg);
          throw new Error(msg);
        }
      } catch (fetchErr: unknown) {
        if (fetchErr instanceof Error) {
          setError(fetchErr.message);
          throw fetchErr;
        }
        throw new Error("Registration failed");
      }
    },
    [persistSession]
  );

  /** Update user profile fields (matches Prisma User schema) */
  const updateProfile = useCallback(
    async (profileData: Partial<AuthUser>): Promise<AuthUser> => {
      setError(null);

      // Merge with existing user
      const currentUser = user ?? getStoredUser();
      if (!currentUser) {
        throw new Error("No authenticated user session found");
      }

      const updatedUser: AuthUser = {
        ...currentUser,
        ...profileData,
      };

      // 1. Send update to backend API (fetchWithAuth attaches token and handles 401 refresh)
      try {
        const payload = {
          name: profileData.name ?? updatedUser.name,
          fatherName: profileData.fatherName !== undefined ? profileData.fatherName : updatedUser.fatherName,
          motherName: profileData.motherName !== undefined ? profileData.motherName : updatedUser.motherName,
          bloodGroup: profileData.bloodGroup !== undefined ? profileData.bloodGroup : updatedUser.bloodGroup,
          bio: profileData.bio !== undefined ? profileData.bio : updatedUser.bio,
          summary: profileData.summary !== undefined ? profileData.summary : updatedUser.summary,
          profession: profileData.profession !== undefined ? profileData.profession : updatedUser.profession,
          village: profileData.village !== undefined ? profileData.village : updatedUser.village,
          currentLocation: profileData.currentLocation !== undefined ? profileData.currentLocation : updatedUser.currentLocation,
          whatsappNumber: profileData.whatsappNumber !== undefined ? profileData.whatsappNumber : updatedUser.whatsappNumber,
          facebookProfile: profileData.facebookProfile !== undefined ? profileData.facebookProfile : updatedUser.facebookProfile,
        };

        let apiSuccess = false;
        try {
          const res = await fetchWithAuth("/users/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const json = await res.json().catch(() => null);
            if (json?.data?.user) {
              Object.assign(updatedUser, json.data.user);
            }
            apiSuccess = true;
          }
        } catch {}

        if (!apiSuccess) {
          try {
            const res2 = await fetchWithAuth("/user/profile", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (res2.ok) {
              const json2 = await res2.json().catch(() => null);
              if (json2?.data?.user) {
                Object.assign(updatedUser, json2.data.user);
              }
            }
          } catch {}
        }
      } catch (err) {
        console.warn("Backend profile sync notice (saved locally):", err);
      }

      // Preserve any refreshed/rotated tokens updated in storage during fetchWithAuth
      const latestAccess = getStoredAccessToken();
      const latestRefresh = getStoredRefreshToken();
      if (latestAccess) {
        updatedUser.token = latestAccess;
      }
      if (latestRefresh) {
        updatedUser.refreshToken = latestRefresh;
      }

      updatedUser.role = normalizeRole(updatedUser.role);
      if (updatedUser.status) {
        updatedUser.status = normalizeUserStatus(updatedUser.status);
      }

      // 2. Persist in local state & storage
      setUser(updatedUser);
      persistStoredSession(updatedUser);

      return updatedUser;
    },
    [user]
  );

  /** Sign out */
  const logout = useCallback(() => {
    setUser(null);
    setRole("user");
    clearStoredSession();
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } catch {}
  }, [setRole]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        loginWithGoogle,
        loginWithCredentials,
        registerWithCredentials,
        updateProfile,
        refreshSession: refreshAccessToken,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
