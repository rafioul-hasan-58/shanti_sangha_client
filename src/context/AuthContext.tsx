"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser, Role } from "@/types";
import { useRole } from "./RoleContext";
import { API_BASE_URL } from "@/lib/api";

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "593220422710-ir6bjdt3kj7ue468pcsqc0213cd9hgum.apps.googleusercontent.com";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<AuthUser>;
  loginWithCredentials: (email: string, password?: string) => Promise<AuthUser>;
  registerWithCredentials: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<AuthUser>;
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
  logout: () => {},
  clearError: () => {},
});

/** Helper to decode Google JWT token */
export function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/** Helper to ensure Google GSI script is loaded */
export function ensureGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.google?.accounts?.oauth2) return resolve();

    const existing = document.getElementById("google-gsi-client") as HTMLScriptElement | null;
    if (existing) {
      if (window.google?.accounts) return resolve();
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

const STORAGE_KEY = "shanti_auth_user";
const TOKEN_KEY = "shanti_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setRole } = useRole();

  // Load saved user session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AuthUser = JSON.parse(saved);
        setUser(parsed);
        if (parsed.role) {
          setRole(parsed.role);
        }
      }
    } catch (err) {
      console.error("Failed to restore auth session:", err);
    } finally {
      setLoading(false);
    }

    // Preload GSI script in background for fast response
    ensureGoogleScript().catch(() => {});
  }, [setRole]);

  const clearError = useCallback(() => setError(null), []);

  /** Google OAuth sign-in flow */
  const loginWithGoogle = useCallback((): Promise<AuthUser> => {
    return new Promise(async (resolve, reject) => {
      setError(null);

      try {
        await ensureGoogleScript();

        if (!window.google?.accounts?.oauth2) {
          const err = new Error("Google Identity Services failed to load. Please check your internet connection.");
          setError(err.message);
          return reject(err);
        }

        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "email profile openid",
          callback: async (response) => {
            if (response.error) {
              const errMsg = response.error_description || response.error;
              setError(errMsg);
              return reject(new Error(errMsg));
            }

            // Log access token to browser console
            console.log("Google OAuth Access Token:", response.access_token);

            try {
              // Fetch user profile from Google UserInfo endpoint
              const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                  Authorization: `Bearer ${response.access_token}`,
                },
              });

              if (!userInfoRes.ok) {
                throw new Error("Failed to fetch Google profile details");
              }

              const profile = await userInfoRes.json();

              // Send access token to backend API if available
              let backendToken: string | undefined;
              let backendRole: Role = "user";
              let backendId: string | undefined;

              try {
                const apiRes = await fetch(`${API_BASE_URL}/auth/google`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ accessToken: response.access_token }),
                });

                if (apiRes.ok) {
                  const apiJson = await apiRes.json();
                  if (apiJson.success && apiJson.data) {
                    const data = apiJson.data;
                    backendToken = data.token || data.accessToken;
                    if (data.user?.role) backendRole = data.user.role as Role;
                    if (data.user?.id) backendId = data.user.id;
                  }
                }
              } catch (apiErr) {
                console.warn("Backend auth/google sync notice:", apiErr);
              }

              const authUser: AuthUser = {
                id: backendId || profile.sub || String(Date.now()),
                name: profile.name || profile.email?.split("@")[0] || "Google Member",
                email: profile.email || "",
                picture: profile.picture,
                accessToken: response.access_token,
                token: backendToken,
                provider: "google",
                role: backendRole,
              };

              setUser(authUser);
              setRole(authUser.role);

              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
                localStorage.setItem("role", authUser.role);
                if (backendToken) {
                  localStorage.setItem(TOKEN_KEY, backendToken);
                }
              } catch {}

              resolve(authUser);
            } catch (fetchErr: unknown) {
              const msg = fetchErr instanceof Error ? fetchErr.message : "Error fetching Google profile";
              setError(msg);
              reject(fetchErr);
            }
          },
          error_callback: (err: unknown) => {
            const msg = err && typeof err === "object" && "message" in err ? String(err.message) : "Google popup closed or blocked";
            setError(msg);
            reject(new Error(msg));
          },
        });

        // Trigger Google popup prompt
        client.requestAccessToken({ prompt: "select_account" });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Google authentication error";
        setError(msg);
        reject(err);
      }
    });
  }, [setRole]);

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
            const data = apiJson.data || {};
            const backendUser = data.user || {};
            const backendToken = data.token || data.accessToken;
            const backendRole = (backendUser.role as Role) || "user";

            const authUser: AuthUser = {
              id: backendUser.id || String(Date.now()),
              name: backendUser.fullName || backendUser.name || email.split("@")[0],
              email: backendUser.email || email,
              picture: backendUser.avatar,
              token: backendToken,
              provider: "credentials",
              role: backendRole,
            };

            setUser(authUser);
            setRole(backendRole);

            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
              localStorage.setItem("role", backendRole);
              if (backendToken) {
                localStorage.setItem(TOKEN_KEY, backendToken);
              }
            } catch {}

            return authUser;
          } else {
            const msg =
              apiJson?.message ||
              apiJson?.errorMessages?.[0] ||
              "Invalid email or password";
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
      const authUser: AuthUser = {
        id: String(Date.now()),
        name: email.split("@")[0] || "Club Member",
        email,
        provider: "credentials",
        role: "user",
      };

      setUser(authUser);
      setRole("user");
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        localStorage.setItem("role", "user");
      } catch {}

      return authUser;
    },
    [setRole]
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
          const data = apiJson.data || {};
          const backendUser = data.user || {};
          const backendToken = data.token || data.accessToken;
          const backendRole = (backendUser.role as Role) || "user";

          const authUser: AuthUser = {
            id: backendUser.id || String(Date.now()),
            name: backendUser.fullName || fullName,
            email: backendUser.email || email,
            token: backendToken,
            provider: "credentials",
            role: backendRole,
          };

          setUser(authUser);
          setRole(backendRole);

          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
            localStorage.setItem("role", backendRole);
            if (backendToken) {
              localStorage.setItem(TOKEN_KEY, backendToken);
            }
          } catch {}

          return authUser;
        } else {
          const msg =
            apiJson?.message ||
            apiJson?.errorMessages?.[0] ||
            "Registration failed";
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
    [setRole]
  );

  /** Sign out */
  const logout = useCallback(() => {
    setUser(null);
    setRole("user");
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("role");
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
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
