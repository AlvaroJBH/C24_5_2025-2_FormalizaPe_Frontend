"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminBusinessProcedure } from "@/services/admin-business-service";

interface BusinessProcedureStatusCardProps {
  procedure: AdminBusinessProcedure;
  onUpdateStatus: (businessProcedureId: number, status: string) => Promise<void>;
}

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "COMPLETED"];

function getStatusLabel(status: string): string {
  switch (status) {
    case "COMPLETED":
      return "Completado";
    case "IN_PROGRESS":
      return "En progreso";
    case "PENDING":
      return "Pendiente";
    default:
      return status;
  }
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    case "PENDING":
      return "outline";
    default:
      return "outline";
  }
}

export function BusinessProcedureStatusCard({
  procedure,
  onUpdateStatus,
}: BusinessProcedureStatusCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    setError(null);
    try {
      await onUpdateStatus(procedure.id, newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar estado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-none p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{procedure.procedureName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={getStatusVariant(procedure.status)} className="rounded-none">
              {getStatusLabel(procedure.status)}
            </Badge>
            <span className="text-xs text-gray-400">
              ID: {procedure.id}
            </span>
          </div>
        </div>
        <Select
          value={procedure.status}
          onValueChange={handleStatusChange}
          disabled={loading}
        >
          <SelectTrigger className="w-40 rounded-none">
            <SelectValue placeholder="Cambiar estado" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {getStatusLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}