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
import {
  createFormalIdentity,
  getFormalIdentity,
  FormalIdentityResponse,
} from "@/services/formalization-service";
import { useBusinessStore } from "@/store/business-store";
import type { StepComponentProps } from "../StepFallbackModal";

type VoucherType = "BOLETA" | "FACTURA" | "AMBOS";

interface VoucherOption {
  value: VoucherType;
  title: string;
  description: string;
}

const VOUCHER_OPTIONS: VoucherOption[] = [
  {
    value: "BOLETA",
    title: "Boleta de Venta",
    description: "Para ventas a consumidores finales sin requerimiento de crédito fiscal.",
  },
  {
    value: "FACTURA",
    title: "Factura",
    description: "Para operaciones entre empresas y requerimiento de crédito fiscal.",
  },
  {
    value: "AMBOS",
    title: "Ambos tipos",
    description: "Flexibilidad para emitir boletas y facturas según el cliente.",
  },
];

const TAXPAYER_TYPE_LABELS: Record<string, string> = {
  PERSONA_NATURAL: "Persona Natural",
  PERSONA_JURIDICA: "Persona Jurídica",
};

const TAX_REGIME_LABELS: Record<string, string> = {
  RUS: "Nuevo RUS",
  RER: "Régimen Especial de Tributación",
  MYPE: "Régimen MYPE Tributario",
  GENERAL: "Régimen General",
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
  voucherType: string
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
    taxRegime: existing?.taxRegime || "",
    taxRegimeSource: existing?.taxRegimeSource || "",
    projectedAnnualIncome: existing?.projectedAnnualIncome ?? undefined,
    companyType: existing?.companyType || "",
    isRegisteredCompany: existing?.isRegisteredCompany ?? undefined,
    voucherType,
    electronicInvoicingEnabled: existing?.electronicInvoicingEnabled ?? undefined,
    hasEmployees: existing?.hasEmployees ?? undefined,
    payrollEnabled: existing?.payrollEnabled ?? undefined,
    accountingObligation: existing?.accountingObligation || "",
    electronicBooksEnabled: existing?.electronicBooksEnabled ?? undefined,
    municipalLicenseRequired: existing?.municipalLicenseRequired ?? undefined,
  };
}

function getAllowedVoucherTypes(
  taxpayerType: string | null,
  taxRegime: string | null
): Set<VoucherType> {
  const allowed = new Set<VoucherType>();

  if (!taxpayerType || !taxRegime) {
    return allowed;
  }

  if (taxpayerType === "PERSONA_NATURAL") {
    allowed.add("BOLETA");
  } else if (taxpayerType === "PERSONA_JURIDICA") {
    if (taxRegime === "RUS") {
      allowed.add("BOLETA");
    } else if (taxRegime === "MYPE" || taxRegime === "RER") {
      allowed.add("BOLETA");
      allowed.add("FACTURA");
    } else if (taxRegime === "GENERAL") {
      allowed.add("FACTURA");
      allowed.add("AMBOS");
    }
  }

  return allowed;
}

export function SunatDefineVoucherTypesStep({
  businessId,
  stepTitle,
  stepDescription,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;

  const taxpayerType = formalIdentity?.taxpayerType ?? null;
  const taxRegime = formalIdentity?.taxRegime ?? null;

  const [selected, setSelected] = useState<VoucherType | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (formalIdentity?.voucherType) {
      setSelected(formalIdentity.voucherType as VoucherType);
    }
  }, [formalIdentity?.voucherType]);

  const allowedTypes = getAllowedVoucherTypes(taxpayerType, taxRegime);
  const hasContext = !!(taxpayerType && taxRegime);
  const canSave = selected !== "" && hasContext && !saving;

  const handleSelect = (value: VoucherType) => {
    setSelected(value);
  };

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

      const dto = buildFormalIdentityDto(existing, businessId, selected);
      await createFormalIdentity(dto);
      onComplete();
    } catch (err) {
      console.error("Error saving voucher type:", err);
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
            Selecciona el tipo de comprobante que emitirás con tu negocio
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Tu contexto actual
            </h3>
            <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Tipo de contribuyente
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {taxpayerType
                    ? TAXPAYER_TYPE_LABELS[taxpayerType] || taxpayerType
                    : "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Régimen tributario
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {taxRegime
                    ? TAX_REGIME_LABELS[taxRegime] || taxRegime
                    : "No definido"}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Según tu tipo de contribuyente y régimen tributario, el sistema te
              muestra los comprobantes que puedes emitir legalmente.
            </p>
            {stepDescription && (
              <p className="text-xs text-gray-500 italic">{stepDescription}</p>
            )}
            {!hasContext && (
              <div className="bg-amber-50 p-3 rounded border border-amber-200">
                <p className="text-xs text-amber-700">
                  Completa los pasos anteriores para definir tu contexto.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Selecciona tipo de comprobante
            </h3>
            <div className="space-y-3">
              {VOUCHER_OPTIONS.map((option) => {
                const isEnabled = allowedTypes.has(option.value);
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
                          : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                      }
                    `}
                  >
                    <span className="font-semibold text-gray-800 text-sm">
                      {option.title}
                    </span>
                    <span className="text-xs text-gray-600 mt-1">
                      {option.description}
                    </span>
                    {isSelected && (
                      <span className="mt-2 text-xs text-green-600 font-medium">
                        ✓ Seleccionado
                      </span>
                    )}
                    {!isEnabled && (
                      <span className="mt-2 text-xs text-gray-400">
                        No disponible para tu tipo y régimen
                      </span>
                    )}
                  </button>
                );
              })}
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