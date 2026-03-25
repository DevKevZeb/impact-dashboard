import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";

interface DeleteIndicatorDialogProps {
  indicatorName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteIndicatorDialog({
  indicatorName,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteIndicatorDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Delete Indicator"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold">"{indicatorName}"</span>? This action
          cannot be undone.
        </>
      }
      confirmText="Delete"
    />
  );
}
