"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createFormalIdentity,
  getFormalIdentity,
  FormalIdentityResponse,
} from "@/services/formalization-service";
import { useBusinessStore } from "@/store/business-store";
import type { StepComponentProps } from "../StepFallbackModal";

function validateRuc(value: string): boolean {
  return /^\d{11}$/.test(value);
}

export function SunarpRegisterCompanyStep({
  businessId,
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const refreshBusiness = useBusinessStore((s) => s.refreshBusiness);
  const formalIdentity = business?.formalIdentity ?? null;

  const [ruc, setRuc] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (formalIdentity?.ruc) {
      setRuc(formalIdentity.ruc);
    }
  }, [formalIdentity?.ruc]);

  const handleRucChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setRuc(value);
  };

  const isValidRuc = validateRuc(ruc);
  const canSave = isValidRuc && !saving;

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
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
        ruc,
        sunatStatus: existing?.sunatStatus || "",
        taxpayerType: existing?.taxpayerType || "",
        ciiuCode: existing?.ciiuCode || "",
        taxRegime: existing?.taxRegime || "",
        taxRegimeSource: existing?.taxRegimeSource || "",
        projectedAnnualIncome: existing?.projectedAnnualIncome ?? undefined,
        companyType: existing?.companyType || "",
        isRegisteredCompany: true,
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
      onComplete();
    } catch (err) {
      console.error("Error saving RUC:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl" className="rounded-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {stepTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Registra el RUC asignado por SUNARP a tu empresa
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              ¿Qué significa inscribirse en SUNARP?
            </h3>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
              <p className="text-sm text-gray-700">
                Inscribir la empresa en SUNARP es el paso que le da existencia
                legal. Hasta que no se inscribe, la empresa no existe formalmente.
              </p>

              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  ¿Qué ocurre con la inscripción?
                </p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>La empresa obtiene personería jurídica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>SUNARP le asigna un número de partida registral</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Se genera automáticamente un RUC a nombre de la empresa</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  ¿Quién realiza el trámite?
                </p>
                <p className="text-sm text-gray-700">
                  El notario envía el parte notarial a SUNARP. El proceso de
                  inscripción puede tardar hasta 24 horas.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-1">
                ¿Qué debes tener a la mano?
              </p>
              <ul className="space-y-1 text-xs text-blue-700">
                <li className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>Correo de confirmación de SUNARP o notaría</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>Número de partida registral (si ya lo tienes)</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 p-3 rounded border border-amber-200">
              <p className="text-xs text-amber-700">
                La activación del RUC ante SUNAT se realizará en un paso posterior.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Ingresa el RUC de tu empresa
            </h3>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-4">
              <p className="text-sm text-gray-700">
                Ingresa el RUC que SUNARP generó automáticamente para tu empresa.
              </p>

              <div className="space-y-2">
                <label className="text-xs text-gray-600 font-medium block">
                  RUC de la empresa (11 dígitos)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 20601234567"
                  value={ruc}
                  onChange={handleRucChange}
                  maxLength={11}
                  className="rounded-none text-center text-lg tracking-widest font-mono"
                />
                {ruc.length > 0 && !isValidRuc && (
                  <p className="text-xs text-red-500">
                    El RUC debe tener exactamente 11 dígitos numéricos
                  </p>
                )}
                {ruc.length === 11 && isValidRuc && (
                  <p className="text-xs text-green-600">✓ RUC válido</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                Este RUC fue generado automáticamente por SUNARP al momentode la inscripción de tu empresa.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-none"
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-none bg-green-600 hover:bg-green-700 text-white"
            disabled={!canSave}
          >
            {saving ? "Guardando..." : "Guardar y continuar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}