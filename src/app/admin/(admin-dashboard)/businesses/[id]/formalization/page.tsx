"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBusinessFormalization } from "@/app/admin/(admin-dashboard)/businesses/_hooks/useBusinessFormalization";
import { useBusinessDetail } from "@/app/admin/(admin-dashboard)/businesses/_hooks/useBusinessDetail";
import { FormalizationTimeline } from "@/app/admin/(admin-dashboard)/businesses/_components/FormalizationTimeline";
import { Button } from "@/components/ui/button";

export default function BusinessFormalizationPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = Number(params.id);
  const { business, fetchBusiness } = useBusinessDetail(businessId);
  const { formalization, loading, error, fetchFormalization } = useBusinessFormalization(businessId);

  useEffect(() => {
    fetchFormalization();
    fetchBusiness();
  }, [fetchFormalization, fetchBusiness]);

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
        <h1 className="text-2xl font-bold text-gray-900">Estado de Formalización</h1>
      </div>

      {business && (
        <p className="text-gray-500 mb-4">
          Seguimiento de formalización de{" "}
          <span className="font-medium text-gray-700">{business.displayName}</span>
        </p>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-none">
          {error}
        </div>
      )}

      <FormalizationTimeline formalization={formalization!} loading={loading} />
    </div>
  );
}