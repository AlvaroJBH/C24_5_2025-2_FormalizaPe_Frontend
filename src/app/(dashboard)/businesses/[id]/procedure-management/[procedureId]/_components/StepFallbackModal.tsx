"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export interface StepComponentProps {
  businessId: number;
  stepId: number;
  stepIdentifier: string;
  stepTitle: string;
  stepDescription: string | null;
  stepStatus: string;
  onClose: () => void;
  onComplete: () => void;
}

export function StepFallbackModal({
  businessId,
  stepId,
  stepIdentifier,
  stepTitle,
  stepDescription,
  stepStatus,
  onClose,
  onComplete,
}: StepComponentProps) {
  const isCompleted = stepStatus === "COMPLETED";

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-none max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {stepTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Identificador: {stepIdentifier}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`rounded-none ${
                isCompleted
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              {isCompleted ? "Completado" : "Pendiente"}
            </Badge>
          </div>

          {stepDescription && (
            <p className="text-sm text-gray-600">{stepDescription}</p>
          )}

          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-xs text-gray-500 font-mono">ID: {stepId}</p>
            <p className="text-xs text-gray-500 font-mono">Identifier: {stepIdentifier}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-none"
          >
            Cancelar
          </Button>
          {!isCompleted && (
            <Button
              onClick={onComplete}
              className="rounded-none bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              Completar step
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}