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
  buildFormalIdentityDto,
  FormalIdentityResponse,
} from "@/services/formalization-service";
import type { StepComponentProps } from "../StepFallbackModal";
import { CheckCircle2, Circle } from "lucide-react";

type AccountingObligation = "SIMPLIFICADA" | "COMPLETA";

const TAXPAYER_TYPE_LABELS: Record<string, string> = {
  PERSONA_NATURAL: "Persona Natural",
  PERSONA_JURIDICA: "Persona Jurídica",
};

const TAX_REGIME_LABELS: Record<string, string> = {
  GENERAL: "Régimen General",
  RER: "Régimen Especial de Rentas (RER)",
  RMT: "Régimen MYPE Tributario",
  NRUS: "Nuevo RUS",
};

const INCOME_THRESHOLDS = {
  RER_MEDIUM: 1700000,
  RMT_MEDIUM: 1700000,
};

interface AccountingOption {
  value: AccountingObligation;
  title: string;
  description: string;
}

const ACCOUNTING_OPTIONS: AccountingOption[] = [
  {
    value: "SIMPLIFICADA",
    title: "Contabilidad Simplificada",
    description:
      "Registro básico de ingresos y gastos. Requiere menos controles contables y es adecuado para negocios pequeños.",
  },
  {
    value: "COMPLETA",
    title: "Contabilidad Completa",
    description:
      "Sistema contable completo con libros registros, estados financieros y mayor detalle en el control de operaciones.",
  },
];

function deriveRecommendation(params: {
  taxpayerType: string | null;
  taxRegime: string | null;
  projectedAnnualIncome: number | null;
  isRegisteredCompany: boolean | null;
  hasEmployees: boolean | null;
}): AccountingObligation {
  const { taxRegime, projectedAnnualIncome, isRegisteredCompany, hasEmployees } = params;

  const income = projectedAnnualIncome ?? 0;
  const hasCompanyStructure = isRegisteredCompany === true;
  const hasStaff = hasEmployees === true;

  if (taxRegime === "NRUS") {
    return "SIMPLIFICADA";
  }

  if (taxRegime === "RMT") {
    if (income >= INCOME_THRESHOLDS.RMT_MEDIUM) {
      return "COMPLETA";
    }
    return "SIMPLIFICADA";
  }

  if (taxRegime === "RER") {
    if (income >= INCOME_THRESHOLDS.RER_MEDIUM) {
      return "COMPLETA";
    }
    if (hasCompanyStructure || hasStaff) {
      return "COMPLETA";
    }
    return "SIMPLIFICADA";
  }

  if (taxRegime === "GENERAL") {
    return "COMPLETA";
  }

  if (hasCompanyStructure) {
    return "COMPLETA";
  }

  if (hasStaff) {
    return "COMPLETA";
  }

  return "SIMPLIFICADA";
}

export function SunatIdentifyAccountingObligationStep({
  businessId,
  stepTitle,
  stepDescription,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;

  const currentAccountingObligation = formalIdentity?.accountingObligation ?? null;

  const [selected, setSelected] = useState<AccountingObligation | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentAccountingObligation) {
      setSelected(currentAccountingObligation as AccountingObligation);
    }
  }, [currentAccountingObligation]);

  const recommendation = deriveRecommendation({
    taxpayerType: formalIdentity?.taxpayerType ?? null,
    taxRegime: formalIdentity?.taxRegime ?? null,
    projectedAnnualIncome: formalIdentity?.projectedAnnualIncome ?? null,
    isRegisteredCompany: formalIdentity?.isRegisteredCompany ?? null,
    hasEmployees: formalIdentity?.hasEmployees ?? null,
  });

  const handleSelect = (value: AccountingObligation) => {
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

      const dto = buildFormalIdentityDto(existing, businessId, {
        accountingObligation: selected,
      });
      await createFormalIdentity(dto);
      onComplete();
    } catch (err) {
      console.error("Error saving accounting obligation:", err);
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
            Obligación contable del negocio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
                  <p className="text-xs text-blue-500 font-medium mb-1">Régimen tributario</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {formalIdentity?.taxRegime
                      ? TAX_REGIME_LABELS[formalIdentity.taxRegime] || formalIdentity.taxRegime
                      : "No definido"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">Ingreso proyectado</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {formalIdentity?.projectedAnnualIncome
                      ? `S/ ${formalIdentity.projectedAnnualIncome.toLocaleString()}`
                      : "No definido"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">Empresa constituida</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {formalIdentity?.isRegisteredCompany === true
                      ? "Sí"
                      : formalIdentity?.isRegisteredCompany === false
                      ? "No"
                      : "No definido"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium mb-1">Trabajadores</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {formalIdentity?.hasEmployees === true
                      ? "Sí"
                      : formalIdentity?.hasEmployees === false
                      ? "No"
                      : "No definido"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-600">
                  La obligación contable depende del régimen tributario, ingresos proyectados,
                  estructura del negocio y cantidad de trabajadores.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Decisión guiada
              </h3>

              <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                <p className="text-xs text-yellow-700 font-medium mb-1">
                  Recomendación del sistema
                </p>
                <p className="text-base text-gray-800 font-semibold">
                  {recommendation === "SIMPLIFICADA"
                    ? "Contabilidad Simplificada"
                    : "Contabilidad Completa"}
                </p>
              </div>

              {stepDescription && (
                <p className="text-sm text-gray-600">{stepDescription}</p>
              )}

              <div className="flex flex-col gap-3">
                {ACCOUNTING_OPTIONS.map((option) => {
                  const isRecommended = option.value === recommendation;
                  return (
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
                        ${isRecommended && selected !== option.value ? "border-yellow-300" : ""}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {selected === option.value && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        )}
                        {selected !== option.value && (
                          <span className="text-gray-400">○</span>
                        )}
                        <span className="font-semibold text-gray-800 text-base">
                          {option.title}
                        </span>
                        {isRecommended && selected !== option.value && (
                          <span className="text-xs text-yellow-600 font-medium ml-2">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 mt-1 ml-6">
                        {option.description}
                      </span>
                      {selected === option.value && (
                        <span className="mt-2 text-xs text-green-600 font-medium ml-6">
                          ✓ Seleccionado
                        </span>
                      )}
                    </button>
                  );
                })}
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
            disabled={!selected || saving}
          >
            {saving ? "Guardando..." : "Guardar y continuar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}