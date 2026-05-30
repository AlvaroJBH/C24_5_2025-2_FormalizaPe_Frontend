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

const TAX_REGIME_LABELS: Record<string, string> = {
  RUS: "Nuevo RUS",
  RER: "Régimen Especial de Tributación",
  MYPE: "Régimen MYPE Tributario",
  GENERAL: "Régimen General",
};

const VOUCHER_TYPE_LABELS: Record<string, string> = {
  BOLETA: "Boleta de Venta",
  FACTURA: "Factura",
  AMBOS: "Ambos tipos",
};

export function SunatAuthorizeVoucherSeriesStep({
  stepTitle,
  stepDescription,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;

  const taxpayerType = formalIdentity?.taxpayerType ?? null;
  const taxRegime = formalIdentity?.taxRegime ?? null;
  const voucherType = formalIdentity?.voucherType ?? null;

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
            Comprende cómo SUNAT asigna series automáticamente a tus comprobantes
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Tu configuración actual
            </h3>
            <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Tipo de contribuyente
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {taxpayerType
                    ? TAXPAYER_TYPE_LABELS[taxpayerType] || taxpayerType
                    : "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Régimen tributario
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {taxRegime
                    ? TAX_REGIME_LABELS[taxRegime] || taxRegime
                    : "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Tipo de comprobante
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {voucherType
                    ? VOUCHER_TYPE_LABELS[voucherType] || voucherType
                    : "No definido"}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                Según tu configuración, el sistema te indica cómo SUNAT maneja
                automáticamente las series de emisión.
              </p>
            </div>
            {stepDescription && (
              <p className="text-xs text-gray-500 italic">{stepDescription}</p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Cómo funcionan las series
            </h3>
            <div className="bg-green-50 p-4 rounded border border-green-200 space-y-4">
              {voucherType === "BOLETA" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧾</span>
                    <p className="text-sm font-semibold text-gray-800">Boleta de Venta</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200 space-y-1">
                    <p className="text-xs text-gray-700">
                      <strong>Serie SUNAT SOL:</strong> E002
                    </p>
                    <p className="text-xs text-gray-700">
                      <strong>Serie otros sistemas:</strong> B001
                    </p>
                    <p className="text-xs text-gray-700">
                      <strong>Numeración:</strong> inicia en 1
                    </p>
                  </div>
                </div>
              )}

              {voucherType === "FACTURA" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧾</span>
                    <p className="text-sm font-semibold text-gray-800">Factura</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200 space-y-1">
                    <p className="text-xs text-gray-700">
                      <strong>Serie SUNAT SOL:</strong> E001
                    </p>
                    <p className="text-xs text-gray-700">
                      <strong>Serie otros sistemas:</strong> F001
                    </p>
                    <p className="text-xs text-gray-700">
                      <strong>Numeración:</strong> inicia en 1
                    </p>
                  </div>
                </div>
              )}

              {voucherType === "AMBOS" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧾</span>
                    <p className="text-sm font-semibold text-gray-800">Boleta de Venta</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200 space-y-1">
                    <p className="text-xs text-gray-700">
                      <strong>Serie SUNAT SOL:</strong> E002
                    </p>
                    <p className="text-xs text-gray-700">
                      <strong>Serie otros sistemas:</strong> B001
                    </p>
                    <p className="text-xs text-gray-700">
                      <strong>Numeración:</strong> inicia en 1
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-lg">🧾</span>
                    <p className="text-sm font-semibold text-gray-800">Factura</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200 space-y-1">
                    <p className="text-xs text-gray-700">
                      <strong>Serie SUNAT SOL:</strong> E001
                    </p>
                    <p className="text-xs text-gray-700">
                      <strong>Serie otros sistemas:</strong> F001
                    </p>
                    <p className="text-xs text-gray-700">
                      <strong>Numeración:</strong> inicia en 1
                    </p>
                  </div>
                </div>
              )}

              {!voucherType && (
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs text-gray-500">
                    Completa los pasos anteriores para ver la configuración de series.
                  </p>
                </div>
              )}

              {voucherType && (
                <div className="pt-3 border-t border-green-200">
                  <p className="text-xs text-gray-500">
                    Tu configuración incluye emisión de boletas y/u facturas. SUNAT
                    asigna automáticamente una serie para cada tipo de comprobante.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-green-200 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    Entiendo cómo funcionan las series de emisión en SUNAT y puedo continuar.
                  </span>
                </label>
              </div>
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
            Entiendo cómo funcionan las series – Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}