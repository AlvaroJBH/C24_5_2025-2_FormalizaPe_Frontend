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
import type { StepComponentProps } from "../StepFallbackModal";

export function SunarpRegisterCompanyStep({
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const [confirmed, setConfirmed] = useState(false);

  const canComplete = confirmed;

  const handleComplete = () => {
    if (!canComplete) return;
    onComplete();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl" className="rounded-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {stepTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Confirmación de inscripción de la empresa en SUNARP
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              ¿Qué significa inscribirse en SUNARP?
            </h3>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
              <p className="text-sm text-gray-700">
                Inscribir la empresa en SUNARP es el paso que le da existencia
                legal. Hasta que no se inscribe, la empresa no existe formalmente.
              </p>

              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  ¿Qué ocurre con la inscripción?
                </p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>La empresa obtiene personería jurídica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>SUNARP le asigna un número de partida registral</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Se genera automáticamente un RUC a nombre de la empresa</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  ¿Quién realiza el trámite?
                </p>
                <p className="text-sm text-gray-700">
                  El notario envía el parte notarial a SUNARP. El proceso de
                  inscripción puede tardar hasta 24 horas.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-1">
                ¿Qué debes tener a la mano?
              </p>
              <ul className="space-y-1 text-xs text-blue-700">
                <li className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>Correo de confirmación de SUNARP o notaría</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>Número de partida registral (si ya lo tienes)</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 p-3 rounded border border-amber-200">
              <p className="text-xs text-amber-700">
                La activación del RUC ante SUNAT se realizará en un paso posterior.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Confirmaciones
            </h3>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
              <p className="text-sm text-gray-700 font-medium">
                Verifica que se cumplan estas condiciones:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>El notario ya envió el parte notarial a SUNARP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>SUNARP ya inscribió la empresa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>He recibido la confirmación de inscripción</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded border border-green-200 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">
                  Confirmo que mi empresa ya está inscrita en SUNARP y cuenta con
                  personería jurídica.
                </span>
              </label>
            </div>

            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                Este paso es declarativo. El sistema no valida la inscripción
                directamente con SUNARP.
              </p>
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