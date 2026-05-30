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

export function MunicipalVerifyZoningStep({
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
              Verificación de zonificación
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="bg-amber-50 p-4 rounded border border-amber-200">
              <p className="text-sm text-amber-700 font-medium">
                Según la evaluación realizada anteriormente, tu negocio no requiere
                licencia municipal de funcionamiento.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
              <p className="text-sm text-gray-700">
                Por ello, la verificación de zonificación no aplica para este negocio.
              </p>
              <p className="text-xs text-gray-500">
                La zonificación es una validación que realizan las municipalidades para
                confirmar que una actividad económica está permitida en una determinada zona.
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
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-none"
            >
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
              Verificación de zonificación ante la municipalidad
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                Información del establecimiento
              </h3>

              <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">
                    Ubicación del negocio
                  </p>
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
                  <p className="text-xs text-blue-500 font-medium mb-1">
                    Nombre comercial
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {formalIdentity?.tradeName || "No disponible"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">
                    Razón social
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {formalIdentity?.legalName || "No disponible"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">
                    Código CIIU
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {formalIdentity?.ciiuCode || "No disponible"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-600">
                  Esta información será utilizada como referencia para verificar si la
                  actividad económica puede desarrollarse en la ubicación indicada.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Verificación de zonificación
              </h3>

              <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
                <p className="text-sm text-gray-700">
                  Antes de solicitar una licencia municipal, debes verificar que la
                  actividad económica declarada esté permitida en la zona donde funcionará
                  el negocio.
                </p>

                <p className="text-sm text-gray-700">
                  La municipalidad correspondiente puede establecer restricciones según
                  el tipo de actividad y la ubicación del establecimiento.
                </p>

                <div className="pt-2 border-t border-yellow-200">
                  <p className="text-sm text-gray-700">
                    Esta consulta debe realizarse directamente ante la municipalidad del
                    distrito donde operará el negocio.
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
                    He verificado o comprendo que debo verificar la zonificación del
                    establecimiento ante la municipalidad correspondiente
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-none"
            >
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
            Verificación de zonificación
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="bg-gray-100 p-4 rounded border border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Cargando información de la evaluación...
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-none"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}