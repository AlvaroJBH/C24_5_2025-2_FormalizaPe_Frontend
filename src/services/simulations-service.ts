// services/simulations-service.ts

import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- Interfaces ---

export interface TaxRegime {
  id: number;
  code: string;
  name: string;
  description: string;
  rulesJson: unknown | null;
}

export interface SimulationInput {
  id: number;
  businessId: number;
  versionNumber: number;
  monthlyIncome: number;
  monthlyExpense: number;
  quantity: number;
  type: string;
  assets: number;
}

export interface SimulationResultItem {
  resultId: number;
  regimeCode: string;
  regimeName: string;
  monthlyTax: string;
  monthlyIgv: string;
  totalMonthly: string;
  totalAnnual: string;
  recommended: boolean;
}

export interface SimulationResults {
  simulationInputId: number;
  recommendedResultId: number;
  results: SimulationResultItem[];
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

  if (res.status !== 204) return res.json();
  return;
}

// --- Obtener lista de regímenes tributarios ---
export async function getTaxRegimes(): Promise<TaxRegime[]> {
  return fetchWithAuth(`${API_BASE_URL}/api/simulations/tax-regimes`);
}

// --- Obtener inputs de simulación de un negocio ---
export async function getSimulationInputsByBusinessId(
  businessId: number
): Promise<SimulationInput[]> {
  return fetchWithAuth(`${API_BASE_URL}/api/simulations/inputs/business/${businessId}`);
}

// --- Obtener resultados de un input de simulación ---
export async function getSimulationResultsByInputId(
  inputId: number
): Promise<SimulationResults> {
  return fetchWithAuth(`${API_BASE_URL}/api/simulations/results/${inputId}`);
}

// --- Crear un nuevo input de simulación ---
export async function createSimulationInput(
  payload: Omit<SimulationInput, "id" | "versionNumber">
): Promise<SimulationInput> {
  return fetchWithAuth(`${API_BASE_URL}/api/simulations/inputs`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

