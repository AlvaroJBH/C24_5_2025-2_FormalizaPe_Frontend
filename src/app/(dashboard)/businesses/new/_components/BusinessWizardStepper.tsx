"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
}

interface BusinessWizardStepperProps {
  steps: Step[];
  currentStep: number;
}

export function BusinessWizardStepper({ steps, currentStep }: BusinessWizardStepperProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all",
                    isCompleted && "bg-blue-600 border-blue-600 text-white",
                    isCurrent && "bg-white border-blue-600 text-blue-600",
                    !isCompleted && !isCurrent && "bg-gray-100 border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center max-w-20",
                    isCurrent && "text-blue-600",
                    !isCurrent && "text-gray-500"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 -mt-5",
                    isCompleted ? "bg-blue-600" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}