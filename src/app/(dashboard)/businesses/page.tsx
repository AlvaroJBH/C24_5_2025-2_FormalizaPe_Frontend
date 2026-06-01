"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import {
  getBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  Business,
  CreateBusinessData,
} from "@/services/business-service";

import { BusinessesHeader } from "./_components/BusinessesHeader";
import { BusinessesGrid } from "./_components/BusinessesGrid";

export default function BusinessesPage() {
  const { token } = useAuthStore();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBusinessId, setEditingBusinessId] = useState<number | null>(null);
  const [deletingBusinessId, setDeletingBusinessId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    const loadBusinesses = async () => {
      try {
        setLoading(true);
        const data = await getBusinesses();
        setBusinesses(data);
        setError(null);
      } catch {
        setError("Error al cargar negocios");
      } finally {
        setLoading(false);
      }
    };
    loadBusinesses();
  }, [token]);

  const handleCreateBusiness = async (data: CreateBusinessData) => {
    if (!token) return;
    await createBusiness(data);
    const updated = await getBusinesses();
    setBusinesses(updated);
  };

  const handleEditOpenChange = (open: boolean, id: number) => {
    setEditingBusinessId(open ? id : null);
  };

  const handleDeleteOpenChange = (open: boolean, id: number) => {
    setDeletingBusinessId(open ? id : null);
  };

  const handleUpdate = async (id: number, data: CreateBusinessData) => {
    if (!token) return;
    await updateBusiness(id, data);
    const updated = await getBusinesses();
    setBusinesses(updated);
    setEditingBusinessId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!token || !deletingBusinessId) return;
    await deleteBusiness(deletingBusinessId);
    const updated = await getBusinesses();
    setBusinesses(updated);
    setDeletingBusinessId(null);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando negocios...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (businesses.length === 0)
    return (
      <div className="flex flex-col flex-1 p-6 overflow-auto">
        <BusinessesHeader />
        <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
            <path d="M3 21h18" />
            <path d="M9 8h1" />
            <path d="M9 12h1" />
            <path d="M9 16h1" />
            <path d="M14 8h1" />
            <path d="M14 12h1" />
            <path d="M14 16h1" />
            <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
          </svg>
          <p className="text-lg font-medium">No tienes negocios registrados</p>
          <p className="text-sm mt-1">Crea tu primer negocio para comenzar</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col flex-1 p-6 overflow-auto">
      <BusinessesHeader />
      <BusinessesGrid
        businesses={businesses}
        editingBusinessId={editingBusinessId}
        deletingBusinessId={deletingBusinessId}
        onEditOpenChange={handleEditOpenChange}
        onDeleteOpenChange={handleDeleteOpenChange}
        onUpdate={handleUpdate}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
}