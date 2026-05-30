"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProcedureStep } from "@/services/admin-procedure-service";

interface ProcedureStepsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedureName: string;
  steps: ProcedureStep[];
  loading: boolean;
  error: string | null;
}

export function ProcedureStepsModal({
  open,
  onOpenChange,
  procedureName,
  steps,
  loading,
  error,
}: ProcedureStepsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pasos del Procedimiento</DialogTitle>
          <DialogDescription>{procedureName}</DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="py-4 text-center text-gray-500">Cargando pasos...</div>
        )}

        {error && <div className="py-4 text-center text-red-600">{error}</div>}

        {!loading && !error && steps.length === 0 && (
          <div className="py-4 text-center text-gray-500">
            Este procedimiento no tiene pasos definidos.
          </div>
        )}

        {!loading && !error && steps.length > 0 && (
          <div className="space-y-3 py-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {step.stepOrder}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{step.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}