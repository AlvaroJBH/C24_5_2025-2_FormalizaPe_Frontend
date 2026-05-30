"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBusinessDetail } from "@/app/admin/(admin-dashboard)/businesses/_hooks/useBusinessDetail";
import { BusinessHeader } from "@/app/admin/(admin-dashboard)/businesses/_components/BusinessHeader";
import { BusinessSummaryCard } from "@/app/admin/(admin-dashboard)/businesses/_components/BusinessSummaryCard";
import { Button } from "@/components/ui/button";

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function BusinessDetailPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = Number(params.id);
  const { business, loading, error, fetchBusiness } = useBusinessDetail(businessId);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
          <p className="text-gray-500 text-center py-8">Cargando negocio...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
          <p className="text-red-600 text-center py-8">
            {error || "Negocio no encontrado"}
          </p>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => router.push("/admin/businesses")}
              variant="outline"
              className="rounded-none"
            >
              Volver a la lista
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <BusinessHeader business={business} />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-none">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BusinessSummaryCard title="Información del Negocio">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Nombre</p>
            <p className="text-gray-800 mt-1">{business.displayName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Fecha de inicio</p>
            <p className="text-gray-800 mt-1">{formatDate(business.startDate)}</p>
          </div>
        </BusinessSummaryCard>

        {business.formalIdentity && (
          <BusinessSummaryCard title="Datos Legales">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Nombre comercial</p>
              <p className="text-gray-800 mt-1">{business.formalIdentity.tradeName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Razón social</p>
              <p className="text-gray-800 mt-1">{business.formalIdentity.legalName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">RUC</p>
              <p className="text-gray-800 mt-1 font-mono">{business.formalIdentity.ruc}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Régimen tributario</p>
              <p className="text-gray-800 mt-1">{business.formalIdentity.taxRegime}</p>
            </div>
          </BusinessSummaryCard>
        )}

        <BusinessSummaryCard title="Ubicación">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Dirección</p>
            <p className="text-gray-800 mt-1">{business.address}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Ubicación</p>
            <p className="text-gray-800 mt-1">
              {business.district}, {business.province}, {business.department}
            </p>
          </div>
        </BusinessSummaryCard>

        <BusinessSummaryCard title="Propietario">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Usuario</p>
            <p className="text-gray-800 mt-1">{business.ownerUsername}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
            <p className="text-gray-800 mt-1">{business.ownerEmail}</p>
          </div>
        </BusinessSummaryCard>
      </div>

      <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/businesses/${business.id}/procedures`)}
          className="rounded-none"
        >
          Ver procedimientos
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/businesses/${business.id}/formalization`)}
          className="rounded-none"
        >
          Ver formalización
        </Button>
      </div>
    </div>
  );
}