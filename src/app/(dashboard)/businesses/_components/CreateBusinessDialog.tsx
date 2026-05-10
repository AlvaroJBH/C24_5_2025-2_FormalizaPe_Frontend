"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function CreateBusinessDialog() {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-none">
          <PlusIcon className="w-4 h-4 mr-2" />
          Crear Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-none max-w-md">
        <DialogHeader>
          <DialogTitle>¿Deseas crear una nueva empresa?</DialogTitle>
          <DialogDescription>
            El asistente te guiará paso a paso para registrar los datos de tu empresa.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="rounded-none"
            onClick={() => {
              const closeBtn = document.querySelector('[data-state="open"] button[class*="close"]') as HTMLButtonElement;
              closeBtn?.click();
            }}
          >
            Cancelar
          </Button>
          <Button
            className="rounded-none"
            onClick={() => router.push("/businesses/new")}
          >
            Sí, crear empresa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}