"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProcedureTemplate } from "@/services/admin-procedure-service";

interface ProcedureListProps {
  procedures: ProcedureTemplate[];
  loading: boolean;
  onViewSteps: (procedure: ProcedureTemplate) => void;
}

export function ProcedureList({ procedures, loading, onViewSteps }: ProcedureListProps) {
  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>Cargando procedimientos...</p>
      </div>
    );
  }

  if (procedures.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No hay procedimientos registrados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {procedures.map((procedure) => (
        <div
          key={procedure.id}
          className="border border-gray-200 rounded-none p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="rounded-none text-xs">
                  {procedure.category}
                </Badge>
              </div>
              <h3 className="font-medium text-gray-800">{procedure.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{procedure.description}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewSteps(procedure)}
              className="rounded-none h-8 px-3 text-xs shrink-0"
            >
              Ver pasos
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}