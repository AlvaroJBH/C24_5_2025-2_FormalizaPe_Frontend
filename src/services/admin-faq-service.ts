import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface AdminFaq {
  id: number;
  category: string;
  questionTitle: string;
  response: string;
  displayOrder?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqDTO {
  category: string;
  questionTitle: string;
  response: string;
  displayOrder?: number;
  active?: boolean;
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

export async function getAllFaqs(): Promise<AdminFaq[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/faqs`);
  if (!res.ok) {
    throw new Error("Error al obtener FAQs");
  }
  return res.json();
}

export async function getFaqById(id: number): Promise<AdminFaq> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/faqs/${id}`);
  if (!res.ok) {
    throw new Error("Error al obtener FAQ");
  }
  return res.json();
}

export async function createFaq(data: CreateFaqDTO): Promise<AdminFaq> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/faqs`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Error al crear FAQ");
  }
  return res.json();
}

export async function updateFaq(id: number, data: CreateFaqDTO): Promise<AdminFaq> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/faqs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Error al actualizar FAQ");
  }
  return res.json();
}

export async function deleteFaq(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE_URL}/admin/faqs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Error al eliminar FAQ");
  }
}