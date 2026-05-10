"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBusinessById } from "@/services/business-service";
import { useBusinessStore } from "@/store/business-store";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const businessId = params?.id ? Number(params.id) : null;
  const { business: storeBusiness, setBusiness } = useBusinessStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const existingBusiness = useBusinessStore.getState().business;
    if (existingBusiness && existingBusiness.id === businessId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const data = await getBusinessById(businessId);
        if (isMounted) {
          setBusiness(data);
        }
      } catch {
        if (isMounted) {
          setError("Error al cargar el negocio");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBusiness();

    return () => {
      isMounted = false;
    };
  }, [businessId, setBusiness]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando información del negocio...
      </div>
    );
  }

  if (error || !storeBusiness) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "Negocio no encontrado"}
      </div>
    );
  }

  return <>{children}</>;
}