"use client";

import { Badge } from "@/components/ui/badge";
import { UserRowActions } from "./UserRowActions";
import { UserStatusBadge } from "./UserStatusBadge";
import { AdminUser } from "@/services/admin-user-service";

interface UsersTableProps {
  users: AdminUser[];
  loading: boolean;
  onUpdateRoles: (userId: number, roles: string[]) => Promise<void>;
  onToggleStatus: (userId: number) => Promise<void>;
  onDelete: (userId: number) => Promise<void>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function UsersTable({
  users,
  loading,
  onUpdateRoles,
  onToggleStatus,
  onDelete,
}: UsersTableProps) {
  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No hay usuarios registrados.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-50">
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Username
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Email
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Roles
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Estado
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Fecha creación
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-800 font-medium">
                {user.username}
              </td>
              <td className="py-3 px-4 text-gray-600">{user.email}</td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <Badge
                      key={role}
                      variant={role === "ADMIN" ? "default" : "secondary"}
                      className="rounded-none"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4">
                <UserStatusBadge enabled={user.enabled} active={user.active} />
              </td>
              <td className="py-3 px-4 text-gray-600 text-sm">
                {formatDate(user.createdAt)}
              </td>
              <td className="py-3 px-4">
                <UserRowActions
                  user={user}
                  onUpdateRoles={onUpdateRoles}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}