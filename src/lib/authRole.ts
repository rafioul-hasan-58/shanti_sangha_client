import type { Role, UserStatus, ViewRole } from "@/types";

const VALID_ROLES = new Set<Role>(["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"]);
const VALID_STATUSES = new Set<UserStatus>(["ACTIVE", "INACTIVE", "SUSPENDED"]);

export interface RoleDisplayMeta {
  role: Role;
  labelEn: string;
  labelBn: string;
  shortEn: string;
  badgeClass: string;
  isElevated: boolean;
}

const ROLE_META_MAP: Record<Role, RoleDisplayMeta> = {
  SUPER_ADMIN: {
    role: "SUPER_ADMIN",
    labelEn: "Super Admin",
    labelBn: "সুপার অ্যাডমিন",
    shortEn: "SUPER ADMIN",
    badgeClass:
      "bg-gradient-to-r from-[#004d38] to-[#006a4e] text-white border border-[#f2b705]/75 shadow-2xs",
    isElevated: true,
  },
  ADMIN: {
    role: "ADMIN",
    labelEn: "Admin",
    labelBn: "অ্যাডমিন",
    shortEn: "ADMIN",
    badgeClass:
      "bg-gradient-to-r from-[#006a4e] to-[#004d38] text-white border border-[#f2b705]/45 shadow-2xs",
    isElevated: true,
  },
  MODERATOR: {
    role: "MODERATOR",
    labelEn: "Moderator",
    labelBn: "মডারেটর",
    shortEn: "MODERATOR",
    badgeClass: "bg-[#FEF8E2] text-[#7A5900] border border-[#f2b705]/55",
    isElevated: true,
  },
  USER: {
    role: "USER",
    labelEn: "Member",
    labelBn: "সদস্য",
    shortEn: "GENERAL MEMBER",
    badgeClass: "bg-[#EEF8F1] text-[#006a4e] border border-[#A9DCBB]",
    isElevated: false,
  },
};

/** Normalize backend/frontend role strings to the Prisma Role enum. */
export function normalizeRole(role?: unknown): Role {
  const upper = String(role ?? "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  if (upper === "SUPERADMIN") return "SUPER_ADMIN";
  if (VALID_ROLES.has(upper as Role)) {
    return upper as Role;
  }
  return "USER";
}

/** Normalize backend status strings to the Prisma UserStatus enum. */
export function normalizeUserStatus(status?: unknown): UserStatus | undefined {
  const upper = String(status ?? "")
    .trim()
    .toUpperCase();
  return VALID_STATUSES.has(upper as UserStatus) ? (upper as UserStatus) : undefined;
}

/** Safely decode a JWT token payload without verifying signature on the client. */
export function decodeJwtPayload(token?: string | null): Record<string, unknown> | null {
  if (!token || typeof token !== "string") return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    if (typeof atob === "function") {
      const jsonPayload = decodeURIComponent(
        atob(padded)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const parsed = JSON.parse(jsonPayload);
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
    }

    const parsed = JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * Resolve role, status, and user identity fields from API JSON data and JWT claims.
 * Falls back to decoding the JWT payload whenever fields are omitted from response user JSON.
 */
export function resolveAuthMeta(params: {
  user?: Record<string, unknown> | null;
  data?: Record<string, unknown> | null;
  token?: string | null;
  preferTokenClaims?: boolean;
}): {
  role: Role;
  status?: UserStatus;
  id?: string;
  email?: string;
  name?: string;
} {
  const { user, data, token, preferTokenClaims = false } = params;
  const claims = decodeJwtPayload(token);

  const rawRole = preferTokenClaims
    ? claims?.role ?? claims?.userRole ?? user?.role ?? data?.role
    : user?.role ?? data?.role ?? claims?.role ?? claims?.userRole;

  const rawStatus = preferTokenClaims
    ? claims?.status ?? claims?.userStatus ?? user?.status ?? data?.status
    : user?.status ?? data?.status ?? claims?.status ?? claims?.userStatus;

  const rawId =
    user?.id ?? user?._id ?? claims?.id ?? claims?.userId ?? claims?.sub;
  const rawEmail = user?.email ?? claims?.email;
  const rawName =
    user?.fullName ?? user?.name ?? claims?.fullName ?? claims?.name;

  return {
    role: normalizeRole(rawRole),
    status: normalizeUserStatus(rawStatus),
    id: rawId !== undefined && rawId !== null && String(rawId).trim() ? String(rawId) : undefined,
    email: typeof rawEmail === "string" && rawEmail.trim() ? rawEmail : undefined,
    name: typeof rawName === "string" && rawName.trim() ? rawName : undefined,
  };
}

/** True for all elevated roles (MODERATOR, ADMIN, SUPER_ADMIN); false only for USER. */
export function hasDashboardAccess(role?: unknown): boolean {
  return normalizeRole(role) !== "USER";
}

/** Collapse Role enum to dashboard preview toggle ("user" | "admin"). */
export function toViewRole(role?: unknown): ViewRole {
  return hasDashboardAccess(role) ? "admin" : "user";
}

/** Route after login: USER goes to locale home ("/"), all other roles go to dashboard. */
export function getPostLoginRedirect(role: unknown, locale: string): string {
  return hasDashboardAccess(role) ? `/${locale}/dashboard` : `/${locale}`;
}

export function getRoleDisplayMeta(role?: unknown): RoleDisplayMeta {
  return ROLE_META_MAP[normalizeRole(role)];
}
