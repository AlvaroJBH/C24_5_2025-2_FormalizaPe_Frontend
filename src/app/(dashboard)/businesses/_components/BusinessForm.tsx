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
  const [tradeName, setTradeName] = useState(initial.tradeName || "");
  const [legalName, setLegalName] = useState(initial.legalName || "");
  const [businessType, setBusinessType] = useState(initial.businessType || "");
  const [sector, setSector] = useState(initial.sector || "");
  const [economicActivity, setEconomicActivity] = useState(initial.economicActivity || "");
  const [startDate, setStartDate] = useState(initial.startDate || "");
  const [department, setDepartment] = useState(initial.department || "");
  const [province, setProvince] = useState(initial.province || "");
  const [district, setDistrict] = useState(initial.district || "");
  const [address, setAddress] = useState(initial.address || "");
  const [taxRegime, setTaxRegime] = useState(initial.taxRegime || "");
  const [ruc, setRuc] = useState(initial.ruc || "");
  const [status, setStatus] = useState(initial.status || "ACTIVO");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      tradeName,
      legalName,
      businessType,
      sector,
      economicActivity,
      startDate,
      department,
      province,
      district,
      address,
      taxRegime,
      ruc,
      status,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tradeName">Nombre Comercial</Label>
          <Input
            id="tradeName"
            className="rounded-none"
            value={tradeName}
            onChange={(e) => setTradeName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="legalName">Razón Social</Label>
          <Input
            id="legalName"
            className="rounded-none"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessType">Tipo de Empresa</Label>
          <Input
            id="businessType"
            className="rounded-none"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="sector">Sector</Label>
          <Input
            id="sector"
            className="rounded-none"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="economicActivity">Actividad Económica</Label>
        <Input
          id="economicActivity"
          className="rounded-none"
          value={economicActivity}
          onChange={(e) => setEconomicActivity(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="taxRegime">Régimen Tributario</Label>
          <Input
            id="taxRegime"
            className="rounded-none"
            value={taxRegime}
            onChange={(e) => setTaxRegime(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="ruc">RUC</Label>
          <Input
            id="ruc"
            className="rounded-none"
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
            required
            maxLength={11}
            minLength={11}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <Label htmlFor="status">Estado</Label>
          <Input
            id="status"
            className="rounded-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="mt-4 w-full rounded-none">
        {submitLabel}
      </Button>
    </form>
  );
}