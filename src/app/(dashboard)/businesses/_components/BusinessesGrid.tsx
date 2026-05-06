import { Card } from "@/components/ui/card";
import { Business } from "@/services/business-service";
import { BusinessCard } from "./BusinessCard";

interface BusinessesGridProps {
  businesses: Business[];
  editingBusinessId: number | null;
  deletingBusinessId: number | null;
  onEditOpenChange: (open: boolean, id: number) => void;
  onDeleteOpenChange: (open: boolean, id: number) => void;
  onUpdate: (id: number, data: { name: string; description: string; sector: string; status: string }) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
}

export function BusinessesGrid({
  businesses,
  editingBusinessId,
  deletingBusinessId,
  onEditOpenChange,
  onDeleteOpenChange,
  onUpdate,
  onDeleteConfirm,
}: BusinessesGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          editingBusinessId={editingBusinessId}
          deletingBusinessId={deletingBusinessId}
          onEditOpenChange={onEditOpenChange}
          onDeleteOpenChange={onDeleteOpenChange}
          onUpdate={onUpdate}
          onDeleteConfirm={onDeleteConfirm}
        />
      ))}
    </div>
  );
}