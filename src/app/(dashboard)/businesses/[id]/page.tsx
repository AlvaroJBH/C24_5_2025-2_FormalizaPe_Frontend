"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBusinessById, Business } from "@/services/business-service"; // tu service
import Link from "next/link";

export default function BusinessDashboardPage() {
  const params = useParams();
  const businessId = params?.id ? Number(params.id) : null;

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;

    let isMounted = true;
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const data = await getBusinessById(businessId);
        if (isMounted) {
          setBusiness(data);
          setError(null);
        }
      } catch {
        if (isMounted) setError("Error al cargar el negocio");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBusiness();
    return () => {
      isMounted = false;
    };
  }, [businessId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando negocio...
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            <div className="mt-4 h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              [Container de progreso]
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
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                Simulador tributario
              </div>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                Asistente IA
              </div>
              <Link
                href="/procedure-management"
                className="bg-gray-100 rounded-lg p-4 flex items-center justify-center hover:bg-gray-200 transition"
              >
                Gestionar trámites
              </Link>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                Reportes
              </div>
            </div>
          </div>
        </div>

        {/* Columna 1/3 */}
        <div className="flex flex-col gap-6">
          {/* Datos del business */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-blue-700 font-semibold text-lg mb-2">
              Datos del negocio
            </h2>
            <p className="text-gray-500 text-sm">Nombre: {business.name}</p>
            <p className="text-gray-500 text-sm">Sector: {business.sector}</p>
            <p className="text-gray-500 text-sm">RUC: [data estatica]</p>
          </div>

          {/* Botón generar documentos */}
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-center">
            <button className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition">
              Generar documentos
            </button>
          </div>

          {/* Recomendaciones IA */}
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
