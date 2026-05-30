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
import { Input } from "@/components/ui/input";
import { ExternalLink } from "lucide-react";
import {
  createFormalIdentity,
  getFormalIdentity,
  FormalIdentityResponse,
} from "@/services/formalization-service";
import { useBusinessStore } from "@/store/business-store";
import type { StepComponentProps } from "../StepFallbackModal";

interface CreateFormalIdentityDto {
  businessId: number;
  businessDisplayName: string;
  tradeName: string;
  legalName: string;
  ruc: string;
  sunatStatus: string;
  taxpayerType: string;
  ciiuCode: string;
  taxRegime: string;
  taxRegimeSource: string;
  projectedAnnualIncome?: number;
  companyType: string;
  isRegisteredCompany?: boolean;
  voucherType: string;
  electronicInvoicingEnabled?: boolean;
  hasEmployees?: boolean;
  payrollEnabled?: boolean;
  accountingObligation: string;
  electronicBooksEnabled?: boolean;
  municipalLicenseRequired?: boolean;
}

function buildFormalIdentityDto(
  existing: FormalIdentityResponse | null,
  businessId: number,
  tradeName: string,
  legalName: string
): CreateFormalIdentityDto {
  return {
    businessId,
    businessDisplayName: existing?.businessDisplayName || "",
    tradeName,
    legalName,
    ruc: existing?.ruc || "",
    sunatStatus: existing?.sunatStatus || "",
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
}

export function SunarpReserveCompanyNameStep({
  businessId,
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const current = business?.formalIdentity ?? null;

  const [selectedTradeName, setSelectedTradeName] = useState(current?.tradeName || "");
  const [selectedLegalName, setSelectedLegalName] = useState(current?.legalName || "");
  const [saving, setSaving] = useState(false);

  const canSave = !saving && selectedTradeName.trim() !== "" && selectedLegalName.trim() !== "";

  const handleSave = async () => {
    setSaving(true);
    try {
      let existing: FormalIdentityResponse | null = null;
      try {
        existing = await getFormalIdentity(businessId);
      } catch {
      }

      const dto = buildFormalIdentityDto(
        existing,
        businessId,
        selectedTradeName,
        selectedLegalName
      );
      await createFormalIdentity(dto);
      onComplete();
    } catch (err) {
      console.error("Error saving company names:", err);
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
            Registra los nombres que planeas usar ante SUNARP
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              ¿Qué es la reserva de nombre?
            </h3>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
              <p className="text-sm text-gray-700">
                La reserva de nombre es un trámite que realizas ante SUNARP para
                proteger temporalmente el nombre de tu empresa antes de constituirla.
              </p>

              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">Características:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>No es obligatoria, pero es recomendable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Protege el nombre mientras preparas la documentación</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>SUNARP validará coincidencias o similitudes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">!</span>
                    <span>Requiere usuario y contraseña del SID - SUNARP</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">!</span>
                    <span>Costo referencial: S/ 25.60</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Este paso ocurre fuera del sistema. El sistema solo registra los
                  nombres que planeas usar para tu empresa.
                </p>
              </div>
            </div>

            {current?.tradeName && (
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Nombre comercial actual
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  {current.tradeName}
                </p>
              </div>
            )}

            {current?.legalName && (
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Razón social actual
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  {current.legalName}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Accede al portal oficial
            </h3>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-4">
              <a
                href="https://sidciudadano.sunarp.gob.pe/sid/sesion.htm?proceso=ciudadano"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-none font-medium text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                SID Ciudadano – SUNARP
              </a>
              <p className="text-xs text-gray-600 text-center">
                Accede con tu usuario y contraseña del SID
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                Registra los nombres decididos
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 font-medium block mb-1">
                    Nombre comercial
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: Mi Tienda de Abarrotes"
                    value={selectedTradeName}
                    onChange={(e) => setSelectedTradeName(e.target.value)}
                    className="rounded-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nombre visible al público (puede diferir del nombre legal)
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-600 font-medium block mb-1">
                    Razón social
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: Mi Empresa S.A.C."
                    value={selectedLegalName}
                    onChange={(e) => setSelectedLegalName(e.target.value)}
                    className="rounded-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nombre legal registrado ante SUNAT / SUNARP
                  </p>
                </div>
              </div>
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