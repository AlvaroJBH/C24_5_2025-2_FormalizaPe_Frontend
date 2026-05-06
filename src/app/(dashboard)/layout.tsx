"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const clearToken = useAuthStore((s) => s.clearToken);

  // 🔑 estado local de hidratación (el que ya sabes que funciona)
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  const handleLogout = () => {
    clearToken();
    router.replace("/login");
  };

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Verificando sesión...
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen app-background flex flex-col">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo + título */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-linear-to-br from-blue-800 to-blue-600">
              <Image
                src="/icono formalizape.ico"
                width={24}
                height={24}
                alt="Icono Formalizape"
                className="w-full h-full"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-blue-700 font-semibold">Formaliza.pe</span>
              <span className="text-gray-500 text-sm">
                Bienvenido, Emprendedor
              </span>
            </div>
          </div>

          {/* --- ICONOS DERECHA --- */}
          <div className="flex items-center gap-2">
            {/* Home */}
            <button
              onClick={() => router.push("/businesses")}
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M3 9l9-6 9 6" />
                <path d="M9 22V12h6v10" />
              </svg>
            </button>

            {/* Usuario */}
            <button
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              </svg>
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