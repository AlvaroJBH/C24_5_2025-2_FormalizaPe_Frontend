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

interface LicenseOption {
  value: boolean;
  title: string;
  description: string;
}

const LICENSE_OPTIONS: LicenseOption[] = [
  {
    value: true,
    title: "Sí, mi negocio requiere licencia municipal",
    description: "Opero desde un local físico o atiendo clientes presencialmente.",
  },
  {
    value: false,
    title: "No, mi negocio no requiere licencia municipal",
    description:
      "No opero desde un establecimiento físico ni atiendo público presencialmente.",
  },
];

export function MunicipalEvaluateLicenseRequirementStep({
  businessId,
  stepTitle,
  stepDescription,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;

  const currentValue = formalIdentity?.municipalLicenseRequired ?? null;

  const [selected, setSelected] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentValue !== null) {
      setSelected(currentValue);
    }
  }, [currentValue]);

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
        companyType: existing?.companyType || "",
        isRegisteredCompany: existing?.isRegisteredCompany ?? undefined,
        voucherType: existing?.voucherType || "",
        electronicInvoicingEnabled: existing?.electronicInvoicingEnabled ?? undefined,
        hasEmployees: existing?.hasEmployees ?? undefined,
        payrollEnabled: existing?.payrollEnabled ?? undefined,
        accountingObligation: existing?.accountingObligation || "",
        electronicBooksEnabled: existing?.electronicBooksEnabled ?? undefined,
        municipalLicenseRequired: selected ?? undefined,
      };

      await createFormalIdentity(dto);
      onComplete();
    } catch (err) {
      console.error("Error saving municipal license requirement:", err);
    } finally {
      setSaving(false);
    }
  };

  const formatLocation = () => {
    const parts = [
      business?.address,
      business?.district,
      business?.province,
      business?.department,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "No disponible";
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl" className="rounded-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {stepTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Evalúa si tu negocio requiere licencia municipal de funcionamiento
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Información actual del negocio
            </h3>

            <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Ubicación del negocio
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {formatLocation()}
                </p>
              </div>

              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Nombre comercial
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {business?.displayName || "No disponible"}
                </p>
              </div>

              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Razón social
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {formalIdentity?.legalName || "No disponible"}
                </p>
              </div>

              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Código CIIU
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {formalIdentity?.ciiuCode || "No disponible"}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Esta información puede ayudarte a determinar si tu actividad
              requiere operar desde un establecimiento físico o atender clientes
              presencialmente.
            </p>

            {stepDescription && (
              <p className="text-xs text-gray-500 italic">{stepDescription}</p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Evaluación de licencia municipal
            </h3>

            <p className="text-sm text-gray-600">
              La necesidad de una licencia municipal depende principalmente de si
              el negocio opera desde un local físico o atiende clientes de manera
              presencial.
            </p>

            <p className="text-sm text-gray-600">
              Si realizas actividades en un establecimiento, oficina, tienda,
              consultorio, taller o cualquier espacio donde recibes clientes o
              desarrollas operaciones presenciales, normalmente necesitarás una
              licencia municipal.
            </p>

            <p className="text-sm text-gray-600">
              Si trabajas de forma remota, sin atención al público y sin operar
              desde un establecimiento abierto al público, es posible que no
              necesites una licencia.
            </p>

            <div className="space-y-3 pt-2">
              {LICENSE_OPTIONS.map((option) => {
                const isSelected = selected === option.value;

                return (
                  <button
                    key={String(option.value)}
                    onClick={() => handleSelect(option.value)}
                    disabled={saving}
                    className={`
                      w-full flex flex-col items-start text-left p-4 rounded-none border-2 transition-all
                      ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
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