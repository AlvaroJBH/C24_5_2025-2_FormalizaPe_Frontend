"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import {
  getTaxRegimes,
  TaxRegime,
  getSimulationInputsByBusinessId,
  SimulationInput,
  getSimulationResultsByInputId,
  SimulationResults,
  createSimulationInput,
} from "@/services/simulations-service";

import { Progress } from "@/components/ui/progress";

export default function SimulationsPage() {
  const params = useParams();
  const businessId = Number(params.id);

  // ------------------------
  // ESTADOS
  // ------------------------
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedSimulationId, setSelectedSimulationId] = useState<number | null>(null);

  const [taxRegimes, setTaxRegimes] = useState<TaxRegime[]>([]);
  const [simulationInputs, setSimulationInputs] = useState<SimulationInput[]>([]);
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);

  const [regimesLoading, setRegimesLoading] = useState(true);
  const [inputsLoading, setInputsLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);

  const [regimesError, setRegimesError] = useState<string | null>(null);
  const [inputsError, setInputsError] = useState<string | null>(null);
  const [resultsError, setResultsError] = useState<string | null>(null);

  // ------------------------
  // FORM DIALOG
  // ------------------------
  const [form, setForm] = useState({
    monthlyIncome: "",
    monthlyExpense: "",
    quantity: "",
    type: "",
    assets: "",
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleFormChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ------------------------
  // LOAD TAX REGIMES
  // ------------------------
  useEffect(() => {
    async function load() {
      try {
        setRegimesLoading(true);
        const data = await getTaxRegimes();
        setTaxRegimes(data);
        setRegimesError(null);
      } catch {
        setRegimesError("Error al cargar regímenes tributarios");
      } finally {
        setRegimesLoading(false);
      }
    }
    load();
  }, []);

  // ------------------------
  // LOAD INPUTS
  // ------------------------
  useEffect(() => {
    if (!businessId) return;

    async function loadInputs() {
      try {
        setInputsLoading(true);
        const data = await getSimulationInputsByBusinessId(businessId);
        setSimulationInputs(data);
        setInputsError(null);

        if (data.length > 0) setSelectedSimulationId(data[0].id);
      } catch {
        setInputsError("Error al cargar entradas de simulación");
      } finally {
        setInputsLoading(false);
      }
    }

    loadInputs();
  }, [businessId]);

  // ------------------------
  // LOAD RESULTS
  // ------------------------
  useEffect(() => {
    if (!selectedSimulationId) return;

    async function loadResults() {
      try {
        setResultsLoading(true);
        const data = await getSimulationResultsByInputId(selectedSimulationId);
        setSimulationResults(data);
        setResultsError(null);
      } catch {
        setResultsError("Error al cargar resultados de simulación");
      } finally {
        setResultsLoading(false);
      }
    }

    loadResults();
  }, [selectedSimulationId]);

  // ------------------------
  // CREATE NEW INPUT
  // ------------------------
  const handleCreateSimulation = async () => {
    setFormError(null);

    if (
      !form.monthlyIncome ||
      !form.monthlyExpense ||
      !form.quantity ||
      !form.type ||
      !form.assets
    ) {
      setFormError("Completa todos los campos");
      return;
    }

    try {
      setCreating(true);

      const payload = {
        businessId,
        monthlyIncome: Number(form.monthlyIncome),
        monthlyExpense: Number(form.monthlyExpense),
        quantity: Number(form.quantity),
        type: form.type,
        assets: Number(form.assets),
      };

      const newInput = await createSimulationInput(payload);

      // 📌 Insertamos al inicio de la lista
      setSimulationInputs((prev) => [newInput, ...prev]);

      // Seleccionamos automáticamente
      setSelectedSimulationId(newInput.id);

      // Limpiamos form
      setForm({
        monthlyIncome: "",
        monthlyExpense: "",
        quantity: "",
        type: "",
        assets: "",
      });

      setCreateOpen(false);
    } catch {
      setFormError("Error al crear simulación");
    } finally {
      setCreating(false);
    }
  };

  // ------------------------
  // MERGE RESULTADOS
  // ------------------------
  const enrichedResults =
    simulationResults?.results.map((result) => {
      const r = taxRegimes.find((x) => x.code === result.regimeCode);
      const rules = (r?.rulesJson as { beneficios?: string[]; requisitos?: string[] } | null) || {};

      return {
        ...result,
        regime: r,
        beneficios: rules.beneficios ?? [],
        requisitos: rules.requisitos ?? [],
      };
    }) || [];

  // ------------------------
  // RENDER
  // ------------------------
  return (
    <div className="min-h-screen p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-blue-700">Simulaciones</h1>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-700 hover:bg-blue-800">
              Crear simulación
            </Button>
          </DialogTrigger>

          {/* ---------- FORMULARIO ---------- */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva simulación</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label>Ingresos mensuales</Label>
                <Input
                  type="number"
                  value={form.monthlyIncome}
                  onChange={(e) => handleFormChange("monthlyIncome", e.target.value)}
                />
              </div>

              <div>
                <Label>Gastos mensuales</Label>
                <Input
                  type="number"
                  value={form.monthlyExpense}
                  onChange={(e) => handleFormChange("monthlyExpense", e.target.value)}
                />
              </div>

              <div>
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => handleFormChange("quantity", e.target.value)}
                />
              </div>

              <div>
                <Label>Tipo de negocio</Label>
                <Input
                  type="text"
                  value={form.type}
                  onChange={(e) => handleFormChange("type", e.target.value)}
                />
              </div>

              <div>
                <Label>Activos</Label>
                <Input
                  type="number"
                  value={form.assets}
                  onChange={(e) => handleFormChange("assets", e.target.value)}
                />
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <Button
                disabled={creating}
                className="w-full bg-blue-700 hover:bg-blue-800"
                onClick={handleCreateSimulation}
              >
                {creating ? "Creando..." : "Crear simulación"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* PANEL IZQUIERDO */}
        <Card className="lg:col-span-1 h-[80vh] flex flex-col">
          <CardContent className="p-4 flex-1">
            <h2 className="text-blue-700 font-semibold text-lg mb-4">
              Entradas de simulación
            </h2>

            <ScrollArea className="h-[70vh] pr-2">
              <div className="flex flex-col gap-3">
                {inputsLoading && <p>Cargando entradas...</p>}
                {inputsError && <p className="text-red-500">{inputsError}</p>}

                {!inputsLoading &&
                  !inputsError &&
                  simulationInputs.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedSimulationId(item.id)}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition",
                        selectedSimulationId === item.id
                          ? "bg-blue-50 border-blue-300"
                          : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                      )}
                    >
                      <p className="font-medium text-gray-800">
                        Simulación {item.versionNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Ingresos: {item.monthlyIncome.toLocaleString()} — Gastos:{" "}
                        {item.monthlyExpense.toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* PANEL DERECHO — RESULTADOS */}
        <Card className="lg:col-span-3">
          <CardContent className="p-6 space-y-8">
            <h2 className="text-blue-700 font-semibold text-lg mb-4">
              Resultados de la simulación
            </h2>

            {regimesLoading && <p>Cargando regímenes...</p>}
            {resultsLoading && <p>Cargando resultados...</p>}
            {resultsError && <p className="text-red-500">{resultsError}</p>}

            {/* TARJETAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {enrichedResults.map((result) => (
                <div
                  key={result.resultId}
                  className={cn(
                    "p-4 rounded-lg border shadow-sm relative",
                    result.recommended
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-gray-100"
                  )}
                >
                  {result.recommended && (
                    <span className="absolute top-2 right-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                      Recomendado
                    </span>
                  )}

                  <h3 className="font-semibold text-gray-800 mb-1">
                    {result.regime?.name} ({result.regimeCode})
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {result.regime?.description}
                  </p>

                  <div className="space-y-4 text-sm text-gray-700 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Impuesto mensual</span>
                        <span>S/ {result.monthlyTax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IGV mensual</span>
                        <span>S/ {result.monthlyIgv}</span>
                      </div>
                    </div>

                    <hr />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total mensual</span>
                        <span>S/ {result.totalMonthly}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total anual</span>
                        <span>S/ {result.totalAnnual}</span>
                      </div>
                    </div>
                  </div>

                  {/* BENEFICIOS / REQUISITOS */}
                  <div className="text-sm text-gray-700">
                    {!!result.beneficios?.length && (
                      <>
                        <p className="font-semibold">Beneficios:</p>
                        <ul className="list-disc ml-5 text-gray-600">
                          {result.beneficios.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {!!result.requisitos?.length && (
                      <>
                        <p className="font-semibold mt-2">Requisitos:</p>
                        <ul className="list-disc ml-5 text-gray-600">
                          {result.requisitos.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* COMPARACIÓN VISUAL */}
            {enrichedResults.length > 0 && (
              <div className="mt-10 p-6 border rounded-lg bg-white shadow-sm">
                <h3 className="text-blue-700 font-semibold text-lg mb-4">
                  Comparación visual de costos anuales
                </h3>

                {(() => {
                  const max = Math.max(
                    ...enrichedResults.map((r) => Number(r.totalAnnual))
                  );

                  return (
                    <div className="space-y-8">
                      {enrichedResults.map((result) => {
                        const value = Number(result.totalAnnual);
                        const pct = (value / max) * 100;

                        return (
                          <div key={result.resultId} className="space-y-2 relative">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-800">
                                {result.regimeName || result.regime?.name}
                              </span>
                              <span className="text-gray-600 text-sm">
                                S/ {result.totalAnnual}
                              </span>
                            </div>

                            <div className="relative">
                              <Progress
                                value={pct}
                                className={cn(
                                  "h-3",
                                  result.recommended ? "bg-green-100" : "bg-blue-100"
                                )}
                              />

                              <div
                                className={cn(
                                  "absolute top-0 left-0 h-3 rounded transition-all",
                                  result.recommended ? "bg-green-600" : "bg-blue-500"
                                )}
                                style={{ width: `${pct}%` }}
                              />

                              {result.recommended && (
                                <span
                                  className="
                                  absolute left-1/2 -top-6 -translate-x-1/2
                                  bg-green-600 text-white text-xs px-2 py-1 rounded shadow
                                "
                                >
                                  Mejor opción
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
