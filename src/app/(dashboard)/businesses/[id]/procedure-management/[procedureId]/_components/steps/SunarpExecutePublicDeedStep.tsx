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

export function SunarpExecutePublicDeedStep({
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
            Confirmación de elevación de minuta a escritura pública
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Preparación previa
            </h3>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
              <p className="text-sm text-gray-700 font-medium">
                Antes de ir a la notaría, asegúrate de tener:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Minuta de constitución y estatuto ya elaborados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Datos de los socios o titular (DNI, nombres completos)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Capital social definido y acordado entre socios</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Notario público de tu elección</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-xs text-blue-700">
                Este es un paso que realizas de forma externa, fuera del sistema.
                El notario es quien eleva la minuta a escritura pública.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Escritura pública
            </h3>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  ¿Qué es la escritura pública?
                </p>
                <p className="text-sm text-gray-700">
                  Es el acto mediante el cual el notario da validez legal formal
                  a la minuta de constitución. Es un requisito obligatorio para
                  que la empresa quede legalmente constituida.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  ¿Qué debes hacer?
                </p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Acudir a la notaría con la minuta y estatuto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Firmar la escritura pública ante el notario</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>El notario remite el testimonio a SUNARP</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-yellow-200">
                <p className="text-xs text-gray-600">
                  Este sistema no realiza ni gestiona este trámite. La escritura
                  pública se gestiona directamente con el notario.
                </p>
              </div>
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
                  Confirmo que la minuta ya fue elevada a escritura pública ante
                  notario, o que realizaré este trámite antes de continuar.
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