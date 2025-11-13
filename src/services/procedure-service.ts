import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Step {
  id: number;
  title: string;
  description: string;
  stepOrder: number;
  procedureId: number | null;
  procedureName: string | null;
  progresses: unknown | null;
}

export interface Procedure {
  id: number;
  name: string;
  description: string;
  category: string;
  steps: Step[];
}

// Función para obtener el token desde el store
function getToken(): string {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error("No se encontró token de autenticación");
  return token;
}

// Función helper para hacer fetch con auth
async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  };

  const res = await fetch(input, { ...init, headers });
  if (!res.ok) throw new Error(`Error en la petición: ${res.statusText}`);
  return res.json();
}

/**
 * 🔹 Obtener todos los procedimientos
 */
export async function getProcedures(): Promise<Procedure[]> {
  return fetchWithAuth(`${API_BASE_URL}/api/procedures`);
}

/**
 * 🔹 Obtener un procedimiento por ID
 */
export async function getProcedureById(id: number): Promise<Procedure> {
  return fetchWithAuth(`${API_BASE_URL}/api/procedures/${id}`);
}
