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

const TAXPAYER_TYPE_LABELS: Record<string, string> = {
  PERSONA_NATURAL: "Persona Natural",
  PERSONA_JURIDICA: "Persona Jurídica",
};

export function SunatRegisterWorkersStep({
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;

  const hasEmployees = formalIdentity?.hasEmployees ?? null;
  const taxpayerType = formalIdentity?.taxpayerType ?? null;

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
              Registro de trabajadores ante SUNAT
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="bg-amber-50 p-4 rounded border border-amber-200">
              <p className="text-sm text-amber-700 font-medium">
                Este paso no aplica porque has indicado que tu negocio no tiene trabajadores.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
              <p className="text-sm text-gray-700">
                Según la declaración realizada en el paso anterior, tu negocio opera
                sin personal contratado.
              </p>
              <p className="text-xs text-gray-500">
                El T-Registro (Registro de Trabajadores) es un requisito obligatorio
                para negocios que sí tienen trabajadores a su cargo.
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
                  Entiendo que no debo registrar trabajadores
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
              Registro de trabajadores ante SUNAT
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
                  <p className="text-xs text-blue-500 font-medium mb-1">
                    Tipo de contribuyente
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {taxpayerType
                      ? TAXPAYER_TYPE_LABELS[taxpayerType] || taxpayerType
                      : "No definido"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">
                    Estado de trabajadores
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    El negocio tiene trabajadores
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-600">
                  El <strong>T-Registro</strong> es el registro obligatorio en SUNAT
                  donde se inscriben los trabajadores, pensionistas y prestadores
                  de servicios de un negocio.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Registro de trabajadores
              </h3>

              <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
                <p className="text-sm text-gray-700">
                  Si tu negocio tiene trabajadores, debes registrarlos obligatoriamente
                  en el T-Registro de SUNAT antes de pagar planilla.
                </p>
                <a
                  href="https://www.gob.pe/8048-registro-de-trabajadores-t-registro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-none font-medium text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Registro de trabajadores – T-Registro (SUNAT)
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
                    Ya registré a mis trabajadores en el T-Registro
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
            Registro de trabajadores ante SUNAT
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="bg-gray-100 p-4 rounded border border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Cargando información...
            </p>
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