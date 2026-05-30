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

type TaxRegime = "RUS" | "RER" | "MYPE" | "GENERAL";

interface TaxRegimeOption {
  value: TaxRegime;
  title: string;
  description: string;
}

const TAX_REGIME_OPTIONS: TaxRegimeOption[] = [
  {
    value: "RUS",
    title: "Nuevo RUS",
    description:
      "Régimen Simplificado para pequeños negocios con ingresos hasta S/ 60,000 anuales. Ideal para emprendedores informales.",
  },
  {
    value: "MYPE",
    title: "Régimen MYPE Tributario",
    description:
      "Para micro y pequeñas empresas con ingresos anuales hasta S/ 1,700,000. Beneficios tributarios progresivos.",
  },
  {
    value: "RER",
    title: "Régimen Especial de Tributación",
    description:
      "Para negocios con ingresos hasta S/ 1,700,000 anuales. Tributación simplificada sobre ingresos netos.",
  },
  {
    value: "GENERAL",
    title: "Régimen General",
    description:
      "Sin límite de ingresos. Obligado a llevar contabilidad completa y emitir comprobantes electrónicos.",
  },
];

const TAXPAYER_TYPE_LABELS: Record<string, string> = {
  PERSONA_NATURAL: "Persona Natural",
  PERSONA_JURIDICA: "Persona Jurídica",
};

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
  taxRegime: string,
  projectedAnnualIncome: number
): CreateFormalIdentityDto {
  return {
    businessId,
    businessDisplayName: existing?.businessDisplayName || "",
    tradeName: existing?.tradeName || "",
    legalName: existing?.legalName || "",
    ruc: existing?.ruc || "",
    sunatStatus: existing?.sunatStatus || "",
    taxpayerType: existing?.taxpayerType || "",
    ciiuCode: existing?.ciiuCode || "",
    taxRegime,
    taxRegimeSource: "USER_SELECTION",
    projectedAnnualIncome,
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

function getAllowedRegimes(
  taxpayerType: string | null,
  projectedAnnualIncome: number | null
): Set<TaxRegime> {
  const allowed = new Set<TaxRegime>();

  if (!taxpayerType || projectedAnnualIncome === null) {
    return allowed;
  }

  const income = projectedAnnualIncome;

  if (taxpayerType === "PERSONA_NATURAL") {
    if (income <= 60000) {
      allowed.add("RUS");
    }
    if (income <= 1700000) {
      allowed.add("RER");
    }
    allowed.add("GENERAL");
  } else if (taxpayerType === "PERSONA_JURIDICA") {
    if (income <= 1700000) {
      allowed.add("MYPE");
      allowed.add("RER");
    }
    allowed.add("GENERAL");
  }

  return allowed;
}

function isValidIncome(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

export function SunatSelectTaxRegimeStep({
  businessId,
  stepTitle,
  stepDescription,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const taxpayerType = business?.formalIdentity?.taxpayerType || null;
  const [projectedAnnualIncome, setProjectedAnnualIncome] = useState<string>("");
  const [selected, setSelected] = useState<TaxRegime | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const existing = business?.formalIdentity?.projectedAnnualIncome;
    if (existing !== null && existing !== undefined) {
      setProjectedAnnualIncome(String(existing));
    }
    const existingTaxRegime = business?.formalIdentity?.taxRegime;
    if (existingTaxRegime) {
      setSelected(existingTaxRegime as TaxRegime);
    }
  }, [business?.formalIdentity?.projectedAnnualIncome, business?.formalIdentity?.taxRegime]);

  const incomeValue = projectedAnnualIncome.trim();
  const isIncomeValid = isValidIncome(incomeValue);
  const incomeNumber = isIncomeValid ? parseFloat(incomeValue) : null;

  const allowedRegimes = getAllowedRegimes(taxpayerType, incomeNumber);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setProjectedAnnualIncome(value);
      if (selected && !allowedRegimes.has(selected)) {
        setSelected("");
      }
    }
  };

  const handleSelect = (value: TaxRegime) => {
    setSelected(value);
  };

  const canSave = selected !== "" && isIncomeValid && !saving;

  const handleSave = async () => {
    if (!canSave || incomeNumber === null) return;

    setSaving(true);
    try {
      let existing: FormalIdentityResponse | null = null;
      try {
        existing = await getFormalIdentity(businessId);
      } catch {
        // 404 means no formal identity exists yet
      }

      const dto = buildFormalIdentityDto(
        existing,
        businessId,
        selected,
        incomeNumber
      );
      await createFormalIdentity(dto);
      onComplete();
    } catch (err) {
      console.error("Error saving tax regime:", err);
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
            Selecciona el régimen tributario que mejor se adapte a tu negocio
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Datos del contribuyente
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Tipo de contribuyente
                  </label>
                  <p className="text-sm font-medium text-gray-800">
                    {taxpayerType
                      ? TAXPAYER_TYPE_LABELS[taxpayerType] || taxpayerType
                      : "No definido"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Ingresos anuales proyectados (S/)
                  </label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ej: 50000"
                    value={projectedAnnualIncome}
                    onChange={handleIncomeChange}
                    className="rounded-none"
                  />
                  {!isIncomeValid && projectedAnnualIncome !== "" && (
                    <p className="text-xs text-red-500 mt-1">
                      Ingresa un valor numérico válido
                    </p>
                  )}
                </div>
              </div>
            </div>

            {stepDescription && (
              <p className="text-sm text-gray-600">{stepDescription}</p>
            )}

            <div className="bg-amber-50 p-3 rounded border border-amber-200">
              <p className="text-xs text-amber-700">
                Los regímenes tributarios se habilitan automáticamente según el tipo de contribuyente y tus ingresos proyectados.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Regímenes tributarios disponibles
            </h3>
            {TAX_REGIME_OPTIONS.map((option) => {
              const isEnabled = allowedRegimes.has(option.value);
              const isSelected = selected === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => isEnabled && handleSelect(option.value)}
                  disabled={!isEnabled || saving}
                  className={`
                    w-full flex flex-col items-start text-left p-4 rounded-none border-2 transition-all
                    ${
                      isSelected
                        ? "border-green-500 bg-green-50"
                        : isEnabled
                        ? "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
                        : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                    }
                  `}
                >
                  <span className="font-semibold text-gray-800 text-base">
                    {option.title}
                  </span>
                  <span className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </span>
                  {isSelected && (
                    <span className="mt-2 text-xs text-green-600 font-medium">
                      ✓ Seleccionado
                    </span>
                  )}
                  {!isEnabled && (
                    <span className="mt-2 text-xs text-gray-400">
                      No disponible para tu tipo y nivel de ingresos
                    </span>
                  )}
                </button>
              );
            })}
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