"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProcedures } from "./_hooks/useProcedures";
import { useProcedureSteps } from "./_hooks/useProcedureSteps";
import { useBusinesses } from "@/app/admin/(admin-dashboard)/businesses/_hooks/useBusinesses";
import { ProcedureList } from "./_components/ProcedureList";
import { ProcedureStepsModal } from "./_components/ProcedureStepsModal";
import { FormalizationOverview } from "./_components/FormalizationOverview";
import { ProcedureTemplate } from "@/services/admin-procedure-service";

export default function AdminProceduresPage() {
  const { procedures, loading, error, fetchProcedures } = useProcedures();
  const { steps, loading: stepsLoading, error: stepsError, fetchSteps } = useProcedureSteps();
  const { businesses, fetchBusinesses } = useBusinesses();

  const [stepsModalOpen, setStepsModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureTemplate | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);

  useEffect(() => {
    fetchProcedures();
    fetchBusinesses();
  }, [fetchProcedures, fetchBusinesses]);

  const handleViewSteps = (procedure: ProcedureTemplate) => {
    setSelectedProcedure(procedure);
    fetchSteps(procedure.id);
    setStepsModalOpen(true);
  };

  const handleBusinessSelect = (businessId: number) => {
    setSelectedBusinessId(businessId);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Procedimientos</h1>
        <Button
          onClick={fetchProcedures}
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

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="rounded-none bg-gray-100 mb-4">
          <TabsTrigger value="templates" className="rounded-none data-[state=active]:bg-white">
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="formalization" className="rounded-none data-[state=active]:bg-white">
            Formalización por Empresa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Procedimientos Disponibles
              </h2>
              <p className="text-sm text-gray-500">
                Lista de plantillas de trámites para formalización de empresas
              </p>
            </div>

            <ProcedureList
              procedures={procedures}
              loading={loading}
              onViewSteps={handleViewSteps}
            />
          </div>
        </TabsContent>

        <TabsContent value="formalization">
          <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Seguimiento de Formalización
              </h2>
              <p className="text-sm text-gray-500">
                Selecciona una empresa para ver su estado de formalización
              </p>
            </div>

            {businesses.length > 0 && !selectedBusinessId && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Selecciona una empresa:</p>
                <div className="flex flex-wrap gap-2">
                  {businesses.map((business) => (
                    <Badge
                      key={business.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-50 rounded-none px-3 py-1"
                      onClick={() => handleBusinessSelect(business.id)}
                    >
                      {business.displayName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedBusinessId && (
              <div>
                <Button
                  onClick={() => setSelectedBusinessId(null)}
                  variant="outline"
                  className="rounded-none mb-4"
                  size="sm"
                >
                  ← Cambiar empresa
                </Button>
                <FormalizationOverview businessId={selectedBusinessId} />
              </div>
            )}

            {!selectedBusinessId && businesses.length === 0 && !loading && (
              <p className="text-gray-500 text-center py-8">
                No hay empresas disponibles para mostrar formalización.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <ProcedureStepsModal
        open={stepsModalOpen}
        onOpenChange={setStepsModalOpen}
        procedureName={selectedProcedure?.name || ""}
        steps={steps}
        loading={stepsLoading}
        error={stepsError}
      />
    </div>
  );
}