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

const TAXPAYER_TYPE_LABELS: Record<string, string> = {
  PERSONA_NATURAL: "Persona Natural",
  PERSONA_JURIDICA: "Persona Jurídica",
};

export function SunatFulfillLaborObligationsStep({
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;

  const hasEmployees = formalIdentity?.hasEmployees ?? null;

  const [confirmed, setConfirmed] = useState(false);
  const canComplete = confirmed;

  const handleComplete = () => {
    if (!canComplete) return;
    onComplete();
  };

  if (hasEmployees === false) {
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent size="lg" className="rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {stepTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Obligaciones laborales del empleador
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="bg-amber-50 p-4 rounded border border-amber-200">
              <p className="text-sm text-amber-700 font-medium">
                Tu negocio no tiene trabajadores, por lo tanto estas obligaciones no aplican actualmente.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
              <p className="text-sm text-gray-700">
                Las obligaciones laborales son requisitos que adquiere el empleador
                cuando tiene trabajadores a su cargo.
              </p>
              <p className="text-xs text-gray-500">
                Si en el futuro contratas trabajadores, deberás cumplir con las
                obligaciones laborales correspondientes.
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
                  Entiendo las obligaciones laborales generales
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

  if (hasEmployees === true) {
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent size="xl" className="rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {stepTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Obligaciones laborales del empleador
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                Contexto del negocio
              </h3>

              <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">Tipo de contribuyente</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {formalIdentity?.taxpayerType
                      ? TAXPAYER_TYPE_LABELS[formalIdentity.taxpayerType] || formalIdentity.taxpayerType
                      : "No definido"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">RUC</p>
                  <p className="text-sm text-gray-800 font-medium font-mono">
                    {formalIdentity?.ruc || "No definido"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">Trabajadores</p>
                  <p className="text-sm text-gray-800 font-medium text-green-600">
                    Tiene trabajadores: Sí
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Obligaciones laborales y confirmación
              </h3>

              <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
                <p className="text-sm text-gray-700">
                  Como empleador, tienes las siguientes obligaciones laborales periódicas:
                </p>

                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>
                      <strong>Gratificaciones:</strong> Se pagan en julio y diciembre (o CTS proporcional)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>
                      <strong>CTS:</strong> Compensación por Tiempo de Servicios, se deposita semestralmente
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>
                      <strong>Vacaciones:</strong> 30 días calendarios por año completo de servicios
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>
                      <strong>Aportes a EsSalud:</strong> 9% de la remuneración bruta
                    </span>
                  </li>
                </ul>

                <div className="pt-2 border-t border-yellow-200">
                  <p className="text-xs text-gray-600">
                    Estas obligaciones aplican de forma periódica mientras existan
                    trabajadores registrados en el T-Registro.
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
                    Declaro que conozco las obligaciones laborales de mi negocio
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
            Obligaciones laborales del empleador
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