"use client";

import { Badge } from "@/components/ui/badge";
import { AdminBusinessProcedure } from "@/services/admin-business-service";

interface ProceduresTableProps {
  procedures: AdminBusinessProcedure[];
  loading: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "COMPLETED":
      return "Completado";
    case "IN_PROGRESS":
      return "En progreso";
    case "PENDING":
      return "Pendiente";
    case "CANCELLED":
      return "Cancelado";
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
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}

export function ProceduresTable({ procedures, loading }: ProceduresTableProps) {
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
        <p>No hay procedimientos asociados a esta empresa.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-50">
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Procedimiento
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Estado
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Fecha creación
            </th>
          </tr>
        </thead>
        <tbody>
          {procedures.map((procedure) => (
            <tr
              key={procedure.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-800 font-medium">
                {procedure.procedureName}
              </td>
              <td className="py-3 px-4">
                <Badge
                  variant={getStatusVariant(procedure.status)}
                  className="rounded-none"
                >
                  {getStatusLabel(procedure.status)}
                </Badge>
              </td>
              <td className="py-3 px-4 text-gray-600 text-sm">
                {formatDate(procedure.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}