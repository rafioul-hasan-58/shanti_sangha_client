/**
 * Member Management API Services (`/api/v1/members`)
 *
 * Implements CRUD endpoints for club members including Cloudinary image references:
 * - GET    /api/v1/members       (list members)
 * - GET    /api/v1/members/:id   (single member details)
 * - POST   /api/v1/members       (create member with image & imagePublicId)
 * - PATCH  /api/v1/members/:id   (update member with image & imagePublicId)
 * - DELETE /api/v1/members/:id   (delete member - backend auto-deletes Cloudinary image)
 */

import { getStoredAccessToken } from "@/lib/api";

export interface Member {
  id: string;
  memberId?: string;
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  villageEn: string;
  villageBn: string;
  joiningYear: string;
  image?: string | null;
  imagePublicId?: string | null;
  phone?: string | null;
  bloodGroup?: string | null;
  category?: "executive" | "general" | "advisor" | "player" | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMemberPayload {
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  villageEn: string;
  villageBn: string;
  joiningYear: string;
  image?: string | null;
  imagePublicId?: string | null;
  phone?: string | null;
  bloodGroup?: string | null;
  category?: string | null;
}

export type UpdateMemberPayload = Partial<CreateMemberPayload>;

function getMembersApiBaseUrl(): string {
  const base = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    ""
  ).replace(/\/+$/, "");

  if (base.endsWith("/api/v1")) {
    return `${base}/members`;
  }
  return `${base}/api/v1/members`;
}

/**
 * Fetch all members
 */
export async function fetchMembers(params?: {
  search?: string;
  category?: string;
}): Promise<Member[]> {
  const baseUrl = getMembersApiBaseUrl();
  const searchParams = new URLSearchParams();

  if (params?.search) searchParams.set("search", params.search);
  if (params?.category && params.category !== "all") {
    searchParams.set("category", params.category);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  const token = getStoredAccessToken();

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch members: ${res.statusText}`);
  }

  const json = await res.json().catch(() => ({}));
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.members)) return json.members;
  return [];
}

/**
 * Fetch single member by ID
 */
export async function fetchMemberById(id: string): Promise<Member> {
  const baseUrl = getMembersApiBaseUrl();
  const token = getStoredAccessToken();

  const res = await fetch(`${baseUrl}/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Member not found: ${res.statusText}`);
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Create a new member with Cloudinary photo reference
 */
export async function createMember(payload: CreateMemberPayload): Promise<Member> {
  const baseUrl = getMembersApiBaseUrl();
  const token = getStoredAccessToken();

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg =
      json.message ||
      json.error ||
      `Failed to create member (${res.status})`;
    throw new Error(errorMsg);
  }

  return json.data || json;
}

/**
 * Update an existing member with updated photo & imagePublicId
 */
export async function updateMember(
  id: string,
  payload: UpdateMemberPayload
): Promise<Member> {
  const baseUrl = getMembersApiBaseUrl();
  const token = getStoredAccessToken();

  // Try PATCH first, fall back to PUT if server requires
  let res = await fetch(`${baseUrl}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 404 || res.status === 405) {
    res = await fetch(`${baseUrl}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg =
      json.message ||
      json.error ||
      `Failed to update member (${res.status})`;
    throw new Error(errorMsg);
  }

  return json.data || json;
}

/**
 * Delete member (backend automatically cleans up the Cloudinary image)
 */
export async function deleteMember(id: string): Promise<boolean> {
  const baseUrl = getMembersApiBaseUrl();
  const token = getStoredAccessToken();

  const res = await fetch(`${baseUrl}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return res.ok;
}

