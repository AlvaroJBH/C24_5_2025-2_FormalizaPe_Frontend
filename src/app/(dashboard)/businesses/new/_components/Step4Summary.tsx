"use client";

import { CreateBusinessData } from "@/services/business-service";
import { Badge } from "@/components/ui/badge";

interface Step4SummaryProps {
  data: Partial<CreateBusinessData>;
}

interface SummarySectionProps {
  title: string;
  children: React.ReactNode;
}

function SummarySection({ title, children }: SummarySectionProps) {
  return (
    <div className="border border-gray-200 rounded-md p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value?: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-xs text-gray-800 text-right">
        {value || <span className="text-gray-400 italic">No especificado</span>}
      </span>
    </div>
  );
}

export function Step4Summary({ data }: Step4SummaryProps) {
  return (
    <div className="space-y-4">
      <SummarySection title="Datos Generales">
        <SummaryItem label="Nombre Comercial" value={data.tradeName} />
        <SummaryItem label="Razón Social" value={data.legalName} />
        <SummaryItem label="Sector" value={data.sector} />
        <SummaryItem label="Actividad Económica" value={data.economicActivity} />
        <SummaryItem label="Fecha de Inicio" value={data.startDate} />
      </SummarySection>

      <SummarySection title="Ubicación">
        <SummaryItem label="Departamento" value={data.department} />
        <SummaryItem label="Provincia" value={data.province} />
        <SummaryItem label="Distrito" value={data.district} />
        <SummaryItem label="Dirección" value={data.address} />
      </SummarySection>

      <SummarySection title="Datos Tributarios">
        <SummaryItem label="Tipo de Empresa" value={data.businessType} />
        <SummaryItem label="Régimen Tributario" value={data.taxRegime} />
        <SummaryItem label="RUC" value={data.ruc} />
      </SummarySection>
    </div>
  );
}