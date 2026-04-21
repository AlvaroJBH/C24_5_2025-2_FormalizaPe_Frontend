"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  FormalizationProcedureDTO,
  getFormalizationStatus,
} from "@/services/formalization-service";
import { AppBreadcrumb } from "@/components/common/app-breadcrumb";
import { Business, getBusinessById } from "@/services/business-service";

export default function ProcedureManagementPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = Number(params.id);
  const [business, setBusiness] = useState<Business | null>(null)

  const { token } = useAuthStore();

  const [procedures, setProcedures] = useState<FormalizationProcedureDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !businessId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFormalizationStatus(businessId);
        setProcedures(data.procedures);
        const business_data = await getBusinessById(businessId);
        setBusiness(business_data)
      } catch (err) {
        console.error(err);
        setError("Error al cargar los procedimientos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, businessId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando procedimientos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // 🎨 Tema unificado por estado
  const StatusTheme: Record<
    string,
    { border: string; badge: string; label: string }
  > = {
    COMPLETED: {
      border: "border-green-500",
      badge: "bg-green-500",
      label: "Completado",
    },
    IN_PROGRESS: {
      border: "border-blue-500",
      badge: "bg-blue-500",
      label: "En progreso",
    },
    PENDING: {
      border: "border-gray-300",
      badge: "bg-gray-400",
      label: "Pendiente",
    },
  };

  return (
    <div className="flex flex-col flex-1 p-6 overflow-auto">
      <AppBreadcrumb
          items={[
            { label: "Inicio", href: "/businesses" },
            { label: business?.name ?? "Business", href: `/businesses/${businessId}` },
            { label: "Progreso", href: `/businesses/${businessId}/procedure-management` },
        ]}
      />
      <h1 className="text-2xl text-slate-700 font-semibold mb-6">
        Progreso de Formalización
      </h1>

      {/* ======================= RESUMEN GENERAL ======================= */}
      {procedures.length > 0 &&
        (() => {
          const completed = procedures.filter(
            (p) => p.status === "COMPLETED"
          ).length;
          const inProgress = procedures.filter(
            (p) => p.status === "IN_PROGRESS"
          ).length;
          const pending = procedures.filter(
            (p) => p.status === "PENDING"
          ).length;
          const blocked = procedures.filter(
            (p) => p.status === "BLOCKED"
          ).length;

          const overallProgress =
            procedures.reduce((acc, p) => acc + p.progressPercent, 0) /
            procedures.length;

          return (
            <div className="bg-white rounded-none shadow-md p-6 mb-8 border border-gray-300">
              <h2 className="text-xl font-semibold text-slate-700">
                Resumen de Formalización
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Estado actual de todos tus trámites de formalización
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {completed}
                  </p>
                  <p className="text-sm text-gray-500">Completados</p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {inProgress}
                  </p>
                  <p className="text-sm text-gray-500">En Proceso</p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-600">{pending}</p>
                  <p className="text-sm text-gray-500">Pendientes</p>
                </div>

                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{blocked}</p>
                  <p className="text-sm text-gray-500">Bloqueados</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">Progreso general</p>
              <Progress value={overallProgress} className="h-2 rounded-none" />

              <p className="text-right text-sm text-gray-500 mt-1 font-medium">
                {overallProgress.toFixed(0)}%
              </p>
            </div>
          );
        })()}

      {/* ======================= LISTA DE PROCEDIMIENTOS ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {procedures.map((p) => {
          const theme = StatusTheme[p.status];

          return (
            <div
              key={p.procedureId}
              className={`relative bg-white rounded-none shadow-md p-6 border border-gray-300 border-l-[6px] ${theme.border}`}
            >
              <div className="absolute top-4 right-4">
                <Badge className={`${theme.badge} text-white rounded-none`}>
                  {theme.label}
                </Badge>
              </div>

              <h2 className="text-lg font-semibold text-slate-800 mb-1">
                {p.name}
              </h2>

              <p className="text-gray-600 text-sm mb-3">{p.description}</p>

              <span className="text-xs text-gray-400 block mb-4">
                {p.category}
              </span>

              <Progress
                value={p.progressPercent}
                className="h-2 rounded-none"
              />

              <p className="mt-2 text-xs text-gray-500">
                {p.completedSteps} / {p.totalSteps} pasos completados
              </p>

              <Button
                className="w-full mt-4 bg-slate-700 hover:bg-slate-800 rounded-none shadow-sm"
                onClick={() =>
                  router.push(
                    `/businesses/${businessId}/procedure-management/${p.procedureId}`
                  )
                }
              >
                Ver detalles
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
