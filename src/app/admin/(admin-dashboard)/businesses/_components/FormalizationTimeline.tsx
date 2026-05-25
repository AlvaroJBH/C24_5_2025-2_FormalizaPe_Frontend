"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AdminBusinessFormalization,
  FormalizationProcedure,
  FormalizationStep,
} from "@/services/admin-business-service";
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, ClockIcon, MinusIcon } from "lucide-react";

interface FormalizationTimelineProps {
  formalization: AdminBusinessFormalization;
  loading: boolean;
}

function getStepIcon(status: string) {
  switch (status) {
    case "COMPLETED":
      return <CheckIcon className="w-4 h-4 text-green-600" />;
    case "IN_PROGRESS":
      return <ClockIcon className="w-4 h-4 text-yellow-500" />;
    case "PENDING":
      return <MinusIcon className="w-4 h-4 text-gray-400" />;
    default:
      return <MinusIcon className="w-4 h-4 text-gray-400" />;
  }
}

function getStepStatusColor(status: string): string {
  switch (status) {
    case "COMPLETED":
      return "text-green-600";
    case "IN_PROGRESS":
      return "text-yellow-500";
    case "PENDING":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
}

function ProcedureAccordion({ procedure }: { procedure: FormalizationProcedure }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="rounded-none text-xs">
              {procedure.category}
            </Badge>
            <span className="font-medium text-gray-800">{procedure.name}</span>
          </div>
          <p className="text-sm text-gray-500">{procedure.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              {procedure.completedSteps}/{procedure.totalSteps} pasos
            </p>
            <p className="text-xs text-gray-500">{procedure.progressPercent}% completado</p>
          </div>
          <Progress value={procedure.progressPercent} className="w-20 h-2" />
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-3">
            {procedure.steps.map((step) => (
              <div
                key={step.stepId}
                className="flex items-start gap-3 p-2 rounded hover:bg-white"
              >
                <div className="mt-0.5">{getStepIcon(step.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      Paso {step.stepOrder}
                    </span>
                    <span className={`font-medium text-sm ${getStepStatusColor(step.status)}`}>
                      {step.title}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function FormalizationTimeline({ formalization, loading }: FormalizationTimelineProps) {
  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>Cargando estado de formalización...</p>
      </div>
    );
  }

  if (!formalization || formalization.procedures.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No hay información de formalización para esta empresa.</p>
      </div>
    );
  }

  const overallProgress =
    formalization.procedures.reduce((acc, p) => acc + p.progressPercent, 0) /
    formalization.procedures.length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-none shadow-md border border-gray-300 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {formalization.businessDisplayName}
          </h2>
          <span className="text-lg font-bold text-gray-800">
            {overallProgress.toFixed(0)}% global
          </span>
        </div>
        <Progress value={overallProgress} className="h-3" />
      </div>

      <div className="space-y-3">
        {formalization.procedures.map((procedure) => (
          <ProcedureAccordion key={procedure.procedureId} procedure={procedure} />
        ))}
      </div>
    </div>
  );
}