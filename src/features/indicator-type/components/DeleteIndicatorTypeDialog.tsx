import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";

interface DeleteIndicatorTypeDialogProps {
  typeName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteIndicatorTypeDialog({
  typeName,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteIndicatorTypeDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Delete Indicator Type"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold">"{typeName}"</span>? This action
          cannot be undone.
        </>
      }
      confirmText="Delete"
    />
  );
}
