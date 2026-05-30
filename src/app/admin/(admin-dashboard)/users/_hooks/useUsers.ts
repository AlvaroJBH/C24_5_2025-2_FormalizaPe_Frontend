"use client";

import { useState, useCallback } from "react";
import {
  getAdminUsers,
  getAdminUserById,
  updateUserRoles,
  toggleUserStatus,
  deleteUser,
  AdminUser,
} from "@/services/admin-user-service";

export function useUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRoles = useCallback(async (userId: number, roles: string[]) => {
    try {
      await updateUserRoles(userId, roles);
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  }, [fetchUsers]);

  const toggleStatus = useCallback(async (userId: number) => {
    try {
      await toggleUserStatus(userId);
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  }, [fetchUsers]);

  const removeUser = useCallback(async (userId: number) => {
    try {
      await deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  }, [fetchUsers]);

  return {
    users,
    setUsers,
    loading,
    error,
    fetchUsers,
    updateRoles,
    toggleStatus,
    removeUser,
  };
}