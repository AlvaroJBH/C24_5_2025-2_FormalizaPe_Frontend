import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  ruc?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

function getToken(): string {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error("No se encontró token de autenticación");
  return token;
}

async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  };

  const res = await fetch(input, { ...init, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function updateProfile(
  data: UpdateProfileRequest
): Promise<void> {
  await fetchWithAuth(`${API_BASE_URL}/api/profile`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(
  data: ChangePasswordRequest
): Promise<void> {
  await fetchWithAuth(`${API_BASE_URL}/api/profile/password`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}