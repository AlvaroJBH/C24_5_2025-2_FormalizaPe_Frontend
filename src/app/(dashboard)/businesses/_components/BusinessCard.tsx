import { Card } from "@/components/ui/card";
import { Business, CreateBusinessData } from "@/services/business-service";
import { BusinessStatusBadge } from "./BusinessStatusBadge";
import { BusinessActions } from "./BusinessActions";

interface BusinessCardProps {
  business: Business;
  editingBusinessId: number | null;
  deletingBusinessId: number | null;
  onEditOpenChange: (open: boolean, id: number) => void;
  onDeleteOpenChange: (open: boolean, id: number) => void;
  onUpdate: (id: number, data: CreateBusinessData) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
}

export function BusinessCard({
  business,
  editingBusinessId,
  deletingBusinessId,
  onEditOpenChange,
  onDeleteOpenChange,
  onUpdate,
  onDeleteConfirm,
}: BusinessCardProps) {
  const displayLocation = [business.address, business.district, business.province, business.department]
    .filter(Boolean)
    .join(", ");

  return (
    <Card
      className="group relative overflow-hidden p-6 shadow-lg border border-gray-200 rounded-none hover:shadow-2xl hover:border-blue-300 transition-all duration-300 bg-linear-to-br from-white to-gray-50"
    >
      <div className="absolute top-4 right-4">
        <BusinessStatusBadge status={business.status} />
      </div>

      <div className="space-y-4">
        <div className="pr-24">
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {business.displayName}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            {business.formalIdentity ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                {business.formalIdentity.tradeName}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                Sin formalizar
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {business.address || "Sin dirección registrada"}
        </p>

        <div className="text-xs text-gray-500 space-y-1">
          <p><b>Ubicación:</b> {displayLocation || "No especificada"}</p>
          {business.formalIdentity && (
            <p><b>RUC:</b> {business.formalIdentity.ruc}</p>
          )}
        </div>
      </div>

      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-5" />

      <BusinessActions
        business={business}
        editingBusinessId={editingBusinessId}
        deletingBusinessId={deletingBusinessId}
        onEditOpenChange={onEditOpenChange}
        onDeleteOpenChange={onDeleteOpenChange}
        onUpdate={onUpdate}
        onDeleteConfirm={onDeleteConfirm}
      />
    </Card>
  );
}