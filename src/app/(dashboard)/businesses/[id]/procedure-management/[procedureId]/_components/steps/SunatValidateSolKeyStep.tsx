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

export function SunatValidateSolKeyStep({
  stepTitle,
  stepDescription,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const ruc = business?.formalIdentity?.ruc ?? null;

  const [confirmed, setConfirmed] = useState(false);

  const canComplete = confirmed && !!ruc;

  const handleComplete = () => {
    if (!canComplete) return;
    onComplete();
  };

  if (!ruc) {
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent size="lg" className="rounded-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {stepTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Validación de Usuario y Clave SOL
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="bg-amber-50 p-4 rounded border border-amber-200">
              <p className="text-sm text-amber-800 font-medium">
                Antes de continuar, completa el paso anterior
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Primero debes registrar tu RUC en el paso{" "}
                <strong>&quot;Registro del RUC&quot;</strong>. Luego podrás
                validar tu Usuario y Clave SOL.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-none"
            >
              Cerrar
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
            Valida o recupera tu Usuario y Clave SOL para trámites en línea
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Tus datos para validar SOL
            </h3>
            <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">RUC</p>
                <p className="text-2xl font-bold text-gray-900 font-mono tracking-widest">
                  {ruc}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                Para continuar con tus trámites en línea en SUNAT, necesitas tu
                <strong> Usuario SOL</strong> y <strong>Clave SOL</strong>.
              </p>
              <p className="text-sm text-gray-700">
                Si ya los tienes, puedes validarlos en el enlace correspondiente.
              </p>
              <p className="text-sm text-gray-600">
                Si olvidaste tu Usuario o Clave SOL, puedes recuperarlos usando
                tu RUC y datos personales.
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
              Accede a SUNAT para validar / recuperar SOL
            </h3>
            <div className="bg-green-50 p-4 rounded border border-green-200 space-y-4">
              <p className="text-sm font-medium text-gray-800">
                Valida o recupera tu Usuario y Clave SOL
              </p>

              <div className="space-y-3">
                <a
                  href="https://ww3.sunat.gob.pe/cl-ti-itestadousr/usrS00Alias"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-none font-medium text-sm transition-colors"
                >
                  <span>Validar Usuario/Clave SOL</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href="https://ww1.sunat.gob.pe/ol-ti-itmantpregrespsec/MantPregResp.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-none font-medium text-sm transition-colors border border-gray-300"
                >
                  <span>¿Olvidaste tu Usuario o Clave SOL?</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="pt-3 border-t border-green-200">
                <p className="text-xs text-gray-600">
                  Haz clic en los enlaces para ir a SUNAT y validar o recuperar
                  tu Usuario y Clave SOL. Este trámite se realiza en el portal
                  oficial de SUNAT y podría requerir confirmar datos personales.
                </p>
              </div>

              <div className="pt-3 border-t border-green-200 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    He validado o recuperado mi Usuario y Clave SOL y puedo
                    usarlos para trámites en línea.
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
            Guardar y continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}