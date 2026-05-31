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
  buildFormalIdentityDto,
  FormalIdentityResponse,
} from "@/services/formalization-service";
import { useBusinessStore } from "@/store/business-store";
import type { StepComponentProps } from "../StepFallbackModal";
import { CheckCircle2, Circle } from "lucide-react";

type ElectronicBooksDecision = "ACTIVATE" | "NOT_ACTIVATE";

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

const ACCOUNTING_LABELS: Record<string, string> = {
  SIMPLIFICADA: "Contabilidad Simplificada",
  COMPLETA: "Contabilidad Completa",
};

interface ElectronicBooksOption {
  value: ElectronicBooksDecision;
  title: string;
  description: string;
}

const ELECTRONIC_BOOKS_OPTIONS: ElectronicBooksOption[] = [
  {
    value: "ACTIVATE",
    title: "Activar libros electrónicos",
    description:
      "Registrar todas las operaciones del negocio mediante el sistema de libros electrónicos de SUNAT.",
  },
  {
    value: "NOT_ACTIVATE",
    title: "No activar libros electrónicos",
    description:
      "Mantener el control contable fuera del sistema electrónico de SUNAT (no aplicable a todos los regímenes).",
  },
];

function getElectronicBooksConfig(params: {
  taxRegime: string | null;
  accountingObligation: string | null;
  isRegisteredCompany: boolean | null;
  taxpayerType: string | null;
}): {
  requiresActivation: boolean;
  notActivateDisabled: boolean;
  notActivateReason: string | null;
} {
  const { taxRegime, accountingObligation, isRegisteredCompany, taxpayerType } = params;

  if (taxRegime === "GENERAL") {
    return {
      requiresActivation: true,
      notActivateDisabled: true,
      notActivateReason: "El Régimen General obliga a llevar libros electrónicos",
    };
  }

  if (isRegisteredCompany === true) {
    return {
      requiresActivation: true,
      notActivateDisabled: true,
      notActivateReason: "Las empresas constituidas deben llevar libros electrónicos",
    };
  }

  if (accountingObligation === "COMPLETA") {
    return {
      requiresActivation: true,
      notActivateDisabled: true,
      notActivateReason: "La contabilidad completa requiere libros electrónicos",
    };
  }

  if (taxRegime === "NRUS") {
    return {
      requiresActivation: false,
      notActivateDisabled: false,
      notActivateReason: null,
    };
  }

  return {
    requiresActivation: false,
    notActivateDisabled: false,
    notActivateReason: null,
  };
}

export function SunatActivateElectronicBooksStep({
  businessId,
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;

  const currentElectronicBooksEnabled = formalIdentity?.electronicBooksEnabled ?? null;

  const [selected, setSelected] = useState<ElectronicBooksDecision | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentElectronicBooksEnabled !== null) {
      setSelected(currentElectronicBooksEnabled ? "ACTIVATE" : "NOT_ACTIVATE");
    }
  }, [currentElectronicBooksEnabled]);

  const config = getElectronicBooksConfig({
    taxRegime: formalIdentity?.taxRegime ?? null,
    accountingObligation: formalIdentity?.accountingObligation ?? null,
    isRegisteredCompany: formalIdentity?.isRegisteredCompany ?? null,
    taxpayerType: formalIdentity?.taxpayerType ?? null,
  });

  const canComplete = selected !== "" && !saving;

  const handleSelect = (value: ElectronicBooksDecision) => {
    if (config.notActivateDisabled && value === "NOT_ACTIVATE") {
      return;
    }
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
        electronicBooksEnabled: selected === "ACTIVATE",
      });
      await createFormalIdentity(dto);
      onComplete();
    } catch (err) {
      console.error("Error saving electronic books decision:", err);
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
            Libros contables electrónicos
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Datos del negocio
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
                <p className="text-xs text-blue-500 font-medium mb-1">Obligación contable</p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.accountingObligation
                    ? ACCOUNTING_LABELS[formalIdentity.accountingObligation] || formalIdentity.accountingObligation
                    : "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">Tipo de empresa</p>
                <p className="text-sm text-gray-800 font-medium">
                  {formalIdentity?.isRegisteredCompany === true
                    ? "Empresa constituida"
                    : formalIdentity?.isRegisteredCompany === false
                    ? "Sin estructura formal"
                    : "No definido"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                Estos datos determinan si tu negocio requiere llevar libros contables
                electrónicos ante SUNAT.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Información normativa
            </h3>

            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
              <p className="text-sm text-gray-700">
                Los libros electrónicos son un sistema obligatorio de registro
                contable en SUNAT para ciertos regímenes tributarios.
              </p>
              <p className="text-sm text-gray-700">
                Su activación implica llevar registros digitales de todas las
                operaciones del negocio a través del sistema PUBLED (Publicadores
                de Libros Electrónicos).
              </p>
              {config.requiresActivation && (
                <div className="pt-2 border-t border-yellow-200">
                  <p className="text-sm text-gray-700 font-medium">
                    Según tu régimen y estructura empresarial, tu negocio está
                    obligado a llevar libros electrónicos.
                  </p>
                </div>
              )}
            </div>

            {config.notActivateReason && (
              <div className="bg-amber-50 p-3 rounded border border-amber-200">
                <p className="text-xs text-amber-700">
                  {config.notActivateReason}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                3
              </span>
              Decisión
            </h3>

            <div className="bg-green-50 p-3 rounded border border-green-200">
              <p className="text-xs text-green-700">
                Selecciona una opción para continuar
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {ELECTRONIC_BOOKS_OPTIONS.map((option) => {
                const isDisabled =
                  (config.notActivateDisabled && option.value === "NOT_ACTIVATE") ||
                  saving;
                const isSelected = selected === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    disabled={isDisabled}
                    className={`
                      flex flex-col items-start text-left p-4 rounded-none border-2 transition-all
                      ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : isDisabled
                          ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                          : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      )}
                      {!isSelected && !isDisabled && (
                        <Circle className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      {!isSelected && isDisabled && (
                        <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                      <span className="font-semibold text-gray-800 text-sm">
                        {option.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 mt-1 ml-6">
                      {option.description}
                    </span>
                    {isSelected && (
                      <span className="mt-2 text-xs text-green-600 font-medium ml-6">
                        ✓ Seleccionado
                      </span>
                    )}
                    {isDisabled && option.value === "NOT_ACTIVATE" && (
                      <span className="mt-2 text-xs text-gray-400 font-medium ml-6">
                        No disponible
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
            disabled={!canComplete}
          >
            {saving ? "Guardando..." : "Guardar y continuar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}