"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getChatbotDocuments,
  createChatbotDocument,
  updateChatbotDocument,
  deleteChatbotDocument,
  ChatbotDocument,
} from "@/services/chatbot-document-service";
import { DocumentForm } from "./DocumentForm";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

export function ChatbotPanel() {
  const [documents, setDocuments] = useState<ChatbotDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ChatbotDocument | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ChatbotDocument | null>(null);

  const fetchDocuments = () => {
    setLoading(true);
    getChatbotDocuments()
      .then(setDocuments)
      .catch(() => setError("Error al cargar documentos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreate = () => {
    setEditingDoc(null);
    setFormOpen(true);
  };

  const handleEdit = (doc: ChatbotDocument) => {
    setEditingDoc(doc);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setFormLoading(true);
    try {
      await deleteChatbotDocument(deleteTarget.id);
      setDeleteTarget(null);
      fetchDocuments();
    } catch {
      setError("Error al eliminar documento");
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = async (data: {
    title: string;
    description: string;
    file?: File;
  }) => {
    setFormLoading(true);
    try {
      if (editingDoc) {
        await updateChatbotDocument(editingDoc.id, {
          title: data.title,
          description: data.description,
        });
      } else {
        if (!data.file) {
          setError("Debes seleccionar un archivo");
          setFormLoading(false);
          return;
        }
        await createChatbotDocument({
          title: data.title,
          description: data.description,
          file: data.file,
        });
      }
      setFormOpen(false);
      fetchDocuments();
    } catch {
      setError(editingDoc ? "Error al actualizar documento" : "Error al subir documento");
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Gestión de Documentos del Chatbot
        </h2>
        <Button onClick={handleCreate} className="rounded-none" size="sm">
          Subir documento
        </Button>
      </div>

      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && documents.length === 0 && (
        <p className="text-gray-500">
          No hay documentos registrados. Sube uno para empezar.
        </p>
      )}

      {!loading && documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-none p-3 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{doc.title}</p>
                <p className="text-sm text-gray-500 truncate">{doc.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {doc.fileName} · {formatDate(doc.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(doc)}
                  className="rounded-none h-7 px-2 text-xs"
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteTarget(doc)}
                  className="rounded-none h-7 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DocumentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingDoc ? { title: editingDoc.title, description: editingDoc.description } : null}
        loading={formLoading}
        mode={editingDoc ? "edit" : "create"}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar documento"
        description={`¿Eliminar "${deleteTarget?.title}"? Esta acción no se puede deshacer y eliminará el archivo de Cloudinary.`}
        onConfirm={handleDelete}
        confirmLabel="Eliminar"
        destructive
      />
    </div>
  );
}