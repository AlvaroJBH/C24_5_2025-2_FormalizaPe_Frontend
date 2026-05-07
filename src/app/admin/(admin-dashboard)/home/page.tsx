"use client";

import { useAuthStore } from "@/store/auth-store";

export default function AdminHomePage() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Cargando datos del usuario...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Administrador</h1>

      <div className="bg-white rounded-none shadow-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Datos del Usuario</h2>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 font-medium">ID</span>
            <span className="text-gray-900 font-mono">{user.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Username</span>
            <span className="text-gray-900">{user.username}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Email</span>
            <span className="text-gray-900">{user.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Roles</span>
            <div className="flex gap-2">
              {user.roles.map((role) => (
                <span
                  key={role}
                  className={`px-2 py-1 rounded-none text-xs font-semibold ${
                    role === "ADMIN"
                      ? "bg-gray-900 text-white"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-none shadow-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Datos completos (JSON)</h2>
        <pre className="bg-gray-50 p-4 rounded-none text-sm font-mono text-gray-700 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => window.location.href = "/businesses"}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-none text-sm font-medium transition"
        >
          Ir a Empresas
        </button>
        <button
          onClick={() => window.location.href = "/"}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-none text-sm font-medium transition"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}