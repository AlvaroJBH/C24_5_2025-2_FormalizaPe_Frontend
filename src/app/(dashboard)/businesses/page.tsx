"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import {
  getBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  Business,
} from "@/services/business-service";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface BusinessFormProps {
  initial?: Partial<Business>;
  onSubmit: (data: {
    name: string;
    description: string;
    sector: string;
    status: string;
  }) => void;
  submitLabel: string;
}

function BusinessForm({
  initial = {},
  onSubmit,
  submitLabel,
}: BusinessFormProps) {
  const [name, setName] = useState(initial.name || "");
  const [description, setDescription] = useState(initial.description || "");
  const [sector, setSector] = useState(initial.sector || "");
  const [status, setStatus] = useState(initial.status || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, sector, status });
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="sector">Sector</Label>
        <Input
          id="sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="status">Estado</Label>
        <Input
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="mt-2 w-full">
        {submitLabel}
      </Button>
    </form>
  );
}

export default function BusinessesPage() {
  const { token } = useAuthStore();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = () => {
    if (!token) return;
    setLoading(true);
    getBusinesses()
      .then((data) => {
        setBusinesses(data);
        setError(null);
      })
      .catch(() => setError("Error al cargar empresas"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token) return;

    const fetch = async () => {
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

    fetch();
  }, [token]);

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
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-700">Empresas</h1>

        {/* Crear nuevo negocio */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Crear Empresa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva empresa</DialogTitle>
            </DialogHeader>
            <BusinessForm
              submitLabel="Crear"
              onSubmit={async (data) => {
                if (!token) return;
                await createBusiness(data);
                fetchBusinesses();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Grilla de empresas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <Card key={business.id} className="p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-700">
                {business.name}
              </h2>
              <p className="text-gray-600 text-sm">{business.description}</p>
              <span className="text-gray-400 text-xs">
                {business.sector} - {business.status}
              </span>
            </div>

            <div className="flex gap-2 mt-4">
              {/* Editar */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Empresa</DialogTitle>
                  </DialogHeader>
                  <BusinessForm
                    initial={business}
                    submitLabel="Actualizar"
                    onSubmit={async (data) => {
                      if (!token) return;
                      await updateBusiness(business.id, data);
                      fetchBusinesses();
                    }}
                  />
                </DialogContent>
              </Dialog>

              {/* Eliminar */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    Eliminar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Eliminar Empresa</DialogTitle>
                  </DialogHeader>
                  <p>
                    ¿Estás seguro que quieres eliminar la empresa{" "}
                    <strong>{business.name}</strong>?
                  </p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        if (!token) return;
                        await deleteBusiness(business.id);
                        fetchBusinesses();
                      }}
                    >
                      Eliminar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
