"use client";

import { Badge } from "@/components/ui/badge";

interface BusinessStatusBadgeProps {
  status: string;
}

export function BusinessStatusBadge({ status }: BusinessStatusBadgeProps) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge variant="default" className="rounded-none bg-green-600">
          Activo
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="secondary" className="rounded-none bg-yellow-500 text-white">
          Pendiente
        </Badge>
      );
    case "INACTIVE":
      return (
        <Badge variant="destructive" className="rounded-none">
          Inactivo
        </Badge>
      );
    case "SUSPENDED":
      return (
        <Badge variant="destructive" className="rounded-none">
          Suspendido
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="rounded-none">
          {status}
        </Badge>
      );
  }
}