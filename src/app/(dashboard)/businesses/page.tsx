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
        setError("Error al cargar empresas");
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
        Cargando empresas...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col flex-1 p-6 overflow-auto">
      <BusinessesHeader onCreateBusiness={handleCreateBusiness} />
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