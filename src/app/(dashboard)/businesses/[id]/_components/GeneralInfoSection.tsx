"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Business, CreateBusinessData } from "@/services/business-service";
import { SectionHeader } from "./SectionHeader";
import { useEditableSection } from "../_hooks/useEditableSection";
import { useState } from "react";
import { updateBusiness } from "@/services/business-service";
import { useAuthStore } from "@/store/auth-store";

interface GeneralInfoSectionProps {
  business: Business;
  onUpdate: (data: CreateBusinessData) => Promise<void>;
}

type GeneralData = Pick<Business, "tradeName" | "legalName" | "sector" | "economicActivity" | "startDate">;

export function GeneralInfoSection({ business, onUpdate }: GeneralInfoSectionProps) {
  const { isEditing, isSaving, startEditing, cancelEditing, save } = useEditableSection();
  const { token } = useAuthStore();

  const [formData, setFormData] = useState<GeneralData>({
    tradeName: business.tradeName,
    legalName: business.legalName,
    sector: business.sector,
    economicActivity: business.economicActivity,
    startDate: business.startDate || "",
  });

  const handleChange = (field: keyof GeneralData, value: string) => {
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
      tradeName: business.tradeName,
      legalName: business.legalName,
      sector: business.sector,
      economicActivity: business.economicActivity,
      startDate: business.startDate || "",
    });
    cancelEditing();
  };

  const displayData = {
    tradeName: business.tradeName,
    legalName: business.legalName,
    sector: business.sector,
    economicActivity: business.economicActivity,
    startDate: business.startDate,
  };

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <SectionHeader
        title="Datos Generales"
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={startEditing}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Nombre Comercial</Label>
            <Input
              className="rounded-none h-8 text-sm"
              value={formData.tradeName}
              onChange={(e) => handleChange("tradeName", e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Razón Social</Label>
            <Input
              className="rounded-none h-8 text-sm"
              value={formData.legalName}
              onChange={(e) => handleChange("legalName", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">Sector</Label>
              <Input
                className="rounded-none h-8 text-sm"
                value={formData.sector}
                onChange={(e) => handleChange("sector", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Actividad Económica</Label>
              <Input
                className="rounded-none h-8 text-sm"
                value={formData.economicActivity}
                onChange={(e) => handleChange("economicActivity", e.target.value)}
              />
            </div>
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
            <span className="text-gray-500">Nombre Comercial</span>
            <span className="text-gray-800 font-medium">{displayData.tradeName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Razón Social</span>
            <span className="text-gray-800 font-medium">{displayData.legalName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Sector</span>
            <span className="text-gray-800 font-medium">{displayData.sector}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Actividad Económica</span>
            <span className="text-gray-800 font-medium">{displayData.economicActivity}</span>
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