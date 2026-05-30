"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AdminBusiness } from "@/services/admin-business-service";
import { BusinessStatusBadge } from "./BusinessStatusBadge";

interface BusinessesTableProps {
  businesses: AdminBusiness[];
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

export function BusinessesTable({ businesses, loading }: BusinessesTableProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>Cargando negocios...</p>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No hay negocios registrados.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-50">
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Nombre
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Estado
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Propietario
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Fecha creación
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((business) => (
            <tr
              key={business.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-800 font-medium">
                {business.displayName}
              </td>
              <td className="py-3 px-4">
                <BusinessStatusBadge status={business.status} />
              </td>
              <td className="py-3 px-4 text-gray-600">
                {business.ownerUsername}
              </td>
              <td className="py-3 px-4 text-gray-600 text-sm">
                {formatDate(business.createdAt)}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/businesses/${business.id}`)}
                    className="rounded-none h-7 px-2 text-xs"
                  >
                    Ver detalle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/businesses/${business.id}/procedures`)}
                    className="rounded-none h-7 px-2 text-xs"
                  >
                    Procedimientos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/businesses/${business.id}/formalization`)}
                    className="rounded-none h-7 px-2 text-xs"
                  >
                    Formalización
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}