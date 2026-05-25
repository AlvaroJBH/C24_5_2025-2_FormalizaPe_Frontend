import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type BusinessStatus = "INFORMAL" | "EN_FORMALIZACION" | "FORMALIZADO";

export interface FormalIdentity {
  id: number;
  businessId: number;
  businessDisplayName: string;
  tradeName: string;
  legalName: string;
  ruc: string;
  taxRegime: string;
  ciiCode: string;
  sunatStatus: string;
}

export interface BusinessProcedureSummary {
  id: number;
  name: string;
  status: string;
}

export interface Business {
  id: number;
  displayName: string;
  startDate: string;
  department: string;
  province: string;
  district: string;
  address: string;
  status: BusinessStatus;
  ownerId: number;
  ownerUsername: string;
  procedures: BusinessProcedureSummary[];
  formalIdentity: FormalIdentity | null;
}

export interface CreateBusinessData {
  displayName: string;
  startDate: string;
  department: string;
  province: string;
  district: string;
  address: string;
}

export interface UpdateBusinessData extends CreateBusinessData {}

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
  if (!res.ok) throw new Error(`Error en la petición: ${res.statusText}`);
  if (res.status !== 204) return res.json();
  return;
}

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

export async function updateBusiness(id: number, data: UpdateBusinessData): Promise<Business> {
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