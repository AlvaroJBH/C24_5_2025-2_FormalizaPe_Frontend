"use client";

import { Button } from "@/components/ui/button";
import { Business } from "@/services/business-service";
import { SectionHeader } from "./SectionHeader";

interface TaxInfoSectionProps {
  business: Business;
  onStartFormalization: () => void;
}

export function TaxInfoSection({ business, onStartFormalization }: TaxInfoSectionProps) {
  const hasFormalIdentity = business.formalIdentity !== null;

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <SectionHeader
        title="Datos Legales"
        isEditing={false}
        isSaving={false}
        onEdit={() => {}}
        onCancel={() => {}}
        onSave={() => {}}
      />

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
            <span className="text-gray-800 font-medium">{business.formalIdentity!.ciiuCode}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Estado SUNAT</span>
            <span className="text-gray-800 font-medium">{business.formalIdentity!.sunatStatus}</span>
          </div>
        </div>
      )}
    </div>
  );
}