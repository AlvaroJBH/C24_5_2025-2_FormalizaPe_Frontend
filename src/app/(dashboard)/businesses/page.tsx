"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { AppBreadcrumb } from "@/components/common/app-breadcrumb";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name,
      description,
      sector,
      // Si el negocio ya tiene estado (caso edición), se conserva.
      // Si es creación, se asigna "Activo".
      status: initial.status || "Activo",
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Nombre */}
      <div>
        <Label htmlFor="name">Nombre</Label>
        <p className="text-xs text-gray-500 mb-1">
          Es el nombre público de la empresa.
        </p>
        <Input
          id="name"
          className="rounded-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <Label htmlFor="description">Descripción</Label>
        <p className="text-xs text-gray-500 mb-1">
          Breve texto explicando a qué se dedica la empresa.
        </p>
        <Input
          id="description"
          className="rounded-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Sector */}
      <div>
        <Label htmlFor="sector">Sector</Label>
        <p className="text-xs text-gray-500 mb-1">
          Industria a la que pertenece (tecnología, servicios, etc.).
        </p>
        <Input
          id="sector"
          className="rounded-none"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="mt-4 w-full rounded-none">
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

  // Estados para controlar los diálogos
  const [editingBusinessId, setEditingBusinessId] = useState<number | null>(
    null
  );
  const [deletingBusinessId, setDeletingBusinessId] = useState<number | null>(
    null
  );

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
    <div className="flex flex-col flex-1 p-6 overflow-auto">
      <AppBreadcrumb
        items={[
          { label: "Inicio", href: "/businesses" },
        ]}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-700">Empresas</h1>

        {/* Crear nuevo negocio */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-none">Crear Empresa</Button>
          </DialogTrigger>
          <DialogContent className="rounded-none">
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
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {businesses.map((business) => (
          <Card
            key={business.id}
            className="group relative overflow-hidden p-6 shadow-lg border border-gray-200 rounded-none hover:shadow-2xl hover:border-blue-300 transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
          >
            {/* Badge de estado en la esquina */}
            <div className="absolute top-4 right-4">
              <span
                className={`
      inline-flex items-center px-3 py-1 rounded-none text-xs font-semibold
      ${
        business.status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-700"
      }
    `}
              >
                {business.status}
              </span>
            </div>

            <div className="space-y-4">
              {/* Header con nombre y sector */}
              <div className="pr-24">
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {business.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {business.sector}
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {business.description}
              </p>
            </div>

            {/* Divisor sutil */}
            <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-5" />

            {/* Acciones */}
            <div className="flex flex-wrap gap-2">
              {/* Ver - botón principal */}
              <Button
                asChild
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-none"
              >
                <Link href={`/businesses/${business.id}`}>
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Ver detalles
                </Link>
              </Button>

              {/* Editar */}
              <Dialog
                open={editingBusinessId === business.id}
                onOpenChange={(open) =>
                  setEditingBusinessId(open ? business.id : null)
                }
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-none"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-none">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      Editar Empresa
                    </DialogTitle>
                  </DialogHeader>
                  <BusinessForm
                    initial={business}
                    submitLabel="Actualizar"
                    onSubmit={async (data) => {
                      if (!token) return;
                      await updateBusiness(business.id, data);
                      fetchBusinesses();
                      setEditingBusinessId(null);
                    }}
                  />
                </DialogContent>
              </Dialog>

              {/* Eliminar */}
              <Dialog
                open={deletingBusinessId === business.id}
                onOpenChange={(open) =>
                  setDeletingBusinessId(open ? business.id : null)
                }
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-none"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Eliminar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-red-600">
                      Eliminar Empresa
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-gray-700">
                      ¿Estás seguro que quieres eliminar la empresa{" "}
                      <strong className="text-gray-900">{business.name}</strong>
                      ?
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Esta acción no se puede deshacer.
                    </p>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDeletingBusinessId(null)}
                      className="border-gray-300"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        if (!token) return;
                        await deleteBusiness(business.id);
                        fetchBusinesses();
                        setDeletingBusinessId(null);
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Confirmar eliminación
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
