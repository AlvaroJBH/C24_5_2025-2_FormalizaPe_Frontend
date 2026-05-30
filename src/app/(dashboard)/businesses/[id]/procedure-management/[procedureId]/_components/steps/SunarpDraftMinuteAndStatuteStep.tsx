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

const COMPANY_TYPE_LABELS: Record<string, string> = {
  EIRL: "EIRL",
  SAC: "SAC",
  SRL: "SRL",
  PERSONA_NATURAL: "Persona Natural",
};

function formatAddress(business: {
  address?: string;
  district?: string;
  province?: string;
  department?: string;
}): string {
  const parts = [business.address, business.district, business.province, business.department].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "No definido aún";
}

export function SunarpDraftMinuteAndStatuteStep({
  businessId,
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
            Información del negocio para la minuta de constitución
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Datos del negocio
            </h3>

            <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Nombre del negocio
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  {business?.displayName || "No definido aún"}
                </p>
              </div>

              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Dirección
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  {formatAddress({
                    address: business?.address,
                    district: business?.district,
                    province: business?.province,
                    department: business?.department,
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Nombre comercial
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.tradeName || "No definido aún"}
                </p>
              </div>

              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Razón social
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.legalName || "No definido aún"}
                </p>
              </div>

              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Tipo de empresa
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.companyType
                    ? COMPANY_TYPE_LABELS[formalIdentity.companyType] || formalIdentity.companyType
                    : "No definido aún"}
                </p>
              </div>

              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Tipo de contribuyente
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.taxpayerType
                    ? TAXPAYER_TYPE_LABELS[formalIdentity.taxpayerType] || formalIdentity.taxpayerType
                    : "No definido aún"}
                </p>
              </div>

              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Actividad económica (CIIU)
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.ciiuCode || "No definido aún"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                Estos datos serán utilizados para elaborar la minuta de constitución
                y el estatuto. No se modifican en este paso.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Minuta y estatuto
            </h3>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  ¿Qué es la minuta de constitución?
                </p>
                <p className="text-sm text-gray-700">
                  Es el documento que contiene todas las decisiones sobre la
                  creación de tu empresa: estructura, socios, capital, órganos
                  de gestión y reglas de funcionamiento.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  ¿Qué es el estatuto?
                </p>
                <p className="text-sm text-gray-700">
                  Es el documento que define las reglas internas permanentes de
                  la empresa: derechos y obligaciones de los socios, gobierno
                  corporativo y mecanismos de toma de decisiones.
                </p>
              </div>

              <div className="pt-2 border-t border-yellow-200 space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  ¿Quién los elabora?
                </p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Un abogado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Una notaría</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Un servicio legal externo</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-yellow-200">
                <p className="text-xs text-gray-600">
                  La minuta y el estatuto son requisito previo para la escritura
                  pública. Este sistema no redacta estos documentos.
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
                  Confirmo que la minuta de constitución y el estatuto ya fueron
                  elaborados o serán elaborados antes de continuar con la escritura
                  pública.
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