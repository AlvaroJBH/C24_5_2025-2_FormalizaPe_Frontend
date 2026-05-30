import { BusinessStatus } from "@/services/business-service";

interface BusinessStatusBadgeProps {
  status: BusinessStatus | string;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  INFORMAL: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Informal" },
  EN_FORMALIZACION: { bg: "bg-blue-100", text: "text-blue-700", label: "En Formalización" },
  FORMALIZADO: { bg: "bg-green-100", text: "text-green-700", label: "Formalizado" },
};

export function BusinessStatusBadge({ status }: BusinessStatusBadgeProps) {
  const config = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-700", label: status };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-none text-xs font-semibold
        ${config.bg} ${config.text}
      `}
    >
      {config.label}
    </span>
  );
}