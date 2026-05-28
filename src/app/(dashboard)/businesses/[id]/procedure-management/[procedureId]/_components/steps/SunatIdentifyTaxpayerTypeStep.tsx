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
import { useBusinessStore } from "@/store/business-store";
import {
  createFormalIdentity,
  getFormalIdentity,
  FormalIdentityResponse,
} from "@/services/formalization-service";
import type { StepComponentProps } from "../StepFallbackModal";

type TaxpayerType = "PERSONA_NATURAL" | "PERSONA_JURIDICA";

interface TaxpayerOption {
  value: TaxpayerType;
  title: string;
  description: string;
}

const TAXPAYER_OPTIONS: TaxpayerOption[] = [
  {
    value: "PERSONA_NATURAL",
    title: "Persona Natural",
    description:
      "Operas como una persona individual. El negocio está a tu nombre y respondes con tu DNI.",
  },
  {
    value: "PERSONA_JURIDICA",
    title: "Persona Jurídica",
    description:
      "Operas mediante una empresa constituida (EIRL, SAC, etc.) con razón social propia.",
  },
];

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
}

function buildFormalIdentityDto(
  existing: FormalIdentityResponse | null,
  businessId: number,
  taxpayerType: TaxpayerType
): CreateFormalIdentityDto {
  return {
    businessId,
    businessDisplayName: existing?.businessDisplayName || "",
    tradeName: existing?.tradeName || "",
    legalName: existing?.legalName || "",
    ruc: existing?.ruc || "",
    sunatStatus: existing?.sunatStatus || "",
    taxpayerType,
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
  };
}

export function SunatIdentifyTaxpayerTypeStep({
  businessId,
  stepTitle,
  stepDescription,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const currentTaxpayerType = business?.formalIdentity?.taxpayerType || "";
  const [selected, setSelected] = useState<TaxpayerType | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentTaxpayerType) {
      setSelected(currentTaxpayerType as TaxpayerType);
    }
  }, [currentTaxpayerType]);

  const handleSelect = (value: TaxpayerType) => {
    setSelected(value);
  };

  const handleSave = async () => {
    if (!selected) return;

    setSaving(true);
    try {
      let existing: FormalIdentityResponse | null = null;
      try {
        existing = await getFormalIdentity(businessId);
      } catch {
        // 404 means no formal identity exists yet
      }

      const dto = buildFormalIdentityDto(existing, businessId, selected);
      await createFormalIdentity(dto);
      onComplete();
    } catch (err) {
      console.error("Error saving taxpayer type:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl" className="rounded-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {stepTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Selecciona el tipo de contribuyente para tu negocio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">
              Tipo seleccionado:{" "}
              {selected
                ? TAXPAYER_OPTIONS.find((o) => o.value === selected)?.title
                : "Ninguno"}
            </p>
          </div>

          {stepDescription && (
            <p className="text-sm text-gray-600">{stepDescription}</p>
          )}

          <div className="flex flex-col gap-4">
            {TAXPAYER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                disabled={saving}
                className={`
                  flex flex-col items-start text-left p-5 rounded-none border-2 transition-all
                  ${
                    selected === option.value
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className="font-semibold text-gray-800 text-base">
                  {option.title}
                </span>
                <span className="text-sm text-gray-600 mt-1">
                  {option.description}
                </span>
                {selected === option.value && (
                  <span className="mt-2 text-xs text-green-600 font-medium">
                    ✓ Seleccionado
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
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
            disabled={!selected || saving}
          >
            {saving ? "Guardando..." : "Guardar y continuar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
