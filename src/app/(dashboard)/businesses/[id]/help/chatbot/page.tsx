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
import { useParams } from "next/navigation";
import { Business, getBusinessById } from "@/services/business-service";
import { AppBreadcrumb } from "@/components/common/app-breadcrumb";

export default function ChatbotPage() {
  const { id } = useParams();
  const businessId = Number(id);
  const [business, setBusiness] = useState<Business | null>(null)

  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [selected, setSelected] = useState<ConversationResponse | null>(null);
  const [conversationData, setConversationData] =
    useState<ConversationWithMessages | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const list = await getConversationsByBusiness(businessId);
    setConversations(list);
    const business_data = await getBusinessById(businessId);
    setBusiness(business_data)

    if (list.length > 0) {
      loadConversation(list[0]);
    }
  }

  async function loadConversation(conv: ConversationResponse) {
    setSelected(conv);
    const full = await getConversation(conv.id);
    setConversationData(full);
  }

  async function handleCreateConversation() {
    if (!newTitle.trim()) return;

    const conv = await createConversation(businessId, newTitle.trim());
    setDialogOpen(false);
    setNewTitle("");

    await loadData();
    loadConversation(conv);
  }

  async function handleSend() {
    if (!conversationData || !message.trim()) return;

    const convId = conversationData.id;
    const content = message.trim();

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
    <div className="flex flex-col flex-1 p-6 overflow-auto">
    <AppBreadcrumb
        items={[
          { label: "Inicio", href: "/businesses" },
          { label: business?.name ?? "Business", href: `/businesses/${businessId}` },
          { label: "QAs", href: `/businesses/${businessId}/help/faqs` },
          { label: "Chatbot", href: `/businesses/${businessId}/chatbot` },
        ]}
    />
    <div className="flex flex-col md:flex-row h-[calc(100vh-10rem)] p-4 gap-4">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-72 border border-gray-300 rounded-none bg-white shadow-md p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-700">Conversaciones</h3>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-none shadow-sm">
                Nueva
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-none">
              <DialogHeader>
                <DialogTitle>Crear nueva conversación</DialogTitle>
              </DialogHeader>

              <Input
                placeholder="Título de la conversación"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-3 rounded-none"
              />

              <DialogFooter className="mt-4">
                <Button onClick={handleCreateConversation} className="rounded-none">
                  Crear
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Separator />

        {/* LISTA */}
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
                  className={`p-3 rounded-none cursor-pointer border border-gray-200 shadow-sm transition-all duration-100
                    ${
                      selected?.id === conv.id
                        ? "bg-slate-200 border-slate-400"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  onClick={() => loadConversation(conv)}
                >
                  <p className="font-medium text-slate-700">{conv.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(conv.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col border border-gray-300 rounded-none p-6 bg-white shadow-lg min-h-[60vh]">
        {selected ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-slate-700">
              {selected.title}
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4 border border-gray-200 p-4 rounded-none bg-gray-50 shadow-inner">
              {conversationData?.messages.length === 0 ? (
                <p className="text-gray-500 italic">No hay mensajes aún.</p>
              ) : (
                conversationData?.messages.map((msg, index) => (
                  <div key={index} className="flex flex-col">
                    <div
                      className={`p-3 rounded-none max-w-[80%] shadow-sm border
                        ${
                          msg.role === "assistant"
                            ? "bg-slate-200 text-slate-900 border-slate-300 self-start"
                            : "bg-blue-200 text-blue-900 border-blue-300 self-end ml-auto"
                        }`}
                    >
                      <div className="prose prose-sm max-w-none prose-p:my-0 prose-li:my-0 prose-headings:mt-0 prose-headings:mb-1">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>

                    {msg.role === "assistant" &&
                      msg.suggestions &&
                      msg.suggestions.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {msg.suggestions.map((sug, i) => (
                            <Button
                              key={i}
                              size="sm"
                              variant="outline"
                              className="rounded-sm shadow-sm"
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
                <div className="bg-slate-200 text-slate-700 p-3 rounded-none w-32 shadow-sm animate-pulse">
                  ...
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="rounded-none"
              />
              <Button onClick={handleSend} className="rounded-none shadow-sm">
                Enviar
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 italic">
            Selecciona o crea una conversación
          </div>
        )}
      </div>
    </div>
    </div>
  );
}