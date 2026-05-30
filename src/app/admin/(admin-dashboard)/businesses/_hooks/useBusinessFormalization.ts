"use client";

import { useState, useCallback } from "react";
import { getAdminBusinessFormalization, AdminBusinessFormalization } from "@/services/admin-business-service";

export function useBusinessFormalization(businessId: number) {
  const [formalization, setFormalization] = useState<AdminBusinessFormalization | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFormalization = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminBusinessFormalization(businessId);
      setFormalization(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar formalización");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  return {
    formalization,
    setFormalization,
    loading,
    error,
    fetchFormalization,
  };
}