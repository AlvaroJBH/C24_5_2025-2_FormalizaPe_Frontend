"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, XIcon, CheckIcon } from "lucide-react";
import { Business } from "@/services/business-service";

interface TaxInfoSectionProps {
  business: Business;
  onStartFormalization: () => void;
}

export function TaxInfoSection({ business, onStartFormalization }: TaxInfoSectionProps) {
  const hasFormalIdentity = business.formalIdentity !== null;
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    onStartFormalization();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-600 rounded-full" />
          <h3 className="text-sm font-semibold text-gray-800">Datos Legales</h3>
        </div>
        {hasFormalIdentity && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-none hover:bg-gray-100"
            onClick={handleEdit}
          >
            <PencilIcon className="w-3.5 h-3.5 text-gray-500" />
          </Button>
        )}
      </div>

      {!hasFormalIdentity ? (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm mb-4">
            Tu negocio aún no tiene datos legales registrados.
          </p>
          <Button
            className="rounded-none"
            onClick={onStartFormalization}
          >
            Iniciar Formalización
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Nombre Comercial</span>
              <span className="text-gray-800 font-medium">{business.formalIdentity!.tradeName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Razón Social</span>
              <span className="text-gray-800 font-medium">{business.formalIdentity!.legalName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">RUC</span>
              <span className="text-gray-800 font-medium">{business.formalIdentity!.ruc}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Régimen Tributario</span>
              <span className="text-gray-800 font-medium">{business.formalIdentity!.taxRegime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Código CIIU</span>
              <span className="text-gray-800 font-medium">{business.formalIdentity!.ciiCode}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estado SUNAT</span>
              <span className="text-gray-800 font-medium">{business.formalIdentity!.sunatStatus}</span>
            </div>
          </div>
          {isEditing && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none flex-1"
                  onClick={handleCancel}
                >
                  <XIcon className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  className="rounded-none flex-1"
                  onClick={() => {
                    onStartFormalization();
                  }}
                >
                  <CheckIcon className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}