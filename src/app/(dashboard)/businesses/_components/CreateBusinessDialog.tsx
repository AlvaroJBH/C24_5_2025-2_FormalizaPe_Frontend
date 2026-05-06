"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BusinessForm } from "./BusinessForm";

interface CreateBusinessDialogProps {
  onSubmit: (data: {
    name: string;
    description: string;
    sector: string;
    status: string;
  }) => Promise<void>;
}

export function CreateBusinessDialog({ onSubmit }: CreateBusinessDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-none">
          <PlusIcon className="w-4 h-4 mr-2" />
          Crear Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-none">
        <DialogHeader>
          <DialogTitle>Crear nueva empresa</DialogTitle>
        </DialogHeader>
        <BusinessForm
          submitLabel="Crear"
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}