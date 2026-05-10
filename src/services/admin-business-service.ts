import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface AdminBusiness {
  id: number;
  tradeName: string;
  legalName: string;
  ruc: string;
  status: string;
  ownerUsername: string;
  createdAt: string;
}

export interface AdminBusinessDetail extends AdminBusiness {
  businessType: string;
  sector: string;
  economicActivity: string;
  startDate: string;
  department: string;
  province: string;
  district: string;
  address: string;
  taxRegime: string;
  ownerId: number;
  ownerEmail: string;
  updatedAt?: string;
}

export interface AdminBusinessProcedure {
  id: number;
  procedureId: number;
  procedureName: string;
  status: string;
  createdAt: string;
}

export interface FormalizationStep {
  stepId: number;
  title: string;
  description: string;
  stepOrder: number;
  status: string;
  notes: string | null;
}

export interface FormalizationProcedure {
  procedureId: number;
  name: string;
  description: string;
  category: string;
  status: string;
  completedSteps: number;
  totalSteps: number;
  progressPercent: number;
  steps: FormalizationStep[];
}

export interface AdminBusinessFormalization {
  businessId: number;
  businessTradeName: string;
  procedures: FormalizationProcedure[];
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

export async function getAdminBusinesses(): Promise<AdminBusiness[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/businesses`);
  if (!res.ok) {
    if (res.status === 403) throw new Error("No tienes permisos para ver empresas");
    if (res.status === 401) throw new Error("Sesión expirada");
    throw new Error("Error al obtener empresas");
  }
  return res.json();
}

export async function getAdminBusinessById(id: number): Promise<AdminBusinessDetail> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/businesses/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Empresa no encontrada");
    if (res.status === 403) throw new Error("No tienes permisos para ver esta empresa");
    throw new Error("Error al obtener empresa");
  }
  return res.json();
}

export async function getAdminBusinessesByUser(userId: number): Promise<AdminBusiness[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/businesses/user/${userId}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Usuario no encontrado");
    if (res.status === 403) throw new Error("No tienes permisos para ver estas empresas");
    throw new Error("Error al obtener empresas del usuario");
  }
  return res.json();
}

export async function getAdminBusinessProcedures(id: number): Promise<AdminBusinessProcedure[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/businesses/${id}/procedures`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Empresa no encontrada");
    if (res.status === 403) throw new Error("No tienes permisos para ver procedimientos");
    throw new Error("Error al obtener procedimientos");
  }
  return res.json();
}

export async function getAdminBusinessFormalization(id: number): Promise<AdminBusinessFormalization> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/businesses/${id}/formalization`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Empresa no encontrada");
    if (res.status === 403) throw new Error("No tienes permisos para ver formalización");
    throw new Error("Error al obtener estado de formalización");
  }
  return res.json();
}