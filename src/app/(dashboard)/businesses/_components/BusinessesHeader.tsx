"use client";

import { AppBreadcrumb } from "@/components/common/app-breadcrumb";
import { CreateBusinessDialog } from "./CreateBusinessDialog";
import { CreateBusinessData } from "@/services/business-service";

interface BusinessesHeaderProps {
  onCreateBusiness: (data: CreateBusinessData) => Promise<void>;
}

export function BusinessesHeader({ onCreateBusiness }: BusinessesHeaderProps) {
  return (
    <>
      <AppBreadcrumb
        items={[
          { label: "Inicio", href: "/businesses" },
        ]}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-700">Empresas</h1>
        <CreateBusinessDialog onSubmit={onCreateBusiness} />
      </div>
    </>
  );
}