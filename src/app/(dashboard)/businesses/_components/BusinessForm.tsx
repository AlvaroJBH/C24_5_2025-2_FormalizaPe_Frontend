import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateBusinessData } from "@/services/business-service";

interface BusinessFormProps {
  initial?: Partial<CreateBusinessData>;
  onSubmit: (data: CreateBusinessData) => void;
  submitLabel: string;
}

export function BusinessForm({
  initial = {},
  onSubmit,
  submitLabel,
}: BusinessFormProps) {
  const [displayName, setDisplayName] = useState(initial.displayName || "");
  const [startDate, setStartDate] = useState(initial.startDate || "");
  const [department, setDepartment] = useState(initial.department || "");
  const [province, setProvince] = useState(initial.province || "");
  const [district, setDistrict] = useState(initial.district || "");
  const [address, setAddress] = useState(initial.address || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      displayName,
      startDate,
      department,
      province,
      district,
      address,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="displayName">Nombre del Negocio</Label>
        <Input
          id="displayName"
          className="rounded-none"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="startDate">Fecha de Inicio</Label>
        <Input
          id="startDate"
          type="date"
          className="rounded-none"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="department">Departamento</Label>
          <Input
            id="department"
            className="rounded-none"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="province">Provincia</Label>
          <Input
            id="province"
            className="rounded-none"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="district">Distrito</Label>
          <Input
            id="district"
            className="rounded-none"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          className="rounded-none"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <Button type="submit" className="mt-4 w-full rounded-none">
        {submitLabel}
      </Button>
    </form>
  );
}