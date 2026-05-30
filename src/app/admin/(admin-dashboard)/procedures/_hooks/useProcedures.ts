"use client";

import { useState, useCallback } from "react";
import { getProcedures, ProcedureTemplate } from "@/services/admin-procedure-service";

export function useProcedures() {
  const [procedures, setProcedures] = useState<ProcedureTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProcedures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProcedures();
      setProcedures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar procedimientos");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    procedures,
    setProcedures,
    loading,
    error,
    fetchProcedures,
  };
}