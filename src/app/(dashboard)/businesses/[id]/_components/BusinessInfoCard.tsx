"use client";

import { Business, CreateBusinessData } from "@/services/business-service";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { LocationSection } from "./LocationSection";
import { TaxInfoSection } from "./TaxInfoSection";
import { Separator } from "@/components/ui/separator";

interface BusinessInfoCardProps {
  business: Business;
  onBusinessUpdate: (data: CreateBusinessData) => Promise<void>;
}

export function BusinessInfoCard({ business, onBusinessUpdate }: BusinessInfoCardProps) {
  return (
    <div className="bg-white rounded-none shadow-md p-6 border border-gray-100 transition-shadow hover:shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-blue-600 rounded-none" />
        <h2 className="text-blue-700 font-semibold text-lg">Datos del negocio</h2>
      </div>

      <div className="flex flex-col gap-3">
        <GeneralInfoSection business={business} onUpdate={onBusinessUpdate} />
        <Separator className="my-1" />
        <LocationSection business={business} onUpdate={onBusinessUpdate} />
        <Separator className="my-1" />
        <TaxInfoSection business={business} onUpdate={onBusinessUpdate} />
      </div>
    </div>
  );
}