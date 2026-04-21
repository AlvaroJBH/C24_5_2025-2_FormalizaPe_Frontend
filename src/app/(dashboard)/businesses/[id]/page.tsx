"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBusinessById, Business } from "@/services/business-service";
import {
  getFormalizationStatus,
  FormalizationProcedureDTO,
} from "@/services/formalization-service";
import { Calculator, MessageSquare, FileText, LineChart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AppBreadcrumb } from "@/components/common/app-breadcrumb";

export default function BusinessDashboardPage() {
  const params = useParams();
  const businessId = params?.id ? Number(params.id) : null;

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [procedures, setProcedures] = useState<FormalizationProcedureDTO[]>([]);
  const [loadingProcedures, setLoadingProcedures] = useState(true);

  useEffect(() => {
    if (!businessId) return;

    let isMounted = true;

    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const data = await getBusinessById(businessId);
        if (isMounted) setBusiness(data);
      } catch {
        if (isMounted) setError("Error al cargar el negocio");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchProcedures = async () => {
      try {
        setLoadingProcedures(true);
        const data = await getFormalizationStatus(businessId);
        if (isMounted) setProcedures(data.procedures);
      } catch {
        console.error("Error cargando procedimientos");
      } finally {
        if (isMounted) setLoadingProcedures(false);
      }
    };

    fetchBusiness();
    fetchProcedures();

    return () => {
      isMounted = false;
    };
  }, [businessId]);

  if (loading || loadingProcedures) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando información...
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "Negocio no encontrado"}
      </div>
    );
  }

  // Badge colors
  const badgeColors: Record<string, string> = {
    COMPLETED: "bg-green-500",
    IN_PROGRESS: "bg-blue-500",
    PENDING: "bg-gray-400",
  };

  const statusLabels: Record<string, string> = {
    COMPLETED: "Completado",
    IN_PROGRESS: "En proceso",
    PENDING: "Pendiente",
  };

  return (
    <div className="flex flex-col flex-1 p-6 overflow-auto ">
      <AppBreadcrumb
        items={[
          { label: "Inicio", href: "/businesses" },
          { label: business.name, href: `/businesses/${businessId}` },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Progreso de trámites */}
          <div className="bg-white rounded-none shadow-md transition-shadow hover:shadow-lg p-6 border  border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-blue-700 font-semibold text-lg">
                Progreso de trámites
              </h2>
            </div>

            <p className="text-gray-500 text-sm mb-4">
              Estado actual de tus procesos de formalización
            </p>

            <div className="flex flex-col gap-5">
              {procedures.length === 0 ? (
                <div className="py-6 text-gray-400 text-sm bg-gray-50 rounded-none text-center">
                  No hay trámites registrados.
                </div>
              ) : (
                procedures.map((p) => (
                  <div
                    key={p.procedureId}
                    className="flex flex-col gap-2 p-3 rounded-none transition hover:bg-gray-50"
                  >
                    <div className="flex items-center w-full">
                      <span className="text-sm font-medium text-gray-800 flex-1">
                        {p.name}
                      </span>

                      <span className="text-xs text-gray-500 mr-3">
                        {p.completedSteps}/{p.totalSteps} pasos
                      </span>

                      <Badge className={`${badgeColors[p.status]} text-white rounded-none`}>
                        {statusLabels[p.status]}
                      </Badge>
                    </div>

                    <Progress value={p.progressPercent} className="h-2 rounded-none" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="bg-white rounded-none shadow p-6 border border-gray-100 transition-shadow hover:shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 bg-blue-600 rounded-none"></div>
              <h2 className="text-blue-700 font-semibold text-lg">
                Accesos rápidos
              </h2>
            </div>

            <p className="text-gray-500 text-sm mb-4">
              Herramientas principales para gestionar tu negocio
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Simulador tributario",
                  href: `/businesses/${businessId}/simulations`,
                  icon: <Calculator size={22} color="#4CAEFF" />,
                  border: "#4CAEFF",
                  hover: "hover:bg-[#E8F4FF]",
                },
                {
                  label: "Preguntas Frecuentes",
                  href: `/businesses/${businessId}/help/faqs`,
                  icon: <MessageSquare size={22} color="#3B82F6" />,
                  border: "#3B82F6",
                  hover: "hover:bg-[#E6EEFF]",
                },
                {
                  label: "Gestionar trámites",
                  href: `/businesses/${businessId}/procedure-management`,
                  icon: <FileText size={22} color="#8B5CF6" />,
                  border: "#8B5CF6",
                  hover: "hover:bg-[#F3E8FF]",
                },
                {
                  label: "Reportes",
                  href: `/businesses/${businessId}/reports`,
                  icon: <LineChart size={22} color="#F97316" />,
                  border: "#F97316",
                  hover: "hover:bg-[#FFF0E6]",
                },
              ].map((card, i) => (
                <Link
                  key={i}
                  href={card.href}
                  className={`
                    border rounded-none p-4 flex flex-col items-center text-center 
                    shadow-md transition-all 
                    hover:shadow-lg hover:-translate-y-1 
                    border-[${card.border}]
                    ${card.hover}
                  `}
                >
                  <div className="mb-2">{card.icon}</div>
                  <span className="text-sm font-medium text-gray-800">
                    {card.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-6">

          {/* Datos del negocio */}
          <div className="bg-white rounded-none shadow-md p-6 border border-gray-100 transition-shadow hover:shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded-none"></div>
              <h2 className="text-blue-700 font-semibold text-lg">
                Datos del negocio
              </h2>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-700"><b>Nombre:</b> {business.name}</p>
              <p className="text-sm text-gray-700"><b>Sector:</b> {business.sector}</p>
              {/*<p className="text-sm text-gray-700"><b>RUC:</b> [data estatica]</p>*/}
            </div>
          </div>

          {/* Botón de documentos 
          <div className="bg-white rounded-none shadow-md p-6 border border-gray-100 flex items-center justify-center transition-shadow hover:shadow-lg">
            <button className="bg-blue-600 text-white px-5 py-3 rounded-sm transition hover:bg-blue-700 shadow-sm hover:shadow">
              Generar documentos
            </button>
          </div>
            */}
          {/* Recomendaciones IA 
          <div className="bg-white rounded-none shadow-md p-6 border border-gray-100 transition-shadow hover:shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-none"></div>
              <h2 className="text-blue-700 font-semibold text-lg">
                Recomendaciones IA
              </h2>
            </div>

            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200/50 shadow-inner">
              [Container vacío]
            </div>

            <button className="bg-blue-600 text-white px-5 py-3 rounded-sm transition hover:bg-blue-700 shadow-sm hover:shadow">
              Chatear con IA
            </button>
          </div>
            */}
        </div>
      </div>
    </div>
  );
}
