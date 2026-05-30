"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { CreateBusinessData } from "@/services/business-service";
import { createBusiness } from "@/services/business-service";
import { useAuthStore } from "@/store/auth-store";
import { BusinessWizardStepper } from "./_components/BusinessWizardStepper";
import { Step1BusinessData } from "./_components/Step1BusinessData";
import { Step2Location } from "./_components/Step2Location";
import { Step3Summary } from "./_components/Step3Summary";

const STEPS = [
  { id: 1, label: "Datos del\nNegocio" },
  { id: 2, label: "Ubicación" },
  { id: 3, label: "Resumen" },
];

const STEP_FIELDS: Record<number, (keyof CreateBusinessData)[]> = {
  1: ["displayName", "startDate"],
  2: ["department", "province", "district", "address"],
  3: [],
};

const INITIAL_DATA: Partial<CreateBusinessData> = {
  displayName: "",
  startDate: "",
  department: "",
  province: "",
  district: "",
  address: "",
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
          displayName: "Nombre del Negocio",
          startDate: "Fecha de Inicio",
          department: "Departamento",
          province: "Provincia",
          district: "Distrito",
          address: "Dirección",
        };
        newErrors[field] = `${fieldLabels[field]} es requerido`;
      }
    });

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
        return <Step1BusinessData data={formData} onChange={handleFieldChange} errors={errors} />;
      case 2:
        return <Step2Location data={formData} onChange={handleFieldChange} errors={errors} />;
      case 3:
        return <Step3Summary data={formData} />;
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
          Crear Nuevo Negocio
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
              Confirmar y crear negocio
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}