"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminUser } from "@/services/admin-user-service";

interface UserRolesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
  onSave: (userId: number, roles: string[]) => Promise<void>;
}

const AVAILABLE_ROLES = ["USER", "ADMIN"];

export function UserRolesModal({
  open,
  onOpenChange,
  user,
  onSave,
}: UserRolesModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setSelectedRoles([...user.roles]);
      setError(null);
    }
  }, [user]);

  const handleToggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const handleSave = async () => {
    if (selectedRoles.length === 0) {
      setError("Debe tener al menos un rol");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSave(user.id, selectedRoles);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar roles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none">
        <DialogHeader>
          <DialogTitle>Editar roles</DialogTitle>
          <DialogDescription>
            Modifica los roles para el usuario{" "}
            <span className="font-medium text-foreground">{user.username}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {AVAILABLE_ROLES.map((role) => (
            <label
              key={role}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => handleToggleRole(role)}
                className="w-4 h-4 rounded border-gray-400 text-primary focus:ring-primary"
              />
              <span className="font-medium text-gray-800">{role}</span>
            </label>
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 px-3 py-2 border border-red-200">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-none"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || selectedRoles.length === 0}
            className="rounded-none"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}