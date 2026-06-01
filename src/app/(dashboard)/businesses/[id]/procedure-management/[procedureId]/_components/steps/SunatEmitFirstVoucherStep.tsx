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
import { useAuthStore } from "@/store/auth-store";
import type { StepComponentProps } from "../StepFallbackModal";

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

export function SunatEmitFirstVoucherStep({
  stepTitle,
  stepDescription,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;
  const user = useAuthStore((s) => s.user);

  const isPersonaNatural = formalIdentity?.taxpayerType === "PERSONA_NATURAL";
  const ruc = isPersonaNatural ? (user?.ruc ?? null) : (formalIdentity?.ruc ?? null);
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
            Emite tu primer comprobante electrónico en SUNAT
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Tu estado actual
            </h3>
            <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">RUC</p>
                <p className="text-lg font-bold text-gray-900 font-mono">
                  {ruc || "No registrado"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Régimen tributario
                </p>
                <p className="text-sm text-gray-800">
                  {taxRegime
                    ? TAX_REGIME_LABELS[taxRegime] || taxRegime
                    : "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Tipo de comprobante
                </p>
                <p className="text-sm text-gray-800">
                  {voucherType
                    ? VOUCHER_TYPE_LABELS[voucherType] || voucherType
                    : "No definido"}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                Ya estás listo para emitir tu primer comprobante electrónico en SUNAT.
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
              Emisión en SUNAT
            </h3>
            <div className="bg-green-50 p-4 rounded border border-green-200 space-y-4">
              <a
                href="https://ww3.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-none font-medium text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ir a SUNAT – Emitir comprobante
              </a>
              <div className="pt-3 border-t border-green-200 space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  Pasos para emitir tu primer comprobante:
                </p>
                <ol className="space-y-1 text-xs text-gray-600 list-decimal list-inside">
                  <li>Ingresa a SUNAT Operaciones en Línea.</li>
                  <li>Ve a: Comprobantes de Pago → Emisión Electrónica.</li>
                  <li>Selecciona Emitir comprobante.</li>
                  <li>Completa los datos de la venta (RUC del cliente, monto, descripción).</li>
                  <li>Confirma la emisión.</li>
                </ol>
              </div>
              <div className="pt-2 border-t border-green-200">
                <p className="text-xs text-gray-500">
                  Una vez emitido tu primer comprobante, tu empresa queda registrada como emisor electrónico activo.
                </p>
              </div>
              <div className="pt-2 border-t border-green-200 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    He emitido mi primer comprobante electrónico en SUNAT.
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
            He emitido mi primer comprobante – Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}