import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Business, CreateBusinessData } from "@/services/business-service";
import { BusinessForm } from "./BusinessForm";

interface BusinessActionsProps {
  business: Business;
  editingBusinessId: number | null;
  deletingBusinessId: number | null;
  onEditOpenChange: (open: boolean, id: number) => void;
  onDeleteOpenChange: (open: boolean, id: number) => void;
  onUpdate: (id: number, data: CreateBusinessData) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
}

export function BusinessActions({
  business,
  editingBusinessId,
  deletingBusinessId,
  onEditOpenChange,
  onDeleteOpenChange,
  onUpdate,
  onDeleteConfirm,
}: BusinessActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        asChild
        size="sm"
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-none"
      >
        <Link href={`/businesses/${business.id}`}>
          <EyeIcon className="w-4 h-4 mr-1.5" />
          Ver detalles
        </Link>
      </Button>

      <Dialog
        open={editingBusinessId === business.id}
        onOpenChange={(open) => onEditOpenChange(open, business.id)}
      >
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-none"
          >
            <PencilIcon className="w-4 h-4 mr-1.5" />
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Editar Negocio
            </DialogTitle>
          </DialogHeader>
          <BusinessForm
            initial={business}
            submitLabel="Actualizar"
            onSubmit={async (data) => {
              await onUpdate(business.id, data);
              onEditOpenChange(false, business.id);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deletingBusinessId === business.id}
        onOpenChange={(open) => onDeleteOpenChange(open, business.id)}
      >
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-none"
          >
            <TrashIcon className="w-4 h-4 mr-1.5" />
            Eliminar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">
              Eliminar Negocio
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              ¿Estás seguro que quieres eliminar el negocio{" "}
              <strong className="text-gray-900">{business.displayName}</strong>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => onDeleteOpenChange(false, business.id)}
              className="border-gray-300"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}