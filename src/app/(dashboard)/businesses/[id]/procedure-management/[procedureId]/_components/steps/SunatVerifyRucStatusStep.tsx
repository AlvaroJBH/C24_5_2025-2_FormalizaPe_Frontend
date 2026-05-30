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
  FormalIdentityResponse,
} from "@/services/formalization-service";
import type { StepComponentProps } from "../StepFallbackModal";

const TAX_REGIME_LABELS: Record<string, string> = {
  RUS: "Nuevo RUS",
  RER: "Régimen Especial de Tributación",
  MYPE: "Régimen MYPE Tributario",
  GENERAL: "Régimen General",
};

export function SunatVerifyRucStatusStep({
  businessId,
  stepTitle,
  stepDescription,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const refreshBusiness = useBusinessStore((s) => s.refreshBusiness);
  const formalIdentity = business?.formalIdentity ?? null;
  const user = useAuthStore((s) => s.user);

  const isPersonaNatural = formalIdentity?.taxpayerType === "PERSONA_NATURAL";
  const ruc = isPersonaNatural ? (user?.ruc ?? null) : (formalIdentity?.ruc ?? null);

  const [confirmed, setConfirmed] = useState(false);

  const canComplete = confirmed && !!(ruc);

  const handleComplete = async () => {
    if (!canComplete) return;

    try {
      let existing: FormalIdentityResponse | null = null;
      try {
        existing = await getFormalIdentity(businessId);
      } catch {
      }

      const dto = {
        businessId,
        businessDisplayName: existing?.businessDisplayName || "",
        tradeName: existing?.tradeName || "",
        legalName: existing?.legalName || "",
        ruc: existing?.ruc || "",
        sunatStatus: "ACTIVE",
        taxpayerType: existing?.taxpayerType || "",
        ciiuCode: existing?.ciiuCode || "",
        taxRegime: existing?.taxRegime || "",
        taxRegimeSource: existing?.taxRegimeSource || "",
        projectedAnnualIncome: existing?.projectedAnnualIncome ?? undefined,
        companyType: existing?.companyType || "",
        isRegisteredCompany: existing?.isRegisteredCompany ?? undefined,
        voucherType: existing?.voucherType || "",
        electronicInvoicingEnabled: existing?.electronicInvoicingEnabled ?? undefined,
        hasEmployees: existing?.hasEmployees ?? undefined,
        payrollEnabled: existing?.payrollEnabled ?? undefined,
        accountingObligation: existing?.accountingObligation || "",
        electronicBooksEnabled: existing?.electronicBooksEnabled ?? undefined,
        municipalLicenseRequired: existing?.municipalLicenseRequired ?? undefined,
      };

      await createFormalIdentity(dto);
      await refreshBusiness(businessId);
    } catch (err) {
      console.error("Error updating sunatStatus:", err);
    } finally {
      onComplete();
    }
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
              Verificación del estado del RUC en SUNAT
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="bg-amber-50 p-4 rounded border border-amber-200">
              <p className="text-sm text-amber-800 font-medium">
                Antes de continuar, completa el paso anterior
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Primero debes registrar tu RUC en el paso{" "}
                <strong>&quot;Registro del RUC&quot;</strong>. Luego podrás verificar
                el estado en el portal de SUNAT.
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
            Verifica que tu RUC esté activo y con datos correctos en SUNAT
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Tu RUC
            </h3>
            <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  RUC registrado
                </p>
                <p className="text-2xl font-bold text-gray-900 font-mono tracking-widest">
                  {ruc}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Régimen tributario
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.taxRegime
                    ? TAX_REGIME_LABELS[formalIdentity.taxRegime] ||
                      formalIdentity.taxRegime
                    : "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Actividad económica (CIIU)
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.ciiuCode || "No definido"}
                </p>
              </div>
            </div>
            {stepDescription && (
              <p className="text-xs text-gray-500 italic">{stepDescription}</p>
            )}
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                Con este número de RUC debes realizar la consulta en el portal
                de SUNAT para verificar que tu estado sea <strong>ACTIVO</strong>{" "}
                y tus datos sean correctos.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Verifica en SUNAT
            </h3>
            <div className="bg-green-50 p-4 rounded border border-green-200 space-y-4">
              <a
                href="https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-none font-medium text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Consulta de RUC – SUNAT
              </a>
              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  Ingresa tu RUC en el portal de SUNAT y verifica que:
                </p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    El estado sea <strong>ACTIVO</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    La actividad económica sea correcta
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    El régimen tributario coincida
                  </li>
                </ul>
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
                    He verificado mi RUC en el portal de SUNAT y la información
                    mostrada es correcta.
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
            Completar y continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}