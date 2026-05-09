import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ChatbotDocument {
  id: number;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatbotDocumentData {
  title: string;
  description: string;
  file: File;
}

export interface UpdateChatbotDocumentData {
  title: string;
  description: string;
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = useAuthStore.getState().token;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  return res;
}

export async function getChatbotDocuments(): Promise<ChatbotDocument[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/chatbot/documents`);
  if (!res.ok) {
    throw new Error("Error al obtener documentos");
  }
  return res.json();
}

export async function getChatbotDocumentById(id: number): Promise<ChatbotDocument> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/chatbot/documents/${id}`);
  if (!res.ok) {
    throw new Error("Error al obtener documento");
  }
  return res.json();
}

export async function createChatbotDocument(
  data: CreateChatbotDocumentData
): Promise<ChatbotDocument> {
  const formData = new FormData();

  formData.append(
    "dto",
    new Blob(
      [
        JSON.stringify({
          title: data.title,
          description: data.description,
        }),
      ],
      { type: "application/json" }
    )
  );

  formData.append("file", data.file);

  const token = useAuthStore.getState().token;

  const res = await fetch(`${API_BASE_URL}/api/chatbot/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ⚠️ NO pongas Content-Type aquí
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(text);
    throw new Error("Error al crear documento");
  }

  return res.json();
}

export async function updateChatbotDocument(
  id: number,
  data: UpdateChatbotDocumentData
): Promise<ChatbotDocument> {
  const res = await fetchWithAuth(
    `${API_BASE_URL}/api/chatbot/documents/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(text);
    throw new Error("Error al actualizar documento");
  }

  return res.json();
}

export async function deleteChatbotDocument(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/chatbot/documents/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Error al eliminar documento");
  }
}