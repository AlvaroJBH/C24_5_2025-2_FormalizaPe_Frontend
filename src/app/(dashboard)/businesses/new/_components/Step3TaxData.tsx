"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreateBusinessData } from "@/services/business-service";
import { LabeledTooltip } from "./LabeledTooltip";

interface Step3TaxDataProps {
  data: Partial<CreateBusinessData>;
  onChange: (field: keyof CreateBusinessData, value: string) => void;
  errors: Record<string, string>;
}

export function Step3TaxData({ data, onChange, errors }: Step3TaxDataProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block">
            <LabeledTooltip
              label="Tipo de Empresa"
              content="Forma jurídica de tu empresa: Empresa Individual, Sociedad Anónima, Sociedad Comercial de Responsabilidad Limitada, etc."
            >
              <span className="text-red-500">*</span>
            </LabeledTooltip>
          </Label>
          <Input
            id="businessType"
            className="rounded-none"
            value={data.businessType || ""}
            onChange={(e) => onChange("businessType", e.target.value)}
          />
          {errors.businessType && (
            <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>
          )}
        </div>

        <div>
          <Label className="mb-1.5 block">
            <LabeledTooltip
              label="Régimen Tributario"
              content="Régimen tributario de SUNAT: General, Especial, MYPES, etc. Debe coincidir con tu inscripción en la SUNAT."
            >
              <span className="text-red-500">*</span>
            </LabeledTooltip>
          </Label>
          <Input
            id="taxRegime"
            className="rounded-none"
            value={data.taxRegime || ""}
            onChange={(e) => onChange("taxRegime", e.target.value)}
          />
          {errors.taxRegime && (
            <p className="text-red-500 text-xs mt-1">{errors.taxRegime}</p>
          )}
        </div>
      </div>

      <div>
        <Label className="mb-1.5 block">
          <LabeledTooltip
            label="RUC"
            content="Registro Único de Contribuyentes de 11 dígitos emitido por la SUNAT. Es indispensable para emitir facturas."
          >
            <span className="text-red-500">*</span>
          </LabeledTooltip>
        </Label>
        <Input
          id="ruc"
          className="rounded-none"
          value={data.ruc || ""}
          onChange={(e) => onChange("ruc", e.target.value)}
          maxLength={11}
          minLength={11}
        />
        {errors.ruc && (
          <p className="text-red-500 text-xs mt-1">{errors.ruc}</p>
        )}
      </div>
    </div>
  );
}