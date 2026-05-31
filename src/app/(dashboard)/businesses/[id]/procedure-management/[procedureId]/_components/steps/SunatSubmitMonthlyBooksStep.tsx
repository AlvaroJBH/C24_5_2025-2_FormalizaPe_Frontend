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
import { ExternalLink } from "lucide-react";
import { useBusinessStore } from "@/store/business-store";
import type { StepComponentProps } from "../StepFallbackModal";

const TAX_REGIME_LABELS: Record<string, string> = {
  GENERAL: "Régimen General",
  RER: "Régimen Especial de Rentas (RER)",
  RMT: "Régimen MYPE Tributario",
  NRUS: "Nuevo RUS",
};

const ACCOUNTING_LABELS: Record<string, string> = {
  SIMPLIFICADA: "Contabilidad Simplificada",
  COMPLETA: "Contabilidad Completa",
};

const SUNAT_SOL_URL = "https://www.sunat.gob.pe/sol.html";

export function SunatSubmitMonthlyBooksStep({
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;

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
            Declaración mensual de libros electrónicos
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Contexto del negocio
            </h3>

            <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">Régimen tributario</p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.taxRegime
                    ? TAX_REGIME_LABELS[formalIdentity.taxRegime] || formalIdentity.taxRegime
                    : "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">Obligación contable</p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.accountingObligation
                    ? ACCOUNTING_LABELS[formalIdentity.accountingObligation] || formalIdentity.accountingObligation
                    : "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">Libros electrónicos</p>
                <p className="text-sm font-medium">
                  {formalIdentity?.electronicBooksEnabled === true ? (
                    <span className="text-green-700">Activados</span>
                  ) : formalIdentity?.electronicBooksEnabled === false ? (
                    <span className="text-amber-700">No activados</span>
                  ) : (
                    <span className="text-gray-500">No definido</span>
                  )}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                Proceso mensual recurrente de cumplimiento tributario ante SUNAT.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Información del proceso
            </h3>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
              <p className="text-sm text-gray-700">
                Cada mes debes enviar la información de tus libros electrónicos
                a SUNAT mediante el sistema de declaraciones y pagos.
              </p>
              <p className="text-sm text-gray-700">
                Este proceso forma parte del cumplimiento tributario periódico
                del negocio.
              </p>

              <div className="pt-2 border-t border-yellow-200">
                <p className="text-xs text-gray-600">
                  El envío de libros electrónicos debe realizarse dentro de los
                  plazos establecidos según el tipo de libro y régimen tributario.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                3
              </span>
              Acción externa
            </h3>

            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <a
                href={SUNAT_SOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-none transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ir a SUNAT Operaciones en Línea
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
                  He tomado conocimiento del proceso mensual de declaración
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