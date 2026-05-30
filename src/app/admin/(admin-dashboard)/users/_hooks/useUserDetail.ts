"use client";

import { useState, useCallback } from "react";
import {
  getAdminUserById,
  updateUserRoles,
  toggleUserStatus,
  AdminUser,
} from "@/services/admin-user-service";

export function useUserDetail(userId: number) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUserById(userId);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuario");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateRoles = useCallback(async (roles: string[]) => {
    setLoading(true);
    try {
      const updated = await updateUserRoles(userId, roles);
      setUser(updated);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const toggleStatus = useCallback(async () => {
    setLoading(true);
    try {
      const result = await toggleUserStatus(userId);
      setUser((prev) => prev ? { ...prev, enabled: result.enabled } : null);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    user,
    setUser,
    loading,
    error,
    fetchUser,
    updateRoles,
    toggleStatus,
  };
}