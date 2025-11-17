// services/chatbot-service.ts

import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- Interfaces DTO ---
export interface ConversationResponse {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  suggestions?: string[]; 
}

export interface ConversationWithMessages {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: MessageResponse[];
}

// --- Helper para token ---
function getToken(): string {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error("No se encontró token de autenticación");
  return token;
}

// --- Fetch con auth ---
async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  };

  const res = await fetch(input, { ...init, headers });
  if (!res.ok) throw new Error(`Error: ${res.statusText}`);

  return res.json();
}

// --- Crear conversación ---
export async function createConversation(businessId: number, title?: string) {
  return fetchWithAuth(`${API_BASE_URL}/api/chatbot/conversations`, {
    method: "POST",
    body: JSON.stringify({ businessId, title }),
  }) as Promise<ConversationResponse>;
}

// --- Enviar mensaje ---
export async function sendMessage(conversationId: number, content: string) {
  return fetchWithAuth(
    `${API_BASE_URL}/api/chatbot/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    }
  ) as Promise<MessageResponse>;
}

// --- Obtener historial ---
export async function getMessages(conversationId: number) {
  return fetchWithAuth(
    `${API_BASE_URL}/api/chatbot/conversations/${conversationId}/messages`
  ) as Promise<MessageResponse[]>;
}

// --- Obtener conversación completa (incluye mensajes) ---
export async function getConversation(conversationId: number) {
  return fetchWithAuth(
    `${API_BASE_URL}/api/chatbot/conversations/${conversationId}`
  ) as Promise<ConversationWithMessages>;
}

// --- 🔥 Obtener conversaciones de un negocio ---
export async function getConversationsByBusiness(businessId: number) {
  return fetchWithAuth(
    `${API_BASE_URL}/api/chatbot/business/${businessId}/conversations`
  ) as Promise<ConversationResponse[]>;
}
