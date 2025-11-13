"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, clearToken } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !token) {
      router.replace("/login");
    }
  }, [token, isClient, router]);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  if (!isClient || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Verificando sesión...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo + título */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 bg-linear-to-br from-blue-800 to-blue-600 rounded-2xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white"
              >
                <path d="M10 12h4" />
                <path d="M10 8h4" />
                <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
                <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
                <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
              </svg>
            </div>

            {/* Título + texto */}
            <div className="flex flex-col">
              <span className="text-blue-700 font-semibold">Formaliza.pe</span>
              <span className="text-gray-500 text-sm">Bienvenido, Emprendedor</span>
            </div>
          </div>

          {/* Botones perfil y logout */}
          <div className="flex items-center gap-2">
            <button
              data-slot="button"
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
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            <button
              onClick={handleLogout}
              data-slot="button"
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
                <path d="m16 17 5-5-5-5"></path>
                <path d="M21 12H9"></path>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 p-6">{children}</main>
    </div>
  );
}
