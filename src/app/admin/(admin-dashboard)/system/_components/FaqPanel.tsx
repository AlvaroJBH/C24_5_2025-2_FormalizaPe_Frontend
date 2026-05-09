"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  AdminFaq,
  CreateFaqDTO,
} from "@/services/admin-faq-service";
import { FaqForm } from "./FaqForm";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["Formalización", "Tributación", "Licencias", "Plataforma"];

export function FaqPanel() {
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminFaq | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");

  const fetchFaqs = () => {
    setLoading(true);
    getAllFaqs()
      .then(setFaqs)
      .catch(() => setError("Error al cargar FAQs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const filteredAndSortedFaqs = useMemo(() => {
    const filtered =
      selectedCategory === "todas"
        ? faqs
        : faqs.filter((faq) => faq.category === selectedCategory);

    return [...filtered].sort((a, b) => {
      const orderA = a.displayOrder ?? 999;
      const orderB = b.displayOrder ?? 999;
      return orderA - orderB;
    });
  }, [faqs, selectedCategory]);

  const handleCreate = () => {
    setEditingFaq(null);
    setFormOpen(true);
  };

  const handleEdit = (faq: AdminFaq) => {
    setEditingFaq(faq);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setFormLoading(true);
    try {
      await deleteFaq(deleteTarget.id);
      setDeleteTarget(null);
      fetchFaqs();
    } catch {
      setError("Error al eliminar FAQ");
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = async (data: CreateFaqDTO) => {
    setFormLoading(true);
    try {
      if (editingFaq) {
        await updateFaq(editingFaq.id, data);
      } else {
        await createFaq(data);
      }
      setFormOpen(false);
      fetchFaqs();
    } catch {
      setError(editingFaq ? "Error al actualizar FAQ" : "Error al crear FAQ");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (faq: AdminFaq) => {
    setFormLoading(true);
    try {
      await updateFaq(faq.id, {
        category: faq.category,
        questionTitle: faq.questionTitle,
        response: faq.response,
        displayOrder: faq.displayOrder,
        active: !faq.active,
      });
      fetchFaqs();
    } catch {
      setError("Error al actualizar estado");
    } finally {
      setFormLoading(false);
    }
  };

  const getCategoryCount = (category: string) =>
    faqs.filter((f) => f.category === category).length;

  return (
    <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Gestión de Preguntas Frecuentes
        </h2>
        <Button onClick={handleCreate} className="rounded-none" size="sm">
          Nueva FAQ
        </Button>
      </div>

      <div className="mb-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-56 rounded-none">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">
              Todas ({faqs.length})
            </SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat} ({getCategoryCount(cat)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && filteredAndSortedFaqs.length === 0 && (
        <p className="text-gray-500">
          {selectedCategory === "todas"
            ? "No hay preguntas frecuentes registradas."
            : `No hay preguntas en "${selectedCategory}".`}
        </p>
      )}

      {!loading && filteredAndSortedFaqs.length > 0 && (
        <div className="space-y-2">
          {filteredAndSortedFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-none p-3 flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-none">
                <span className="text-sm font-semibold text-gray-600">
                  {faq.displayOrder ?? index + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    {faq.category}
                  </span>
                  {!faq.active && (
                    <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded-none">
                      Inactivo
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-800 truncate">
                  {faq.questionTitle}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Switch
                  checked={faq.active}
                  onCheckedChange={() => handleToggleActive(faq)}
                  aria-label={faq.active ? "Desactivar" : "Activar"}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(faq)}
                  className="rounded-none h-7 px-2 text-xs"
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteTarget(faq)}
                  className="rounded-none h-7 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FaqForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingFaq}
        loading={formLoading}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar pregunta"
        description={`¿Estás seguro de eliminar la pregunta "${deleteTarget?.questionTitle}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        confirmLabel="Eliminar"
        destructive
      />
    </div>
  );
}