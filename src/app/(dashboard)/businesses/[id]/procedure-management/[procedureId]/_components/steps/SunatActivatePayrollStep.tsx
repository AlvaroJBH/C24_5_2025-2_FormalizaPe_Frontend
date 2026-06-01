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
import {
  createFormalIdentity,
  getFormalIdentity,
  buildFormalIdentityDto,
  FormalIdentityResponse,
} from "@/services/formalization-service";
import type { StepComponentProps } from "../StepFallbackModal";

const TAXPAYER_TYPE_LABELS: Record<string, string> = {
  PERSONA_NATURAL: "Persona Natural",
  PERSONA_JURIDICA: "Persona Jurídica",
};

const SUNAT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  ACTIVE: "Activo",
  SUSPENDED: "Suspendido",
  CANCELED: "Cancelado",
};

export function SunatActivatePayrollStep({
  businessId,
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const refreshBusiness = useBusinessStore((s) => s.refreshBusiness);
  const formalIdentity = business?.formalIdentity ?? null;
  const user = useAuthStore((s) => s.user);

  const isPersonaNatural = formalIdentity?.taxpayerType === "PERSONA_NATURAL";
  const ruc = isPersonaNatural ? (user?.ruc ?? null) : (formalIdentity?.ruc ?? null);

  const hasEmployees = formalIdentity?.hasEmployees ?? null;

  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  const canComplete = confirmed && !saving;

  const handleSave = async () => {
    if (!canComplete) return;

    setSaving(true);
    try {
      if (hasEmployees === true) {
        let existing: FormalIdentityResponse | null = null;
        try {
          existing = await getFormalIdentity(businessId);
        } catch {
        }

        const dto = buildFormalIdentityDto(existing, businessId, {
          payrollEnabled: true,
        });

        await createFormalIdentity(dto);
        await refreshBusiness(businessId);
      }
      onComplete();
    } catch (err) {
      console.error("Error saving payroll:", err);
    } finally {
      setSaving(false);
    }
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
              Activación de Planilla Electrónica (PLAME)
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="bg-amber-50 p-4 rounded border border-amber-200">
              <p className="text-sm text-amber-700 font-medium">
                Este paso no aplica porque tu negocio no tiene trabajadores.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
              <p className="text-sm text-gray-700">
                Según la declaración realizada en pasos anteriores, tu negocio opera
                sin personal contratado.
              </p>
              <p className="text-xs text-gray-500">
                La Planilla Electrónica (PLAME) es obligatoria únicamente cuando
                existen trabajadores registrados en el T-Registro.
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
                  Entiendo que no necesito activar planilla electrónica porque no tengo trabajadores
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="rounded-none" disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-none bg-green-600 hover:bg-green-700 text-white"
              disabled={!canComplete}
            >
              {saving ? "Guardando..." : "Completar y continuar"}
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
              Activación de Planilla Electrónica (PLAME)
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
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
                    {formalIdentity?.sunatStatus
                      ? SUNAT_STATUS_LABELS[formalIdentity.sunatStatus] || formalIdentity.sunatStatus
                      : "No definido"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">Trabajadores</p>
                  <p className="text-sm text-gray-800 font-medium text-green-600">
                    Tiene trabajadores: Sí
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-600">
                  La planilla electrónica se elabora a partir de la información
                  registrada en el T-Registro.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Sobre la PLAME
              </h3>

              <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 font-medium">¿Qué es la PLAME?</p>
                  <p className="text-xs text-gray-600">
                    La Planilla Electrónica (PLAME) es una declaración jurada que
                    contiene información sobre los trabajadores, pensionistas y
                    prestadores de servicios de un negocio.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-700 font-medium">¿Cuándo es obligatoria?</p>
                  <p className="text-xs text-gray-600">
                    Cuando existen trabajadores registrados en el T-Registro,
                    la PLAME debe presentarse mensualmente.
                  </p>
                </div>

                <div className="pt-2 border-t border-yellow-200 space-y-2">
                  <p className="text-sm text-gray-700 font-medium">Flujo general:</p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">1.</span>
                      <span>Descargar el programa PLAME o usar PLAME Web</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">2.</span>
                      <span>Generar la declaración jurada con los datos del T-Registro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">3.</span>
                      <span>Presentar vía SUNAT Operaciones en Línea (SOL)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                Recursos y confirmación
              </h3>

              <div className="bg-green-50 p-4 rounded border border-green-200 space-y-3">
                <p className="text-xs text-gray-600 text-center">
                  Accede a las herramientas oficiales de SUNAT para activar y presentar tu planilla electrónica.
                </p>

                <a
                  href="https://www2.sunat.gob.pe/pdt/pdtdown/independientes/independientes.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-none font-medium text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Instalador de programa PLAME
                </a>

                <a
                  href="https://www.sunat.gob.pe/sol.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-none font-medium text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  SUNAT Operaciones en Línea (SOL)
                </a>

                <div className="pt-3 border-t border-green-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      Confirmo que ya activé mi planilla electrónica (PLAME)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="rounded-none" disabled={saving}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-none bg-green-600 hover:bg-green-700 text-white"
              disabled={!canComplete}
            >
              {saving ? "Guardando..." : "Completar y continuar"}
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
            Activación de Planilla Electrónica (PLAME)
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="bg-gray-100 p-4 rounded border border-gray-200">
            <p className="text-sm text-gray-500 text-center">Cargando información...</p>
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