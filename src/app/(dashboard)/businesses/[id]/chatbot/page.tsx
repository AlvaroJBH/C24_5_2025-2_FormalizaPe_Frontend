"use client";

import { useEffect, useState } from "react";
import {
  createConversation,
  getConversation,
  getConversationsByBusiness,
  sendMessage,
  ConversationResponse,
  ConversationWithMessages,
  MessageResponse,
} from "@/services/chatbot-service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";

export default function ChatbotPage() {
  const businessId = 1; // luego lo traes del store

  const [conversations, setConversations] = useState<ConversationResponse[]>(
    []
  );
  const [selected, setSelected] = useState<ConversationResponse | null>(null);
  const [conversationData, setConversationData] =
    useState<ConversationWithMessages | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  // --- Cargar conversaciones ---
  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadConversations() {
    const list = await getConversationsByBusiness(businessId);
    setConversations(list);

    if (list.length > 0) {
      loadConversation(list[0]);
    }
  }

  async function loadConversation(conv: ConversationResponse) {
    setSelected(conv);
    const full = await getConversation(conv.id);
    setConversationData(full);
  }

  // --- Crear conversación ---
  async function handleCreateConversation() {
    if (!newTitle.trim()) return;

    const conv = await createConversation(businessId, newTitle.trim());
    setDialogOpen(false);
    setNewTitle("");

    await loadConversations();
    loadConversation(conv);
  }

  // --- Enviar mensaje ---
  async function handleSend() {
    if (!conversationData || !message.trim()) return;

    const convId = conversationData.id;
    const content = message.trim();

    // Mensaje optimista
    const optimistic: MessageResponse = {
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setConversationData((prev) =>
      prev ? { ...prev, messages: [...prev.messages, optimistic] } : prev
    );

    setMessage("");
    setLoadingResponse(true);

    try {
      const assistantReply = await sendMessage(convId, content);

      setConversationData((prev) =>
        prev ? { ...prev, messages: [...prev.messages, assistantReply] } : prev
      );
    } finally {
      setLoadingResponse(false);
    }
  }

  async function handleSuggestionClick(suggestion: string) {
    setMessage(suggestion);
    await handleSend();
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] p-4 gap-4">
      {/* ------------------------ SIDEBAR -------------------------------- */}
      <div className="w-80 border rounded-lg bg-white shadow p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-blue-700">Conversaciones</h3>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Nueva</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nueva conversación</DialogTitle>
              </DialogHeader>

              <Input
                placeholder="Título de la conversación"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-3"
              />

              <DialogFooter className="mt-4">
                <Button onClick={handleCreateConversation}>Crear</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Separator />

        {/* Lista */}
        <ScrollArea className="mt-4 flex-1">
          {conversations.length === 0 ? (
            <p className="text-sm text-gray-500 italic mt-4">
              No hay conversaciones. Crea una nueva.
            </p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-3 rounded cursor-pointer border ${
                    selected?.id === conv.id
                      ? "bg-blue-100 border-blue-400"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => loadConversation(conv)}
                >
                  <p className="font-medium">{conv.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(conv.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ----------------------- PANTALLA PRINCIPAL ----------------------- */}
      <div className="flex-1 flex flex-col border rounded-lg p-6 bg-white shadow-lg">
        {selected ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              {selected.title}
            </h2>

            {/* Mensajes */}
            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto space-y-4 border p-4 rounded bg-gray-50">
              {conversationData?.messages.length === 0 ? (
                <p className="text-gray-500 italic">No hay mensajes aún.</p>
              ) : (
                conversationData?.messages.map((msg, index) => (
                  <div key={index} className="flex flex-col">
                    <div
                      className={`p-3 rounded-lg max-w-[75%] ${
                        msg.role === "assistant"
                          ? "bg-blue-100 text-blue-900 self-start"
                          : "bg-green-100 text-green-900 self-end ml-auto"
                      }`}
                    >
                      <div
                        className="prose prose-sm max-w-none
                        prose-p:my-0 prose-li:my-0
                        prose-headings:mt-0 prose-headings:mb-1"
                      >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>

                    {/* 🔹 Sugerencias del asistente */}
                    {msg.role === "assistant" &&
                      msg.suggestions &&
                      msg.suggestions.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {msg.suggestions.map((sug, i) => (
                            <Button
                              key={i}
                              size="sm"
                              variant="outline"
                              onClick={() => handleSuggestionClick(sug)}
                            >
                              {sug}
                            </Button>
                          ))}
                        </div>
                      )}
                  </div>
                ))
              )}

              {loadingResponse && (
                <div className="bg-blue-100 text-blue-700 p-3 rounded-lg w-32 animate-pulse">
                  ...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend}>Enviar</Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 italic">
            Selecciona o crea una conversación
          </div>
        )}
      </div>
    </div>
  );
}
