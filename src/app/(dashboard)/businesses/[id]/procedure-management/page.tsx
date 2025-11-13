"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { getProcedures, Procedure } from "@/services/procedure-service";

export default function DashboardPage() {
  const { token } = useAuthStore();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchProcedures = async () => {
      try {
        setLoading(true);
        const data = await getProcedures();
        setProcedures(data);
        setError(null);
      } catch (err: unknown) {
        console.error(err);
        setError("Error al cargar los procedimientos");
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, [token]);

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

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-2xl text-blue-700 font-semibold mb-6">
        Procedimientos disponibles
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {procedures.map((procedure) => (
          <div
            key={procedure.id}
            className="bg-white rounded-xl shadow p-4 hover:shadow-md transition"
          >
            <h2 className="text-blue-700 font-semibold text-lg mb-2">
              {procedure.name}
            </h2>
            <p className="text-gray-600 text-sm mb-2">{procedure.description}</p>
            <span className="text-gray-400 text-xs">{procedure.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
