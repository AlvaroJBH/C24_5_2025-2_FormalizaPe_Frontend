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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SimulationsPage() {
  const params = useParams();
  const businessId = Number(params.id);

  // ------------------------
  // ESTADOS
  // ------------------------
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedSimulationId, setSelectedSimulationId] = useState<
    number | null
  >(null);

  const [taxRegimes, setTaxRegimes] = useState<TaxRegime[]>([]);
  const [simulationInputs, setSimulationInputs] = useState<SimulationInput[]>(
    []
  );
  const [simulationResults, setSimulationResults] =
    useState<SimulationResults | null>(null);

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
  const businessTypes = [
    {
      value: "EIRL",
      label: "Empresa Individual de Responsabilidad Limitada (EIRL)",
    },
    { value: "SAC", label: "Sociedad Anónima Cerrada (SAC)" },
    {
      value: "SRL",
      label: "Sociedad Comercial de Responsabilidad Limitada (SRL)",
    },
    { value: "Persona Natural", label: "Persona Natural con Negocio" },
  ];
  const workerRanges = [
    { value: 1, label: "0 - 1 trabajadores" },
    { value: 5, label: "2 - 5 trabajadores" },
    { value: 10, label: "6 - 10 trabajadores" },
    { value: 11, label: "Más de 10" },
  ];

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
        if (selectedSimulationId == null) {
          setResultsError("No hay simulación seleccionada");
          return;
        }
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
      const rules =
        (r?.rulesJson as {
          beneficios?: string[];
          requisitos?: string[];
        } | null) || {};

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
  // Improved styling: straight borders, refined shadows, neutral colors, responsive behavior
  // Paste your component logic and wrap with these updated classes

  return (
    <div className="flex-1 p-6 flex flex-col min-h-0">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-700">Simulaciones</h1>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-700 hover:bg-slate-800 rounded-none shadow-sm">
              Crear simulación
            </Button>
          </DialogTrigger>

          <DialogContent className="rounded-none border border-gray-300 shadow-lg">
            <DialogHeader>
              <DialogTitle>Nueva simulación</DialogTitle>
              <p className="text-sm text-gray-500">
                Completa los datos para estimar tus impuestos según cada régimen
                tributario.
              </p>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Ingresos */}
              <div>
                <Label>Ingresos mensuales (S/)</Label>
                <Input
                  type="number"
                  placeholder="Ej: 5000"
                  className="rounded-none"
                  value={form.monthlyIncome}
                  onChange={(e) =>
                    handleFormChange("monthlyIncome", e.target.value)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Monto total que generas en ventas cada mes.
                </p>
              </div>

              {/* Gastos */}
              <div>
                <Label>Gastos mensuales (S/)</Label>
                <Input
                  type="number"
                  placeholder="Ej: 2000"
                  className="rounded-none"
                  value={form.monthlyExpense}
                  onChange={(e) =>
                    handleFormChange("monthlyExpense", e.target.value)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Incluye costos del negocio: compras, servicios, alquiler, etc.
                </p>
              </div>

              {/* Trabajadores */}
              <div>
                <Label>Cantidad de trabajadores</Label>
                <Select
                  onValueChange={(value) => handleFormChange("quantity", value)}
                  value={String(form.quantity)}
                >
                  <SelectTrigger className="w-full rounded-none">
                    <SelectValue placeholder="Selecciona un rango" />
                  </SelectTrigger>
                  <SelectContent>
                    {workerRanges.map((w) => (
                      <SelectItem key={w.value} value={String(w.value)}>
                        {w.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Selecciona el rango que mejor representa el número de
                  trabajadores.
                </p>
              </div>

              {/* Tipo de negocio */}
              <div>
                <Label>Tipo de negocio</Label>
                <Select
                  onValueChange={(value) => handleFormChange("type", value)}
                  value={form.type}
                >
                  <SelectTrigger className="w-full rounded-none">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Elige la forma jurídica registrada o planificada para tu
                  negocio.
                </p>
              </div>

              {/* Activos */}
              <div>
                <Label>Valor total de activos (S/)</Label>
                <Input
                  type="number"
                  placeholder="Ej: 10000"
                  className="rounded-none"
                  value={form.assets}
                  onChange={(e) => handleFormChange("assets", e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suma del valor de maquinaria, equipos, inventario y bienes del
                  negocio.
                </p>
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <Button
                disabled={creating}
                className="w-full bg-slate-700 hover:bg-slate-800 rounded-none shadow-sm"
                onClick={handleCreateSimulation}
              >
                {creating ? "Creando..." : "Crear simulación"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* PANEL IZQUIERDO */}
        <Card className="lg:col-span-1 flex flex-col min-h-0 rounded-none border border-gray-300 shadow-sm">
          <CardContent className="p-4 flex-1">
            <h2 className="text-slate-700 font-semibold text-lg mb-4">
              Entradas de simulación
            </h2>

            <ScrollArea className="flex-1 min-h-0 pr-2">
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
                        "p-4 rounded-none border cursor-pointer transition shadow-sm",
                        selectedSimulationId === item.id
                          ? "bg-slate-200 border-slate-400"
                          : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                      )}
                    >
                      <p className="font-medium text-gray-800">
                        Simulación {item.versionNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Ingresos: {item.monthlyIncome.toLocaleString()} —
                        Gastos: {item.monthlyExpense.toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* PANEL DERECHO */}
        <Card className="lg:col-span-3 flex flex-col min-h-0 rounded-none border border-gray-300 shadow-md">
          <CardContent className="p-6 flex-1 min-h-0 space-y-8 overflow-auto">
            <h2 className="text-slate-700 font-semibold text-lg mb-4">
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
                    "p-5 rounded-none border shadow-sm flex flex-col gap-4",
                    result.recommended
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-gray-100",
                    !result.available && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex justify-between items-start min-h-[28px]">
                    <h3 className="font-semibold text-gray-800">
                      {result.regimeName} ({result.regimeCode})
                    </h3>

                    {result.recommended && result.available ? (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-none shadow-sm">
                        Recomendado
                      </span>
                    ) : (
                      <span className="invisible text-xs px-2 py-1 rounded-none">
                        R
                      </span>
                    )}
                  </div>

                  {!result.available && (
                    <p className="text-sm text-red-600 font-medium">
                      No disponible para este negocio
                    </p>
                  )}

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {result.regime?.description}
                  </p>

                  <div className="space-y-4 text-sm text-gray-700">
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

                  <div className="text-sm text-gray-700 space-y-3">
                    {!!result.beneficios?.length && (
                      <div>
                        <p className="font-semibold mb-1">Beneficios:</p>
                        <ul className="list-disc ml-5 text-gray-600 space-y-1">
                          {result.beneficios.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!!result.requisitos?.length && (
                      <div>
                        <p className="font-semibold mb-1">Requisitos:</p>
                        <ul className="list-disc ml-5 text-gray-600 space-y-1">
                          {result.requisitos.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* COMPARACIÓN VISUAL */}
            {enrichedResults.length > 0 && (
              <div className="mt-10 p-6 border rounded-none bg-white shadow-sm">
                <h3 className="text-slate-700 font-semibold text-lg mb-4">
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
                          <div
                            key={result.resultId}
                            className="space-y-2 relative"
                          >
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
                                  "h-3 rounded-none",
                                  result.recommended
                                    ? "bg-green-100"
                                    : "bg-slate-100"
                                )}
                              />

                              <div
                                className={cn(
                                  "absolute top-0 left-0 h-3 rounded-none transition-all",
                                  result.recommended
                                    ? "bg-green-600"
                                    : "bg-slate-600"
                                )}
                                style={{ width: `${pct}%` }}
                              />

                              {result.recommended && (
                                <span className="absolute left-1/2 -top-6 -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded-none shadow-sm">
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
