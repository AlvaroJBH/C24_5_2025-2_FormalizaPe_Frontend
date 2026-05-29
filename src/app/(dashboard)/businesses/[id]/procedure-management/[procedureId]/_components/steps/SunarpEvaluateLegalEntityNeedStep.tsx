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
import { CheckCircle2, Circle } from "lucide-react";

type TaxpayerType = "PERSONA_NATURAL" | "PERSONA_JURIDICA";
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

const LEGAL_ENTITY_CRITERIA = [
  "Tendrás socios o inversionistas",
  "Firmarás contratos con empresas grandes o el Estado",
  "Buscarás crecer formalmente o necesitarás capital externo",
  "Necesitas separar tu patrimonio personal del negocio",
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
  taxpayerType: TaxpayerType,
  companyType: CompanyType
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
    companyType,
    isRegisteredCompany: false,
    voucherType: existing?.voucherType || "",
    electronicInvoicingEnabled: existing?.electronicInvoicingEnabled ?? undefined,
    hasEmployees: existing?.hasEmployees ?? undefined,
    payrollEnabled: existing?.payrollEnabled ?? undefined,
    accountingObligation: existing?.accountingObligation || "",
    electronicBooksEnabled: existing?.electronicBooksEnabled ?? undefined,
  };
}

export function SunarpEvaluateLegalEntityNeedStep({
  businessId,
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const currentTaxpayerType = business?.formalIdentity?.taxpayerType || null;

  const [selectedTaxpayerType, setSelectedTaxpayerType] = useState<
    TaxpayerType | ""
  >("");
  const [selectedCompanyType, setSelectedCompanyType] = useState<CompanyType | "">(
    ""
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentTaxpayerType) {
      setSelectedTaxpayerType(currentTaxpayerType as TaxpayerType);
    }
  }, [currentTaxpayerType]);

  useEffect(() => {
    if (selectedTaxpayerType === "PERSONA_NATURAL") {
      setSelectedCompanyType("PERSONA_NATURAL");
    }
  }, [selectedTaxpayerType]);

  const handleTaxpayerTypeSelect = (value: TaxpayerType) => {
    setSelectedTaxpayerType(value);
    if (value === "PERSONA_NATURAL") {
      setSelectedCompanyType("PERSONA_NATURAL");
    } else {
      setSelectedCompanyType("");
    }
  };

  const handleCompanyTypeSelect = (value: CompanyType) => {
    setSelectedCompanyType(value);
  };

  const canSave =
    selectedTaxpayerType !== "" &&
    (selectedTaxpayerType === "PERSONA_NATURAL" ||
      (selectedTaxpayerType === "PERSONA_JURIDICA" && selectedCompanyType !== ""));

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      let existing: FormalIdentityResponse | null = null;
      try {
        existing = await getFormalIdentity(businessId);
      } catch {
        // 404 means no formal identity exists yet
      }

      const finalCompanyType =
        selectedTaxpayerType === "PERSONA_NATURAL"
          ? "PERSONA_NATURAL"
          : selectedCompanyType;

      const dto = buildFormalIdentityDto(
        existing,
        businessId,
        selectedTaxpayerType,
        finalCompanyType as CompanyType
      );
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              ¿Necesitas constituir una empresa?
            </h3>

            <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1.5">
              <p className="text-xs text-gray-600">
                Te conviene ser Persona Jurídica si:
              </p>
              <ul className="space-y-1">
                {LEGAL_ENTITY_CRITERIA.map((criteria, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                    <Circle className="w-3 h-3 mt-0.5 text-gray-400 shrink-0" />
                    {criteria}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 p-2.5 rounded border border-blue-200">
              <p className="text-xs text-blue-700">
                Si te identificas con uno o más puntos, te conviene ser Persona Jurídica.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Decisión de tipo de contribuyente
            </h3>

            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Actualmente configurado como:</p>
              <p className="text-sm font-medium text-gray-800">
                {currentTaxpayerType
                  ? TAXPAYER_TYPE_LABELS[currentTaxpayerType] || currentTaxpayerType
                  : "No definido"}
              </p>
            </div>

            <div className="space-y-2">
              {selectedTaxpayerType !== "PERSONA_JURIDICA" && (
                <button
                  onClick={() => handleTaxpayerTypeSelect("PERSONA_JURIDICA")}
                  disabled={saving}
                  className="w-full flex items-center justify-between p-3 rounded-none border-2 border-gray-200 bg-white hover:border-yellow-400 transition-all disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm font-medium text-gray-800">
                      Cambiar a Persona Jurídica
                    </span>
                  </div>
                </button>
              )}

              {selectedTaxpayerType !== "PERSONA_NATURAL" && (
                <button
                  onClick={() => handleTaxpayerTypeSelect("PERSONA_NATURAL")}
                  disabled={saving}
                  className="w-full flex items-center justify-between p-3 rounded-none border-2 border-gray-200 bg-white hover:border-yellow-400 transition-all disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600">↺</span>
                    <span className="text-sm font-medium text-gray-800">
                      Volver a Persona Natural
                    </span>
                  </div>
                </button>
              )}

              {selectedTaxpayerType === "PERSONA_NATURAL" && (
                <button
                  onClick={() => handleTaxpayerTypeSelect("PERSONA_NATURAL")}
                  disabled={saving}
                  className="w-full flex items-center justify-between p-3 rounded-none border-2 border-green-500 bg-green-50"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-800">
                      Mantenerme como Persona Natural
                    </span>
                  </div>
                </button>
              )}

              {selectedTaxpayerType === "PERSONA_JURIDICA" && (
                <button
                  onClick={() => handleTaxpayerTypeSelect("PERSONA_JURIDICA")}
                  disabled={saving}
                  className="w-full flex items-center justify-between p-3 rounded-none border-2 border-green-500 bg-green-50"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-800">
                      Mantenerme como Persona Jurídica
                    </span>
                  </div>
                </button>
              )}
            </div>

            <div className="bg-amber-50 p-3 rounded border border-amber-200">
              <p className="text-xs text-amber-700">
                Esta decisión define si necesitarás constituir una empresa en SUNARP.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                3
              </span>
              Selección de tipo de empresa
            </h3>

            {selectedTaxpayerType === "PERSONA_NATURAL" ? (
              <div className="space-y-3">
                <div className="bg-gray-100 p-4 rounded border border-gray-200">
                  <p className="text-sm text-gray-700">
                    Como persona natural, no necesitas constituir una empresa.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-none border-2 border-green-500 bg-green-50">
                    <p className="text-sm font-medium text-gray-800">
                      Persona Natural
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Operas con tu DNI. El negocio está a tu nombre.
                    </p>

                    <span className="mt-2 text-xs text-green-600 font-medium block">
                      ✓ Seleccionado
                    </span>
                  </div>
                </div>
              </div>
            ) : selectedTaxpayerType === "PERSONA_JURIDICA" ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Selecciona el tipo de empresa:
                </p>
                {COMPANY_TYPE_OPTIONS.map((option) => {
                  const isSelected = selectedCompanyType === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleCompanyTypeSelect(option.value)}
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
            ) : (
              <div className="bg-gray-100 p-4 rounded border border-gray-200">
                <p className="text-sm text-gray-500">
                  Primero selecciona el tipo de contribuyente en la columna 2.
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
