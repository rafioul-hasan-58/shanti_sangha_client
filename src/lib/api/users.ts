/**
 * Admin User Management API Client (`/users`)
 *
 * Implements all 5 endpoints from the backend User Management specification:
 * 1. GET    /users                (paginated, filterable, sortable)
 * 2. GET    /users/:id            (single user details)
 * 3. PATCH  /users/:id            (profile + administrative updates)
 * 4. PATCH  /users/:id/toggle-block (toggle SUSPENDED <-> ACTIVE)
 * 5. DELETE /users/:id            (permanent delete)
 */

import { API_BASE_URL, apiRequest } from "@/lib/api";
import { normalizeRole, normalizeUserStatus } from "@/lib/authRole";
import { toPrismaBloodGroup } from "@/lib/bloodGroup";
import { MOCK_MANAGED_USERS } from "@/lib/mock/dashboard";
import type {
  ManagedUser,
  UpdateManagedUserPayload,
  UsersListResponse,
  UsersPaginationMeta,
  UsersQueryParams,
} from "@/lib/types/dashboard";
import type { MembershipType } from "@/types";

function asNullableString(val: unknown): string | null {
  if (typeof val !== "string") return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeMembershipType(val: unknown): MembershipType | null {
  const upper = String(val ?? "").trim().toUpperCase();
  if (upper === "PERMANENT" || upper === "PLAYER_QUOTA") {
    return upper;
  }
  return null;
}

/** Map a raw backend user JSON object into the normalized `ManagedUser` model. */
export function mapApiUser(raw: Record<string, unknown>, idx = 0): ManagedUser {
  const id = String(raw.id ?? raw._id ?? `user-${idx + 1}`);
  const fullName =
    asNullableString(raw.fullName) ||
    asNullableString(raw.name) ||
    "Club Member";
  const profileImage =
    asNullableString(raw.profileImage) ||
    asNullableString(raw.avatar) ||
    asNullableString(raw.picture);
  const phoneNumber =
    asNullableString(raw.phoneNumber) ||
    asNullableString(raw.phone) ||
    asNullableString(raw.whatsappNumber);
  const createdAt = asNullableString(raw.createdAt) ?? undefined;
  const updatedAt = asNullableString(raw.updatedAt) ?? undefined;

  return {
    id,
    fullName,
    name: fullName,
    fatherName: asNullableString(raw.fatherName),
    motherName: asNullableString(raw.motherName),
    email: typeof raw.email === "string" ? raw.email : "",
    profileImage,
    picture: profileImage ?? undefined,
    phoneNumber,
    phone: phoneNumber,
    bloodGroup: asNullableString(raw.bloodGroup),
    bio: asNullableString(raw.bio),
    summary: asNullableString(raw.summary),
    status: normalizeUserStatus(raw.status) ?? "ACTIVE",
    role: normalizeRole(raw.role),
    profession: asNullableString(raw.profession),
    village: asNullableString(raw.village),
    currentLocation: asNullableString(raw.currentLocation),
    whatsappNumber: asNullableString(raw.whatsappNumber),
    membershipType: normalizeMembershipType(raw.membershipType),
    facebookProfile: asNullableString(raw.facebookProfile),
    authProvider: asNullableString(raw.authProvider),
    emailVerified:
      typeof raw.emailVerified === "boolean" ? raw.emailVerified : null,
    phoneVerified:
      typeof raw.phoneVerified === "string" || typeof raw.phoneVerified === "boolean"
        ? raw.phoneVerified
        : null,
    adminVerified:
      typeof raw.adminVerified === "string" || typeof raw.adminVerified === "boolean"
        ? raw.adminVerified
        : null,
    googleId: asNullableString(raw.googleId),
    createdAt,
    updatedAt,
    joinedAt: createdAt ? createdAt.slice(0, 10) : undefined,
  };
}

function buildUsersQueryString(params: UsersQueryParams = {}): string {
  const qs = new URLSearchParams();
  if (params.page !== undefined) qs.set("page", String(params.page));
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.role) qs.set("role", params.role);
  if (params.status) qs.set("status", params.status);
  if (params.membershipType) qs.set("membershipType", params.membershipType);
  if (params.bloodGroup) qs.set("bloodGroup", params.bloodGroup);
  if (typeof params.emailVerified === "boolean") {
    qs.set("emailVerified", String(params.emailVerified));
  }
  if (params.search?.trim()) qs.set("search", params.search.trim());
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  const str = qs.toString();
  return str ? `?${str}` : "";
}

function isNetworkFailure(err: unknown): boolean {
  return err instanceof TypeError;
}

function queryMockUsers(params: UsersQueryParams = {}): UsersListResponse {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 10);
  const q = params.search?.trim().toLowerCase() ?? "";

  const filtered = MOCK_MANAGED_USERS.filter((u) => {
    if (params.role && u.role !== params.role) return false;
    if (params.status && u.status !== params.status) return false;
    if (params.membershipType && u.membershipType !== params.membershipType) return false;
    if (params.bloodGroup && toPrismaBloodGroup(u.bloodGroup) !== params.bloodGroup) {
      return false;
    }
    if (
      typeof params.emailVerified === "boolean" &&
      Boolean(u.emailVerified) !== params.emailVerified
    ) {
      return false;
    }
    if (!q) return true;
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phoneNumber?.toLowerCase().includes(q) ?? false) ||
      (u.village?.toLowerCase().includes(q) ?? false) ||
      (u.profession?.toLowerCase().includes(q) ?? false) ||
      (u.currentLocation?.toLowerCase().includes(q) ?? false)
    );
  });

  const sortBy = params.sortBy ?? "createdAt";
  const sortOrder = params.sortOrder ?? "desc";
  const sorted = [...filtered].sort((a, b) => {
    const valA = String(a[sortBy] ?? "").toLowerCase();
    const valB = String(b[sortBy] ?? "").toLowerCase();
    const cmp = valA.localeCompare(valB);
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;

  return {
    users: sorted.slice(start, start + limit).map((u) => ({ ...u })),
    meta: {
      total,
      page: safePage,
      limit,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
    isMockFallback: true,
  };
}

/**
 * 1. `GET /api/v1/users` — Paginated, filterable, sortable user list.
 */
export async function fetchUsers(
  params: UsersQueryParams = {}
): Promise<UsersListResponse> {
  if (!API_BASE_URL) {
    return queryMockUsers(params);
  }

  try {
    const query = buildUsersQueryString(params);
    const res = await apiRequest<{
      users?: Record<string, unknown>[];
      meta?: Partial<UsersPaginationMeta>;
    }>(`/users${query}`);

    const rawUsers = Array.isArray(res.data?.users)
      ? res.data.users
      : Array.isArray(res.data)
        ? (res.data as unknown as Record<string, unknown>[])
        : [];

    const users = rawUsers
      .filter((item): item is Record<string, unknown> =>
        Boolean(item && typeof item === "object")
      )
      .map(mapApiUser);

    const rawMeta = res.data?.meta;
    const page = Number(rawMeta?.page ?? params.page ?? 1);
    const limit = Number(rawMeta?.limit ?? params.limit ?? 10);
    const total = Number(rawMeta?.total ?? users.length);
    const totalPages = Math.max(
      1,
      Number(rawMeta?.totalPages ?? Math.ceil(total / Math.max(1, limit)))
    );

    return {
      users,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: Boolean(rawMeta?.hasNextPage ?? page < totalPages),
        hasPreviousPage: Boolean(rawMeta?.hasPreviousPage ?? page > 1),
      },
      isMockFallback: false,
    };
  } catch (err) {
    if (isNetworkFailure(err)) {
      return queryMockUsers(params);
    }
    throw err;
  }
}

/**
 * 2. `GET /api/v1/users/:id` — Retrieve a single sanitized user by ID.
 */
export async function fetchUserById(id: string): Promise<ManagedUser> {
  if (!API_BASE_URL) {
    const found = MOCK_MANAGED_USERS.find((u) => u.id === id);
    if (!found) throw new Error(`User with ID '${id}' was not found`);
    return { ...found };
  }

  const res = await apiRequest<Record<string, unknown>>(`/users/${id}`);
  if (!res.data || typeof res.data !== "object") {
    throw new Error("Invalid user response from server");
  }
  return mapApiUser(res.data);
}

function sanitizeUpdatePayload(
  payload: UpdateManagedUserPayload
): Record<string, unknown> {
  const nullableStringFields: Array<keyof UpdateManagedUserPayload> = [
    "fatherName",
    "motherName",
    "profileImage",
    "phoneNumber",
    "bio",
    "summary",
    "profession",
    "village",
    "currentLocation",
    "whatsappNumber",
    "facebookProfile",
  ];

  const clean: Record<string, unknown> = {};

  if (payload.fullName !== undefined) {
    clean.fullName = payload.fullName.trim();
  }
  for (const field of nullableStringFields) {
    const value = payload[field];
    if (value !== undefined) {
      clean[field] =
        typeof value === "string" ? (value.trim() ? value.trim() : null) : null;
    }
  }
  if (payload.bloodGroup !== undefined) clean.bloodGroup = payload.bloodGroup;
  if (payload.membershipType !== undefined) {
    clean.membershipType = payload.membershipType;
  }
  if (payload.role !== undefined) clean.role = payload.role;
  if (payload.status !== undefined) clean.status = payload.status;
  if (typeof payload.emailVerified === "boolean") {
    clean.emailVerified = payload.emailVerified;
  }
  if (typeof payload.adminVerified === "boolean") {
    clean.adminVerified = payload.adminVerified;
  }

  return clean;
}

/**
 * 3. `PATCH /api/v1/users/:id` — Update profile and/or administrative fields.
 */
export async function updateUserById(
  id: string,
  payload: UpdateManagedUserPayload
): Promise<{ user: ManagedUser; message: string }> {
  const body = sanitizeUpdatePayload(payload);

  const res = await apiRequest<Record<string, unknown>>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  if (!res.data || typeof res.data !== "object") {
    throw new Error("Invalid update response from server");
  }

  return {
    user: mapApiUser(res.data),
    message: res.message || "User updated successfully",
  };
}

/**
 * 4. `PATCH /api/v1/users/:id/toggle-block` — Toggle `SUSPENDED` <-> `ACTIVE`.
 */
export async function toggleBlockUserById(
  id: string
): Promise<{ user: ManagedUser; message: string }> {
  const res = await apiRequest<Record<string, unknown>>(
    `/users/${id}/toggle-block`,
    { method: "PATCH" }
  );

  if (!res.data || typeof res.data !== "object") {
    throw new Error("Invalid toggle-block response from server");
  }

  return {
    user: mapApiUser(res.data),
    message: res.message || "User status updated",
  };
}

/**
 * 5. `DELETE /api/v1/users/:id` — Permanently delete a user.
 */
export async function deleteUserById(
  id: string
): Promise<{ user: ManagedUser; message: string }> {
  const res = await apiRequest<Record<string, unknown>>(`/users/${id}`, {
    method: "DELETE",
  });

  if (!res.data || typeof res.data !== "object") {
    throw new Error("Invalid delete response from server");
  }

  return {
    user: mapApiUser(res.data),
    message: res.message || "User deleted successfully",
  };
}

