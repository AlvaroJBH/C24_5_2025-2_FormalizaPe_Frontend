"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserDetail } from "../_hooks/useUserDetail";
import { UserStatusBadge } from "../_components/UserStatusBadge";
import { UserRolesModal } from "../_components/UserRolesModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.id);
  const { user, loading, error, fetchUser, updateRoles, toggleStatus } = useUserDetail(userId);
  const [rolesModalOpen, setRolesModalOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
          <p className="text-gray-500 text-center py-8">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
          <p className="text-red-600 text-center py-8">{error || "Usuario no encontrado"}</p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => router.push("/admin/users")} variant="outline" className="rounded-none">
              Volver a la lista
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => router.push("/admin/users")}
          variant="outline"
          className="rounded-none"
          size="sm"
        >
          ← Volver
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Detalle de Usuario</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-none">
          {error}
        </div>
      )}

      <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Username</label>
              <p className="text-gray-800 font-medium mt-1">{user.username}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
              <p className="text-gray-800 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">DNI</label>
              <p className="text-gray-800 mt-1">{user.dni || "-"}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">RUC</label>
              <p className="text-gray-800 mt-1">{user.ruc || "-"}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Roles</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <Badge key={role} variant={role === "ADMIN" ? "default" : "secondary"} className="rounded-none">
                    {role}
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRolesModalOpen(true)}
                className="rounded-none h-6 px-2 text-xs ml-2"
              >
                Editar
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">Estado</label>
            <div className="mt-1">
              <UserStatusBadge enabled={user.enabled} active={user.active} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Fecha de creación</label>
              <p className="text-gray-800 text-sm mt-1">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Última actualización</label>
              <p className="text-gray-800 text-sm mt-1">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button
            variant={user.enabled ? "outline" : "default"}
            onClick={toggleStatus}
            disabled={loading}
            className={`rounded-none ${
              !user.enabled ? "bg-green-600 hover:bg-green-700" : "text-orange-600 border-orange-300 hover:bg-orange-50"
            }`}
          >
            {user.enabled ? "Desactivar usuario" : "Activar usuario"}
          </Button>
        </div>
      </div>

      <UserRolesModal
        open={rolesModalOpen}
        onOpenChange={setRolesModalOpen}
        user={user}
        onSave={async (id, roles) => {
          await updateRoles(roles);
        }}
      />
    </div>
  );
}