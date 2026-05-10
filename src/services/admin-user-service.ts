import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  dni?: string;
  ruc?: string;
  enabled: boolean;
  active: boolean;
  roles: string[];
  createdAt: string;
  updatedAt?: string;
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = useAuthStore.getState().token;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  return res;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/users`);
  if (!res.ok) {
    if (res.status === 403) throw new Error("No tienes permisos para ver usuarios");
    if (res.status === 401) throw new Error("Sesión expirada");
    throw new Error("Error al obtener usuarios");
  }
  return res.json();
}

export async function getAdminUserById(id: number): Promise<AdminUser> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/users/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Usuario no encontrado");
    if (res.status === 403) throw new Error("No tienes permisos para ver este usuario");
    throw new Error("Error al obtener usuario");
  }
  return res.json();
}

export async function updateUserRoles(id: number, roles: string[]): Promise<AdminUser> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/users/${id}/roles`, {
    method: "PUT",
    body: JSON.stringify({ roles }),
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Usuario no encontrado");
    if (res.status === 403) throw new Error("No tienes permisos para modificar roles");
    throw new Error("Error al actualizar roles");
  }
  return res.json();
}

export async function toggleUserStatus(id: number): Promise<{ enabled: boolean }> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/users/${id}/toggle-status`, {
    method: "PUT",
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Usuario no encontrado");
    if (res.status === 403) throw new Error("No tienes permisos para cambiar el estado");
    throw new Error("Error al cambiar estado del usuario");
  }
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Usuario no encontrado");
    if (res.status === 403) throw new Error("No tienes permisos para eliminar este usuario");
    throw new Error("Error al eliminar usuario");
  }
  if (res.status === 204) return;
}