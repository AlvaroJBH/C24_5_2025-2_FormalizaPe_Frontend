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

const TREGISTRO_URL = "https://www.gob.pe/8048-registro-de-trabajadores-t-registro";

export function EsSaludVerifyInsuredWorkersStep({
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
              Verificación de trabajadores asegurados
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
                Este paso permite verificar que los trabajadores estén correctamente
                registrados en el T-Registro.
              </p>
              <p className="text-xs text-gray-500">
                Cuando actives tu planilla, podrás verificar el estado de cobertura
                de tus trabajadores en EsSalud.
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
                  Entiendo que debo verificar mis trabajadores en el T-Registro
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
            Verificación de trabajadores asegurados
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

            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                Este paso permite verificar que los trabajadores estén correctamente
                registrados en el T-Registro.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Verificación y confirmación
            </h3>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
              <p className="text-sm text-gray-700">
                El T-Registro es la base donde se registran los trabajadores.
              </p>
              <p className="text-sm text-gray-700">
                EsSalud valida la cobertura a partir de esa información.
              </p>
              <p className="text-xs text-gray-600">
                Este paso es una verificación, no un registro.
              </p>

              <div className="pt-2 border-t border-yellow-200">
                <p className="text-sm text-gray-700 font-medium">
                  Debes confirmar que los trabajadores han sido correctamente
                  registrados en el T-Registro.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <a
                href={TREGISTRO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Ir al T-Registro SUNAT
              </a>
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
                  He verificado que mis trabajadores están registrados en el T-Registro
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