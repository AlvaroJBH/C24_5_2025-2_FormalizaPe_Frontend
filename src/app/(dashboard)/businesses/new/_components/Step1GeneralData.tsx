"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreateBusinessData } from "@/services/business-service";
import { LabeledTooltip } from "./LabeledTooltip";

interface Step1GeneralDataProps {
  data: Partial<CreateBusinessData>;
  onChange: (field: keyof CreateBusinessData, value: string) => void;
  errors: Record<string, string>;
}

export function Step1GeneralData({ data, onChange, errors }: Step1GeneralDataProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1.5 block">
          <LabeledTooltip
            label="Nombre Comercial"
            content="Nombre público de tu negocio o marca comercial. Es el nombre que usarás para identificar tu empresa."
          >
            <span className="text-red-500">*</span>
          </LabeledTooltip>
        </Label>
        <Input
          id="tradeName"
          className="rounded-none"
          value={data.tradeName || ""}
          onChange={(e) => onChange("tradeName", e.target.value)}
        />
        {errors.tradeName && (
          <p className="text-red-500 text-xs mt-1">{errors.tradeName}</p>
        )}
      </div>

      <div>
        <Label className="mb-1.5 block">
          <LabeledTooltip
            label="Razón Social"
            content="Razón social legal de tu empresa según registros públicos. Debe coincidir con tu documentación oficial."
          >
            <span className="text-red-500">*</span>
          </LabeledTooltip>
        </Label>
        <Input
          id="legalName"
          className="rounded-none"
          value={data.legalName || ""}
          onChange={(e) => onChange("legalName", e.target.value)}
        />
        {errors.legalName && (
          <p className="text-red-500 text-xs mt-1">{errors.legalName}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block">
            <LabeledTooltip
              label="Sector"
              content="Sector económico de tu empresa: tecnología, comercio, servicios, manufactura, etc."
            >
              <span className="text-red-500">*</span>
            </LabeledTooltip>
          </Label>
          <Input
            id="sector"
            className="rounded-none"
            value={data.sector || ""}
            onChange={(e) => onChange("sector", e.target.value)}
          />
          {errors.sector && (
            <p className="text-red-500 text-xs mt-1">{errors.sector}</p>
          )}
        </div>

        <div>
          <Label className="mb-1.5 block">
            <LabeledTooltip
              label="Actividad Económica"
              content="Actividad económica principal de tu empresa según el clasificador nacional."
            >
              <span className="text-red-500">*</span>
            </LabeledTooltip>
          </Label>
          <Input
            id="economicActivity"
            className="rounded-none"
            value={data.economicActivity || ""}
            onChange={(e) => onChange("economicActivity", e.target.value)}
          />
          {errors.economicActivity && (
            <p className="text-red-500 text-xs mt-1">{errors.economicActivity}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="startDate" className="mb-1.5 block">
          Fecha de Inicio de Actividades
        </Label>
        <Input
          id="startDate"
          type="date"
          className="rounded-none"
          value={data.startDate || ""}
          onChange={(e) => onChange("startDate", e.target.value)}
        />
      </div>
    </div>
  );
}