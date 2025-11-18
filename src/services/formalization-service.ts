// services/formalization-service.ts

import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// -----------------------------------------
// DTOs EXACTOS del backend
// -----------------------------------------

export interface FormalizationStepDTO {
  stepId: number;
  title: string;
  description: string;
  stepOrder: number;
  status: string; // "PENDING" | "COMPLETED"
  notes: string | null;
}

export interface FormalizationProcedureDTO {
  procedureId: number;
  name: string;
  description: string;
  category: string;
  status: string; // "PENDING" | "IN_PROGRESS" | "COMPLETED"
  completedSteps: number;
  totalSteps: number;
  progressPercent: number;
  steps: FormalizationStepDTO[];
}

export interface FormalizationStatusDTO {
  businessId: number;
  businessName: string;
  procedures: FormalizationProcedureDTO[];
}

export interface FormalizationToggleStepRequest {
  businessId: number;
  procedureId: number;
  stepId: number;
  completed: boolean;
  notes?: string | null;
}

// -----------------------------------------
// Helpers de autenticación
// -----------------------------------------

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

  return res.json();
}

// -----------------------------------------
// ENDPOINTS reales del controller
// -----------------------------------------

// ✔ Obtener estado completo de la formalización
export function getFormalizationStatus(
  businessId: number
): Promise<FormalizationStatusDTO> {
  return fetchWithAuth(
    `${API_BASE_URL}/api/formalization/business/${businessId}`
  );
}

// ✔ Marcar/desmarcar paso
export function toggleStep(
  request: FormalizationToggleStepRequest
): Promise<FormalizationStepDTO> {
  return fetchWithAuth(`${API_BASE_URL}/api/formalization/step/toggle`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}
