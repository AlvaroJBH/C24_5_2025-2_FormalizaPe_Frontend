"use client";

import { useState, useCallback } from "react";

interface UseEditableSectionReturn {
  isEditing: boolean;
  isSaving: boolean;
  startEditing: () => void;
  cancelEditing: () => void;
  save: (onSave: () => Promise<void>) => Promise<void>;
}

export function useEditableSection(): UseEditableSectionReturn {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const save = useCallback(async (onSave: () => Promise<void>) => {
    setIsSaving(true);
    try {
      await onSave();
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    isEditing,
    isSaving,
    startEditing,
    cancelEditing,
    save,
  };
}