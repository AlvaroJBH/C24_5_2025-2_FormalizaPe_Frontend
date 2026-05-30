"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Business, CreateBusinessData } from "@/services/business-service";
import { SectionHeader } from "./SectionHeader";
import { useEditableSection } from "../_hooks/useEditableSection";
import { useState } from "react";
import { updateBusiness } from "@/services/business-service";

interface LocationSectionProps {
  business: Business;
  onUpdate: (data: CreateBusinessData) => Promise<void>;
}

type LocationData = Pick<Business, "department" | "province" | "district" | "address">;

export function LocationSection({ business, onUpdate }: LocationSectionProps) {
  const { isEditing, isSaving, startEditing, cancelEditing, save } = useEditableSection();

  const [formData, setFormData] = useState<LocationData>({
    department: business.department,
    province: business.province,
    district: business.district,
    address: business.address,
  });

  const handleChange = (field: keyof LocationData, value: string) => {
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
      department: business.department,
      province: business.province,
      district: business.district,
      address: business.address,
    });
    cancelEditing();
  };

  const displayLocation = [
    business.address,
    business.district,
    business.province,
    business.department,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <SectionHeader
        title="Ubicación"
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={startEditing}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-gray-600">Departamento</Label>
              <Input
                className="rounded-none h-8 text-sm"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Provincia</Label>
              <Input
                className="rounded-none h-8 text-sm"
                value={formData.province}
                onChange={(e) => handleChange("province", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Distrito</Label>
              <Input
                className="rounded-none h-8 text-sm"
                value={formData.district}
                onChange={(e) => handleChange("district", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-600">Dirección</Label>
            <Input
              className="rounded-none h-8 text-sm"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Ubicación</span>
            <span className="text-gray-800 font-medium text-right max-w-[60%]">
              {displayLocation || "No especificada"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}