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

import { API_BASE_URL, apiRequest, type ApiResponse } from "@/lib/api";
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
    asNullableString(raw.nameBn) ||
    asNullableString(raw.nameEn) ||
    "Club Member";
  const profileImage =
    asNullableString(raw.profileImage) ||
    asNullableString(raw.avatar) ||
    asNullableString(raw.picture) ||
    asNullableString(raw.image);
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
    imagePublicId:
      asNullableString(raw.imagePublicId) || asNullableString(raw.publicId),
    picture: profileImage ?? undefined,
    phoneNumber,
    phone: phoneNumber,
    bloodGroup: asNullableString(raw.bloodGroup),
    bio:
      asNullableString(raw.bio) ||
      asNullableString(raw.summaryBn) ||
      asNullableString(raw.summaryEn),
    summary:
      asNullableString(raw.summary) ||
      asNullableString(raw.summaryBn) ||
      asNullableString(raw.summaryEn),
    status: normalizeUserStatus(raw.status) ?? "ACTIVE",
    role: normalizeRole(raw.role || raw.roleEn || raw.roleBn),
    profession:
      asNullableString(raw.profession) ||
      asNullableString(raw.roleBn) ||
      asNullableString(raw.roleEn),
    village:
      asNullableString(raw.village) ||
      asNullableString(raw.villageBn) ||
      asNullableString(raw.villageEn) ||
      "সাভারচালা",
    currentLocation:
      asNullableString(raw.currentLocation) ||
      asNullableString(raw.villageBn) ||
      asNullableString(raw.villageEn),
    whatsappNumber: asNullableString(raw.whatsappNumber) || phoneNumber,
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
      typeof (raw.adminVerified ?? raw.adminApproved) === "string" ||
      typeof (raw.adminVerified ?? raw.adminApproved) === "boolean"
        ? (raw.adminVerified ?? raw.adminApproved) as string | boolean
        : null,
    googleId: asNullableString(raw.googleId),
    createdAt,
    updatedAt,
    joinedAt: createdAt
      ? createdAt.slice(0, 10)
      : raw.joiningYear
        ? String(raw.joiningYear)
        : undefined,
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

export function queryMockUsers(params: UsersQueryParams = {}): UsersListResponse {
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
 * 1. `GET /api/v1/users` (or fallback `/api/v1/members`) — Live backend member list.
 * Only real user data from backend, NO dummy / static data.
 */
export async function fetchUsers(
  params: UsersQueryParams = {}
): Promise<UsersListResponse> {
  const query = buildUsersQueryString(params);
  let res: ApiResponse<any> | null = null;
  let lastError: Error | null = null;

  // 1. Try /users endpoint first (now public endpoint: skipAuth: true, no accessToken passed)
  try {
    res = await apiRequest<any>(`/users${query}`, { skipAuth: true });
  } catch (err) {
    lastError = err instanceof Error ? err : new Error(String(err));
  }

  // 2. If /users was blocked or not found, try /members (also public: skipAuth: true)
  if (!res || !res.data) {
    try {
      res = await apiRequest<any>(`/members${query}`, { skipAuth: true });
    } catch {
      if (lastError) throw lastError;
    }
  }

  if (!res) {
    throw lastError || new Error("Failed to fetch user data from backend");
  }

  const d = res.data ?? res;
  let rawUsers: Record<string, unknown>[] = [];
  if (Array.isArray(d)) {
    rawUsers = d;
  } else if (d && typeof d === "object") {
    const obj = d as Record<string, unknown>;
    if (Array.isArray(obj.users)) rawUsers = obj.users as Record<string, unknown>[];
    else if (Array.isArray(obj.members)) rawUsers = obj.members as Record<string, unknown>[];
    else if (Array.isArray(obj.data)) rawUsers = obj.data as Record<string, unknown>[];
    else if (Array.isArray(obj.items)) rawUsers = obj.items as Record<string, unknown>[];
    else if (Array.isArray(obj.results)) rawUsers = obj.results as Record<string, unknown>[];
  }

  const users = rawUsers
    .filter((item): item is Record<string, unknown> =>
      Boolean(item && typeof item === "object")
    )
    .map(mapApiUser);

  const rawMeta =
    (res.data && typeof res.data === "object" ? (res.data as any).meta : null) ||
    (res.data && typeof res.data === "object" ? (res.data as any).pagination : null) ||
    (res as any)?.meta ||
    null;

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
}

/**
 * Public-safe member directory fetch: always loads directly from live backend,
 * strictly NO dummy / static data.
 */
export async function fetchPublicMembers(
  params: UsersQueryParams = {}
): Promise<UsersListResponse> {
  return await fetchUsers(params);
}

/**
 * 2. `GET /api/v1/users/:id` — Retrieve a single sanitized user by ID from backend.
 */
export async function fetchUserById(id: string): Promise<ManagedUser> {
  let res: ApiResponse<Record<string, unknown>> | null = null;
  let lastError: Error | null = null;

  try {
    res = await apiRequest<Record<string, unknown>>(`/users/${id}`, {
      skipAuth: true,
    });
  } catch (err) {
    lastError = err instanceof Error ? err : new Error(String(err));
    try {
      res = await apiRequest<Record<string, unknown>>(`/members/${id}`, {
        skipAuth: true,
      });
    } catch {
      throw lastError;
    }
  }

  const userData = (res?.data && typeof res.data === "object"
    ? (res.data as any).user || (res.data as any).member || res.data
    : res) as Record<string, unknown>;

  if (!userData || typeof userData !== "object") {
    throw new Error("Invalid user response from server");
  }

  return mapApiUser(userData);
}

function sanitizeUpdatePayload(
  payload: UpdateManagedUserPayload
): Record<string, unknown> {
  const clean: Record<string, unknown> = {};

  // Name: supply both 'name' and 'fullName' if non-empty
  const rawName = (
    payload.fullName ||
    (payload as any).name ||
    ""
  ).trim();
  if (rawName.length > 0) {
    clean.fullName = rawName;
    clean.name = rawName;
  }

  // String fields: ONLY include if non-empty string.
  // NEVER send null or blank strings, as backend NestJS/class-transformer `.trim()` will crash with:
  // "Cannot read properties of null (reading 'trim')"
  const addStringIfValid = (keys: string[], val: unknown) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed.length > 0) {
        for (const k of keys) {
          clean[k] = trimmed;
        }
      }
    }
  };

  addStringIfValid(["fatherName"], payload.fatherName);
  addStringIfValid(["motherName"], payload.motherName);
  addStringIfValid(["phoneNumber", "phone"], payload.phoneNumber);
  addStringIfValid(["whatsappNumber"], payload.whatsappNumber);
  addStringIfValid(["profession"], payload.profession);
  addStringIfValid(["village"], payload.village);
  addStringIfValid(["currentLocation"], payload.currentLocation);
  addStringIfValid(["facebookProfile"], payload.facebookProfile);
  addStringIfValid(["summary"], payload.summary);
  addStringIfValid(["bio"], payload.bio);
  addStringIfValid(["profileImage", "image", "picture"], payload.profileImage);
  addStringIfValid(["imagePublicId", "publicId"], payload.imagePublicId);

  // Blood group: Prisma enum doesn't support "UNKNOWN", only send if valid group
  if (
    payload.bloodGroup &&
    payload.bloodGroup !== "UNKNOWN" &&
    typeof payload.bloodGroup === "string" &&
    payload.bloodGroup.trim().length > 0
  ) {
    clean.bloodGroup = payload.bloodGroup.trim();
  }

  // Membership type
  if (payload.membershipType) {
    clean.membershipType = payload.membershipType;
  }

  // Role & Status
  if (payload.role) {
    clean.role = payload.role;
  }
  if (payload.status) {
    clean.status = payload.status;
  }

  // Verification booleans
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

  const rawUserData =
    res.data && typeof res.data === "object"
      ? (res.data as any).user && typeof (res.data as any).user === "object"
        ? (res.data as any).user
        : res.data
      : body;

  return {
    user: mapApiUser(rawUserData),
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

