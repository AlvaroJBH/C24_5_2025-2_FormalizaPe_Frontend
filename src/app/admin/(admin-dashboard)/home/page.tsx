"use client";

import { useRouter } from "next/navigation";

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

export default function AdminHomePage() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Administrador</h1>

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