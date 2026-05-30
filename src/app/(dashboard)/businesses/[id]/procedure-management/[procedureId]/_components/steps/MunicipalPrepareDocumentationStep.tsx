"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBusinessStore } from "@/store/business-store";
import type { StepComponentProps } from "../StepFallbackModal";

function formatAddress(business: {
  address?: string;
  district?: string;
  province?: string;
  department?: string;
}): string {
  const parts = [business.address, business.district, business.province, business.department].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "No disponible";
}

export function MunicipalPrepareDocumentationStep({
  businessId,
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;
  const municipalLicenseRequired = formalIdentity?.municipalLicenseRequired ?? null;
  const [confirmed, setConfirmed] = useState(false);
  const canComplete = confirmed;

  const handleComplete = () => {
    if (!canComplete) return;
    onComplete();
  };

  if (municipalLicenseRequired === false) {
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent size="lg" className="rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {stepTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Preparación de documentación
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="bg-amber-50 p-4 rounded border border-amber-200">
              <p className="text-sm text-amber-700 font-medium">
                El negocio fue clasificado como no sujeto a licencia municipal de funcionamiento.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
              <p className="text-sm text-gray-700">
                Por ello, no es necesario reunir documentación adicional para este trámite.
              </p>
              <p className="text-xs text-gray-500">
                Este paso se marca como completado una vez confirmes que has leído esta información.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">
                  Comprendo que este paso no aplica para mi negocio
                </span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="rounded-none">
              Cancelar
            </Button>
            <Button
              onClick={handleComplete}
              className="rounded-none bg-green-600 hover:bg-green-700 text-white"
              disabled={!canComplete}
            >
              Completar y continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (municipalLicenseRequired === true) {
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent size="xl" className="rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {stepTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Preparación de documentación para licencia municipal
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                Información del negocio
              </h3>
              <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">Nombre del negocio</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {business?.displayName || "No disponible"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">Ubicación</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {formatAddress({
                      address: business?.address,
                      district: business?.district,
                      province: business?.province,
                      department: business?.department,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">RUC</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {formalIdentity?.ruc || "No disponible"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">Razón social</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {formalIdentity?.legalName || "No disponible"}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Documentación a preparar
              </h3>
              <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
                <p className="text-sm text-gray-700">
                  Antes de solicitar una licencia municipal, debes reunir la documentación
                  requerida por la municipalidad correspondiente.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 font-medium">Documentación habitualmente solicitada:</p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>RUC activo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Documento de identidad</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Contrato de alquiler o documento que acredite posesión del local</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Declaraciones juradas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Formularios municipales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Planos u otros requisitos según la municipalidad</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-yellow-200">
                  <p className="text-xs text-gray-600">
                    Los requisitos exactos dependen del municipio correspondiente. Consulta
                    directamente ante la municipalidad del distrito donde operará el negocio.
                  </p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    He reunido o revisado la documentación necesaria para solicitar la licencia municipal
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="rounded-none">
              Cancelar
            </Button>
            <Button
              onClick={handleComplete}
              className="rounded-none bg-green-600 hover:bg-green-700 text-white"
              disabled={!canComplete}
            >
              Completar y continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg" className="rounded-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {stepTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Preparación de documentación
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="bg-gray-100 p-4 rounded border border-gray-200">
            <p className="text-sm text-gray-500 text-center">Cargando información...</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button onClick={onClose} variant="outline" className="rounded-none">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}