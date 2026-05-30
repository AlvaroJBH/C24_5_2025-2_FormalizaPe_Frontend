"use client";

import { Badge } from "@/components/ui/badge";

interface UserStatusBadgeProps {
  enabled: boolean;
  active: boolean;
}

export function UserStatusBadge({ enabled, active }: UserStatusBadgeProps) {
  if (!enabled) {
    return (
      <Badge variant="destructive" className="rounded-none">
        Deshabilitado
      </Badge>
    );
  }

  if (!active) {
    return (
      <Badge variant="destructive" className="rounded-none">
        Inactivo
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="rounded-none bg-green-600">
      Activo
    </Badge>
  );
}