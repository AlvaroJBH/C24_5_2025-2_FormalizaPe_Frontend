"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

import {
  getFormalizationStatus,
  toggleStep,
  FormalizationStepDTO,
  FormalizationProcedureDTO,
} from "@/services/formalization-service";
import { AppBreadcrumb } from "@/components/common/app-breadcrumb";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Business, getBusinessById } from "@/services/business-service";

export default function ProcedureDetailsPage() {
  const params = useParams();
  const businessId = Number(params.id);
  const procedureId = Number(params.procedureId);

  const { token } = useAuthStore();
  const [business, setBusiness] = useState<Business | null>(null)
  const [procedure, setProcedure] = useState<FormalizationProcedureDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingStep, setSavingStep] = useState<number | null>(null);

  const fetchProcedureData = async () => {
    try {
      setLoading(true);

      const data = await getFormalizationStatus(businessId);
      const found = data.procedures.find(
        (p: FormalizationProcedureDTO) => p.procedureId === procedureId
      );

      if (!found) throw new Error("Procedimiento no encontrado");
      setProcedure(found);
      const business_data = await getBusinessById(businessId);
      setBusiness(business_data)
    } catch (err) {
      console.error(err);
      setError("Error al cargar el procedimiento");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProcedureData();
  }, [token]);

  const handleToggleStep = async (step: FormalizationStepDTO) => {
    try {
      setSavingStep(step.stepId);

      await toggleStep({
        businessId,
        procedureId,
        stepId: step.stepId,
        completed: step.status !== "COMPLETED",
      });

      await fetchProcedureData();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el paso");
    } finally {
      setSavingStep(null);
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!procedure) return <div className="p-6">Procedimiento no encontrado</div>;

  // 🎨 Colores del borde según estado
  const statusStyles: Record<string, string> = {
    COMPLETED: "border-green-500",
    IN_PROGRESS: "border-blue-500",
    PENDING: "border-gray-300",
  };

  // 🎨 Badge colors
  const badgeColors: Record<string, string> = {
    COMPLETED: "bg-green-500",
    IN_PROGRESS: "bg-blue-500",
    PENDING: "bg-gray-400",
  };

  // 🏷️ Labels amigables
  const statusLabels: Record<string, string> = {
    COMPLETED: "Completado",
    IN_PROGRESS: "En progreso",
    PENDING: "Pendiente",
  };

  return (
    <div className="flex flex-col flex-1 p-6 overflow-auto">
      <AppBreadcrumb
        items={[
          { label: "Inicio", href: "/businesses" },
          { label: business?.displayName ?? "Business", href: `/businesses/${businessId}` },
          { label: "Progreso", href: `/businesses/${businessId}/procedure-management` },
          { label: procedure?.name ?? "Procedure", href: `/businesses/${businessId}/procedure-management/${procedureId}` },
        ]}
      />
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* LEFT COLUMN – card */}
      <div className="md:col-span-1">
        <div
          className={`bg-white rounded-none shadow-md p-6 space-y-5 border border-gray-300 border-l-[6px] ${
            statusStyles[procedure.status]
          }`}
        >
          <div>
            <h1 className="text-2xl font-semibold text-blue-700">
              {procedure.name}
            </h1>

            <p className="text-gray-600 mt-1">{procedure.description}</p>

            <span className="text-xs text-gray-500">{procedure.category}</span>

            <div className="mt-3">
              <Badge
                className={`${
                  badgeColors[procedure.status]
                } text-white rounded-none`}
              >
                {statusLabels[procedure.status]}
              </Badge>
            </div>
          </div>

          {/* progress */}
          <div>
            <Progress
              value={procedure.progressPercent}
              className="h-2 rounded-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              {procedure.completedSteps} / {procedure.totalSteps} pasos
              completados
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN – steps list */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold">Pasos</h2>

        <div className="space-y-4">
          {procedure.steps.map((step: FormalizationStepDTO) => (
            <div
              key={step.stepId}
              className={`
              bg-white rounded-none shadow-md p-4 border border-gray-300 border-l-[6px]
              ${
                step.status === "COMPLETED"
                  ? "border-green-600"
                  : step.status === "IN_PROGRESS"
                  ? "border-blue-600"
                  : "border-gray-400"
              }
              flex items-start justify-between
            `}
            >
              {/* Step content */}
              <div className="flex-1 pr-6">
                <p className="font-medium">{step.title}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>

              {/* small square toggle */}
              <button
                onClick={() => handleToggleStep(step)}
                disabled={savingStep === step.stepId}
                className={`
                w-9 h-9 flex items-center justify-center border rounded-none transition
                ${
                  step.status === "COMPLETED"
                    ? "bg-green-600 border-green-700 text-white"
                    : "bg-gray-100 border-gray-400"
                }
              `}
              >
                {step.status === "COMPLETED" && <Check size={18} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
