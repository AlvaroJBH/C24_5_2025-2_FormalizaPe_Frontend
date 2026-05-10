"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AdminBusinessDetail } from "@/services/admin-business-service";
import { BusinessStatusBadge } from "./BusinessStatusBadge";

interface BusinessHeaderProps {
  business: AdminBusinessDetail;
}

export function BusinessHeader({ business }: BusinessHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.push("/admin/businesses")}
          variant="outline"
          className="rounded-none"
          size="sm"
        >
          ← Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {business.tradeName}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {business.legalName} · RUC {business.ruc}
          </p>
        </div>
      </div>
      <BusinessStatusBadge status={business.status} />
    </div>
  );
}