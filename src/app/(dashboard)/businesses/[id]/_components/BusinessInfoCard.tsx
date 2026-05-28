"use client";

import { useState } from "react";
import { Business, UpdateBusinessData } from "@/services/business-service";
import { createFormalIdentity } from "@/services/formalization-service";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { LocationSection } from "./LocationSection";
import { TaxInfoSection } from "./TaxInfoSection";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

interface BusinessInfoCardProps {
  business: Business;
  onBusinessUpdate: (data: UpdateBusinessData) => Promise<void>;
  onFormalizationComplete?: () => void;
}

export function BusinessInfoCard({ business, onBusinessUpdate, onFormalizationComplete }: BusinessInfoCardProps) {
  const { token } = useAuthStore();
  const [showFormalizationForm, setShowFormalizationForm] = useState(false);
  const [formalizationData, setFormalizationData] = useState({
    tradeName: "",
    legalName: "",
    ruc: "",
    taxRegime: "",
    ciiuCode: "",
  });
  const [formalizationError, setFormalizationError] = useState<string | null>(null);
  const [isSubmittingFormalization, setIsSubmittingFormalization] = useState(false);

  const handleStartFormalization = () => {
    if (business.formalIdentity) {
      setFormalizationData({
        tradeName: business.formalIdentity.tradeName,
        legalName: business.formalIdentity.legalName,
        ruc: business.formalIdentity.ruc,
        taxRegime: business.formalIdentity.taxRegime,
        ciiuCode: business.formalIdentity.ciiuCode,
      });
    }
    setShowFormalizationForm(true);
    setFormalizationError(null);
  };

  const handleFormalizationChange = (field: string, value: string) => {
    setFormalizationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitFormalization = async () => {
    if (!token) return;

    setIsSubmittingFormalization(true);
    setFormalizationError(null);
    try {
      await createFormalIdentity({
        businessId: business.id,
        tradeName: formalizationData.tradeName || undefined,
        legalName: formalizationData.legalName || undefined,
        ruc: formalizationData.ruc || undefined,
        taxRegime: formalizationData.taxRegime || undefined,
        ciiuCode: formalizationData.ciiuCode || undefined,
      });
      setShowFormalizationForm(false);
      onFormalizationComplete?.();
    } catch {
      setFormalizationError("Error al iniciar formalización. Verifica los datos.");
    } finally {
      setIsSubmittingFormalization(false);
    }
  };

  if (showFormalizationForm) {
    return (
      <div className="bg-white rounded-none shadow-md p-6 border border-gray-100 transition-shadow hover:shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-blue-600 rounded-none" />
          <h2 className="text-blue-700 font-semibold text-lg">Formalización</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Completa los datos legales de tu negocio para iniciar el proceso de formalización.
          </p>

          <div>
            <Label className="text-xs text-gray-600">Nombre Comercial</Label>
            <Input
              className="rounded-none h-8 text-sm"
              value={formalizationData.tradeName ?? ""}
              onChange={(e) => handleFormalizationChange("tradeName", e.target.value)}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Razón Social</Label>
            <Input
              className="rounded-none h-8 text-sm"
              value={formalizationData.legalName ?? ""}
              onChange={(e) => handleFormalizationChange("legalName", e.target.value)}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">RUC</Label>
            <Input
              className="rounded-none h-8 text-sm"
              value={formalizationData.ruc ?? ""}
              onChange={(e) => handleFormalizationChange("ruc", e.target.value)}
              maxLength={11}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Régimen Tributario</Label>
            <Input
              className="rounded-none h-8 text-sm"
              value={formalizationData.taxRegime ?? ""}
              onChange={(e) => handleFormalizationChange("taxRegime", e.target.value)}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-600">Código CIIU</Label>
            <Input
              className="rounded-none h-8 text-sm"
              value={formalizationData.ciiuCode ?? ""}
              onChange={(e) => handleFormalizationChange("ciiuCode", e.target.value)}
            />
          </div>

          {formalizationError && (
            <p className="text-red-500 text-xs">{formalizationError}</p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="rounded-none flex-1"
              onClick={() => setShowFormalizationForm(false)}
              disabled={isSubmittingFormalization}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-none flex-1"
              onClick={handleSubmitFormalization}
              disabled={isSubmittingFormalization}
            >
              {isSubmittingFormalization ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
        <TaxInfoSection business={business} onStartFormalization={handleStartFormalization} />
      </div>
    </div>
  );
}