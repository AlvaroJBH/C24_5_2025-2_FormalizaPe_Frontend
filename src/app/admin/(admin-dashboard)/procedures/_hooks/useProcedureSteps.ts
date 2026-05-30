"use client";

import { useState, useCallback } from "react";
import { getProcedureSteps, ProcedureStep } from "@/services/admin-procedure-service";

export function useProcedureSteps() {
  const [steps, setSteps] = useState<ProcedureStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSteps = useCallback(async (procedureId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProcedureSteps(procedureId);
      const sorted = [...data].sort((a, b) => a.stepOrder - b.stepOrder);
      setSteps(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar pasos");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    steps,
    setSteps,
    loading,
    error,
    fetchSteps,
  };
}