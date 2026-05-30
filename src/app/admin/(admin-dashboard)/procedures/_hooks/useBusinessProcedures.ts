"use client";

import { useState, useCallback } from "react";
import { getAdminBusinessProcedures } from "@/services/admin-business-service";
import { updateBusinessProcedureStatus } from "@/services/admin-procedure-service";
import { AdminBusinessProcedure } from "@/services/admin-business-service";

export function useBusinessProcedures(businessId: number) {
  const [procedures, setProcedures] = useState<AdminBusinessProcedure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProcedures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminBusinessProcedures(businessId);
      setProcedures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar procedimientos");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const updateStatus = useCallback(
    async (businessProcedureId: number, status: string) => {
      try {
        await updateBusinessProcedureStatus(businessProcedureId, status);
        await fetchProcedures();
      } catch (err) {
        throw err;
      }
    },
    [fetchProcedures]
  );

  return {
    procedures,
    setProcedures,
    loading,
    error,
    fetchProcedures,
    updateStatus,
  };
}