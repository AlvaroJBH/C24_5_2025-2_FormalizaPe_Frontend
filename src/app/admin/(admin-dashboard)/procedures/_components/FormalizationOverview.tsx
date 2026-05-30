"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFormalizationStatus } from "../_hooks/useFormalizationStatus";
import { useBusinessProcedures } from "../_hooks/useBusinessProcedures";
import { BusinessProcedureStatusCard } from "./BusinessProcedureStatusCard";
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, ClockIcon, MinusIcon } from "lucide-react";

interface FormalizationOverviewProps {
  businessId: number;
  businessName?: string;
}

export function FormalizationOverview({ businessId, businessName }: FormalizationOverviewProps) {
  const router = useRouter();
  const { formalization, loading, error, fetchFormalization } = useFormalizationStatus(businessId);
  const { procedures, updateStatus, fetchProcedures } = useBusinessProcedures(businessId);

  useEffect(() => {
    fetchFormalization();
    fetchProcedures();
  }, [fetchFormalization, fetchProcedures]);

  const handleRefresh = () => {
    fetchFormalization();
    fetchProcedures();
  };

  if (loading && !formalization) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>Cargando estado de formalización...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline" className="rounded-none">
          Reintentar
        </Button>
      </div>
    );
  }

  if (!formalization) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No hay información de formalización disponible.</p>
      </div>
    );
  }

  const overallProgress =
    formalization.procedures.length > 0
      ? formalization.procedures.reduce((acc, p) => acc + p.progressPercent, 0) /
        formalization.procedures.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-none shadow-md border border-gray-300 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {businessName || formalization.businessTradeName}
            </h2>
            <p className="text-sm text-gray-500">ID Empresa: {businessId}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">
              {overallProgress.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500">progreso global</p>
          </div>
        </div>
        <Progress value={overallProgress} className="h-3" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Procedimientos de la Empresa
        </h3>
        <div className="space-y-3 mb-6">
          {procedures.map((proc) => (
            <BusinessProcedureStatusCard
              key={proc.id}
              procedure={proc}
              onUpdateStatus={updateStatus}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Detalle de Formalización
        </h3>
        <Accordion type="single" collapsible className="bg-white rounded-none border border-gray-300">
          {formalization.procedures.map((procedure) => (
            <AccordionItem key={procedure.procedureId} value={`procedure-${procedure.procedureId}`}>
              <AccordionTrigger className="px-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="rounded-none text-xs">
                    {procedure.category}
                  </Badge>
                  <span className="font-medium text-gray-800">{procedure.name}</span>
                  <span className="text-sm text-gray-500">
                    {procedure.completedSteps}/{procedure.totalSteps} pasos
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {procedure.progressPercent.toFixed(0)}%
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-gray-500">{procedure.description}</p>
                  <div className="space-y-2">
                    {procedure.steps.map((step) => (
                      <div
                        key={step.stepId}
                        className="flex items-start gap-3 p-2 border border-gray-100 rounded"
                      >
                        <div className="mt-0.5">
                          {step.status === "COMPLETED" && (
                            <CheckIcon className="w-4 h-4 text-green-600" />
                          )}
                          {step.status === "IN_PROGRESS" && (
                            <ClockIcon className="w-4 h-4 text-yellow-500" />
                          )}
                          {step.status === "PENDING" && (
                            <MinusIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">
                              Paso {step.stepOrder}
                            </span>
                            <span className="text-sm font-medium text-gray-700">{step.title}</span>
                          </div>
                          <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => router.push(`/admin/businesses/${businessId}`)}
          variant="outline"
          className="rounded-none"
        >
          Ver empresa
        </Button>
      </div>
    </div>
  );
}