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

const LEGAL_ENTITY_CRITERIA = [
  "Tendrás socios o inversionistas",
  "Firmarás contratos con empresas grandes o el Estado",
  "Buscarás crecer formalmente o necesitarás capital externo",
  "Necesitas separar tu patrimonio personal del negocio",
];

const PERSONA_NATURAL_INFO = {
  title: "¿Qué significa operar como Persona Natural?",
  description:
    "Cuando inicias tu negocio, lo más común es comenzar como Persona Natural. Esto significa que operas con tu DNI y el negocio está a tu nombre. Respondes con tu patrimonio personal ante las obligaciones del negocio.",
  evolutionTitle: "¿Qué pasa si luego necesito ser empresa?",
  evolutionDescription:
    "Si en el futuro tu negocio crece y necesitas constituir una empresa (EIRL, SAC, SRL), ese proceso se realiza en SUNARP. Allí evaluarás si te conviene formalizarte como Persona Jurídica.",
  sunarpContext:
    "SUNARP es el punto donde se evalúa la constitución de empresas y la formalización empresarial. Este paso en SUNAT solo define tu tipo de contribuyente actual.",
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
    municipalLicenseRequired: existing?.municipalLicenseRequired ?? undefined,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                    1
                  </span>
                  Contexto: ¿Cómo inicia un negocio?
                </h3>
                <p className="text-xs text-gray-600">
                  {PERSONA_NATURAL_INFO.description}
                </p>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    {PERSONA_NATURAL_INFO.evolutionTitle}
                  </p>
                  <p className="text-xs text-gray-600">
                    {PERSONA_NATURAL_INFO.evolutionDescription}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded border border-amber-200 space-y-1.5">
                <p className="text-xs text-amber-700 font-medium">
                  Criterios para evaluar si necesitas ser Persona Jurídica:
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

              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-xs text-green-700">
                  <span className="font-medium">Nota:</span>{" "}
                  {PERSONA_NATURAL_INFO.sunarpContext}
                </p>
              </div>
            </div>

            <div className="space-y-4">
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

              <div className="flex flex-col gap-3">
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
                ))}
              </div>
            </div>
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