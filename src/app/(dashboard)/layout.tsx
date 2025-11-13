"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, clearToken } = useAuthStore();
  const router = useRouter();

  // 🔒 Validar autenticación
  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  // Mientras valida o redirige
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Verificando sesión...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-blue-700 font-semibold">
          Formaliza.pe
        </Link>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:underline text-sm"
        >
          Cerrar sesión
        </button>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}
