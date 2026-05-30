"use client";

import { useEffect } from "react";
import { useBusinesses } from "./_hooks/useBusinesses";
import { BusinessesTable } from "./_components/BusinessesTable";
import { Button } from "@/components/ui/button";

export default function AdminBusinessesPage() {
  const { businesses, loading, error, fetchBusinesses } = useBusinesses();

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h1>
        <Button
          onClick={fetchBusinesses}
          variant="outline"
          className="rounded-none"
          size="sm"
        >
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-none">
          {error}
        </div>
      )}

      <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
        <BusinessesTable businesses={businesses} loading={loading} />
      </div>
    </div>
  );
}