"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateFaqDTO } from "@/services/admin-faq-service";

interface FaqFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateFaqDTO) => void;
  initialData?: CreateFaqDTO | null;
  loading?: boolean;
}

const CATEGORIES = ["Formalización","Tributación","Licencias","Plataforma"];

export function FaqForm({ open, onOpenChange, onSubmit, initialData, loading }: FaqFormProps) {
  const [category, setCategory] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [response, setResponse] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setQuestionTitle(initialData.questionTitle);
      setResponse(initialData.response);
      setDisplayOrder(initialData.displayOrder?.toString() ?? "");
    } else {
      setCategory("");
      setQuestionTitle("");
      setResponse("");
      setDisplayOrder("");
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      category,
      questionTitle,
      response,
      displayOrder: displayOrder ? parseInt(displayOrder) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar FAQ" : "Nueva FAQ"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="questionTitle">Pregunta</Label>
            <Input
              id="questionTitle"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              placeholder="¿Cómo puedo...?"
              required
              className="rounded-none"
            />
          </div>

          <div>
            <Label htmlFor="response">Respuesta</Label>
            <Textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Para realizar..."
              required
              className="rounded-none"
            />
          </div>

          <div>
            <Label htmlFor="displayOrder">Orden de visualización</Label>
            <Input
              id="displayOrder"
              type="number"
              min="0"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="0"
              className="rounded-none"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-none"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="rounded-none">
              {loading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}