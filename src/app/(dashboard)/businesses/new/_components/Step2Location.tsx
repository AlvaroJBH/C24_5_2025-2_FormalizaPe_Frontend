"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreateBusinessData } from "@/services/business-service";

interface Step2LocationProps {
  data: Partial<CreateBusinessData>;
  onChange: (field: keyof CreateBusinessData, value: string) => void;
  errors: Record<string, string>;
}

export function Step2Location({ data, onChange, errors }: Step2LocationProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="department" className="mb-1.5 block">
            Departamento
          </Label>
          <Input
            id="department"
            className="rounded-none"
            value={data.department || ""}
            onChange={(e) => onChange("department", e.target.value)}
          />
          {errors.department && (
            <p className="text-red-500 text-xs mt-1">{errors.department}</p>
          )}
        </div>

        <div>
          <Label htmlFor="province" className="mb-1.5 block">
            Provincia
          </Label>
          <Input
            id="province"
            className="rounded-none"
            value={data.province || ""}
            onChange={(e) => onChange("province", e.target.value)}
          />
          {errors.province && (
            <p className="text-red-500 text-xs mt-1">{errors.province}</p>
          )}
        </div>

        <div>
          <Label htmlFor="district" className="mb-1.5 block">
            Distrito
          </Label>
          <Input
            id="district"
            className="rounded-none"
            value={data.district || ""}
            onChange={(e) => onChange("district", e.target.value)}
          />
          {errors.district && (
            <p className="text-red-500 text-xs mt-1">{errors.district}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="address" className="mb-1.5 block">
          Dirección
        </Label>
        <Input
          id="address"
          className="rounded-none"
          value={data.address || ""}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>
    </div>
  );
}