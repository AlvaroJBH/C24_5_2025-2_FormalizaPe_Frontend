import { Card } from "@/components/ui/card";
import { Business } from "@/services/business-service";
import { BusinessStatusBadge } from "./BusinessStatusBadge";
import { BusinessActions } from "./BusinessActions";

interface BusinessCardProps {
  business: Business;
  editingBusinessId: number | null;
  deletingBusinessId: number | null;
  onEditOpenChange: (open: boolean, id: number) => void;
  onDeleteOpenChange: (open: boolean, id: number) => void;
  onUpdate: (id: number, data: { name: string; description: string; sector: string; status: string }) => Promise<void>;
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
            {business.name}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {business.sector}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {business.description}
        </p>
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