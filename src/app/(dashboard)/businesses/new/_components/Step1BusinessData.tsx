"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreateBusinessData } from "@/services/business-service";
import { LabeledTooltip } from "./LabeledTooltip";

interface Step1BusinessDataProps {
  data: Partial<CreateBusinessData>;
  onChange: (field: keyof CreateBusinessData, value: string) => void;
  errors: Record<string, string>;
}

export function Step1BusinessData({ data, onChange, errors }: Step1BusinessDataProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1.5 block">
          <LabeledTooltip
            label="Nombre del Negocio"
            content="Nombre público de tu negocio informal. Es el nombre que usarás para identificarte."
          >
            <span className="text-red-500">*</span>
          </LabeledTooltip>
        </Label>
        <Input
          id="displayName"
          className="rounded-none"
          value={data.displayName || ""}
          onChange={(e) => onChange("displayName", e.target.value)}
        />
        {errors.displayName && (
          <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
        )}
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