"use client";

import { useState, useCallback } from "react";
import { getAdminBusinesses, AdminBusiness } from "@/services/admin-business-service";

export function useBusinesses() {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminBusinesses();
      setBusinesses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar empresas");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    businesses,
    setBusinesses,
    loading,
    error,
    fetchBusinesses,
  };
}