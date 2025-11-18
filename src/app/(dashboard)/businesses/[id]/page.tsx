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
    <div className="flex flex-col flex-1 p-6 overflow-auto">
      {/* Tarjeta de alertas */}
      <div className="mb-6 p-4 border border-gray-200 rounded-xl flex items-center justify-between">
        <span className="text-gray-700 font-medium">Alertas importantes</span>
        <span className="text-sm text-gray-400">[data estatica]</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Progreso de trámites */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-blue-700 font-semibold text-lg">
              Progreso de trámites
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Estado actual de tus procesos de formalización
            </p>

            <div className="mt-4 flex flex-col gap-5">
              {procedures.length === 0 ? (
                <div className="text-gray-400 text-sm">
                  No hay trámites registrados.
                </div>
              ) : (
                procedures.map((p) => (
                  <div key={p.procedureId} className="flex flex-col gap-2">
                    {/* Fila principal */}
                    <div className="flex items-center w-full">
                      {/* Nombre */}
                      <span className="text-sm font-medium text-gray-800 flex-1">
                        {p.name}
                      </span>

                      {/* Pasos (pegado al nombre, alineado a la derecha del nombre) */}
                      <span className="text-xs text-gray-500 mr-3">
                        {p.completedSteps}/{p.totalSteps} pasos
                      </span>

                      {/* Badge (al extremo derecho) */}
                      <Badge className={`${badgeColors[p.status]} text-white`}>
                        {statusLabels[p.status]}
                      </Badge>
                    </div>

                    {/* Barra de progreso */}
                    <Progress value={p.progressPercent} className="h-2" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-blue-700 font-semibold text-lg">
              Accesos rápidos
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Herramientas principales para gestionar tu negocio
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Simulador tributario */}
              <Link
                href={`/businesses/${businessId}/simulations`}
                className="
        border rounded-lg p-4 flex flex-col items-center text-center
        border-[#4CAEFF] hover:bg-[#E8F4FF] transition
      "
              >
                <Calculator size={24} className="mb-2" color="#4CAEFF" />
                <span className="text-black text-sm font-medium">
                  Simulador tributario
                </span>
              </Link>

              {/* Asistente IA */}
              <Link
                href={`/businesses/${businessId}/chatbot`}
                className="
        border rounded-lg p-4 flex flex-col items-center text-center
        border-[#3B82F6] hover:bg-[#E6EEFF] transition
      "
              >
                <MessageSquare size={24} className="mb-2" color="#3B82F6" />
                <span className="text-black text-sm font-medium">
                  Asistente IA
                </span>
              </Link>

              {/* Gestionar trámites */}
              <Link
                href={`/businesses/${businessId}/procedure-management`}
                className="
        border rounded-lg p-4 flex flex-col items-center text-center
        border-[#8B5CF6] hover:bg-[#F3E8FF] transition
      "
              >
                <FileText size={24} className="mb-2" color="#8B5CF6" />
                <span className="text-black text-sm font-medium">
                  Gestionar trámites
                </span>
              </Link>

              {/* Reportes */}
              <Link
                href={`/businesses/${businessId}/reports`}
                className="
        border rounded-lg p-4 flex flex-col items-center text-center
        border-[#F97316] hover:bg-[#FFF0E6] transition
      "
              >
                <LineChart size={24} className="mb-2" color="#F97316" />
                <span className="text-black text-sm font-medium">Reportes</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Columna 1/3 */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-blue-700 font-semibold text-lg mb-2">
              Datos del negocio
            </h2>
            <p className="text-gray-500 text-sm">Nombre: {business.name}</p>
            <p className="text-gray-500 text-sm">Sector: {business.sector}</p>
            <p className="text-gray-500 text-sm">RUC: [data estatica]</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-center">
            <button className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition">
              Generar documentos
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-blue-700 font-semibold text-lg">
              Recomendaciones IA
            </h2>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              [Container vacío]
            </div>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition">
              Chatear con IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
