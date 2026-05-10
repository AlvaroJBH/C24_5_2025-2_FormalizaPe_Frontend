"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUsers } from "./_hooks/useUsers";
import { UsersTable } from "./_components/UsersTable";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const router = useRouter();
  const { users, loading, error, fetchUsers, updateRoles, toggleStatus, removeUser } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <Button
          onClick={fetchUsers}
          variant="outline"
          className="rounded-none"
          size="sm"
        >
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-none">
          {error}
        </div>
      )}

      <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
        <UsersTable
          users={users}
          loading={loading}
          onUpdateRoles={updateRoles}
          onToggleStatus={toggleStatus}
          onDelete={removeUser}
        />
      </div>
    </div>
  );
}