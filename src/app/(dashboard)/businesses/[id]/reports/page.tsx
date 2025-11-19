"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  getFormalizationStatus,
  FormalizationProcedureDTO,
  FormalizationStatusDTO,
} from "@/services/formalization-service";
import {
  getSimulationInputsByBusinessId,
  getSimulationResultsByInputId,
  SimulationResultItem,
  SimulationResults,
} from "@/services/simulations-service";

export default function ReportPage() {
  const params = useParams();
  const businessId = Number(params.id);
  const { token } = useAuthStore();

  /** TRÁMITES */
  const [procedures, setProcedures] = useState<FormalizationProcedureDTO[]>([]);
  const [loadingProcedures, setLoadingProcedures] = useState(true);
  const [errorProcedures, setErrorProcedures] = useState<string | null>(null);

  /** FINANCIERO */
  const [simulationResults, setSimulationResults] = useState<
    SimulationResultItem[]
  >([]);
  const [loadingFinancial, setLoadingFinancial] = useState(true);
  const [errorFinancial, setErrorFinancial] = useState<string | null>(null);

  /** CRONOLOGÍA */
  const [chronologyData, setChronologyData] =
    useState<FormalizationStatusDTO | null>(null);
  const [loadingChronology, setLoadingChronology] = useState(true);
  const [errorChronology, setErrorChronology] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !businessId) return;

    /** Fetch Trámites */
    const fetchProcedures = async () => {
      try {
        setLoadingProcedures(true);
        const data = await getFormalizationStatus(businessId);
        setProcedures(data.procedures);
      } catch (err) {
        console.error(err);
        setErrorProcedures("Error al cargar los trámites");
      } finally {
        setLoadingProcedures(false);
      }
    };

    /** Fetch Financiero */
    const fetchFinancial = async () => {
      try {
        setLoadingFinancial(true);
        const inputs = await getSimulationInputsByBusinessId(businessId);
        if (!inputs.length) return;

        const latestInput = inputs.reduce((prev, curr) =>
          curr.versionNumber > prev.versionNumber ? curr : prev
        );

        const resultsData: SimulationResults =
          await getSimulationResultsByInputId(latestInput.id);
        setSimulationResults(resultsData.results);
      } catch (err) {
        console.error(err);
        setErrorFinancial("Error al cargar resultados de simulación");
      } finally {
        setLoadingFinancial(false);
      }
    };

    /** Fetch Cronología */
    const fetchChronology = async () => {
      try {
        setLoadingChronology(true);
        const data = await getFormalizationStatus(businessId);
        setChronologyData(data);
      } catch (err) {
        console.error(err);
        setErrorChronology("Error al cargar la cronología");
      } finally {
        setLoadingChronology(false);
      }
    };

    fetchProcedures();
    fetchFinancial();
    fetchChronology();
  }, [token, businessId]);

  /** TRÁMITES: Totales y progreso */
  const totals = {
    COMPLETED: procedures.filter((p) => p.status === "COMPLETED").length,
    IN_PROGRESS: procedures.filter((p) => p.status === "IN_PROGRESS").length,
    PENDING: procedures.filter((p) => p.status === "PENDING").length,
    BLOCKED: procedures.filter((p) => p.status === "BLOCKED").length,
  };
  const overallProgress =
    procedures.length > 0
      ? procedures.reduce((acc, p) => acc + p.progressPercent, 0) /
        procedures.length
      : 0;
  const completedSteps = procedures.reduce(
    (acc, p) => acc + p.completedSteps,
    0
  );
  const totalSteps = procedures.reduce((acc, p) => acc + p.totalSteps, 0);

  return (
    <div className="flex flex-col flex-1 p-6">
      <Tabs defaultValue="tramites" className="w-full">
        <TabsList className="mb-4 border-b w-full text-lg rounded-none">
          <TabsTrigger
            value="tramites"
            className="flex-1 text-center rounded-none"
          >
            Trámites
          </TabsTrigger>
          <TabsTrigger
            value="financiero"
            className="flex-1 text-center rounded-none"
          >
            Financiero
          </TabsTrigger>
          <TabsTrigger
            value="cronologia"
            className="flex-1 text-center rounded-none"
          >
            Cronología
          </TabsTrigger>
        </TabsList>

        {/* ========================= TRÁMITES ========================= */}
        <TabsContent value="tramites">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Reporte de Trámites
          </h2>

          {loadingProcedures ? (
            <p className="text-gray-500">Cargando trámites...</p>
          ) : errorProcedures ? (
            <p className="text-red-500">{errorProcedures}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-none shadow-md border border-gray-300 p-4 flex flex-col items-center">
                  <p className="text-3xl font-bold text-green-600">
                    {totals.COMPLETED}
                  </p>
                  <p className="text-sm text-gray-500">Completados</p>
                </div>

                <div className="bg-white rounded-none shadow-md border border-gray-300 p-4 flex flex-col items-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {totals.IN_PROGRESS}
                  </p>
                  <p className="text-sm text-gray-500">En Proceso</p>
                </div>

                <div className="bg-white rounded-none shadow-md border border-gray-300 p-4 flex flex-col items-center">
                  <p className="text-3xl font-bold text-gray-500">
                    {totals.PENDING}
                  </p>
                  <p className="text-sm text-gray-500">Pendientes</p>
                </div>

                <div className="bg-white rounded-none shadow-md border border-gray-300 p-4 flex flex-col items-center">
                  <p className="text-3xl font-bold text-red-500">
                    {totals.BLOCKED}
                  </p>
                  <p className="text-sm text-gray-500">Bloqueados</p>
                </div>
              </div>

              <div className="bg-white rounded-none shadow-md p-6 border border-gray-300">
                <p className="text-gray-600 text-sm mb-2">Progreso general</p>
                <Progress
                  value={overallProgress}
                  className="h-4 mb-2 rounded-none"
                />

                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>{overallProgress.toFixed(0)}%</span>
                  <span>
                    {completedSteps} de {totalSteps} pasos completados
                  </span>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* ========================= FINANCIERO ========================= */}
        <TabsContent value="financiero">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Reporte Financiero
          </h2>

          {loadingFinancial ? (
            <p className="text-gray-500">Cargando resultados...</p>
          ) : errorFinancial ? (
            <p className="text-red-500">{errorFinancial}</p>
          ) : (
            <>
              <div className="bg-white rounded-none shadow-md p-6 mb-6 border border-gray-300">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Comparación de Regímenes
                </h3>

                {simulationResults.length > 0 && (
                  <div className="space-y-4">
                    {(() => {
                      const maxMonthly = Math.max(
                        ...simulationResults.map((r) =>
                          parseFloat(r.totalMonthly)
                        )
                      );

                      return simulationResults.map((result) => {
                        const progress = maxMonthly
                          ? (parseFloat(result.totalMonthly) / maxMonthly) * 100
                          : 0;

                        return (
                          <div
                            key={result.resultId}
                            className={`
                            p-4 rounded-none border border-gray-300 shadow-md flex flex-col gap-2 transition-opacity
                            ${
                              result.recommended
                                ? "border-green-500 bg-green-50"
                                : "bg-gray-100"
                            }
                            ${
                              !result.available &&
                              "opacity-50 cursor-not-allowed"
                            }
                          `}
                          >
                            <div className="flex justify-between text-sm font-semibold text-gray-600">
                              <span>{result.regimeName}</span>
                              <span>S/ {result.totalMonthly}/mes</span>
                            </div>

                            <Progress
                              value={progress}
                              className="h-2 rounded-none"
                            />
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}

                {simulationResults.some((r) => r.recommended) && (
                  <p className="mt-4 text-sm text-gray-700 font-medium">
                    Recomendación:{" "}
                    <span className="font-semibold">
                      {simulationResults.find((r) => r.recommended)?.regimeName}{" "}
                      es el más económico para tu nivel de ingresos actual.
                    </span>
                  </p>
                )}
              </div>

              <div className="bg-white rounded-none shadow-md p-6 border border-gray-300">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Proyección Anual de Impuestos
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  Estimación de pagos tributarios según diferentes regímenes
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {simulationResults.map((result) => (
                    <div
                      key={result.resultId}
                      className={`
                      p-4 rounded-none border border-gray-300 shadow-md flex flex-col gap-2
                      ${
                        result.recommended
                          ? "border-green-500 bg-green-50"
                          : "bg-gray-100"
                      }
                      ${!result.available && "opacity-50 cursor-not-allowed"}
                    `}
                    >
                      <p className="text-sm font-semibold text-gray-600">
                        {result.regimeName}
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        S/ {result.totalAnnual}
                      </p>
                      <p className="text-xs text-gray-500">anual</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* ========================= CRONOLOGÍA ========================= */}
        <TabsContent value="cronologia">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Cronología de Trámites
          </h2>

          {loadingChronology ? (
            <p className="text-gray-500">Cargando cronología...</p>
          ) : errorChronology ? (
            <p className="text-red-500">{errorChronology}</p>
          ) : (
            <div className="space-y-8">
              {chronologyData?.procedures.map((proc) => (
                <div
                  key={proc.procedureId}
                  className="bg-white rounded-none shadow-md p-6 border border-gray-300"
                >
                  {/* Título del trámite */}
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">
                    {proc.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    {proc.description}
                  </p>

                  {/* TIMELINE */}
                  <div className="relative border-l-2 border-gray-300 pl-6 space-y-6">
                    {proc.steps.map((step) => {
                      const color =
                        step.status === "COMPLETED"
                          ? "bg-green-500"
                          : step.status === "IN_PROGRESS"
                          ? "bg-blue-500"
                          : step.status === "BLOCKED"
                          ? "bg-red-500"
                          : "bg-gray-400";

                      const textColor =
                        step.status === "COMPLETED"
                          ? "text-green-600"
                          : step.status === "IN_PROGRESS"
                          ? "text-blue-600"
                          : step.status === "BLOCKED"
                          ? "text-red-600"
                          : "text-gray-500";

                      return (
                        <div key={step.stepId} className="relative">
                          {/* Punto del timeline */}
                          <div
                            className={`absolute -left-3 top-1 w-3 h-3 rounded-full ${color}`}
                          ></div>

                          {/* Tarjeta del paso */}
                          <div className="border border-gray-300 shadow-sm rounded-none p-4 bg-gray-50">
                            <p className={`font-semibold ${textColor}`}>
                              {step.title}
                            </p>

                            <p className="text-sm text-gray-600">
                              {step.description}
                            </p>

                            <div className="flex items-center text-xs text-gray-500 mt-2">
                              <span className="font-medium mr-2">Estado:</span>
                              <span>{step.status}</span>
                            </div>

                            {step.notes && (
                              <p className="text-xs text-gray-400 mt-1 italic">
                                Nota: {step.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
