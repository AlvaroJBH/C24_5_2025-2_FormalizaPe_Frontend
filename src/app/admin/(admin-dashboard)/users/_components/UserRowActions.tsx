"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { UserRolesModal } from "./UserRolesModal";
import { AdminUser } from "@/services/admin-user-service";

interface UserRowActionsProps {
  user: AdminUser;
  onUpdateRoles: (userId: number, roles: string[]) => Promise<void>;
  onToggleStatus: (userId: number) => Promise<void>;
  onDelete: (userId: number) => Promise<void>;
}

export function UserRowActions({
  user,
  onUpdateRoles,
  onToggleStatus,
  onDelete,
}: UserRowActionsProps) {
  const router = useRouter();
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleToggleStatus = async () => {
    setActionLoading(true);
    try {
      await onToggleStatus(user.id);
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await onDelete(user.id);
      setDeleteDialogOpen(false);
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditRoles = () => {
    setRolesModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin/users/${user.id}`)}
          className="rounded-none h-7 px-2 text-xs"
        >
          Ver detalle
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditRoles}
          className="rounded-none h-7 px-2 text-xs"
        >
          Editar roles
        </Button>
        <Button
          variant={user.enabled ? "outline" : "default"}
          size="sm"
          onClick={handleToggleStatus}
          disabled={actionLoading}
          className={`rounded-none h-7 px-2 text-xs ${
            !user.enabled ? "bg-green-600 hover:bg-green-700" : "text-orange-600 border-orange-300 hover:bg-orange-50"
          }`}
        >
          {user.enabled ? "Desactivar" : "Activar"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
          className="rounded-none h-7 px-2 text-xs text-red-600 border-red-300 hover:bg-red-50"
        >
          Eliminar
        </Button>
      </div>

      <UserRolesModal
        open={rolesModalOpen}
        onOpenChange={setRolesModalOpen}
        user={user}
        onSave={onUpdateRoles}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar usuario"
        description={`¿Estás seguro de eliminar al usuario "${user.username}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        confirmLabel="Eliminar"
        destructive
      />
    </>
  );
}