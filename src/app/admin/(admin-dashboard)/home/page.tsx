"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminUsers } from "@/services/admin-user-service";
import { getAdminBusinesses } from "@/services/admin-business-service";
import { getProcedures } from "@/services/admin-procedure-service";
import { getChatbotDocuments } from "@/services/chatbot-document-service";

interface DashboardMetrics {
  users: { total: number; active: number; newThisMonth: number };
  businesses: { total: number; byStatus: Record<string, number>; newThisMonth: number };
  procedures: { total: number };
  documents: { total: number; newThisMonth: number };
}

function isNewThisMonth(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

async function loadMetrics(): Promise<DashboardMetrics> {
  const [users, businesses, procedures, documents] = await Promise.all([
    getAdminUsers(),
    getAdminBusinesses(),
    getProcedures(),
    getChatbotDocuments(),
  ]);

  const usersActive = users.filter((u) => u.enabled).length;
  const usersNew = users.filter((u) => isNewThisMonth(u.createdAt)).length;

  const businessesByStatus: Record<string, number> = {};
  businesses.forEach((b) => {
    businessesByStatus[b.status] = (businessesByStatus[b.status] || 0) + 1;
  });
  const businessesNew = businesses.filter((b) => isNewThisMonth(b.createdAt)).length;

  const documentsNew = documents.filter((d) => isNewThisMonth(d.createdAt)).length;

  return {
    users: { total: users.length, active: usersActive, newThisMonth: usersNew },
    businesses: { total: businesses.length, byStatus: businessesByStatus, newThisMonth: businessesNew },
    procedures: { total: procedures.length },
    documents: { total: documents.length, newThisMonth: documentsNew },
  };
}

const sections = [
  {
    title: "Usuarios",
    description: "Supervisión y gestión de cuentas de usuarios",
    href: "/admin/users",
  },
  {
    title: "Empresas",
    description: "Monitoreo de negocios formalizados",
    href: "/admin/businesses",
  },
  {
    title: "Procedimientos",
    description: "Seguimiento de procesos de formalización",
    href: "/admin/procedures",
  },
  {
    title: "Sistema",
    description: "FAQ, chatbot, archivos y métricas del sistema",
    href: "/admin/system",
  },
];

interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  details?: Record<string, number>;
}

function MetricCard({ title, value, subtitle, details }: MetricCardProps) {
  return (
    <div className="bg-white rounded-none shadow-md border border-gray-300 p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      {details && Object.keys(details).length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          {Object.entries(details).map(([key, val]) => (
            <div key={key} className="flex justify-between text-xs text-gray-600">
              <span>{key}</span>
              <span className="font-medium">{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminHomePage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics()
      .then(setMetrics)
      .catch(() => setError("No se pudieron cargar las métricas"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Administrador</h1>

      {loading && <p className="text-gray-500 text-sm">Cargando métricas...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {metrics && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Resumen del Sistema</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard
              title="Usuarios"
              value={metrics.users.total}
              subtitle={`${metrics.users.active} activos`}
              details={{
                "Nuevos este mes": metrics.users.newThisMonth,
              }}
            />
            <MetricCard
              title="Empresas"
              value={metrics.businesses.total}
              subtitle={`${metrics.businesses.newThisMonth} nuevas este mes`}
              details={metrics.businesses.byStatus}
            />
            <MetricCard
              title="Procedimientos"
              value={metrics.procedures.total}
              subtitle="templates"
            />
            <MetricCard
              title="Documentos"
              value={metrics.documents.total}
              subtitle={`${metrics.documents.newThisMonth} nuevos este mes`}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            onClick={() => section.href && router.push(section.href)}
            className={`bg-white rounded-none shadow-md border border-gray-300 p-6 cursor-pointer hover:shadow-lg hover:border-gray-400 transition-shadow ${
              section.href ? "" : "opacity-60 pointer-events-none"
            }`}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {section.title}
            </h2>
            <p className="text-gray-500 text-sm">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}