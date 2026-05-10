"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Business, CreateBusinessData } from "@/services/business-service";
import { SectionHeader } from "./SectionHeader";
import { useEditableSection } from "../_hooks/useEditableSection";
import { useState } from "react";
import { updateBusiness } from "@/services/business-service";

interface TaxInfoSectionProps {
  business: Business;
  onUpdate: (data: CreateBusinessData) => Promise<void>;
}

type TaxData = Pick<Business, "businessType" | "taxRegime" | "ruc">;

export function TaxInfoSection({ business, onUpdate }: TaxInfoSectionProps) {
  const { isEditing, isSaving, startEditing, cancelEditing, save } = useEditableSection();

  const [formData, setFormData] = useState<TaxData>({
    businessType: business.businessType || "",
    taxRegime: business.taxRegime || "",
    ruc: business.ruc,
  });

  const handleChange = (field: keyof TaxData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await save(async () => {
      const fullData: CreateBusinessData = {
        ...business,
        ...formData,
      };
      await updateBusiness(business.id, fullData);
      await onUpdate(fullData);
    });
  };

  const handleCancel = () => {
    setFormData({
      businessType: business.businessType || "",
      taxRegime: business.taxRegime || "",
      ruc: business.ruc,
    });
    cancelEditing();
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <SectionHeader
        title="Datos Tributarios"
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={startEditing}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">Tipo de Empresa</Label>
              <Input
                className="rounded-none h-8 text-sm"
                value={formData.businessType}
                onChange={(e) => handleChange("businessType", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Régimen Tributario</Label>
              <Input
                className="rounded-none h-8 text-sm"
                value={formData.taxRegime}
                onChange={(e) => handleChange("taxRegime", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-600">RUC</Label>
            <Input
              className="rounded-none h-8 text-sm"
              value={formData.ruc}
              onChange={(e) => handleChange("ruc", e.target.value)}
              maxLength={11}
              minLength={11}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tipo de Empresa</span>
            <span className="text-gray-800 font-medium">{business.businessType || "N/A"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Régimen Tributario</span>
            <span className="text-gray-800 font-medium">{business.taxRegime || "N/A"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">RUC</span>
            <span className="text-gray-800 font-medium">{business.ruc}</span>
          </div>
        </div>
      )}
    </div>
  );
}