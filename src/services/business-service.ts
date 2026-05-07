import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface BusinessProcedureSummary {
  id: number;
  name: string;
  status: string;
}

export interface BusinessSummary {
  id: number;
  tradeName: string;
  status: string;
}

export interface Business {
  id: number;
  tradeName: string;
  legalName: string;
  businessType: string;
  sector: string;
  economicActivity: string;
  startDate: string;
  department: string;
  province: string;
  district: string;
  address: string;
  taxRegime: string;
  ruc: string;
  status: string;
  ownerId: number;
  ownerUsername: string;
  procedures: BusinessProcedureSummary[];
}

export interface CreateBusinessData {
  tradeName: string;
  legalName: string;
  businessType: string;
  sector: string;
  economicActivity: string;
  startDate: string;
  department: string;
  province: string;
  district: string;
  address: string;
  taxRegime: string;
  ruc: string;
  status: string;
}

// --- Helper para obtener token ---
function getToken(): string {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error("No se encontró token de autenticación");
  return token;
}

// --- Helper genérico de fetch con auth ---
async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  };

  const res = await fetch(input, { ...init, headers });
  if (!res.ok) throw new Error(`Error en la petición: ${res.statusText}`);
  if (res.status !== 204) return res.json(); // 204 No Content
  return;
}

// --- Funciones CRUD ---

export async function getBusinesses(): Promise<Business[]> {
  return fetchWithAuth(`${API_BASE_URL}/api/businesses`);
}

export async function getBusinessById(id: number): Promise<Business> {
  return fetchWithAuth(`${API_BASE_URL}/api/businesses/${id}`);
}

export async function getBusinessesByUserId(userId: number): Promise<Business[]> {
  return fetchWithAuth(`${API_BASE_URL}/api/businesses/user/${userId}`);
}

export async function createBusiness(data: CreateBusinessData): Promise<Business> {
  return fetchWithAuth(`${API_BASE_URL}/api/businesses`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBusiness(id: number, data: CreateBusinessData): Promise<Business> {
  return fetchWithAuth(`${API_BASE_URL}/api/businesses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBusiness(id: number): Promise<void> {
  return fetchWithAuth(`${API_BASE_URL}/api/businesses/${id}`, {
    method: "DELETE",
  });
}
