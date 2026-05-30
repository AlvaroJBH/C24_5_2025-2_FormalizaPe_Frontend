"use client";

import { useState, useCallback } from "react";
import { getAdminBusinessById, AdminBusinessDetail } from "@/services/admin-business-service";

export function useBusinessDetail(businessId: number) {
  const [business, setBusiness] = useState<AdminBusinessDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminBusinessById(businessId);
      setBusiness(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar empresa");
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  return {
    business,
    setBusiness,
    loading,
    error,
    fetchBusiness,
  };
}