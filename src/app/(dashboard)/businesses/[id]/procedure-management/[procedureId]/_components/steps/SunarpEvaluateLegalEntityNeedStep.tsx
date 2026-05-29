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
import {
  createFormalIdentity,
  getFormalIdentity,
  FormalIdentityResponse,
} from "@/services/formalization-service";
import type { StepComponentProps } from "../StepFallbackModal";

type CompanyType = "EIRL" | "SAC" | "SRL" | "PERSONA_NATURAL";

interface CompanyTypeOption {
  value: CompanyType;
  title: string;
  description: string;
  whenToUse: string;
}

const COMPANY_TYPE_OPTIONS: CompanyTypeOption[] = [
  {
    value: "EIRL",
    title: "EIRL",
    description: "Empresa Individual de Responsabilidad Limitada",
    whenToUse:
      "Para un solo titular, sin socios. Separa tu patrimonio personal del negocio.",
  },
  {
    value: "SAC",
    title: "SAC",
    description: "Sociedad Anónima Cerrada",
    whenToUse:
      "Para negocios con pocos socios (hasta 20). Estructura formal y flexible.",
  },
  {
    value: "SRL",
    title: "SRL",
    description: "Sociedad de Responsabilidad Limitada",
    whenToUse:
      "Similar a la SAC, con estructura más cerrada. Ideal para familias o grupos reducidos.",
  },
];

const TAXPAYER_TYPE_LABELS: Record<string, string> = {
  PERSONA_NATURAL: "Persona Natural",
  PERSONA_JURIDICA: "Persona Jurídica",
};

function formatAddress(business: {
  department?: string;
  province?: string;
  district?: string;
  address?: string;
}): string {
  const parts = [
    business.address,
    business.district,
    business.province,
    business.department,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "No disponible";
}

export function SunarpEvaluateLegalEntityNeedStep({
  businessId,
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const currentTaxpayerType = business?.formalIdentity?.taxpayerType || null;

  const [selectedCompanyType, setSelectedCompanyType] = useState<CompanyType | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave =
    currentTaxpayerType === "PERSONA_NATURAL" ||
    (currentTaxpayerType === "PERSONA_JURIDICA" && selectedCompanyType !== null);

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      let existing: FormalIdentityResponse | null = null;
      try {
        existing = await getFormalIdentity(businessId);
      } catch {
      }

      const finalCompanyType =
        currentTaxpayerType === "PERSONA_NATURAL"
          ? "PERSONA_NATURAL"
          : selectedCompanyType!;

      const dto = {
        businessId,
        businessDisplayName: existing?.businessDisplayName || "",
        tradeName: existing?.tradeName || "",
        legalName: existing?.legalName || "",
        ruc: existing?.ruc || "",
        sunatStatus: existing?.sunatStatus || "",
        taxpayerType: existing?.taxpayerType || "",
        ciiuCode: existing?.ciiuCode || "",
        taxRegime: existing?.taxRegime || "",
        taxRegimeSource: existing?.taxRegimeSource || "",
        projectedAnnualIncome: existing?.projectedAnnualIncome ?? undefined,
        companyType: finalCompanyType,
        isRegisteredCompany: existing?.isRegisteredCompany ?? undefined,
        voucherType: existing?.voucherType || "",
        electronicInvoicingEnabled: existing?.electronicInvoicingEnabled ?? undefined,
        hasEmployees: existing?.hasEmployees ?? undefined,
        payrollEnabled: existing?.payrollEnabled ?? undefined,
        accountingObligation: existing?.accountingObligation || "",
        electronicBooksEnabled: existing?.electronicBooksEnabled ?? undefined,
      };

      await createFormalIdentity(dto);
      onComplete();
    } catch (err) {
      console.error("Error saving legal entity type:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        size="xl"
        className="rounded-none max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {stepTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Evalúa si tu negocio debe operar como persona natural o jurídica
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

            <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-2">
              <div>
                <p className="text-xs text-gray-500">Tu negocio opera como:</p>
                <p className="text-sm font-medium text-gray-800">
                  {currentTaxpayerType
                    ? TAXPAYER_TYPE_LABELS[currentTaxpayerType]
                    : "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Nombre comercial</p>
                <p className="text-sm font-medium text-gray-800">
                  {business?.tradeName || "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Dirección</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatAddress({
                    department: business?.department,
                    province: business?.province,
                    district: business?.district,
                    address: business?.address,
                  })}
                </p>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded border border-amber-200">
              <p className="text-xs text-amber-700">
                Esta información se usa para la constitución de tu empresa en SUNARP.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Tipo de empresa
            </h3>

            {currentTaxpayerType === "PERSONA_NATURAL" && (
              <div className="space-y-3">
                <div className="bg-gray-100 p-4 rounded border border-gray-200">
                  <p className="text-sm text-gray-700">
                    Como persona natural, no necesitas constituir una empresa en SUNARP.
                  </p>
                </div>

                <div className="p-3 rounded-none border-2 border-green-500 bg-green-50">
                  <p className="text-sm font-medium text-gray-800">
                    Persona Natural
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Operas con tu DNI. El negocio está a tu nombre.
                  </p>
                </div>
              </div>
            )}

            {currentTaxpayerType === "PERSONA_JURIDICA" && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Selecciona el tipo de empresa:
                </p>
                {COMPANY_TYPE_OPTIONS.map((option) => {
                  const isSelected = selectedCompanyType === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSelectedCompanyType(option.value)}
                      disabled={saving}
                      className={`
                        w-full flex flex-col items-start text-left p-3 rounded-none border-2 transition-all
                        ${
                          isSelected
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 bg-white hover:border-gray-400"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">
                          {option.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {option.description}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {option.whenToUse}
                      </p>
                      {isSelected && (
                        <span className="mt-2 text-xs text-green-600 font-medium">
                          ✓ Seleccionado
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {!currentTaxpayerType && (
              <div className="bg-gray-100 p-4 rounded border border-gray-200">
                <p className="text-sm text-gray-500">
                  Cargando tipo de contribuyente...
                </p>
              </div>
            )}
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
            disabled={!canSave || saving}
          >
            {saving ? "Guardando..." : "Guardar y continuar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}