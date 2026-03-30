import { XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";

interface DeleteKpaDialogProps {
  kpaName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteKpaDialog({
  kpaName,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteKpaDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
      icon={XCircle}
      title="Delete KPA"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold">"{kpaName}"</span>? This action
          cannot be undone.
        </>
      }
      confirmText="Delete"
    />
  );
}
