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

export function SunatRecordTransactionsStep({
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;

  const electronicBooksEnabled = formalIdentity?.electronicBooksEnabled ?? null;
  const hasElectronicBooks = electronicBooksEnabled === true;

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
            Registro de operaciones del negocio
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Estado del negocio
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
                  {electronicBooksEnabled === true ? (
                    <span className="text-green-700">Activados</span>
                  ) : electronicBooksEnabled === false ? (
                    <span className="text-amber-700">No activados</span>
                  ) : (
                    <span className="text-gray-500">No definido</span>
                  )}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                El registro de operaciones constituye el marco contable donde se
                controla las ventas y compras del negocio, generando la información
                necesaria para las declaraciones tributarias.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Registro de operaciones
            </h3>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
              <p className="text-sm text-gray-700">
                El registro de operaciones consiste en el control de las ventas
                y compras del negocio, información que sustenta la contabilidad
                y las declaraciones tributarias.
              </p>

              {hasElectronicBooks ? (
                <div className="pt-3 border-t border-yellow-200 space-y-3">
                  <p className="text-sm text-gray-700">
                    Al tener libros electrónicos activados, el registro de tus
                    operaciones se realiza a través del sistema SUNAT Operaciones
                    en Línea (SOL).
                  </p>
                  <p className="text-xs text-gray-600">
                    Todas las ventas y compras deben ser registradas en el portal
                    para mantener tu contabilidad al día con SUNAT.
                  </p>
                </div>
              ) : (
                <div className="pt-3 border-t border-yellow-200 space-y-3">
                  <p className="text-sm text-gray-700">
                    Al no contar con libros electrónicos activados, el registro
                    de operaciones puede realizarse de forma manual o mediante
                    sistemas externos autorizados.
                  </p>
                  <p className="text-xs text-gray-600">
                    Es importante mantener un control estricto de tus operaciones
                    para cumplir con tus obligaciones tributarias.
                  </p>
                </div>
              )}
            </div>

            {hasElectronicBooks && (
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
            )}

            <div className="bg-green-50 p-4 rounded border border-green-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">
                  He entendido cómo se registran las operaciones del negocio
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