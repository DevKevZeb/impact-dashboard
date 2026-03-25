import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";

interface DeleteMeasureDialogProps {
  measureName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteMeasureDialog({
  measureName,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteMeasureDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Delete Measure"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold">"{measureName}"</span>? This action
          cannot be undone.
        </>
      }
      confirmText="Delete"
    />
  );
}
