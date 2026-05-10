"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { CreateBusinessData } from "@/services/business-service";
import { createBusiness } from "@/services/business-service";
import { useAuthStore } from "@/store/auth-store";
import { BusinessWizardStepper } from "./_components/BusinessWizardStepper";
import { Step1GeneralData } from "./_components/Step1GeneralData";
import { Step2Location } from "./_components/Step2Location";
import { Step3TaxData } from "./_components/Step3TaxData";
import { Step4Summary } from "./_components/Step4Summary";

const STEPS = [
  { id: 1, label: "Datos\nGenerales" },
  { id: 2, label: "Ubicación" },
  { id: 3, label: "Datos\nTributarios" },
  { id: 4, label: "Resumen" },
];

const STEP_FIELDS: Record<number, (keyof CreateBusinessData)[]> = {
  1: ["tradeName", "legalName", "sector", "economicActivity", "startDate"],
  2: ["department", "province", "district", "address"],
  3: ["businessType", "taxRegime", "ruc"],
  4: [],
};

const INITIAL_DATA: Partial<CreateBusinessData> = {
  tradeName: "",
  legalName: "",
  businessType: "",
  sector: "",
  economicActivity: "",
  startDate: "",
  department: "",
  province: "",
  district: "",
  address: "",
  taxRegime: "",
  ruc: "",
  status: "ACTIVO",
};

export default function NewBusinessPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateBusinessData>>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field: keyof CreateBusinessData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const fields = STEP_FIELDS[step];
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field];
      if (!value || value.trim() === "") {
        const fieldLabels: Record<keyof CreateBusinessData, string> = {
          tradeName: "Nombre Comercial",
          legalName: "Razón Social",
          sector: "Sector",
          economicActivity: "Actividad Económica",
          startDate: "Fecha de Inicio",
          department: "Departamento",
          province: "Provincia",
          district: "Distrito",
          address: "Dirección",
          businessType: "Tipo de Empresa",
          taxRegime: "Régimen Tributario",
          ruc: "RUC",
          status: "Estado",
        };
        newErrors[field] = `${fieldLabels[field]} es requerido`;
      }
    });

    if (step === 3 && formData.ruc && formData.ruc.length !== 11) {
      newErrors.ruc = "El RUC debe tener exactamente 11 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      await createBusiness(formData as CreateBusinessData);
      router.push("/businesses");
    } catch {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1GeneralData data={formData} onChange={handleFieldChange} errors={errors} />;
      case 2:
        return <Step2Location data={formData} onChange={handleFieldChange} errors={errors} />;
      case 3:
        return <Step3TaxData data={formData} onChange={handleFieldChange} errors={errors} />;
      case 4:
        return <Step4Summary data={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="rounded-none pl-0 hover:bg-transparent hover:text-blue-600"
          onClick={() => router.push("/businesses")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a empresas
        </Button>
      </div>

      <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Crear Nueva Empresa
        </h1>

        <BusinessWizardStepper steps={STEPS} currentStep={currentStep} />

        <div className="min-h-80">{renderStep()}</div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="rounded-none"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              className="rounded-none"
              onClick={handleNext}
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="rounded-none"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmar y crear empresa
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}