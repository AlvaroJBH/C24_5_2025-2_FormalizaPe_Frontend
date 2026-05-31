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
  buildFormalIdentityDto,
  FormalIdentityResponse,
} from "@/services/formalization-service";
import type { StepComponentProps } from "../StepFallbackModal";

interface EmployerOption {
  value: boolean;
  title: string;
  description: string;
  disabled?: boolean;
}

const TAXPAYER_TYPE_LABELS: Record<string, string> = {
  PERSONA_NATURAL: "Persona Natural",
  PERSONA_JURIDICA: "Persona Jurídica",
};

export function SunatDeclareEmployerStep({
  businessId,
  stepTitle,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;

  const taxpayerType = formalIdentity?.taxpayerType ?? null;
  const isPersonaJuridica = taxpayerType === "PERSONA_JURIDICA";

  const [selected, setSelected] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave = selected !== null && !saving;

  const handleSelect = (value: boolean) => {
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
      }

      const dto = buildFormalIdentityDto(existing, businessId, {
        hasEmployees: selected ?? undefined,
      });

      await createFormalIdentity(dto);
      onComplete();
    } catch (err) {
      console.error("Error saving hasEmployees:", err);
    } finally {
      setSaving(false);
    }
  };

  const options: EmployerOption[] = [
    {
      value: true,
      title: "Sí, tengo trabajadores",
      description: "El negocio tiene personal contratado a su cargo.",
    },
    {
      value: false,
      title: "No tengo trabajadores",
      description: isPersonaJuridica
        ? "Esta opción no está disponible para personas jurídicas."
        : "Trabajo solo sin personal contratado.",
      disabled: isPersonaJuridica,
    },
  ];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl" className="rounded-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {stepTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Declaración de empleador ante SUNAT
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Tipo de contribuyente
            </h3>

            <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Classification actual
                </p>
                <p className="text-sm text-gray-800 font-semibold">
                  {taxpayerType
                    ? TAXPAYER_TYPE_LABELS[taxpayerType] || taxpayerType
                    : "No definido"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                Esta información fue definida en pasos anteriores del procedimento.
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded border border-amber-200 space-y-2">
              {isPersonaJuridica ? (
                <>
                  <p className="text-sm text-amber-700 font-medium">
                    Declaración obligatoria como empleador
                  </p>
                  <p className="text-xs text-amber-600">
                    En el caso de una persona jurídica, la normativa exige que la empresa
                    se declare como empleador. Incluso si no has contratado personal externo,
                    el representante legal o titular figura como trabajador para efectos laborales.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-amber-700 font-medium">
                    ¿Tienes trabajadores a tu cargo?
                  </p>
                  <p className="text-xs text-amber-600">
                    Si trabajas solo y no tienes personal contratado, no es necesario que
                    te declares como empleador ante SUNAT. Sin embargo, si decides contratar
                    trabajadores, deberás realizar el alta como empleador y cumplir con las
                    obligaciones laborales correspondientes.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Selecciona una opción
            </h3>

            <div className="space-y-3">
              {options.map((option) => {
                const isSelected = selected === option.value;
                const isDisabled = option.disabled || saving;

                return (
                  <button
                    key={String(option.value)}
                    onClick={() => !isDisabled && handleSelect(option.value)}
                    disabled={isDisabled}
                    className={`
                      w-full flex flex-col items-start text-left p-4 rounded-none border-2 transition-all
                      ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : isDisabled
                          ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
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