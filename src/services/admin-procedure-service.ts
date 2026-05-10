import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ProcedureTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt: string;
}

export interface ProcedureStep {
  id: number;
  title: string;
  description: string;
  stepOrder: number;
  createdAt: string;
}

export interface BusinessProcedure {
  id: number;
  procedureId: number;
  procedureName: string;
  status: string;
  createdAt: string;
}

export interface BusinessProcedureStatus {
  id: number;
  status: string;
  businessId: number;
  procedureId: number;
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

export async function getProcedures(): Promise<ProcedureTemplate[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/procedures`);
  if (!res.ok) {
    if (res.status === 403) throw new Error("No tienes permisos para ver procedimientos");
    if (res.status === 401) throw new Error("Sesión expirada");
    throw new Error("Error al obtener procedimientos");
  }
  return res.json();
}

export async function getProcedureSteps(id: number): Promise<ProcedureStep[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/procedures/${id}/steps`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Procedimiento no encontrado");
    if (res.status === 403) throw new Error("No tienes permisos para ver los pasos");
    throw new Error("Error al obtener pasos del procedimiento");
  }
  return res.json();
}

export async function updateBusinessProcedureStatus(
  id: number,
  status: string
): Promise<BusinessProcedureStatus> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/business-procedures/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Procedimiento de empresa no encontrado");
    if (res.status === 400) throw new Error("Estado no válido");
    if (res.status === 403) throw new Error("No tienes permisos para actualizar el estado");
    throw new Error("Error al actualizar estado");
  }
  return res.json();
}

export async function getFormalizationStatus(
  businessId: number
): Promise<AdminBusinessFormalization> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/businesses/${businessId}/formalization`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Empresa no encontrada");
    if (res.status === 403) throw new Error("No tienes permisos para ver formalización");
    throw new Error("Error al obtener estado de formalización");
  }
  return res.json();
}