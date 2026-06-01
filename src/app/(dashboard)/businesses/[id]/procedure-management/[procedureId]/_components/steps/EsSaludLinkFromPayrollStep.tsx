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
import { useAuthStore } from "@/store/auth-store";
import type { StepComponentProps } from "../StepFallbackModal";

const TAXPAYER_TYPE_LABELS: Record<string, string> = {
  PERSONA_NATURAL: "Persona Natural",
  PERSONA_JURIDICA: "Persona Jurídica",
};

export function EsSaludLinkFromPayrollStep({
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;
  const user = useAuthStore((s) => s.user);

  const isPersonaNatural = formalIdentity?.taxpayerType === "PERSONA_NATURAL";
  const ruc = isPersonaNatural ? (user?.ruc ?? null) : (formalIdentity?.ruc ?? null);

  const payrollEnabled = formalIdentity?.payrollEnabled ?? null;

  const [confirmed, setConfirmed] = useState(false);
  const canComplete = confirmed;

  const handleComplete = () => {
    if (!canComplete) return;
    onComplete();
  };

  if (payrollEnabled !== true) {
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent size="lg" className="rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {stepTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Vinculación con EsSalud
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="bg-amber-50 p-4 rounded border border-amber-200">
              <p className="text-sm text-amber-700 font-medium">
                Tu planilla no está activa actualmente.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
              <p className="text-sm text-gray-700">
                EsSalud se vincula automáticamente mediante la planilla electrónica (PLAME).
              </p>
              <p className="text-xs text-gray-500">
                Cuando actives tu planilla, los aportes de salud se generarán desde los
                trabajadores registrados en el T-Registro. No es un trámite independiente.
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
                  Entiendo que EsSalud se vincula a través de la planilla electrónica
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

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl" className="rounded-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {stepTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Vinculación con EsSalud
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
                  {ruc || "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">Estado SUNAT</p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.sunatStatus || "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">Estado planilla</p>
                <p className="text-sm text-gray-800 font-medium text-green-600">
                  Activa
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Explicación y confirmación
            </h3>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
              <p className="text-sm text-gray-700">
                EsSalud se vincula automáticamente mediante la planilla electrónica (PLAME).
              </p>
              <p className="text-sm text-gray-700">
                Los aportes de salud se generan desde trabajadores registrados en T-Registro.
              </p>
              <p className="text-xs text-gray-600">
                No es un trámite independiente.
              </p>

              <div className="pt-2 border-t border-yellow-200">
                <p className="text-sm text-gray-700 font-medium">
                  La vinculación con EsSalud ocurre automáticamente al activar la planilla electrónica.
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
                  Entiendo que EsSalud se vincula a través de la planilla electrónica
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