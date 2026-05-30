"use client";

import { CreateBusinessData } from "@/services/business-service";

interface Step3SummaryProps {
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

export function Step3Summary({ data }: Step3SummaryProps) {
  return (
    <div className="space-y-4">
      <SummarySection title="Datos del Negocio">
        <SummaryItem label="Nombre del Negocio" value={data.displayName} />
        <SummaryItem label="Fecha de Inicio" value={data.startDate} />
      </SummarySection>

      <SummarySection title="Ubicación">
        <SummaryItem label="Departamento" value={data.department} />
        <SummaryItem label="Provincia" value={data.province} />
        <SummaryItem label="Distrito" value={data.district} />
        <SummaryItem label="Dirección" value={data.address} />
      </SummarySection>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-sm text-blue-700">
          Al crear tu negocio, podrás iniciar el proceso de formalización cuando lo desees.
          Los datos legales (RUC, Razón Social, Régimen Tributario) se solicitarán durante la formalización.
        </p>
      </div>
    </div>
  );
}