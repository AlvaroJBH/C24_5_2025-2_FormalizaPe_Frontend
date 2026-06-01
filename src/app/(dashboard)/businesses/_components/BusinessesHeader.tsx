"use client";

import { AppBreadcrumb } from "@/components/common/app-breadcrumb";
import { CreateBusinessDialog } from "./CreateBusinessDialog";

export function BusinessesHeader() {
  return (
    <>
      <AppBreadcrumb
        items={[
          { label: "Inicio", href: "/businesses" },
        ]}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-700">Negocios</h1>
        <CreateBusinessDialog />
      </div>
    </>
  );
}