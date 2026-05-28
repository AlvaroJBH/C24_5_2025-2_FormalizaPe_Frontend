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
import { ExternalLink } from "lucide-react";
import {
  createFormalIdentity,
  getFormalIdentity,
  FormalIdentityResponse,
} from "@/services/formalization-service";
import { useBusinessStore } from "@/store/business-store";
import type { StepComponentProps } from "../StepFallbackModal";

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
  ruc: string
): CreateFormalIdentityDto {
  return {
    businessId,
    businessDisplayName: existing?.businessDisplayName || "",
    tradeName: existing?.tradeName || "",
    legalName: existing?.legalName || "",
    ruc,
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
  };
}

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

function formatDate(dateStr: string): string {
  if (!dateStr) return "No disponible";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatIncome(value: number | null | undefined): string {
  if (value === null || value === undefined) return "No definido";
  return `S/ ${value.toLocaleString("es-PE")}`;
}

function validateRuc(value: string): boolean {
  return /^\d{11}$/.test(value);
}

export function SunatRegisterRucStep({
  businessId,
  stepTitle,
  stepDescription,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const formalIdentity = business?.formalIdentity ?? null;

  const [ruc, setRuc] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (formalIdentity?.ruc) {
      setRuc(formalIdentity.ruc);
    }
  }, [formalIdentity?.ruc]);

  const handleRucChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setRuc(value);
  };

  const isValidRuc = validateRuc(ruc);
  const canSave = isValidRuc && !saving;

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

      const dto = buildFormalIdentityDto(existing, businessId, ruc);
      await createFormalIdentity(dto);
      onComplete();
    } catch (err) {
      console.error("Error saving RUC:", err);
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
            Registra el RUC de tu negocio en SUNAT
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Datos que ya tenemos
            </h3>
            <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3 text-sm">
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Tipo de contribuyente
                </p>
                <p className="text-gray-800 font-medium">
                  {formalIdentity?.taxpayerType
                    ? TAXPAYER_TYPE_LABELS[formalIdentity.taxpayerType] ||
                      formalIdentity.taxpayerType
                    : "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Actividad económica (CIIU)
                </p>
                <p className="text-gray-800 font-medium">
                  {formalIdentity?.ciiuCode || "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Régimen tributario
                </p>
                <p className="text-gray-800 font-medium">
                  {formalIdentity?.taxRegime
                    ? TAX_REGIME_LABELS[formalIdentity.taxRegime] ||
                      formalIdentity.taxRegime
                    : "No definido"}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Ingresos proyectados
                </p>
                <p className="text-gray-800 font-medium">
                  {formatIncome(formalIdentity?.projectedAnnualIncome ?? null)}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Dirección
                </p>
                <p className="text-gray-800 font-medium">
                  {formatAddress({
                    department: business?.department,
                    province: business?.province,
                    district: business?.district,
                    address: business?.address,
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-500 font-medium mb-1">
                  Fecha de inicio
                </p>
                <p className="text-gray-800 font-medium">
                  {business?.startDate
                    ? formatDate(business.startDate)
                    : "No disponible"}
                </p>
              </div>
            </div>
            {stepDescription && (
              <p className="text-xs text-gray-500 italic">{stepDescription}</p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Prepárate antes de ir a SUNAT
            </h3>
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-3">
              <p className="text-sm text-gray-700 font-medium">
                Ten a la mano:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  Documento de identidad (DNI o CE)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  Celular con App Personas SUNAT instalada
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  Correo electrónico activo
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  Clave SOL (se genera durante el proceso)
                </li>
              </ul>
              <div className="pt-2 border-t border-yellow-200">
                <p className="text-xs text-gray-600">
                  SUNAT realizará validación biométrica con tu documento.
                  El trámite es externo y lo gestionas directamente en su
                  plataforma.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                3
              </span>
              Realiza el trámite
            </h3>
            <div className="bg-green-50 p-4 rounded border border-green-200 space-y-4">
              <a
                href="https://www.gob.pe/284-inscripcion-en-el-ruc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-none font-medium text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Inscripción en el RUC – SUNAT
              </a>
              <div className="space-y-2">
                <label className="text-xs text-gray-600 font-medium block">
                  Ingresa tu RUC (11 dígitos)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 10456789012"
                  value={ruc}
                  onChange={handleRucChange}
                  maxLength={11}
                  className="rounded-none text-center text-lg tracking-widest font-mono"
                />
                {ruc.length > 0 && !isValidRuc && (
                  <p className="text-xs text-red-500">
                    El RUC debe tener exactamente 11 dígitos numéricos
                  </p>
                )}
                {ruc.length === 11 && isValidRuc && (
                  <p className="text-xs text-green-600">✓ RUC válido</p>
                )}
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
            disabled={!canSave}
          >
            {saving ? "Guardando..." : "Guardar y continuar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}