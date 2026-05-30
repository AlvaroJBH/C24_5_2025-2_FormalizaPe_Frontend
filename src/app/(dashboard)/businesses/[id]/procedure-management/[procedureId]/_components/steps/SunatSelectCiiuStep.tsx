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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StepComponentProps } from "../StepFallbackModal";
import ciiuData from "@/data/ciiu_revision4.json";
import {
  createFormalIdentity,
  getFormalIdentity,
  FormalIdentityResponse,
} from "@/services/formalization-service";
import { useBusinessStore } from "@/store/business-store";

type SelectedCiiu = {
  code: string;
  title: string;
};

interface Section {
  titulo: string;
  divisiones: Record<string, {
    titulo: string;
    subdivisiones?: Record<string, {
      titulo: string;
      actividades: Record<string, string>;
    }>;
    actividades?: Record<string, string>;
  }>;
}

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

function findCiiuInHierarchy(code: string, sections: Record<string, Section>) {
  for (const [sectionKey, section] of Object.entries(sections)) {
    for (const [divisionKey, division] of Object.entries(section.divisiones)) {
      if (division.actividades && division.actividades[code]) {
        return {
          section: sectionKey,
          division: divisionKey,
          subdivision: null,
          title: division.actividades[code],
        };
      }
      if (division.subdivisiones) {
        for (const [subdivisionKey, subdivision] of Object.entries(division.subdivisiones)) {
          if (subdivision.actividades && subdivision.actividades[code]) {
            return {
              section: sectionKey,
              division: divisionKey,
              subdivision: subdivisionKey,
              title: subdivision.actividades[code],
            };
          }
        }
      }
    }
  }
  return null;
}

function buildFormalIdentityDto(
  existing: FormalIdentityResponse | null,
  businessId: number,
  ciiuCode: string
): CreateFormalIdentityDto {
  return {
    businessId,
    businessDisplayName: existing?.businessDisplayName || "",
    tradeName: existing?.tradeName || "",
    legalName: existing?.legalName || "",
    ruc: existing?.ruc || "",
    sunatStatus: existing?.sunatStatus || "",
    taxpayerType: existing?.taxpayerType || "",
    ciiuCode,
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

export function SunatSelectCiiuStep({
  businessId,
  stepId,
  stepIdentifier,
  stepTitle,
  stepDescription,
  stepStatus,
  onClose,
  onComplete,
}: StepComponentProps) {
  const business = useBusinessStore((s) => s.business);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedSubdivision, setSelectedSubdivision] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<SelectedCiiu | null>(null);
  const [saving, setSaving] = useState(false);

  const sections = ciiuData as Record<string, Section>;
  const currentSection = selectedSection ? sections[selectedSection] : null;

  const divisions = currentSection?.divisiones || {};
  const currentDivision = selectedDivision ? divisions[selectedDivision] : null;

  const subdivisions = currentDivision?.subdivisiones || {};
  const hasSubdivisions = Object.keys(subdivisions).length > 0;

  useEffect(() => {
    const existingCiiuCode = business?.formalIdentity?.ciiuCode;
    if (existingCiiuCode) {
      const found = findCiiuInHierarchy(existingCiiuCode, sections);
      if (found) {
        setSelectedSection(found.section);
        setSelectedDivision(found.division);
        setSelectedSubdivision(found.subdivision || "");
        setSelectedActivity({ code: existingCiiuCode, title: found.title });
      }
    }
  }, [business?.formalIdentity?.ciiuCode, sections]);

  const handleSelectSection = (value: string) => {
    setSelectedSection(value);
    setSelectedDivision("");
    setSelectedSubdivision("");
    setSelectedActivity(null);
  };

  const handleSelectDivision = (value: string) => {
    setSelectedDivision(value);
    setSelectedSubdivision("");
    setSelectedActivity(null);
  };

  const handleSelectSubdivision = (value: string) => {
    setSelectedSubdivision(value);
    setSelectedActivity(null);
  };

  const handleSelectActivity = (code: string, title: string) => {
    setSelectedActivity({ code, title });
  };

  const canSave = selectedActivity !== null && !saving;

  const handleSave = async () => {
    if (!selectedActivity) return;

    setSaving(true);
    try {
      let existing: FormalIdentityResponse | null = null;
      try {
        existing = await getFormalIdentity(businessId);
      } catch {
        // 404 means no formal identity exists yet
      }

      const dto = buildFormalIdentityDto(existing, businessId, selectedActivity.code);
      await createFormalIdentity(dto);
      onComplete();
    } catch (err) {
      console.error("Error saving CIIU:", err);
    } finally {
      setSaving(false);
    }
  };

  const getDisplayedCode = (): string => {
    if (selectedActivity) {
      return `${selectedActivity.code} - ${selectedActivity.title}`;
    }
    return "Ninguno";
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="xl" className="rounded-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {stepTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Selecciona la clasificación CIIU para tu negocio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">
              CIIU seleccionado: {getDisplayedCode()}
            </p>
          </div>

          {stepDescription && (
            <p className="text-sm text-gray-600">{stepDescription}</p>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Sección
              </label>
              <Select value={selectedSection} onValueChange={handleSelectSection}>
                <SelectTrigger className="rounded-none w-full">
                  <SelectValue placeholder="Selecciona una sección" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-60 overflow-y-auto">
                  {Object.entries(sections).map(([key, section]) => (
                    <SelectItem key={key} value={key}>
                      {key} - {section.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                División
              </label>
              <Select
                value={selectedDivision}
                onValueChange={handleSelectDivision}
                disabled={!selectedSection}
              >
                <SelectTrigger className="rounded-none w-full">
                  <SelectValue placeholder="Selecciona una división" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-60 overflow-y-auto">
                  {Object.entries(divisions).map(([key, division]) => (
                    <SelectItem key={key} value={key}>
                      {key} - {division.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Subdivisión (opcional)
              </label>
              <Select
                value={selectedSubdivision}
                onValueChange={handleSelectSubdivision}
                disabled={!selectedDivision || !hasSubdivisions}
              >
                <SelectTrigger className="rounded-none w-full">
                  <SelectValue placeholder="Selecciona una subdivisión" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-60 overflow-y-auto">
                  {Object.entries(subdivisions).map(([key, subdivision]) => (
                    <SelectItem key={key} value={key}>
                      {key} - {(subdivision as { titulo: string }).titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Actividad (CIIU final)
              </label>
              <Select
                value={selectedActivity?.code || ""}
                onValueChange={(code) => {
                  const actividades = hasSubdivisions && selectedSubdivision
                    ? subdivisions[selectedSubdivision]?.actividades || {}
                    : currentDivision?.actividades || {};
                  const title = actividades[code];
                  if (title) {
                    handleSelectActivity(code, title);
                  }
                }}
                disabled={!selectedDivision}
              >
                <SelectTrigger className="rounded-none w-full">
                  <SelectValue placeholder="Selecciona una actividad" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-60 overflow-y-auto">
                  {Object.entries(
                    hasSubdivisions && selectedSubdivision
                      ? subdivisions[selectedSubdivision]?.actividades || {}
                      : currentDivision?.actividades || {}
                  ).map(([code, title]) => (
                    <SelectItem key={code} value={code}>
                      {code} - {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            disabled={!canSave}
          >
            {saving ? "Guardando..." : "Guardar y continuar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
