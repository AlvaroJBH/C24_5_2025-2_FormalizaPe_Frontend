"use client";

import { useAuthStore } from "@/store/auth-store";
import { useBusinessStore } from "@/store/business-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-6 9 6" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

function SummaryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function ProceduresIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function SimulationsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    </svg>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { business, clearBusiness } = useBusinessStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  const handleLogout = () => {
    clearAuth();
    clearBusiness();
    router.replace("/login");
  };

  const handleHome = () => {
    clearBusiness();
    router.push("/businesses");
  };

  const isBusinessContext = pathname.includes("/businesses/") && pathname !== "/businesses";

  const navItemsWhenBusinessSelected: NavItem[] = business
    ? [
        { label: "Resumen", href: `/businesses/${business.id}`, icon: <SummaryIcon /> },
        { label: "Trámites", href: `/businesses/${business.id}/procedure-management`, icon: <ProceduresIcon /> },
        { label: "Simulaciones", href: `/businesses/${business.id}/simulations`, icon: <SimulationsIcon /> },
        { label: "Reportes", href: `/businesses/${business.id}/reports`, icon: <ReportsIcon /> },
      ]
    : [];

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
                Bienvenido, {user?.username ?? "Emprendedor"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleHome}
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium hover:bg-gray-100 transition gap-1.5"
            >
              <HomeIcon />
              <span>Inicio</span>
            </button>

            {isBusinessContext && business && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-2" />
                {navItemsWhenBusinessSelected.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium transition gap-1.5 ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </>
            )}

            <div className="w-px h-6 bg-gray-300 mx-2" />

            <button
              onClick={() => router.push("/profile")}
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium hover:bg-gray-100 transition gap-1.5"
            >
              <UserIcon />
              <span>Perfil</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-sm font-medium hover:bg-gray-100 transition gap-1.5"
            >
              <LogoutIcon />
              <span>Salir</span>
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