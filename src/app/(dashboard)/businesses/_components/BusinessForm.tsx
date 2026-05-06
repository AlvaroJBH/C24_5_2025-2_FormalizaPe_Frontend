import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Business } from "@/services/business-service";

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

export function BusinessForm({
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
      status: initial.status || "Activo",
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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