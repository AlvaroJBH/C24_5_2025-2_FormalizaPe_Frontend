export interface DocumentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string; file?: File }) => void;
  initialData?: { title: string; description: string } | null;
  loading?: boolean;
  mode: "create" | "edit";
}