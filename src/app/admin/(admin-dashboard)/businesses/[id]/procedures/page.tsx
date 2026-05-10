"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBusinessProcedures } from "@/app/admin/(admin-dashboard)/businesses/_hooks/useBusinessProcedures";
import { useBusinessDetail } from "@/app/admin/(admin-dashboard)/businesses/_hooks/useBusinessDetail";
import { ProceduresTable } from "@/app/admin/(admin-dashboard)/businesses/_components/ProceduresTable";
import { Button } from "@/components/ui/button";

export default function BusinessProceduresPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = Number(params.id);
  const { business, fetchBusiness } = useBusinessDetail(businessId);
  const { procedures, loading, error, fetchProcedures } = useBusinessProcedures(businessId);

  useEffect(() => {
    fetchProcedures();
    fetchBusiness();
  }, [fetchProcedures, fetchBusiness]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => router.push(`/admin/businesses/${businessId}`)}
          variant="outline"
          className="rounded-none"
          size="sm"
        >
          ← Volver
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Procedimientos</h1>
      </div>

      {business && (
        <p className="text-gray-500 mb-4">
          Procedimientos de{" "}
          <span className="font-medium text-gray-700">{business.tradeName}</span>
        </p>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-none">
          {error}
        </div>
      )}

      <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
        <ProceduresTable procedures={procedures} loading={loading} />
      </div>
    </div>
  );
}