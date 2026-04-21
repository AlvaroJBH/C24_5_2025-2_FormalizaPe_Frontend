import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ----------------------------------
// Interfaces
// ----------------------------------

export interface Faq {
  id: number;
  questionTitle: string;
  response: string;
}

export interface FaqCategory {
  category: string;
  questions: Faq[];
}

// ----------------------------------
// Helper para token y fetch auth
// ----------------------------------

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

// ----------------------------------
// Función para obtener FAQs
// ----------------------------------

export async function getFaqs(): Promise<FaqCategory[]> {
  return fetchWithAuth(`${API_BASE_URL}/api/help/faqs`);
}