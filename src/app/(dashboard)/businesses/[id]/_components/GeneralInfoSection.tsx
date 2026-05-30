"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Business, UpdateBusinessData } from "@/services/business-service";
import { SectionHeader } from "./SectionHeader";
import { useEditableSection } from "../_hooks/useEditableSection";
import { useState } from "react";
import { updateBusiness } from "@/services/business-service";

interface GeneralInfoSectionProps {
  business: Business;
  onUpdate: (data: UpdateBusinessData) => Promise<void>;
}

type GeneralData = Pick<Business, "displayName" | "startDate">;

export function GeneralInfoSection({ business, onUpdate }: GeneralInfoSectionProps) {
  const { isEditing, isSaving, startEditing, cancelEditing, save } = useEditableSection();

  const [formData, setFormData] = useState<GeneralData>({
    displayName: business.displayName,
    startDate: business.startDate || "",
  });

  const handleChange = (field: keyof GeneralData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await save(async () => {
      const fullData: UpdateBusinessData = {
        displayName: formData.displayName,
        startDate: formData.startDate,
        department: business.department,
        province: business.province,
        district: business.district,
        address: business.address,
      };
      await updateBusiness(business.id, fullData);
      await onUpdate(fullData);
    });
  };

  const handleCancel = () => {
    setFormData({
      displayName: business.displayName,
      startDate: business.startDate || "",
    });
    cancelEditing();
  };

  const displayData = {
    displayName: business.displayName,
    startDate: business.startDate,
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <SectionHeader
        title="Datos del Negocio"
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={startEditing}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Nombre del Negocio</Label>
            <Input
              className="rounded-none h-8 text-sm"
              value={formData.displayName}
              onChange={(e) => handleChange("displayName", e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Fecha de Inicio</Label>
            <Input
              type="date"
              className="rounded-none h-8 text-sm"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Nombre del Negocio</span>
            <span className="text-gray-800 font-medium">{displayData.displayName}</span>
          </div>
          {displayData.startDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Fecha de Inicio</span>
              <span className="text-gray-800 font-medium">{displayData.startDate}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}