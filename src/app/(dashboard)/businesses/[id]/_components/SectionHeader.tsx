"use client";

import { PencilIcon, XIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function SectionHeader({
  title,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-blue-600 rounded-full" />
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {!isEditing ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 rounded-none hover:bg-gray-100"
          onClick={onEdit}
        >
          <PencilIcon className="w-3.5 h-3.5 text-gray-500" />
        </Button>
      ) : (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-none hover:bg-gray-100"
            onClick={onCancel}
            disabled={isSaving}
          >
            <XIcon className="w-3.5 h-3.5 text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-none hover:bg-green-50"
            onClick={onSave}
            disabled={isSaving}
          >
            <CheckIcon className={`w-3.5 h-3.5 ${isSaving ? "text-gray-300" : "text-green-600"}`} />
          </Button>
        </div>
      )}
    </div>
  );
}