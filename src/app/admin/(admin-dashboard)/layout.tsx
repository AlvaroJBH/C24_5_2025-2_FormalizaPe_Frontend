"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, hydrated } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;

    if (!token) {
      router.replace("/admin/login");
    }
  }, [hydrated, token, router]);

  if (!hydrated || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Verificando sesión...
      </div>
    );
  }

  return (
    <div className="min-h-screen app-background-admin flex flex-col">
      <nav className="bg-gray-800 shadow">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-linear-to-br from-gray-700 to-gray-500">
              <Image
                src="/icono formalizape.ico"
                width={24}
                height={24}
                alt="Icono Formalizape"
                className="w-full h-full"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-gray-100 font-semibold">Formaliza.pe</span>
              <span className="text-gray-400 text-sm">Panel de Administrador</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition"
            >
              Inicio
            </button>
            <button
              onClick={() => router.push("/businesses")}
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition"
            >
              Empresas
            </button>
            <button
              onClick={() => {
                useAuthStore.getState().clearAuth();
                router.replace("/admin/login");
              }}
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 p-6 flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}